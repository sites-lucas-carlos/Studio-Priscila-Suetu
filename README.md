# Studio Priscila Suetu Hair Design

Landing page do Studio Priscila Suetu, salão de beleza na CLN 112, Asa Norte, Brasília.

**Site:** https://sites-lucas-carlos.github.io/Studio-Priscila-Suetu/

Site estático (HTML, CSS e JavaScript puros, sem build). Para ver localmente, abra `index.html` no navegador.

- `index.html`: conteúdo da página
- `css/styles.css`: estilos (somente tema claro)
- `js/main.js`: menu do celular, links do WhatsApp com mensagem pronta, filtro da equipe e status "aberto agora"
- `img/`, `fonts/`: imagens e fontes hospedadas junto com o site

O número do WhatsApp fica em `js/main.js` (`WHATSAPP_NUMBER`) e nos links `wa.me` do `index.html`.

**Ao atualizar:** aumente o número `?v=` dos links de `styles.css` e `main.js` no `index.html` (evita que quem já visitou veja CSS antigo) e envie para `main` e `gh-pages` (o GitHub Pages publica a `gh-pages`).
