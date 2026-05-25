# aprozo.github.io · aprozo.com

Personal site of **Alexandr Prozorov** — experimental particle physicist.


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
ctive.
4. Optional **Page Rule**: redirect `www.aprozo.com/*` → `https://aprozo.com/$1`.

Set DNS to *DNS only* (grey cloud) at first so GitHub can issue its Let's Encrypt
cert via HTTP challenge. After it's enforced, you can switch back to proxied (orange cloud).
