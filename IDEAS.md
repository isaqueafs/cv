# Ideias — Funcionalidades não utilizadas do tema Terminal

Referência: https://github.com/panr/hugo-theme-terminal

---

## 1. `enableGitInfo` + `showLastUpdated`

**O que é:** Exibe a data da última atualização do arquivo baseada no histórico git.

**Como ativar:**
```toml
# hugo.toml
enableGitInfo = true

[params]
  showLastUpdated = true
  updatedDatePrefix = "Atualizado em"
```

**Por que vale pena:** Um CV de desenvolvedor deve parecer vivo. Mostrar "Atualizado em 2025-03-xx" embaixo do conteúdo reforça que o perfil está ativo e mantido, sem precisar editar isso manualmente.

---

## 2. Shortcode `{{< code >}}`

**O que é:** Bloco de código estilizado com título e opção de exibir aberto/fechado.

**Exemplo:**
```
{{< code language="javascript" title="Exemplo de projeto — parser de logs" open="true" >}}
const parseLine = (line) => line.match(/\[(\w+)\]\s(.+)/);
{{< /code >}}
```

**Por que vale pena:** Na seção de Projetos, em vez de só descrever o que foi feito, um snippet real do código mostra diretamente a qualidade técnica. O bloco com `open="false"` funciona como um spoiler colapsável, mantendo a página limpa.

---

## 3. Shortcode `{{< image >}}`

**O que é:** Shortcode nativo para imagens com controle de posição e estilo.

**Exemplo:**
```
{{< image src="/img/projeto-dashboard.png" alt="Dashboard" position="center" style="border-radius: 4px;" >}}
```

**Por que vale pena:** Adicionar screenshots de projetos ou um diagrama de arquitetura na seção de projetos aumenta muito o impacto visual. Atualmente o CV é todo texto.

---

## 4. Imagem de capa (`cover`)

**O que é:** O tema suporta uma imagem de capa por página. Com `autoCover = true` (já ativado), basta ter um arquivo `cover.jpg/png/webp` na pasta do conteúdo.

**Como usar:**
- Colocar `content/br/cover.png` (ou via front matter: `cover = "/img/cover.png"`)

**Por que vale pena:** Uma imagem de capa sutil no topo — pode ser uma foto de perfil, um banner com nome e stack, ou algo gerado com a paleta do tema — dá identidade visual forte logo no primeiro scroll.

---

## 5. Esquema de cores customizado

**O que é:** O tema tem um gerador de paleta em https://panr.github.io/terminal-css/. Dá pra criar um arquivo CSS de tema personalizado com outras cores além do verde padrão.

**Como usar:** Gerar a paleta no site, salvar como `themes/terminal/assets/css/[nome-do-tema].css` e referenciar em `hugo.toml`.

**Por que vale pena:** O verde `#1db954` (Spotify green) é reconhecível mas genérico. Uma cor de acento única reforça a identidade do desenvolvedor. Pode combinar com a paleta de um projeto pessoal ou portfolio.

---

## 6. Table of Contents (`Toc`)

**O que é:** Geração automática de sumário baseado nos headings da página.

**Como ativar** (por front matter na `_index.md`):
```yaml
Toc: true
TocTitle: "Índice"
```

**Por que vale pena:** Para recrutadores que querem pular direto para "Projetos" ou "Experiência", um ToC colapsável no topo da página seria mais acessível que o menu fixo atual — especialmente em mobile. Vale comparar com a navegação customizada atual para decidir qual é mais eficaz.

---

## 7. Twitter Cards (`params.twitter`)

**O que é:** Meta tags para cartões ricos no Twitter/X ao compartilhar o link do CV.

**Como ativar:**
```toml
[params.twitter]
  creator = "seu_usuario"
  site = "seu_usuario"
```

**Por que vale pena:** Quando o link do CV é compartilhado no Twitter/X, LinkedIn preview ou Slack, aparece com título, descrição e imagem em vez de só a URL. Aumenta CTR ao enviar o link para recrutadores.

---

## 8. `readingTime`

**O que é:** Exibe o tempo estimado de leitura da página.

**Como ativar:**
```toml
[params]
  readingTime = true
```

**Por que vale pena:** Detalhe pequeno mas que sinaliza para o recrutador quanto tempo vai levar — "3 min de leitura" é um convite. Tem personalidade de desenvolvedor e encaixa bem no estilo terminal.

---

## 9. `fullWidthTheme`

**O que é:** Expande o layout para ocupar toda a largura da tela (atualmente está centrado com largura máxima).

**Como ativar:**
```toml
[params]
  fullWidthTheme = true
  centerTheme = false
```

**Por que vale pena:** Vale experimentar visualmente. Em monitores grandes, o layout full-width com o conteúdo do CV distribuído pode ficar mais imersivo. Risco: linhas muito longas ficam difíceis de ler.

---

## 10. Partial de comentários como formulário de contato

**O que é:** O tema tem `layouts/partials/comments.html` como ponto de extensão para integrar sistemas de comentários.

**Como usar:** Reutilizar esse partial para injetar um formulário de contato (Netlify Forms, Formspree, etc.) em vez de uma seção de comentários de blog.

**Por que vale pena:** A seção `#contato` atual provavelmente é só texto com links de email/LinkedIn. Um formulário funcional diretamente na página é mais conveniente e profissional para recrutadores que não querem sair do CV para contato.
