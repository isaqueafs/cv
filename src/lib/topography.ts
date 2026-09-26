// Gera curvas de nível (padrão topográfico) como paths SVG.
// Ruído de valor com fbm + domain warp → marching squares → polilinhas suavizadas.
// Determinístico por seed; o site sorteia uma seed nova a cada carregamento.

type Point = [number, number]

function mulberry32(seed: number) {
    return () => {
        seed |= 0
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

// Ruído de gradiente (Perlin) com fade quíntico: curvas redondas, sem artefatos de grade
function createNoise(seed: number, octaves: number, gain: number, warp: number) {
    const rand = mulberry32(seed)
    const size = 256
    const angles = Array.from({ length: size }, () => rand() * Math.PI * 2)
    const gx = angles.map(Math.cos), gy = angles.map(Math.sin)
    const perm = Array.from({ length: size }, (_, i) => i)
    for (let i = size - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1))
        ;[perm[i], perm[j]] = [perm[j], perm[i]]
    }
    const hash = (x: number, y: number) => perm[(perm[x & 255] + y) & 255]
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
    const dot = (h: number, dx: number, dy: number) => gx[h] * dx + gy[h] * dy

    const perlin = (x: number, y: number) => {
        const xi = Math.floor(x), yi = Math.floor(y)
        const fx = x - xi, fy = y - yi
        const u = fade(fx), v = fade(fy)
        const a = dot(hash(xi, yi), fx, fy), b = dot(hash(xi + 1, yi), fx - 1, fy)
        const c = dot(hash(xi, yi + 1), fx, fy - 1), d = dot(hash(xi + 1, yi + 1), fx - 1, fy - 1)
        return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
    }

    const fbm = (x: number, y: number) => {
        let sum = 0, amp = 0.5, freq = 1
        for (let o = 0; o < octaves; o++) {
            sum += amp * perlin(x * freq, y * freq)
            amp *= gain
            freq *= 2
        }
        return sum
    }

    // Domain warp deixa as formas fluidas e alongadas em vez de "bolhas" regulares
    return (x: number, y: number) => fbm(x + warp * fbm(x + 5.2, y + 1.3), y + warp * fbm(x + 9.7, y + 2.8))
}

function marchingSquares(field: number[][], level: number, cell: number): [Point, Point][] {
    const segments: [Point, Point][] = []
    const rows = field.length - 1, cols = field[0].length - 1
    const lerp = (a: number, b: number) => (level - a) / (b - a)

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const tl = field[y][x], tr = field[y][x + 1], br = field[y + 1][x + 1], bl = field[y + 1][x]
            const idx = (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0)
            if (idx === 0 || idx === 15) continue

            const top: Point = [(x + lerp(tl, tr)) * cell, y * cell]
            const right: Point = [(x + 1) * cell, (y + lerp(tr, br)) * cell]
            const bottom: Point = [(x + lerp(bl, br)) * cell, (y + 1) * cell]
            const left: Point = [x * cell, (y + lerp(tl, bl)) * cell]

            switch (idx) {
                case 1: case 14: segments.push([left, bottom]); break
                case 2: case 13: segments.push([bottom, right]); break
                case 3: case 12: segments.push([left, right]); break
                case 4: case 11: segments.push([top, right]); break
                case 6: case 9: segments.push([top, bottom]); break
                case 7: case 8: segments.push([left, top]); break
                case 5: segments.push([left, top], [bottom, right]); break
                case 10: segments.push([top, right], [left, bottom]); break
            }
        }
    }
    return segments
}

// Encadeia segmentos soltos em polilinhas contínuas
function chain(segments: [Point, Point][]): Point[][] {
    const key = (p: Point) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`
    const ends = new Map<string, number[]>()
    segments.forEach(([a, b], i) => {
        for (const p of [a, b]) {
            const k = key(p)
            const list = ends.get(k)
            if (list) list.push(i)
            else ends.set(k, [i])
        }
    })

    const used = new Array(segments.length).fill(false)
    const lines: Point[][] = []

    const extend = (line: Point[]) => {
        for (;;) {
            const tail = line[line.length - 1]
            const next = (ends.get(key(tail)) ?? []).find(i => !used[i])
            if (next === undefined) return
            used[next] = true
            const [a, b] = segments[next]
            line.push(key(a) === key(tail) ? b : a)
        }
    }

    segments.forEach(([a, b], i) => {
        if (used[i]) return
        used[i] = true
        const line: Point[] = [a, b]
        extend(line)
        line.reverse()
        extend(line)
        lines.push(line)
    })
    return lines
}

function chaikin(line: Point[], iterations: number): Point[] {
    let pts = line
    for (let n = 0; n < iterations; n++) {
        const closed = pts.length > 2 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]
        const out: Point[] = closed ? [] : [pts[0]]
        for (let i = 0; i < pts.length - 1; i++) {
            const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]
            out.push([x0 * 0.75 + x1 * 0.25, y0 * 0.75 + y1 * 0.25], [x0 * 0.25 + x1 * 0.75, y0 * 0.25 + y1 * 0.75])
        }
        if (closed) out.push(out[0])
        else out.push(pts[pts.length - 1])
        pts = out
    }
    return pts
}

// Ramer–Douglas–Peucker: remove pontos que não mudam a forma (ruído da grade)
function simplify(pts: Point[], epsilon: number): Point[] {
    if (pts.length < 3) return pts
    const keep = new Uint8Array(pts.length)
    keep[0] = keep[pts.length - 1] = 1
    const stack: [number, number][] = [[0, pts.length - 1]]
    while (stack.length) {
        const [a, b] = stack.pop()!
        const [ax, ay] = pts[a], [bx, by] = pts[b]
        const dx = bx - ax, dy = by - ay
        const len = Math.hypot(dx, dy) || 1
        let max = 0, idx = -1
        for (let i = a + 1; i < b; i++) {
            const dist = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / len
            if (dist > max) { max = dist; idx = i }
        }
        if (max > epsilon) {
            keep[idx] = 1
            stack.push([a, idx], [idx, b])
        }
    }
    return pts.filter((_, i) => keep[i])
}

const num = (n: number) => {
    const s = (Math.round(n * 10) / 10).toString()
    return s === '-0' ? '0' : s
}

// Curva lisa: spline Catmull-Rom convertida em Béziers cúbicas relativas (sem quinas nem degraus)
function toPath(pts: Point[]): string {
    const closed = pts.length > 3 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 0.5
    const p = closed ? pts.slice(0, -1) : pts
    const n = p.length
    const at = (i: number): Point => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]

    let d = `M${num(p[0][0])} ${num(p[0][1])}c`
    const segments = closed ? n : n - 1
    for (let i = 0; i < segments; i++) {
        const [x0, y0] = at(i - 1), [x1, y1] = at(i), [x2, y2] = at(i + 1), [x3, y3] = at(i + 2)
        const c1x = (x2 - x0) / 6, c1y = (y2 - y0) / 6
        const c2x = x2 - x1 - (x3 - x1) / 6, c2y = y2 - y1 - (y3 - y1) / 6
        const parts = [c1x, c1y, c2x, c2y, x2 - x1, y2 - y1].map(num)
        d += parts.map((v, j) => (j === 0 && d.endsWith('c')) || v.startsWith('-') ? v : ' ' + v).join('')
    }
    return closed ? d + 'z' : d
}

// equalize: 0 = níveis lineares (linhas amontoam nas encostas, platôs vazios),
// 1 = níveis por quantil (linhas espalhadas por igual). O meio-termo é o mais orgânico.
export function topographyPath({
    width = 1600, height = 1000, cell = 20, levels = 14, scale = 0.0015,
    octaves = 2, gain = 0.5, warp = 1.3, equalize = 0.7, smoothing = 1, seed = 7,
} = {}) {
    const noise = createNoise(seed, octaves, gain, warp)
    const cols = Math.ceil(width / cell), rows = Math.ceil(height / cell)
    const field = Array.from({ length: rows + 1 }, (_, y) =>
        Array.from({ length: cols + 1 }, (_, x) => noise(x * cell * scale, y * cell * scale)))

    const sorted = field.flat().sort((a, b) => a - b)
    // Faixa linear entre os percentis 2 e 98: extremos raros não esticam os níveis para o vazio
    const min = sorted[Math.floor(sorted.length * 0.02)], max = sorted[Math.floor(sorted.length * 0.98)]
    const paths: string[] = []

    for (let l = 1; l < levels; l++) {
        const linear = min + ((max - min) * l) / levels
        const quantile = sorted[Math.floor((sorted.length * l) / levels)]
        const level = linear + (quantile - linear) * equalize
        for (const line of chain(marchingSquares(field, level, cell))) {
            if (line.length < 4) continue
            paths.push(toPath(simplify(chaikin(line, smoothing), 0.6)))
        }
    }

    return paths.join('')
}
