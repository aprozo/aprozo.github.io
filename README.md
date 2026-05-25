# aprozo.github.io · aprozo.com

Personal site of **Alexandr Prozorov** — experimental particle physicist.
Pure static HTML / CSS / vanilla JS. No build step. No framework.

## Run locally

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

…or any other static server:

```bash
npx serve .
```

## Structure

```
.
├── index.html          # Main page
├── blog.html           # Blog (hash-routed reader)
├── assets/
│   ├── css/style.css
│   ├── js/main.js      # Animations, theme, particles, cursor
│   ├── js/blog.js      # Markdown loader + router
│   └── cv/CV.pdf
├── posts/
│   ├── index.json      # Post manifest
│   └── <slug>.md       # Markdown body per post
└── CNAME               # GitHub Pages custom domain → aprozo.com
```

## Adding a new blog post

1. Drop a markdown file in `posts/`, e.g. `posts/my-new-post.md`.
2. Add an entry at the top of `posts/index.json`:

```json
{
  "slug": "my-new-post",
  "title": "My new post",
  "date": "2026-06-01",
  "summary": "One-sentence teaser shown in the list.",
  "categories": ["diary"]
}
```

3. Commit & push. GitHub Pages serves it.

## Custom domain: aprozo.com (Cloudflare)

GitHub Pages already gets the `CNAME` file in this repo. To finish the wiring:

1. **GitHub** → repo *Settings* → *Pages* → *Custom domain* → enter `aprozo.com`.
   Tick **Enforce HTTPS** after the cert appears (1–10 min).
2. **Cloudflare** → DNS for `aprozo.com`, add:

   | Type | Name | Value                  | Proxy |
   |------|------|------------------------|-------|
   | A    | @    | 185.199.108.153        | DNS only first, then proxied |
   | A    | @    | 185.199.109.153        | DNS only first, then proxied |
   | A    | @    | 185.199.110.153        | DNS only first, then proxied |
   | A    | @    | 185.199.111.153        | DNS only first, then proxied |
   | CNAME| www  | aprozo.github.io       | proxied |

3. **Cloudflare SSL/TLS** → *Full* (not Flexible) once GitHub HTTPS is active.
4. Optional **Page Rule**: redirect `www.aprozo.com/*` → `https://aprozo.com/$1`.

Set DNS to *DNS only* (grey cloud) at first so GitHub can issue its Let's Encrypt
cert via HTTP challenge. After it's enforced, you can switch back to proxied (orange cloud).
