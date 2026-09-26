# cv — Isaque Santos

Portfolio/CV pessoal, disponível em PT-BR e EN-US.

**Live:** [isaqueafs.github.io/cv](https://isaqueafs.github.io/cv)

## Stack

- [Astro](https://astro.build) — framework
- [Tailwind CSS v4](https://tailwindcss.com) — estilos
- Scripts inline mínimos (tema e efeito dos cards), sem framework JS
- GitHub Actions — deploy automático para GitHub Pages

## Comandos

| Comando          | Ação                                        |
| :--------------- | :------------------------------------------ |
| `npm install`    | Instala as dependências                     |
| `npm run dev`    | Inicia o servidor local em `localhost:4321` |
| `npm run build`  | Gera o build de produção em `./dist/`       |
| `npm run preview`| Pré-visualiza o build localmente            |

## Rotas

| Rota      | Descrição        |
| :-------- | :--------------- |
| `/cv/`    | Versão PT-BR     |
| `/cv/en/` | Versão EN-US     |

## Deploy

O deploy é feito automaticamente via GitHub Actions a cada push na branch `main`. O workflow está em [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
