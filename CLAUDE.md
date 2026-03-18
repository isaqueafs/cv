# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start development server with live reload
hugo server -t terminal

# Build for production (outputs to public/)
hugo build
```

Requires Hugo Extended v0.90.0+ (SCSS processing is needed for the theme).

## Architecture

This is a bilingual personal portfolio site using Hugo with the [Terminal theme](https://github.com/panr/hugo-theme-terminal).

**Languages:** Portuguese-BR (`br`) is the default language; English (`en`) is secondary. Each language has its own content directory (`content/br/`, `content/en/`) and menu configuration in `hugo.toml`.

**Theme:** Lives in `themes/terminal/` and is referenced via Hugo Modules with a local path replacement in `hugo.toml`. The Terminal theme uses SCSS (hence the Hugo Extended requirement).

**Customization pattern:** Rather than modifying theme files, overrides are done through:
- `assets/css/custom.css` — custom CSS loaded via Hugo's resource pipeline (minified + fingerprinted)
- `layouts/partials/extended_head.html` — injects the custom CSS into `<head>`

**Content structure:** Four pages per language (Home `_index.md`, About, Projects/Showcase, Contact), all simple Markdown with minimal front matter.

## Configuration

`hugo.toml` is the single config file. Key settings:
- `contentTypeName = "posts"` — affects URL structure
- `paginate = 5`
- Syntax highlighting uses Chroma with `noClasses = false` (class-based, not inline styles)
- Language selector is enabled (`languageMenuName`)
