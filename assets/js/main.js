/* =========================================================
 * Alexandr Prozorov — personal site
 * Animations + interactions. No deps.
 * ========================================================= */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (persisted) ---------- */
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    root.setAttribute("data-theme", storedTheme);
  }
  const themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---------- Nav scrolled state ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    let i = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const delay = Math.min((i++ % 6) * 0.06, 0.4);
            entry.target.style.setProperty("--reveal-delay", `${delay}s`);
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Custom cursor ---------- */
  if (isFinePointer && !reduceMotion) {
    const ring = document.querySelector(".cursor");
    const dot  = document.querySelector(".cursor-dot");
    if (ring && dot) {
      let mx = window.innerWidth / 2, my = window.innerHeight / 2;
      let rx = mx, ry = my;
      window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
      const loop = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        dot.style.transform  = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      };
      loop();

      const setMode = (mode) => {
        ring.classList.remove("is-link", "is-card");
        if (mode === "link") ring.classList.add("is-link");
        else if (mode === "card") ring.classList.add("is-card");
      };
      document.addEventListener("mouseover", (e) => {
        const t = e.target.closest("[data-cursor], a, button");
        if (!t) return setMode(null);
        const mode = t.getAttribute("data-cursor") || (t.tagName === "BUTTON" ? "link" : "link");
        setMode(mode);
      });
      document.addEventListener("mouseout", (e) => {
        if (!e.relatedTarget) setMode(null);
      });
      window.addEventListener("blur",  () => setMode(null));
    }
  }

  /* ---------- Slow particle-collision background ----------
   * Primaries drift slowly. When two come close: vertex event —
   * burst of short-lived secondary tracks fanning out (jet spray).
   * Mouse can also trigger a vertex on click.
   * --------------------------------------------------------- */
  const canvas = document.getElementById("bg-canvas");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const themeColors = () => {
      const root = document.documentElement;
      const accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#56c0ff";
      const accent2 = getComputedStyle(root).getPropertyValue("--accent-2").trim() || "#b78bff";
      return { accent, accent2 };
    };

    const hexToRgb = (hex) => {
      const m = hex.replace("#", "");
      const v = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
      const n = parseInt(v, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const rgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

    const PRT_COUNT = () => {
      const area = window.innerWidth * window.innerHeight;
      return Math.max(14, Math.min(34, Math.round(area / 60000)));
    };

    let primaries = [];   // slow drifting particles
    let tracks = [];      // collision-spawned trails
    let fragments = [];   // tiny debris particles
    let vertices = [];    // flash markers at collision points
    let cooldown = new WeakMap(); // per-particle collision cooldown

    // Mouse-as-beam-particle
    const beam = {
      x: -9999, y: -9999,
      px: -9999, py: -9999,
      vx: 0, vy: 0,
      speed: 0,
      active: false,
      trail: [],     // recent positions for streak
      cd: 0,         // global collision cooldown (ms)
    };
    let beamHitCd = new WeakMap(); // per-primary cooldown for beam strikes

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawnPrimary(p) {
      const speed = 0.08 + Math.random() * 0.12;
      const ang = Math.random() * Math.PI * 2;
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.vx = Math.cos(ang) * speed;
      p.vy = Math.sin(ang) * speed;
      p.r  = 1.1 + Math.random() * 1.2;
      p.life = 0;
      return p;
    }

    function init() {
      resize();
      primaries = new Array(PRT_COUNT()).fill(0).map(() => spawnPrimary({}));
      tracks = [];
      fragments = [];
      vertices = [];
      cooldown = new WeakMap();
      beamHitCd = new WeakMap();
    }

    function emitVertex(x, y, energy = 1) {
      // flash marker
      vertices.push({ x, y, t: 0, max: 90, energy });

      // outgoing tracks — like jet sprays
      const n = 7 + Math.floor(Math.random() * 6); // 7..12 tracks
      const baseAng = Math.random() * Math.PI * 2;
      const back2back = Math.random() < 0.55; // back-to-back jet topology sometimes
      for (let i = 0; i < n; i++) {
        const groupAng = back2back
          ? (i < n / 2 ? baseAng : baseAng + Math.PI) + (Math.random() - 0.5) * 0.6
          : baseAng + (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        const speed = (0.6 + Math.random() * 1.0) * energy;
        tracks.push({
          x, y,
          px: x, py: y,
          path: [{ x, y }],          // persistent trail
          vx: Math.cos(groupAng) * speed,
          vy: Math.sin(groupAng) * speed,
          life: 0,
          max:  900 + Math.random() * 700, // ms — much longer than before
          curl: (Math.random() - 0.5) * 0.010,
          width: 1.6 + Math.random() * 1.4,
        });
      }

      // small debris fragments — short-lived puff
      const nf = 14 + Math.floor(Math.random() * 12); // 14..25
      for (let i = 0; i < nf; i++) {
        const ang = Math.random() * Math.PI * 2;
        const sp = (Math.random() * 1.6 + 0.3) * energy;
        fragments.push({
          x, y,
          vx: Math.cos(ang) * sp,
          vy: Math.sin(ang) * sp,
          life: 0,
          max:  450 + Math.random() * 600,
          r: 0.5 + Math.random() * 1.4,
          drag: 0.93 + Math.random() * 0.04,
        });
      }
    }

    let lastT = performance.now();
    function tick(now) {
      const dt = Math.min(48, now - lastT); lastT = now;
      // mild trail effect: instead of full clear, fade slightly
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.clearRect(0, 0, w, h);

      const { accent, accent2 } = themeColors();
      const rgbA = hexToRgb(accent);
      const rgbB = hexToRgb(accent2);

      // ---- primaries ----
      for (const p of primaries) {
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // glow dot
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 14);
        grd.addColorStop(0, rgba(rgbA, 0.55));
        grd.addColorStop(1, rgba(rgbA, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgba(rgbA, 0.9);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // ---- mouse beam particle ----
      if (beam.active) {
        // Draw streak from recent trail
        if (beam.trail.length > 1) {
          for (let i = 1; i < beam.trail.length; i++) {
            const p0 = beam.trail[i - 1], p1 = beam.trail[i];
            const a = i / beam.trail.length;
            ctx.strokeStyle = rgba(rgbA, 0.35 * a);
            ctx.lineWidth = 1.6 * a + 0.4;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.stroke();
          }
        }
        // Beam particle head — bigger, brighter
        const grd = ctx.createRadialGradient(beam.x, beam.y, 0, beam.x, beam.y, 26);
        grd.addColorStop(0, rgba(rgbB, 0.7));
        grd.addColorStop(0.45, rgba(rgbA, 0.35));
        grd.addColorStop(1, rgba(rgbA, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(beam.x, beam.y, 26, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(rgbB, 1);
        ctx.beginPath();
        ctx.arc(beam.x, beam.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      beam.cd = Math.max(0, beam.cd - dt);
      // Decay beam.speed each frame so idle mouse can't sustain hits
      beam.speed *= 0.82;
      if (beam.speed < 0.01) beam.speed = 0;

      // ---- collision detection: beam vs primaries ----
      // Require real beam movement (no fire on hover/idle) and per-primary
      // cooldown so the beam can't hammer the same particle repeatedly.
      if (beam.active && beam.speed > 4 && beam.cd <= 0) {
        for (const p of primaries) {
          const dx = p.x - beam.x, dy = p.y - beam.y;
          const d2 = dx * dx + dy * dy;
          const bhc = beamHitCd.get(p) || 0;
          if (d2 < 500 && bhc <= 0) {
            const cx = (p.x + beam.x) / 2, cy = (p.y + beam.y) / 2;
            emitVertex(cx, cy, 1.0 + Math.min(beam.speed * 0.025, 2.0));
            beam.cd = 600;          // global pause between beam strikes
            beamHitCd.set(p, 1400); // this primary safe for a while
            // Recoil primary along beam direction
            const ang = Math.atan2(beam.vy, beam.vx);
            const s = 0.4 + Math.min(beam.speed * 0.008, 0.5);
            p.vx = Math.cos(ang) * s;
            p.vy = Math.sin(ang) * s;
            cooldown.set(p, 300);
            break; // one hit per frame is plenty
          }
        }
      }
      // Decay per-primary beam cooldowns
      for (const p of primaries) {
        const v = beamHitCd.get(p) || 0;
        if (v > 0) beamHitCd.set(p, v - dt);
      }

      // ---- collision detection: primary vs primary (rarer, slow) ----
      for (let i = 0; i < primaries.length; i++) {
        const a = primaries[i];
        const cdA = cooldown.get(a) || 0;
        for (let j = i + 1; j < primaries.length; j++) {
          const b = primaries[j];
          const cdB = cooldown.get(b) || 0;
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 700 && cdA <= 0 && cdB <= 0) {
            const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
            const rel = Math.hypot(a.vx - b.vx, a.vy - b.vy);
            emitVertex(cx, cy, 0.6 + rel * 2.0);
            cooldown.set(a, 320);
            cooldown.set(b, 320);
            const ang = Math.atan2(dy, dx);
            const s = 0.15;
            a.vx = Math.cos(ang) * s;  a.vy = Math.sin(ang) * s;
            b.vx = -a.vx;              b.vy = -a.vy;
          }
        }
        cooldown.set(a, Math.max(0, cdA - dt));
      }

      // Very rare ambient vertex so static page still feels alive
      if (Math.random() < 0.0015) {
        emitVertex(Math.random() * w, Math.random() * h, 0.6 + Math.random() * 0.5);
      }

      // ---- tracks (persistent trails) ----
      const liveTracks = [];
      for (const t of tracks) {
        // tiny curvature (magnetic-field feel)
        const cs = Math.cos(t.curl), sn = Math.sin(t.curl);
        const nvx = t.vx * cs - t.vy * sn;
        const nvy = t.vx * sn + t.vy * cs;
        // slight deceleration (medium energy loss)
        t.vx = nvx * 0.992;
        t.vy = nvy * 0.992;
        t.x += t.vx * (dt / 16);
        t.y += t.vy * (dt / 16);
        t.life += dt;

        // append to path
        const last = t.path[t.path.length - 1];
        if (!last || (last.x - t.x) ** 2 + (last.y - t.y) ** 2 > 6) {
          t.path.push({ x: t.x, y: t.y });
          if (t.path.length > 90) t.path.shift();
        }

        const k = t.life / t.max;
        if (k >= 1) continue;
        const fade = 1 - k;

        // color: lerp accent -> accent2 along life
        const rr = (rgbA[0] + (rgbB[0] - rgbA[0]) * k) | 0;
        const gg = (rgbA[1] + (rgbB[1] - rgbA[1]) * k) | 0;
        const bb = (rgbA[2] + (rgbB[2] - rgbA[2]) * k) | 0;

        // outer glow stroke (wider, soft)
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},${0.18 * fade})`;
        ctx.lineWidth = (t.width + 3) * fade;
        ctx.beginPath();
        for (let i = 0; i < t.path.length; i++) {
          const pt = t.path[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(t.x, t.y);
        ctx.stroke();

        // inner crisp stroke
        ctx.strokeStyle = `rgba(${rr},${gg},${bb},${0.92 * fade})`;
        ctx.lineWidth = t.width * (1 - k * 0.3);
        ctx.beginPath();
        for (let i = 0; i < t.path.length; i++) {
          const pt = t.path[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineTo(t.x, t.y);
        ctx.stroke();

        // bright head
        const headR = t.width * 1.6 * (1 - k * 0.7);
        const headGrd = ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, headR * 3);
        headGrd.addColorStop(0, `rgba(${rr},${gg},${bb},${0.95 * fade})`);
        headGrd.addColorStop(1, `rgba(${rr},${gg},${bb},0)`);
        ctx.fillStyle = headGrd;
        ctx.beginPath();
        ctx.arc(t.x, t.y, headR * 3, 0, Math.PI * 2);
        ctx.fill();

        liveTracks.push(t);
      }
      tracks = liveTracks;

      // ---- fragments (debris) ----
      const liveFrags = [];
      for (const f of fragments) {
        f.vx *= f.drag;
        f.vy *= f.drag;
        f.x += f.vx * (dt / 16);
        f.y += f.vy * (dt / 16);
        f.life += dt;
        const k = f.life / f.max;
        if (k >= 1) continue;
        const a = (1 - k) * 0.85;

        // gradient blob
        const fr = f.r * (1 + k * 0.5);
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, fr * 3);
        grd.addColorStop(0, rgba(rgbB, a));
        grd.addColorStop(1, rgba(rgbB, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(f.x, f.y, fr * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = rgba(rgbA, a);
        ctx.beginPath();
        ctx.arc(f.x, f.y, fr, 0, Math.PI * 2);
        ctx.fill();

        liveFrags.push(f);
      }
      fragments = liveFrags;

      // ---- vertex flashes ----
      const liveVerts = [];
      for (const v of vertices) {
        v.t += dt;
        const k = v.t / v.max;
        if (k >= 1) continue;
        const a = (1 - k);
        const r = 4 + k * 24 * v.energy;
        const grd = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, r);
        grd.addColorStop(0, rgba(rgbA, 0.6 * a));
        grd.addColorStop(0.4, rgba(rgbB, 0.25 * a));
        grd.addColorStop(1, rgba(rgbA, 0));
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(v.x, v.y, r, 0, Math.PI * 2);
        ctx.fill();
        liveVerts.push(v);
      }
      vertices = liveVerts;

      requestAnimationFrame(tick);
    }

    init();
    window.addEventListener("resize", init);
    window.addEventListener("mousemove", (e) => {
      const nx = e.clientX, ny = e.clientY;
      if (beam.active) {
        beam.vx = nx - beam.x;
        beam.vy = ny - beam.y;
      } else {
        beam.vx = 0; beam.vy = 0;
      }
      beam.speed = Math.hypot(beam.vx, beam.vy);
      beam.px = beam.x;
      beam.py = beam.y;
      beam.x = nx;
      beam.y = ny;
      beam.active = true;
      beam.trail.push({ x: nx, y: ny });
      if (beam.trail.length > 16) beam.trail.shift();
    }, { passive: true });
    window.addEventListener("mouseleave", () => { beam.active = false; beam.trail.length = 0; });
    window.addEventListener("blur",       () => { beam.active = false; beam.trail.length = 0; });
    window.addEventListener("click", (e) => {
      emitVertex(e.clientX, e.clientY, 1.6); // big burst on click
    });
    // Trail decay when mouse idle
    setInterval(() => { if (beam.active && beam.trail.length) beam.trail.shift(); }, 60);
    requestAnimationFrame(tick);
  }

  /* ---------- Hover-jiggle hero tags ---------- */
  document.querySelectorAll("[data-tag]").forEach((tag) => {
    tag.addEventListener("mouseenter", () => {
      tag.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-4px) rotate(-1.5deg)" }, { transform: "translateY(0)" }],
        { duration: 380, easing: "cubic-bezier(.22,1,.36,1)" }
      );
    });
  });
})();
