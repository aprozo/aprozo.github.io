# aprozo.github.io · aprozo.com

Personal site of **Alexandr Prozorov**, experimental nuclear and particle physicist.

Static Jekyll site, no theme gem and no plugins, so GitHub Pages builds it as-is.

## Editing

Everything is in **`index.md`**. Front matter holds the header text, the experience list
and the skills groups; the body below it is plain Markdown.

```yaml
---
layout: default
role: Experimental nuclear and particle physicist
affiliation: Czech Technical University, Prague · STAR (RHIC) · ePIC (EIC)
footer: Alexandr Prozorov · Prague

experience:
  - years: 2023 – now
    what: Researcher, Czech Technical University, Prague

skills:
  - group: Programming
    items: [C++, Python, Bash, SQL, LaTeX, JavaScript]
---

Prose goes here, in Markdown.
```

Push to `master` and GitHub Pages rebuilds.

## Run locally

```bash
jekyll serve --port 8080
# → http://localhost:8080
```

## Structure

```
.
├── index.md              # The page: front matter + Markdown. Edit this.
├── _config.yml           # Site title, description, URL
├── _layouts/default.html # HTML shell, CSS, light/dark theme toggle
├── _includes/
│   ├── experience.html   # Renders the experience front matter
│   └── skills.html       # Renders the skills front matter
├── assets/
│   ├── img/avatar.jpg
│   └── cv/CV.pdf
├── blog.html             # Old blog reader (unlinked, see note)
├── posts/*.md            # Blog posts
└── CNAME                 # GitHub Pages custom domain → aprozo.com
```

## Note on the blog

`blog.html` and `posts/` predate the Jekyll rewrite. The reader still works, but its
navigation links point at anchors (`index.html#about`, `#research`, …) that the current
page no longer has, and it loads `marked.js` from a CDN. Either port the posts to Jekyll
`_posts/` or fix those links before linking to it again.
