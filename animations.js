/* =========================================================
   Vijey Sachin A | Portfolio v2
   GSAP + ScrollTrigger + Lenis, plus hand-made canvas effects.
   If the CDN libraries fail to load, the page stays fully readable.
   ========================================================= */
(() => {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const rand = (a, b) => a + Math.random() * (b - a);
  const SVGNS = "http://www.w3.org/2000/svg";

  const reduce  = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine    = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const ANIM    = hasGSAP && !reduce;

  if (ANIM) {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("anim");
  }

  /* ---------------------------------------------------------
     Text splitter: wraps words / characters in spans,
     keeping inner tags like <br> and <b>.
     --------------------------------------------------------- */
  function split(el, mode = "chars") {
    if (!el) return [];
    if (!el.getAttribute("aria-label")) el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    const out = [];
    const walk = (node, parent) => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { parent.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.className = "w";
            w.setAttribute("aria-hidden", "true");
            if (mode === "chars") {
              [...part].forEach(c => {
                const s = document.createElement("span");
                s.className = "ch"; s.textContent = c;
                w.appendChild(s); out.push(s);
              });
            } else { w.textContent = part; out.push(w); }
            parent.appendChild(w);
          });
        } else if (n.nodeType === 1) {
          const clone = n.cloneNode(false);
          parent.appendChild(clone);
          walk(n, clone);
        }
      });
    };
    const holder = document.createElement("div");
    walk(el, holder);
    el.innerHTML = "";
    while (holder.firstChild) el.appendChild(holder.firstChild);
    return out;
  }

  /* ---------------------------------------------------------
     FX canvas: sparks + lightning (works without GSAP)
     --------------------------------------------------------- */
  const fx = $("#fx");
  const fctx = fx.getContext("2d");
  let FW = 0, FH = 0, DPR = Math.min(devicePixelRatio || 1, 2);
  const sparks = [], bolts = [];

  function sizeFx() {
    FW = innerWidth; FH = innerHeight;
    fx.width = FW * DPR; fx.height = FH * DPR;
    fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  sizeFx();
  addEventListener("resize", sizeFx);

  function spark(x, y, n = 1, power = 1) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const a = rand(0, Math.PI * 2), sp = rand(1, 4.5) * power;
      sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, decay: rand(.02, .045) });
    }
  }

  function boltPoints(x1, y1, x2, y2, disp) {
    if (disp < 3) return [[x1, y1], [x2, y2]];
    const mx = (x1 + x2) / 2 + rand(-.5, .5) * disp;
    const my = (y1 + y2) / 2 + rand(-.5, .5) * disp;
    const a = boltPoints(x1, y1, mx, my, disp / 2);
    const b = boltPoints(mx, my, x2, y2, disp / 2);
    return a.concat(b.slice(1));
  }

  function bolt(x1, y1, x2, y2) {
    if (reduce) return;
    const d = Math.hypot(x2 - x1, y2 - y1);
    bolts.push({ pts: boltPoints(x1, y1, x2, y2, d * .35), life: 1 });
  }

  (function fxLoop() {
    fctx.clearRect(0, 0, FW, FH);
    if (sparks.length || bolts.length) {
      fctx.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy; s.vy += .08; s.vx *= .97; s.life -= s.decay;
        if (s.life <= 0) { sparks.splice(i, 1); continue; }
        fctx.strokeStyle = `rgba(160,235,255,${s.life})`;
        fctx.lineWidth = 1.6 * s.life + .4;
        fctx.beginPath();
        fctx.moveTo(s.x, s.y);
        fctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        fctx.stroke();
      }
      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        b.life -= .06;
        if (b.life <= 0) { bolts.splice(i, 1); continue; }
        fctx.shadowColor = "#7FE3FF"; fctx.shadowBlur = 18;
        fctx.strokeStyle = `rgba(230,250,255,${b.life})`;
        fctx.lineWidth = 2.2 * b.life;
        fctx.beginPath();
        b.pts.forEach((p, j) => j ? fctx.lineTo(p[0], p[1]) : fctx.moveTo(p[0], p[1]));
        fctx.stroke();
        fctx.shadowBlur = 0;
      }
      fctx.globalCompositeOperation = "source-over";
    }
    requestAnimationFrame(fxLoop);
  })();

  /* ---------------------------------------------------------
     Custom cursor
     --------------------------------------------------------- */
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  if (fine && !reduce) {
    document.body.classList.add("has-cursor");
    const cur = $(".cursor"), dot = $(".cursor__dot"), ring = $(".cursor__ring");
    let rx = mouse.x, ry = mouse.y, lx = mouse.x, ly = mouse.y;

    addEventListener("mousemove", e => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      dot.style.transform = `translate(${mouse.x}px,${mouse.y}px)`;
      if (Math.hypot(mouse.x - lx, mouse.y - ly) > 26) {
        spark(mouse.x, mouse.y, 1, .6);
        lx = mouse.x; ly = mouse.y;
      }
    });
    (function ringLoop() {
      rx += (mouse.x - rx) * .16; ry += (mouse.y - ry) * .16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(ringLoop);
    })();

    addEventListener("mousedown", () => cur.classList.add("is-down"));
    addEventListener("mouseup", () => cur.classList.remove("is-down"));
    addEventListener("click", e => {
      spark(e.clientX, e.clientY, 18, 1.2);
      for (let i = 0; i < 2; i++) {
        const a = rand(0, Math.PI * 2), r = rand(70, 140);
        bolt(e.clientX, e.clientY, e.clientX + Math.cos(a) * r, e.clientY + Math.sin(a) * r);
      }
    });
    document.addEventListener("mouseover", e => {
      cur.classList.toggle("is-hover", !!e.target.closest("a, button, [data-tilt], .chips li"));
    });
  }

  /* ---------------------------------------------------------
     Magnetic buttons
     --------------------------------------------------------- */
  if (fine && !reduce) {
    $$("[data-magnetic]").forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .35;
        const y = (e.clientY - r.top - r.height / 2) * .45;
        el.style.transform = `translate(${x}px,${y}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1)";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 500);
      });
    });
  }

  /* ---------------------------------------------------------
     Scroll progress: rail + HUD
     --------------------------------------------------------- */
  const railFill = $("#railFill"), railSpark = $("#railSpark"), hudNum = $("#hudNum"), hudBar = $("#hudBar");
  function onScrollProgress() {
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    railFill.style.transform = `scaleY(${p})`;
    railSpark.style.top = p * 100 + "%";
    hudBar.style.transform = `scaleX(${p})`;
    hudNum.textContent = String(Math.round(p * 100)).padStart(3, "0");
  }
  addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  /* active nav link */
  const navLinks = $$(".nav a[href^='#']");
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main section[id]").forEach(s => io.observe(s));

  /* ---------------------------------------------------------
     HERO: windows, electrons, lightning, parallax
     --------------------------------------------------------- */
  const energy = { v: ANIM ? .12 : 1 };
  const winGroup = $("#windows");
  let windows = [];

  (function buildWindows() {
    winGroup.innerHTML = "";
    $$(".building rect").forEach(b => {
      const x = +b.getAttribute("x"), y = +b.getAttribute("y");
      const w = +b.getAttribute("width"), h = +b.getAttribute("height");
      for (let cx = Math.max(x, 0) + 6; cx < x + w - 8; cx += 14) {
        for (let cy = y + 9; cy < Math.min(y + h, 900) - 8; cy += 18) {
          if (Math.random() < .25) continue;
          const r = document.createElementNS(SVGNS, "rect");
          r.setAttribute("x", cx); r.setAttribute("y", cy);
          r.setAttribute("width", 6); r.setAttribute("height", 8);
          r.setAttribute("fill", Math.random() < .78 ? "#FFD98A" : "#9FE9FF");
          r.style.opacity = ANIM ? .05 : .85;
          winGroup.appendChild(r); windows.push(r);
        }
      }
    });
  })();

  const cablePaths = $$(".hero .cable");
  const eGroup = $("#electrons");
  const electrons = [];
  cablePaths.forEach((p, pi) => {
    const L = p.getTotalLength();
    const n = 12;
    for (let i = 0; i < n; i++) {
      const c = document.createElementNS(SVGNS, "circle");
      c.setAttribute("r", rand(4, 7).toFixed(1));
      c.setAttribute("fill", "url(#eGrad)");
      eGroup.appendChild(c);
      electrons.push({ el: c, path: p, L, d: (L / n) * i + rand(0, 40), sp: rand(2.2, 3.4) * (pi ? .85 : 1) });
    }
  });

  let heroVisible = true;
  new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe($(".hero"));

  const liveLines = $$(".hero .live");
  (function heroLoop() {
    if (heroVisible && !reduce) {
      const ev = energy.v;
      electrons.forEach(e => {
        e.d = (e.d + e.sp * (.35 + ev * 2)) % e.L;
        const pt = e.path.getPointAtLength(e.d);
        e.el.setAttribute("cx", pt.x.toFixed(1));
        e.el.setAttribute("cy", pt.y.toFixed(1));
        e.el.style.opacity = .25 + ev * .75;
      });
      liveLines.forEach(l => (l.style.opacity = .15 + ev * .85));
    }
    requestAnimationFrame(heroLoop);
  })();

  /* lightning arcs between tower tops */
  const arc = $("#arc");
  const tops = [[260, 300], [800, 180], [1340, 300]];
  function svgBolt() {
    if (!heroVisible || reduce || energy.v < .45) return;
    const i = Math.random() < .5 ? 0 : 1;
    const [a, b] = [tops[i], tops[i + 1]];
    const pts = boltPoints(a[0], a[1] - 10, b[0], b[1] - 10, 260);
    arc.setAttribute("points", pts.map(p => p.join(",")).join(" "));
    arc.animate([{ opacity: 1 }, { opacity: .2 }, { opacity: .9 }, { opacity: 0 }], { duration: 420, easing: "ease-out" });
  }
  if (!reduce) (function arcTimer() { svgBolt(); setTimeout(arcTimer, rand(1400, 3600)); })();

  /* mouse parallax */
  if (ANIM && fine) {
    const tx = gsap.quickTo("#towersG", "x", { duration: 1.2, ease: "power3" });
    const ty = gsap.quickTo("#towersG", "y", { duration: 1.2, ease: "power3" });
    const cx = gsap.quickTo("#cityG", "x", { duration: 1.2, ease: "power3" });
    const kx = gsap.quickTo("#cablesG", "x", { duration: 1.2, ease: "power3" });
    const ky = gsap.quickTo("#cablesG", "y", { duration: 1.2, ease: "power3" });
    addEventListener("mousemove", e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      tx(nx * -24); ty(ny * -12); kx(nx * -24); ky(ny * -12); cx(nx * -50);
    });
  }

  /* ---------------------------------------------------------
     Terminal typing (works without GSAP)
     --------------------------------------------------------- */
  const termLines = [
    { cls: "me",  t: "you › rewrite this cursor as a CTE" },
    { cls: "bot", t: "ai  › set-based version ready" },
    { cls: "me",  t: "you › explain the execution plan" },
    { cls: "bot", t: "ai  › index seek replaced table scan" },
    { cls: "ok",  t: "you › tested, reviewed, shipped ✓" }
  ];
  const termOut = $("#termOut");
  if (!reduce) {
    let typed = false;
    new IntersectionObserver(([e], obs) => {
      if (!e.isIntersecting || typed) return;
      typed = true; obs.disconnect();
      termOut.innerHTML = "";
      const caret = document.createElement("span"); caret.className = "caret";
      let li = 0;
      const nextLine = () => {
        if (li >= termLines.length) { termOut.appendChild(caret); return; }
        const { cls, t } = termLines[li++];
        const span = document.createElement("span"); span.className = cls;
        termOut.appendChild(span); termOut.appendChild(caret);
        let ci = 0;
        const speed = cls === "bot" ? 18 : 38;
        const typeChar = () => {
          span.textContent = t.slice(0, ++ci);
          if (ci < t.length) setTimeout(typeChar, speed + rand(0, 25));
          else { termOut.insertBefore(document.createTextNode("\n"), caret); setTimeout(nextLine, cls === "me" ? 500 : 350); }
        };
        typeChar();
      };
      setTimeout(nextLine, 300);
    }, { threshold: .5 }).observe($("#term"));
  }

  /* ---------------------------------------------------------
     AI neural network canvas
     --------------------------------------------------------- */
  (function neural() {
    const cv = $("#neural"); if (!cv || reduce) return;
    const ctx = cv.getContext("2d");
    const sec = $("#ai");
    let W, H, nodes = [], pulses = [], visible = false;
    const local = { x: -999, y: -999 };

    function size() {
      W = sec.offsetWidth; H = sec.offsetHeight;
      cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      const n = Math.min(90, Math.round((W * H) / 16000));
      nodes = Array.from({ length: n }, () => ({ x: rand(0, W), y: rand(0, H), vx: rand(-.25, .25), vy: rand(-.25, .25) }));
    }
    size(); addEventListener("resize", size);
    sec.addEventListener("mousemove", e => { const r = sec.getBoundingClientRect(); local.x = e.clientX - r.left; local.y = e.clientY - r.top; });
    sec.addEventListener("mouseleave", () => (local.x = local.y = -999));
    new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(sec);

    (function loop() {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        const R = 140;
        nodes.forEach(n => {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > W) n.vx *= -1;
          if (n.y < 0 || n.y > H) n.vy *= -1;
          const dm = Math.hypot(n.x - local.x, n.y - local.y);
          if (dm < 180) { n.x += (local.x - n.x) * .006; n.y += (local.y - n.y) * .006; }
        });
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d < R) {
              ctx.strokeStyle = `rgba(127,227,255,${(1 - d / R) * .22})`;
              ctx.lineWidth = 1;
              ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
              if (Math.random() < .0009) pulses.push({ a, b, t: 0 });
            }
          }
          const n = nodes[i], dm = Math.hypot(n.x - local.x, n.y - local.y);
          if (dm < 180) {
            ctx.strokeStyle = `rgba(255,210,63,${(1 - dm / 180) * .5})`;
            ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(local.x, local.y); ctx.stroke();
          }
          ctx.fillStyle = "rgba(160,200,255,.6)";
          ctx.beginPath(); ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2); ctx.fill();
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i]; p.t += .025;
          if (p.t >= 1) { pulses.splice(i, 1); continue; }
          const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
          const g = ctx.createRadialGradient(x, y, 0, x, y, 8);
          g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(1, "rgba(127,227,255,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
        }
      }
      requestAnimationFrame(loop);
    })();
  })();

  /* ---------------------------------------------------------
     Skills: circuit traces from the CPU to each board
     --------------------------------------------------------- */
  const board = $("#board"), traces = $("#traces"), cpu = $("#cpu");
  let tracesDrawn = !ANIM;

  function buildTraces() {
    if (getComputedStyle(traces).display === "none") return;
    const BW = board.offsetWidth, BH = board.offsetHeight;
    traces.setAttribute("viewBox", `0 0 ${BW} ${BH}`);
    traces.innerHTML = "";
    const rel = el => ({ l: el.offsetLeft, r: el.offsetLeft + el.offsetWidth, t: el.offsetTop, b: el.offsetTop + el.offsetHeight, cy: el.offsetTop + el.offsetHeight / 2 });
    const c = rel(cpu);
    const cards = ["c1", "c2", "c3", "c4"].map(k => rel($("." + k, board)));

    const add = (d, pads) => {
      const base = document.createElementNS(SVGNS, "path");
      base.setAttribute("d", d); base.setAttribute("class", "tr-base");
      const draw = document.createElementNS(SVGNS, "path");
      draw.setAttribute("d", d); draw.setAttribute("class", "tr-draw"); draw.setAttribute("pathLength", "1");
      if (!tracesDrawn) draw.style.strokeDashoffset = 1;
      const live = document.createElementNS(SVGNS, "path");
      live.setAttribute("d", d); live.setAttribute("class", "tr-live");
      traces.append(base, draw, live);
      pads.forEach(([x, y]) => {
        const p = document.createElementNS(SVGNS, "circle");
        p.setAttribute("cx", x); p.setAttribute("cy", y); p.setAttribute("r", 4.5); p.setAttribute("class", "tr-pad");
        traces.appendChild(p);
      });
    };

    cards.forEach((k, i) => {
      const left = i % 2 === 0;
      const top = i < 2;
      [-14, 14].forEach((off, j) => {
        const sy = c.cy + (top ? -30 : 30) + off;
        const sx = left ? c.l - 18 : c.r + 18;
        const ex = left ? k.r : k.l;
        const ey = k.cy + (j ? 22 : -22);
        const mx = (sx + ex) / 2 + (j ? 10 : -10) * (left ? 1 : -1);
        add(`M${sx} ${sy} H${mx} V${ey} H${ex}`, [[sx, sy], [ex, ey]]);
      });
    });
  }
  buildTraces();
  new ResizeObserver(() => buildTraces()).observe(board);

  /* tilt + glare on boards */
  if (fine && !reduce) {
    $$("[data-tilt]").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        card.style.transform = `perspective(900px) rotateX(${(.5 - py) * 8}deg) rotateY(${(px - .5) * 10}deg) translateZ(0)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)";
        card.style.transform = "";
        setTimeout(() => (card.style.transition = ""), 600);
      });
    });
  }

  /* ---------------------------------------------------------
     Journey cable geometry
     --------------------------------------------------------- */
  const track = $("#track"), jCable = $("#jCable"), jBase = $("#jBase"), jLive = $("#jLive"), jHead = $("#jHead");
  let jLen = 0;
  function buildCable() {
    if (!ANIM) return;
    const W = track.scrollWidth, H = 140;
    jCable.setAttribute("width", W); jCable.setAttribute("height", H);
    jCable.setAttribute("viewBox", `0 0 ${W} ${H}`);
    jCable.style.width = W + "px";
    let d = `M0 ${H / 2}`, seg = 520, k = 0;
    for (let x = 0; x < W; x += seg, k++) d += ` Q${x + seg / 2} ${k % 2 ? H * .9 : H * .1} ${x + seg} ${H / 2}`;
    jBase.setAttribute("d", d); jLive.setAttribute("d", d);
    jLen = jLive.getTotalLength();
    jLive.style.strokeDasharray = jLen;
    setCable(0);
  }
  function setCable(p) {
    if (!jLen) return;
    jLive.style.strokeDashoffset = jLen * (1 - p);
    const pt = jLive.getPointAtLength(jLen * p);
    jHead.setAttribute("cx", pt.x); jHead.setAttribute("cy", pt.y);
  }

  /* big contact switch */
  const big = $("#bigSwitch");
  big.addEventListener("click", () => {
    if (big.classList.contains("on")) return;
    big.classList.add("on");
    $(".bigswitch__label", big).textContent = "Connecting you…";
    const r = big.getBoundingClientRect();
    const ox = r.left + 40, oy = r.top + r.height / 2;
    spark(ox, oy, 50, 2);
    for (let i = 0; i < 5; i++) {
      setTimeout(() => bolt(ox, oy, rand(0, innerWidth), rand(0, innerHeight * .6)), i * 90);
    }
    setTimeout(() => {
      location.href = "mailto:vijeysachin1605@gmail.com?subject=Hello%20Vijey";
      setTimeout(() => { big.classList.remove("on"); $(".bigswitch__label", big).textContent = "Switch on a conversation"; }, 1500);
    }, 900);
  });

  /* ---------------------------------------------------------
     No GSAP? Stop here: the page is already readable.
     --------------------------------------------------------- */
  if (!ANIM) {
    $("#loader")?.remove();
    return;
  }

  /* ---------------------------------------------------------
     Smooth scroll (Lenis)
     --------------------------------------------------------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: .085, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$("a[href^='#']").forEach(a => a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    const target = id === "#top" ? 0 : $(id);
    if (target === null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 });
    else (target === 0 ? scrollTo({ top: 0, behavior: "smooth" }) : target.scrollIntoView({ behavior: "smooth" }));
  }));

  /* ---------------------------------------------------------
     Split texts
     --------------------------------------------------------- */
  const nameChars  = split($("#heroName"));
  const line2Chars = split($("#heroLine2 .l2"));
  const aboutWords = split($("#aboutBig"), "words");
  const contactChars = split($("#contactTitle"));
  const h2Words = $$(".split-up").map(h => split(h, "words"));

  /* ---------------------------------------------------------
     Loader
     --------------------------------------------------------- */
  const loader = $("#loader");
  document.body.classList.add("loading");
  gsap.set([...nameChars, ...$$(".hello, .hero__sub, .tags li, .cue, .top")], { opacity: 0 });
  gsap.set(loader, { clipPath: "inset(0% 0% 0% 0%)" });
  gsap.set(".tower", { strokeDashoffset: 1 });
  gsap.set(".hero .cable", { strokeDashoffset: 1 });

  const volts = { v: 0 };
  gsap.timeline()
    .to(volts, {
      v: 230, duration: 1.9, ease: "power2.inOut",
      onUpdate: () => {
        $("#ldNum").textContent = String(Math.round(volts.v)).padStart(3, "0");
        $("#ldBar").style.transform = `scaleX(${volts.v / 230})`;
      }
    })
    .add(() => ($("#ldTxt").textContent = "230 V stable. Switching on."))
    .to(".breaker__lever", { y: -38, duration: .35, ease: "back.out(3)" }, "+=.2")
    .add(() => { loader.classList.add("on"); const r = $(".breaker").getBoundingClientRect(); spark(r.left + r.width / 2, r.top + 20, 30, 1.4); })
    .to(".loader__flash", { opacity: 1, duration: .12 }, "+=.15")
    .to(".loader__flash", { opacity: 0, duration: .5 })
    .to(loader, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, "-=.45")
    .add(heroIntro, "-=.6")
    .add(() => {
      loader.remove();
      document.body.classList.remove("loading");
      lenis && lenis.start();
      ScrollTrigger.refresh();
    });

  function heroIntro() {
    gsap.to(".top", { opacity: 1, y: 0, duration: 1, ease: "power3.out", startAt: { y: -30 } });
    gsap.to(".tower", { strokeDashoffset: 0, duration: 2.4, ease: "power2.inOut" });
    gsap.to(".hero .cable", { strokeDashoffset: 0, duration: 2.6, ease: "power2.inOut", delay: .3 });
    gsap.fromTo(nameChars, { opacity: 0, yPercent: 110, rotateX: -90 },
      { opacity: 1, yPercent: 0, rotateX: 0, duration: 1.2, stagger: .045, ease: "expo.out", delay: .1 });
    gsap.fromTo([".hello", ".hero__sub", ".tags li", ".cue"], { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: .9, stagger: .08, ease: "power3.out", delay: .5 });

    /* current sweeping through the name, forever */
    gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: 2.5 })
      .to(nameChars, { color: "#7FE3FF", textShadow: "0 0 14px #7FE3FF, 0 0 34px rgba(127,227,255,.6)", duration: .12, stagger: .05 })
      .to(nameChars, { color: "#ECE6DA", textShadow: "0 0 0 rgba(127,227,255,0)", duration: .5, stagger: .05 }, .18);
  }

  /* ---------------------------------------------------------
     HERO scroll film
     --------------------------------------------------------- */
  gsap.set(line2Chars, { opacity: 0, yPercent: 60, rotateX: -80 });
  gsap.set("#heroLine2 small", { opacity: 0, y: 20 });

  const heroTL = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: ".hero", start: "top top", end: "+=280%", scrub: 1, pin: true, anticipatePin: 1 }
  });
  heroTL
    .to(".hero__intro", { y: -140, opacity: 0, filter: "blur(10px)", duration: 1 }, 0)
    .to(energy, { v: 1, duration: 1.4 }, 0)
    .to(".scene", { scale: 1.25, duration: 1.6 }, 0)
    .to(windows, { opacity: .95, duration: .04, stagger: { amount: 1.3, from: "random" } }, .2)
    .to(line2Chars, { opacity: 1, yPercent: 0, rotateX: 0, duration: .5, stagger: .025, ease: "power2.out" }, 1.0)
    .to("#heroLine2 small", { opacity: 1, y: 0, duration: .4 }, 1.5)
    .to(".scene", { scale: 3.6, duration: 1.5, ease: "power2.in" }, 1.6)
    .to("#heroLine2", { scale: 1.35, opacity: 0, filter: "blur(12px)", duration: .6 }, 2.55)
    .to(".hero__flash", { opacity: .95, duration: .2 }, 2.8)
    .to(".hero__flash", { opacity: 0, duration: .35 }, 3.0);

  /* ---------------------------------------------------------
     Marquee reacting to scroll speed
     --------------------------------------------------------- */
  const mq1 = gsap.to("#mq1", { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
  const mq2 = gsap.fromTo("#mq2", { xPercent: -50 }, { xPercent: 0, duration: 36, ease: "none", repeat: -1 });
  const skew = gsap.quickTo(".marquee__row", "skewX", { duration: .4, ease: "power3" });
  ScrollTrigger.create({
    trigger: ".marquee", start: "top bottom", end: "bottom top",
    onUpdate: self => {
      const v = self.getVelocity();
      const ts = 1 + Math.min(Math.abs(v) / 250, 6);
      gsap.to([mq1, mq2], { timeScale: ts, duration: .3, overwrite: true });
      skew(gsap.utils.clamp(-12, 12, v / -120));
    },
    onLeave: () => gsap.to([mq1, mq2], { timeScale: 1 }),
    onLeaveBack: () => gsap.to([mq1, mq2], { timeScale: 1 })
  });
  ScrollTrigger.addEventListener("scrollEnd", () => { gsap.to([mq1, mq2], { timeScale: 1, duration: .8 }); skew(0); });

  /* ---------------------------------------------------------
     PROFILE: scroll transforms Developer -> TNEB uniform
     --------------------------------------------------------- */
  const profile = $(".profile"), portrait = $("#portrait"), pfFigure = $("#pfFigure");
  const layTech = $(".pf-tech"), layHolo = $(".pf-holo"), layTneb = $(".pf-tneb");
  const beam = $("#pfBeam"), pct = $("#pfPct"), bigWord = $("#bigWord");
  profile.classList.remove("is-tneb");
  bigWord.textContent = "DEVELOPER";

  /* text scramble for the giant background word */
  const glyphs = "01⚡#%&<>/{}ABCDEFXYZ";
  let scrambleId = 0;
  function scramble(el, to) {
    const id = ++scrambleId, from = el.textContent, len = Math.max(from.length, to.length);
    let f = 0;
    const total = 26;
    (function step() {
      if (id !== scrambleId) return;
      let out = "";
      for (let i = 0; i < len; i++) {
        const lockAt = (i / len) * total * .7 + total * .3;
        if (f >= lockAt) out += to[i] || "";
        else out += (Math.random() < .5 && from[i]) ? glyphs[(Math.random() * glyphs.length) | 0] : glyphs[(Math.random() * glyphs.length) | 0];
      }
      el.textContent = out;
      if (++f <= total) requestAnimationFrame(step); else el.textContent = to;
    })();
  }

  let mode = "dev";
  function setMode(next) {
    if (next === mode) return;
    mode = next;
    profile.classList.toggle("is-tneb", next === "tneb");
    scramble(bigWord, next === "tneb" ? "TNEB" : "DEVELOPER");
  }

  const BAND = 14;              /* height (%) of the glowing outline band */
  const sw = { p: 0 };
  let lastP = 0, done = false;

  function renderSwap() {
    const raw = sw.p;                          /* 0 .. 100 + BAND */
    const p = Math.min(100, raw);
    const holoTop = Math.min(100, Math.max(0, raw - BAND));
    layTneb.style.clipPath = `inset(0% 0% ${100 - holoTop}% 0%)`;
    layHolo.style.clipPath = `inset(${holoTop}% 0% ${100 - p}% 0%)`;
    layTech.style.clipPath = `inset(${p}% 0% 0% 0%)`;
    beam.style.top = p + "%";
    beam.style.opacity = raw > 0.5 && raw < 100 ? 1 : 0;
    pct.textContent = Math.round(p);

    /* sparks along the beam while it moves */
    const moved = Math.abs(raw - lastP);
    if (moved > .05 && raw > 0 && raw < 100) {
      const r = pfFigure.getBoundingClientRect();
      const y = r.top + r.height * p / 100;
      for (let i = 0; i < Math.min(4, 1 + moved * 3); i++) spark(r.left + r.width * rand(.15, .85), y, 1, .9);
      layTech.style.transform = `translateX(${rand(-3, 3)}px)`;
      clearTimeout(renderSwap.t);
      renderSwap.t = setTimeout(() => (layTech.style.transform = ""), 90);
    }

    setMode(p >= 50 ? "tneb" : "dev");

    if (raw >= 100 + BAND - .5 && lastP < 100 + BAND - .5 && !done) {
      done = true;
      const r = portrait.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height * .35;
      spark(cx, cy, 60, 2.2);
      for (let i = 0; i < 5; i++) setTimeout(() => bolt(cx, cy, cx + rand(-360, 360), cy + rand(-280, 280)), i * 70);
      gsap.fromTo(".pf-flash", { opacity: .9 }, { opacity: 0, duration: .8, ease: "power2.out" });
      gsap.fromTo(".pf-ring", { scale: .9 }, { scale: 1, duration: 1.2, ease: "elastic.out(1,.4)" });
    }
    if (raw < 90) done = false;
    lastP = raw;
  }
  renderSwap();

  gsap.from([".pf-head > *", ".pf-side"], {
    y: 60, opacity: 0, stagger: .08, duration: 1, ease: "expo.out", clearProps: "opacity,transform",
    scrollTrigger: { trigger: profile, start: "top 70%", toggleActions: "play none none reverse" }
  });
  gsap.from(portrait, {
    scale: .85, opacity: 0, duration: 1.2, ease: "expo.out",
    scrollTrigger: { trigger: profile, start: "top 70%", toggleActions: "play none none reverse" }
  });
  gsap.timeline({
    scrollTrigger: { trigger: profile, start: "top top", end: "+=240%", scrub: .8, pin: true, anticipatePin: 1 }
  })
    .to({}, { duration: .25 })
    .to(sw, { p: 100 + BAND, duration: 1.4, ease: "none", onUpdate: renderSwap })
    .to({}, { duration: .45 });

  if (fine) {
    const ry = gsap.quickTo(portrait, "rotationY", { duration: 1, ease: "power3" });
    const rx = gsap.quickTo(portrait, "rotationX", { duration: 1, ease: "power3" });
    gsap.set(portrait, { transformPerspective: 1200 });
    profile.addEventListener("mousemove", e => {
      ry((e.clientX / innerWidth - .5) * 14);
      rx((e.clientY / innerHeight - .5) * -8);
    });
  }

  /* ---------------------------------------------------------
     JOURNEY: horizontal pinned scroll
     --------------------------------------------------------- */
  buildCable();
  const dist = () => track.scrollWidth - innerWidth;
  const chapNum = $("#chapNum"), chapBar = $("#chapBar");
  const hz = gsap.to(track, {
    x: () => -dist(), ease: "none",
    scrollTrigger: {
      trigger: ".journey", start: "top top", end: () => "+=" + dist() * 1.1,
      pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      onRefresh: buildCable,
      onUpdate: self => {
        setCable(self.progress);
        chapBar.style.transform = `scaleX(${self.progress})`;
        chapNum.textContent = "0" + Math.min(4, Math.floor(self.progress * 3.999) + 1);
      }
    }
  });

  $$(".panel").forEach((panel, i) => {
    const items = $$(".rv", panel);
    gsap.from(items, {
      y: 90, opacity: 0, rotateX: -25, duration: 1, stagger: .1, ease: "expo.out",
      scrollTrigger: i === 0
        ? { trigger: ".journey", start: "top 70%", toggleActions: "play none none reverse" }
        : { trigger: panel, containerAnimation: hz, start: "left 75%", toggleActions: "play none none reverse" }
    });
    const lines = $$(".ln", panel);
    if (lines.length) gsap.from(lines, {
      x: -30, opacity: 0, duration: .6, stagger: .08, ease: "power3.out",
      scrollTrigger: i === 0
        ? { trigger: ".journey", start: "top 50%", toggleActions: "play none none reverse" }
        : { trigger: panel, containerAnimation: hz, start: "left 55%", toggleActions: "play none none reverse" }
    });
  });

  gsap.fromTo("#tneb", { backgroundSize: "0% 100%" }, {
    backgroundSize: "100% 100%", ease: "none",
    scrollTrigger: {
      trigger: $$(".panel")[2], containerAnimation: hz, start: "left 60%", end: "center 50%", scrub: true,
      onLeave: () => { const r = $("#tneb").getBoundingClientRect(); spark(r.left + r.width / 2, r.top + r.height / 2, 40, 1.8); }
    }
  });

  /* ---------------------------------------------------------
     Section headings: words rise in
     --------------------------------------------------------- */
  h2Words.forEach(words => {
    gsap.from(words, {
      yPercent: 100, opacity: 0, rotate: 4, duration: 1, stagger: .07, ease: "expo.out",
      scrollTrigger: { trigger: words[0].closest(".split-up"), start: "top 85%", toggleActions: "play none none reverse" }
    });
  });

  /* ---------------------------------------------------------
     ABOUT: current runs through the paragraph word by word
     --------------------------------------------------------- */
  gsap.set(aboutWords, { opacity: .12 });
  const aboutTL = gsap.timeline({
    scrollTrigger: { trigger: "#aboutBig", start: "top 80%", end: "bottom 45%", scrub: .6 }
  });
  aboutWords.forEach((w, i) => {
    aboutTL.to(w, { opacity: 1, color: "#7FE3FF", textShadow: "0 0 18px rgba(127,227,255,.8)", duration: .3 }, i * .12)
           .to(w, { color: "#ECE6DA", textShadow: "0 0 0 rgba(127,227,255,0)", duration: .6 }, i * .12 + .3);
  });

  /* gauges */
  $$(".gauge").forEach((g, i) => {
    const val = +g.dataset.value, max = +g.dataset.max, dec = +g.dataset.dec, suf = g.dataset.suffix || "";
    const arcEl = $(".g-arc", g), needle = $(".g-needle", g), num = $(".gauge__num b", g);
    const pct = val / max;
    gsap.set(arcEl, { strokeDashoffset: 100 });
    gsap.set(needle, { rotation: -90, svgOrigin: "100 110" });
    num.textContent = (0).toFixed(dec) + suf;
    const o = { v: 0 };
    gsap.timeline({
      scrollTrigger: { trigger: g, start: "top 85%", toggleActions: "play none none reverse" },
      delay: i * .15
    })
      .from(g, { y: 60, opacity: 0, duration: .8, ease: "expo.out" })
      .to(arcEl, { strokeDashoffset: 100 - pct * 100, duration: 1.6, ease: "power3.out" }, .2)
      .to(needle, { rotation: -90 + 180 * pct, duration: 1.8, ease: "elastic.out(1,.5)" }, .2)
      .to(o, { v: val, duration: 1.6, ease: "power3.out", onUpdate: () => (num.textContent = o.v.toFixed(dec) + suf) }, .2);
  });

  /* ---------------------------------------------------------
     SKILLS: power up the board
     --------------------------------------------------------- */
  gsap.set(".card", { opacity: 0, y: 60 });
  gsap.set(".chips li", { opacity: .15 });
  gsap.set(".cpu", { scale: .8, opacity: 0 });
  ScrollTrigger.create({
    trigger: board, start: "top 70%", once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      tl.to(".cpu", { scale: 1, opacity: 1, duration: .8, ease: "back.out(2)" })
        .add(() => {
          board.classList.add("on");
          const r = cpu.getBoundingClientRect();
          spark(r.left + r.width / 2, r.top + r.height / 2, 34, 1.6);
        })
        .to(".tr-draw", { strokeDashoffset: 0, duration: 1, stagger: .06, ease: "power2.inOut", onComplete: () => (tracesDrawn = true) }, "-=.1")
        .to(".card", { opacity: 1, y: 0, duration: .9, stagger: .12, ease: "expo.out" }, "-=.8")
        .to(".chips li", {
          keyframes: [{ opacity: 1, duration: .05 }, { opacity: .3, duration: .05 }, { opacity: 1, duration: .08 }],
          stagger: { each: .035, from: "random" }
        }, "-=.5");
    }
  });

  /* ---------------------------------------------------------
     EXPERIENCE: the wire charges, stations light up
     --------------------------------------------------------- */
  gsap.set("#tlFill", { scaleY: 0 });
  gsap.timeline({
    scrollTrigger: { trigger: "#tl", start: "top 60%", end: "bottom 60%", scrub: .5 }
  })
    .to("#tlFill", { scaleY: 1, ease: "none" }, 0)
    .to("#tlElectron", { top: "100%", ease: "none", startAt: { top: "0%" } }, 0);

  $$(".stop").forEach(stop => {
    gsap.from($(".stop__card", stop), {
      x: 120, opacity: 0, rotateY: -12, transformPerspective: 1000, duration: 1.1, ease: "expo.out",
      scrollTrigger: { trigger: stop, start: "top 82%", toggleActions: "play none none reverse" }
    });
    ScrollTrigger.create({
      trigger: stop, start: "top 60%",
      onEnter: () => {
        stop.classList.add("is-on");
        const r = $(".stop__node", stop).getBoundingClientRect();
        spark(r.left + r.width / 2, r.top + r.height / 2, 22, 1.2);
      },
      onLeaveBack: () => stop.classList.remove("is-on")
    });
  });

  /* ---------------------------------------------------------
     AI rules
     --------------------------------------------------------- */
  gsap.from(".rules li", {
    x: -60, opacity: 0, duration: .9, stagger: .15, ease: "expo.out",
    scrollTrigger: { trigger: ".rules", start: "top 80%", toggleActions: "play none none reverse" }
  });
  gsap.from("#term", {
    y: 80, opacity: 0, rotateX: 18, transformPerspective: 1000, duration: 1.2, ease: "expo.out",
    scrollTrigger: { trigger: "#term", start: "top 90%", toggleActions: "play none none reverse" }
  });

  /* ---------------------------------------------------------
     CONTACT
     --------------------------------------------------------- */
  gsap.from(contactChars, {
    yPercent: 120, opacity: 0, rotateZ: 8, duration: 1.1, stagger: .035, ease: "expo.out",
    scrollTrigger: { trigger: "#contactTitle", start: "top 85%", toggleActions: "play none none reverse" }
  });
  gsap.from(".links li", {
    x: -80, opacity: 0, duration: .9, stagger: .1, ease: "expo.out",
    scrollTrigger: { trigger: ".links", start: "top 85%", toggleActions: "play none none reverse" }
  });
  gsap.from(".bigswitch", {
    scale: .6, opacity: 0, duration: .9, ease: "back.out(2)",
    scrollTrigger: { trigger: ".bigswitch", start: "top 90%", toggleActions: "play none none reverse" }
  });

  /* refresh after fonts settle so pin distances are exact */
  document.fonts && document.fonts.ready.then(() => { buildTraces(); ScrollTrigger.refresh(); });
  addEventListener("load", () => ScrollTrigger.refresh());
})();
