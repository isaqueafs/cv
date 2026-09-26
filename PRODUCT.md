# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: recrutadores e pessoas de RH no Brasil fazendo a triagem de candidatos a vagas de desenvolvimento web/backend. Normalmente chegam pelo link do currículo em PDF ou do LinkedIn e decidem em pouco tempo se a pessoa vale uma conversa.

Secondary: recrutadores de fora do Brasil, atendidos pela versão EN-US (`/cv2/en/`). O EN-US complementa o PT-BR, que é a versão principal.

## Product Purpose

Portfólio/CV pessoal de Isaque Santos (nome completo: Isaque André Fernandes dos Santos Ribeiro), desenvolvedor web e engenheiro de software backend com 5+ anos de experiência. Deve apresentar a experiência de forma crível e escaneável.

Success: o recrutador sai convencido e entra em contato por e-mail ou LinkedIn.

## Positioning

É um desenvolvedor backend PHP/Laravel que foi dono de sistemas inteiros e multi-marca em produção, não só de tarefas soltas:
- mais de 95% dos commits de um LMS corporativo ao longo de 3 anos;
- cerca de 70% dos commits de um portal ERP que integra 6 redes de franquia e 9 bancos de dados;
- arquitetura multi-tenant com RBAC;
- pipeline de vídeo com backup no AWS S3;
- SSO entre marcas;
- adoção prática de IA no ciclo de desenvolvimento (Claude Code, MCP, Skills).

Toda a carreira até agora é na MoveEdu, com progressão de suporte técnico para dev principal.

## Operating Context

- Canais de entrada: o link no currículo em PDF e no perfil do LinkedIn.
- Leitura: rápida, em desktop ou celular.
- Os PDFs do currículo (PT e EN) são a fonte da verdade do conteúdo. O site deve permanecer consistente com eles.

## Capabilities and Constraints

- Site estático em Astro 6, Tailwind v4 e Alpine.js (este ainda sem uso). É publicado no GitHub Pages sob o base path `/cv2`.
- Bilíngue por duplicação de páginas: `src/pages/index.astro` (PT-BR) e `src/pages/en/index.astro` (EN-US). Toda mudança precisa ser espelhada nas duas.
- Tema claro/escuro com persistência por cookie.
- Canais de contato públicos: e-mail isaqueafsantos@gmail.com, linkedin.com/in/isaqueafs, github.com/isaqu3. O telefone consta no PDF, mas não é publicado no site.
- Não há formulário de contato nem backend.

## Brand Commitments

- Nome de exibição: "Isaque Santos".
- Voz em primeira pessoa, direta e factual. Os números vêm do currículo e não devem ser inflados.
- Títulos profissionais usados: "Desenvolvedor Web · Engenheiro de Software Backend" / "Web Developer · Backend Software Engineer".

## Evidence on Hand

- Conteúdo do currículo: experiência, skills, formação e idiomas, já refletidos nas páginas.
- Certificado da Alura com link público.
- Não existem projetos públicos, estudos de caso, prints, depoimentos ou métricas de clientes para mostrar. A seção "projetos" está em construção, e nada deve ser inventado para preenchê-la.
- Os sistemas da MoveEdu são internos: não há telas nem código publicáveis.

## Product Principles

1. **Credibilidade em segundos.** O recrutador precisa entender cargo, senioridade e especialidade (backend PHP/Laravel) no primeiro olhar.
2. **Fatos verificáveis, não adjetivos.** Números e escopo reais (commits, marcas, bancos integrados) valem mais que autodescrição.
3. **Contato sem atrito.** E-mail e LinkedIn sempre à mão. É a ação que define o sucesso do site.
4. **PT-BR primeiro, EN-US em paridade.** As duas versões dizem a mesma coisa.
5. **Fiel ao currículo.** O site não afirma nada que o PDF não sustente.
