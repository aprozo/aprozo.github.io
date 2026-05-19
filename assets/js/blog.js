/* =========================================================
 * Blog: simple client-side renderer.
 * Loads posts/index.json (list) and posts/<slug>.md (content).
 * Hash router: #/post/<slug>  (or no hash = list view)
 * ========================================================= */

(() => {
  "use strict";

  const listView   = document.getElementById("view-list");
  const postView   = document.getElementById("view-post");
  const postsList  = document.getElementById("posts-list");
  const filtersEl  = document.getElementById("filters");
  const postMeta   = document.getElementById("post-meta");
  const postH1     = document.getElementById("post-h1");
  const postBody   = document.getElementById("post-content");

  if (!listView || !postView) return;

  let allPosts = [];
  let activeCat = "all";

  /* ---------- helpers ---------- */
  const fmtDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        year: "numeric", month: "short", day: "2-digit",
      });
    } catch { return iso; }
  };
  const escape = (s) => s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));

  /* ---------- index ---------- */
  async function loadIndex() {
    try {
      const res = await fetch("posts/index.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("Failed to load posts index.");
      const data = await res.json();
      allPosts = (data.posts || []).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
      renderFilters();
      renderList();
    } catch (err) {
      postsList.innerHTML = `<li class="post-error">Could not load posts: ${escape(err.message)}</li>`;
    }
  }

  function renderFilters() {
    const cats = new Set();
    allPosts.forEach((p) => (p.categories || []).forEach((c) => cats.add(c)));
    const list = ["all", ...Array.from(cats).sort()];
    filtersEl.innerHTML = list
      .map(
        (c) =>
          `<button class="filter-btn ${c === activeCat ? "is-active" : ""}" data-cat="${escape(c)}" data-cursor="link">${escape(c)}</button>`
      )
      .join("");
    filtersEl.querySelectorAll(".filter-btn").forEach((b) => {
      b.addEventListener("click", () => {
        activeCat = b.dataset.cat;
        renderFilters();
        renderList();
      });
    });
  }

  function renderList() {
    const filtered =
      activeCat === "all"
        ? allPosts
        : allPosts.filter((p) => (p.categories || []).includes(activeCat));

    if (!filtered.length) {
      postsList.innerHTML = `<li class="post-loading">No posts in “${escape(activeCat)}” yet.</li>`;
      return;
    }
    postsList.innerHTML = filtered
      .map((p) => `
        <li>
          <a class="post-row" href="#/post/${escape(p.slug)}" data-cursor="card">
            <span class="post-date">${escape(fmtDate(p.date))}</span>
            <div>
              <h3 class="post-title"><span>${escape(p.title)}</span></h3>
              ${p.summary ? `<p class="post-summary">${escape(p.summary)}</p>` : ""}
            </div>
            <span class="post-cat">${escape((p.categories && p.categories[0]) || "note")}</span>
          </a>
        </li>`)
      .join("");

    // Re-trigger reveal on freshly-injected rows
    postsList.querySelectorAll(".post-row").forEach((el, i) => {
      el.style.opacity = 0;
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity .6s var(--ease, ease-out), transform .6s var(--ease, ease-out)";
      setTimeout(() => {
        el.style.opacity = 1;
        el.style.transform = "none";
      }, 40 + i * 50);
    });
  }

  /* ---------- single post ---------- */
  async function loadPost(slug) {
    listView.hidden = true;
    postView.hidden = false;
    postH1.textContent = "Loading…";
    postBody.innerHTML = "";
    postMeta.textContent = "";

    const meta = allPosts.find((p) => p.slug === slug);
    if (meta) {
      postH1.textContent = meta.title;
      postMeta.textContent = `${fmtDate(meta.date)} · ${(meta.categories || []).join(" · ") || "note"}`;
      document.title = `${meta.title} — Alexandr Prozorov`;
    }

    try {
      const res = await fetch(`posts/${slug}.md`, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Post not found (${res.status})`);
      const md = await res.text();
      const html = window.marked ? window.marked.parse(md) : `<pre>${escape(md)}</pre>`;
      postBody.innerHTML = html;
      postBody.querySelectorAll("a[href^='http']").forEach((a) => {
        a.target = "_blank"; a.rel = "noopener";
        a.setAttribute("data-cursor", "link");
      });
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    } catch (err) {
      postH1.textContent = "Couldn’t load post";
      postBody.innerHTML = `<p class="post-error">${escape(err.message)}</p>`;
    }
  }

  /* ---------- router ---------- */
  function route() {
    const h = window.location.hash || "";
    const m = h.match(/^#\/post\/(.+)$/);
    if (m) {
      if (!allPosts.length) {
        loadIndex().then(() => loadPost(decodeURIComponent(m[1])));
      } else {
        loadPost(decodeURIComponent(m[1]));
      }
    } else {
      postView.hidden = true;
      listView.hidden = false;
      document.title = "Blog — Alexandr Prozorov";
      if (!allPosts.length) loadIndex();
    }
  }

  window.addEventListener("hashchange", route);
  route();
})();
