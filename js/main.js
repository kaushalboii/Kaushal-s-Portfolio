
/* ══════════════════════════════════════════════════════════════
   KAUSHAL MARAN PORTFOLIO — COMPLETE ENGINE
   Exact Replication & Motion Physics from therishithakor.com
   ══════════════════════════════════════════════════════════════ */

import Lenis from 'lenis';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const COARSE = matchMedia('(pointer: coarse)').matches;
const root = document.documentElement;

// ─── SCROLL LOCK & LENIS ENGINE ───
let lenis = null, scrollEnabled = true, locks = 0;
window.__touching = false;
window.addEventListener('touchstart', () => window.__touching = true, { passive: true, capture: true });
window.addEventListener('touchend', () => window.__touching = false, { passive: true, capture: true });
window.addEventListener('touchcancel', () => window.__touching = false, { passive: true, capture: true });

window.__snapTo = top => {
  if (!COARSE && window.__lenis) {
    window.__lenis.scrollTo(top, { duration: 0.65, easing: x => 1 - Math.pow(1 - x, 3) });
  } else {
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
  }
};

function stopScroll() {
  locks++;
  scrollEnabled = false;
  lenis?.stop();
}

function startScroll() {
  locks = Math.max(0, locks - 1);
  if (locks) return;
  scrollEnabled = true;
  lenis?.start();
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset;
  window.__snapTo(top);
}

// Initialize Lenis
(() => {
  if (COARSE) return;
  lenis = new Lenis({
    duration: 1.15,
    easing: x => Math.min(1, 1.001 - Math.pow(2, -10 * x)),
    orientation: 'vertical',
    smoothWheel: true
  });
  window.__lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
})();

// ─── STICKY HEADER & LIVE CLOCK ───
{
  const hdr = $('.hdr');
  let isStuck = false;
  const upd = () => {
    const s = (window.scrollY || window.pageYOffset || 0) > 24;
    if (s !== isStuck) {
      isStuck = s;
      hdr?.classList.toggle('stuck', s);
    }
  };
  window.addEventListener('scroll', upd, { passive: true });
}

function tickClock() {
  const now = new Date();
  try {
    const timeFmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const parts = timeFmt.formatToParts(now);
    const hour = parts.find(p => p.type === 'hour')?.value || '12';
    const minute = parts.find(p => p.type === 'minute')?.value || '00';
    const dayPeriod = (parts.find(p => p.type === 'dayPeriod')?.value || 'am').toLowerCase();
    const time = `${hour}:${minute}${dayPeriod}`;

    const dateFmt = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const dParts = dateFmt.formatToParts(now);
    const day = dParts.find(p => p.type === 'day')?.value || String(now.getDate());
    const month = dParts.find(p => p.type === 'month')?.value || 'November';
    const year = dParts.find(p => p.type === 'year')?.value || String(now.getFullYear());
    const date = `${day} ${month}, ${year}`;
    const shortDate = `${day} ${month.slice(0, 3)}`;

    document.querySelectorAll('[data-time]').forEach(e => e.textContent = time);
    document.querySelectorAll('[data-date]').forEach(e => e.textContent = date);
    document.querySelectorAll('[data-dshort]').forEach(e => e.textContent = shortDate);
    document.querySelectorAll('[data-navtime]').forEach(e => e.textContent = ' — ' + time);
    document.querySelectorAll('[data-ftime]').forEach(e => e.textContent = time);
    document.querySelectorAll('[data-fyear]').forEach(e => e.textContent = year);
  } catch (e) {
    const h = now.getHours();
    const time = `${h % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
    document.querySelectorAll('[data-time]').forEach(el => el.textContent = time);
    document.querySelectorAll('[data-ftime]').forEach(el => el.textContent = time);
  }
}
tickClock();
setInterval(tickClock, 1000);

// ─── MODE (LIGHT / DARK) & PULL CORD VERLET SIMULATION ───
const MODE_KEY = 'kaushal-mode';
const themeMeta = document.querySelector('meta[name="theme-color"]');
function getMode() { return root.dataset.mode === 'dark' ? 'dark' : 'light'; }
function setMode(m, animate = true) {
  if (animate && !reduced && document.startViewTransition) {
    document.startViewTransition(() => setMode(m, false));
    return;
  }
  if (m === 'dark') root.dataset.mode = 'dark'; else delete root.dataset.mode;
  themeMeta?.setAttribute('content', m === 'dark' ? '#1A1818' : '#EEEAE6');
  $('#cordHit')?.setAttribute('aria-checked', String(m === 'dark'));
  try { localStorage.setItem(MODE_KEY, m); } catch (e) { }
}
const savedMode = (() => { try { return localStorage.getItem(MODE_KEY); } catch (e) { return null; } })();
if (savedMode) setMode(savedMode, false);
else setMode(getMode(), false);
const toggleMode = () => setMode(getMode() === 'dark' ? 'light' : 'dark');

(function pullCord() {
  const wrap = $('#cord'); if (!wrap) return;
  const cv = $('.cord__cv', wrap), hit = $('#cordHit');
  if (!cv || !hit) return;
  const ctx = cv.getContext('2d');
  const N = 26;                         // segments
  const G = 4600;                       // gravity, px/s²
  const STEP = 1 / 120;                 // fixed physics step
  const ITER = 16;                      // constraint passes
  let dpr = 1, W = 300, H = 500;
  let L = 220, EXT_MAX = 46, HIDDEN = 70, seg = 10, ax = 200, thick = 3.2, knobS = 1;
  let pts = [];                         // {x,y,px,py,w}
  let ext = 0, extV = 0, armed = true;
  let grab = -1, grabOff = { x: 0, y: 0 }, target = null, ptr = null, ptrPrev = null;
  let downAt = 0, downPos = null, moved = 0;
  let acc = 0, lastT = 0, t = 0;
  let dropped = false, live = false;

  function layout() {
    const rem = parseFloat(getComputedStyle(root).fontSize) || 16;
    const vw = innerWidth, vh = innerHeight;
    let offset;
    if (vw >= 1024) { offset = 4.25 * rem; L = Math.min(270, Math.max(190, vh * .3)); EXT_MAX = 72; thick = 3.7; knobS = 1.3; }
    else if (vw >= 640) { offset = 5.9 * rem; L = Math.min(220, Math.max(160, vh * .2)); EXT_MAX = 62; thick = 3.4; knobS = 1.2; }
    else { offset = 5.7 * rem; L = 70; EXT_MAX = 54; thick = 3.1; knobS = 1.1; }
    HIDDEN = EXT_MAX + 18;
    W = Math.min(vw, 340);
    H = Math.round(L + EXT_MAX + 170);
    wrap.style.height = H + 'px';
    dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const ck = document.querySelector('.hdr .clock');
    if (ck && ck.offsetWidth) {
      offset = vw >= 1200 ? Math.max(1.2 * rem, vw - ck.getBoundingClientRect().right - 1.4 * rem) : 2.4 * rem;
    }
    const newAx = W - offset;
    const total = L + HIDDEN;
    seg = total / N;
    if (!pts.length) {
      for (let i = 0; i <= N; i++) {
        const x = newAx, y = -HIDDEN + i * seg;
        pts.push({ x, y, px: x, py: y, w: i === 0 ? 0 : i === N ? .28 : 1 });
      }
    } else {
      const dx = newAx - ax;
      for (const p of pts) { p.x += dx; p.px += dx; }
    }
    ax = newAx;
  }

  function step(dt) {
    if (!dropped) return;
    t += dt;
    if (grab < 0) {
      const K = 760, C = 21;
      extV += (-K * ext - C * extV) * dt;
      ext += extV * dt;
    }
    if (ext > EXT_MAX * .8 && armed && live) {
      armed = false;
      toggleMode();
      try {
        const actx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.frequency.setValueAtTime(root.dataset.mode === 'dark' ? 880 : 540, actx.currentTime);
        gain.gain.setValueAtTime(0.08, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.08);
        osc.connect(gain); gain.connect(actx.destination);
        osc.start(); osc.stop(actx.currentTime + 0.08);
      } catch (e) { }
      try { navigator.vibrate?.(12); } catch (e) { }
    }
    if (ext < EXT_MAX * .22) armed = true;

    const a = pts[0];
    a.x = a.px = ax; a.y = a.py = -HIDDEN + ext;

    const wind = reduced ? 0 : (Math.sin(t * .63) * 16 + Math.sin(t * 1.71 + 1.3) * 7);
    const damp = grab >= 0 ? .992 : .9875;
    for (let i = 1; i <= N; i++) {
      if (i === grab) continue;
      const p = pts[i];
      const vx = (p.x - p.px) * damp, vy = (p.y - p.py) * damp;
      p.px = p.x; p.py = p.y;
      p.x += vx + wind * dt * dt * (i / N);
      p.y += vy + G * dt * dt;
    }
    if (grab >= 0 && target) {
      const g = pts[grab];
      g.px = g.x; g.py = g.y;
      g.x = target.x; g.y = target.y;
    }
    for (let k = 0; k < ITER; k++) {
      for (let i = 0; i < N; i++) {
        const p1 = pts[i], p2 = pts[i + 1];
        const w1 = (i === grab) ? 0 : p1.w, w2 = (i + 1 === grab) ? 0 : p2.w;
        const sw = w1 + w2; if (!sw) continue;
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const d = Math.hypot(dx, dy) || 1e-6;
        const diff = (d - seg) / d / sw;
        p1.x += dx * diff * w1; p1.y += dy * diff * w1;
        p2.x -= dx * diff * w2; p2.y -= dy * diff * w2;
      }
    }
    for (let i = 1; i <= N; i++) {
      const p = pts[i];
      if (p.x < 14) { p.x = 14; } else if (p.x > W - 14) { p.x = W - 14; }
      if (p.y > H - 46) { p.y = H - 46; }
    }
  }

  function updateDrag() {
    if (grab < 0 || !ptr) return;
    let tx = ptr.x - grabOff.x, ty = ptr.y - grabOff.y;
    const bx = ax, by = -HIDDEN;
    const reach = grab * seg;
    let dx = tx - bx, dy = ty - by, d = Math.hypot(dx, dy) || 1e-6;
    let need = d - reach;
    if (need > EXT_MAX) {
      const over = need - EXT_MAX;
      const allowed = reach + EXT_MAX + over * .14 / (1 + over / 160);
      tx = bx + dx / d * allowed; ty = by + dy / d * allowed;
      need = EXT_MAX;
    }
    const targetExt = Math.max(0, need);
    const prevExt = ext;
    ext += (targetExt - ext) * .55;
    extV = (ext - prevExt) * 60;
    target = { x: Math.max(14, Math.min(W - 14, tx)), y: Math.min(H - 46, ty) };
  }

  const local = e => { const r = wrap.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  function startDrag(e_, i_) { wake(); return startDrag_(e_, i_); }
  function startDrag_(e, idx) {
    grab = idx;
    const p = local(e), g = pts[idx];
    grabOff = { x: p.x - g.x, y: p.y - g.y };
    ptr = ptrPrev = p; target = { x: g.x, y: g.y };
    downAt = performance.now(); downPos = p; moved = 0;
    wrap.classList.add('dragging');
    addEventListener('pointermove', onMove, { passive: false });
    addEventListener('pointerup', endDrag);
    addEventListener('pointercancel', endDrag);
  }
  function onMove(e) {
    if (grab < 0) return;
    e.preventDefault();
    ptrPrev = ptr; ptr = local(e);
    moved = Math.max(moved, Math.hypot(ptr.x - downPos.x, ptr.y - downPos.y));
  }
  function endDrag() {
    if (grab < 0) return;
    const g = pts[grab];
    if (ptr && ptrPrev) {
      const vx = (ptr.x - ptrPrev.x), vy = (ptr.y - ptrPrev.y);
      g.px = g.x - vx * .5; g.py = g.y - vy * .5;
    }
    const tap = moved < 6 && performance.now() - downAt < 300;
    grab = -1; target = null; ptr = ptrPrev = null;
    wrap.classList.remove('dragging');
    removeEventListener('pointermove', onMove);
    removeEventListener('pointerup', endDrag);
    removeEventListener('pointercancel', endDrag);
    if (tap) tug();
  }
  function tug() { wake(); extV = EXT_MAX * 44; pts[N].px = pts[N].x + 1.5; }

  hit.addEventListener('pointerdown', e => {
    if (!dropped) return;
    e.preventDefault();
    try { hit.setPointerCapture(e.pointerId); } catch (_) { }
    startDrag(e, N);
  });
  hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tug(); } });
  hit.addEventListener('click', e => e.preventDefault());

  document.addEventListener('pointerdown', e => {
    if (!dropped || e.pointerType !== 'mouse' || e.button !== 0 || grab >= 0 || e.target === hit) return;
    const p = local(e);
    if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) return;
    let best = -1, bd = 11;
    for (let i = 2; i <= N; i++) {
      if (pts[i].y < 0) continue;
      const d = Math.hypot(pts[i].x - p.x, pts[i].y - p.y);
      if (d < bd) { bd = d; best = i; }
    }
    if (best > 0) { e.preventDefault(); startDrag(e, best); }
  });

  addEventListener('pointermove', e => {
    if (grab >= 0 || e.pointerType !== 'mouse') return;
    const p = local(e);
    if (p.x < -20 || p.y < -20 || p.x > W + 20 || p.y > H + 20) { brush.last = null; return; }
    if (brush.last) {
      wake();
      const vx = p.x - brush.last.x, vy = p.y - brush.last.y;
      for (let i = 2; i <= N; i++) {
        const q = pts[i], d = Math.hypot(q.x - p.x, q.y - p.y);
        if (d < 16) { const f = (1 - d / 16) * .35; q.x += vx * f; q.y += vy * f * .5; }
      }
    }
    brush.last = p;
  }, { passive: true });
  const brush = { last: null };

  function pathThrough(c, ps) {
    c.beginPath();
    c.moveTo(ps[0].x, ps[0].y);
    for (let i = 1; i < ps.length - 1; i++) {
      const mx = (ps[i].x + ps[i + 1].x) / 2, my = (ps[i].y + ps[i + 1].y) / 2;
      c.quadraticCurveTo(ps[i].x, ps[i].y, mx, my);
    }
    const l = ps[ps.length - 1]; c.lineTo(l.x, l.y);
  }
  function samples(ps, spacing) {
    const out = [];
    let carry = 0;
    for (let i = 0; i < ps.length - 1; i++) {
      const a = ps[i], b = ps[i + 1];
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1e-6;
      let s = carry;
      while (s < len) { out.push({ x: a.x + dx * s / len, y: a.y + dy * s / len, tx: dx / len, ty: dy / len }); s += spacing; }
      carry = s - len;
    }
    return out;
  }
  function knobPath(c) {
    c.beginPath();
    c.moveTo(-3.1, 6.2);
    c.bezierCurveTo(-3.6, 10.5, -9.6, 13.5, -9.6, 22.5);
    c.bezierCurveTo(-9.6, 30.5, -5.4, 35, 0, 35);
    c.bezierCurveTo(5.4, 35, 9.6, 30.5, 9.6, 22.5);
    c.bezierCurveTo(9.6, 13.5, 3.6, 10.5, 3.1, 6.2);
    c.closePath();
  }
  function drawKnob(c, x, y, ang, shadowOnly) {
    c.save();
    c.translate(x, y); c.rotate(ang - Math.PI / 2); c.scale(knobS, knobS);
    if (shadowOnly) {
      knobPath(c); c.fill();
      c.fillRect(-3.4, -.5, 6.8, 7.5);
      c.restore(); return;
    }
    const fg = c.createLinearGradient(-3.6, 0, 3.6, 0);
    fg.addColorStop(0, '#5b4a2c'); fg.addColorStop(.3, '#e8d59e'); fg.addColorStop(.55, '#b0924f'); fg.addColorStop(1, '#4a3a1f');
    c.fillStyle = fg;
    c.beginPath(); c.roundRect ? c.roundRect(-3.5, -.6, 7, 7.6, 1.2) : c.rect(-3.5, -.6, 7, 7.6); c.fill();
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(-3.5, 2.6, 7, .7); c.fillRect(-3.5, 4.4, 7, .6);
    knobPath(c);
    const bg = c.createLinearGradient(-9.6, 0, 9.6, 0);
    bg.addColorStop(0, '#24150c'); bg.addColorStop(.22, '#6b3f22'); bg.addColorStop(.4, '#a8693d');
    bg.addColorStop(.58, '#7c4828'); bg.addColorStop(.85, '#3b2213'); bg.addColorStop(1, '#1d110a');
    c.fillStyle = bg; c.fill();
    c.save(); knobPath(c); c.clip();
    c.strokeStyle = 'rgba(30,14,6,.28)'; c.lineWidth = .55;
    for (let k = -3; k <= 3; k++) {
      c.beginPath(); c.moveTo(k * 2.4 - .6, 8); c.bezierCurveTo(k * 2.9 + 1, 16, k * 2.2 - 1, 26, k * 1.6, 35); c.stroke();
    }
    const hl = c.createRadialGradient(-3.6, 17, .5, -3.6, 17, 9);
    hl.addColorStop(0, 'rgba(255,226,190,.42)'); hl.addColorStop(1, 'rgba(255,226,190,0)');
    c.fillStyle = hl; c.fillRect(-10, 6, 20, 30);
    const bo = c.createLinearGradient(0, 24, 0, 35.5);
    bo.addColorStop(0, 'rgba(0,0,0,0)'); bo.addColorStop(1, 'rgba(0,0,0,.35)');
    c.fillStyle = bo; c.fillRect(-10, 6, 20, 30);
    c.restore();
    c.fillStyle = 'rgba(255,240,220,.38)';
    c.beginPath(); c.ellipse(-4.4, 20.5, 1.1, 5.2, -.08, 0, Math.PI * 2); c.fill();
    c.restore();
  }
  function draw() {
    const c = ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    const ps = pts;
    const last = ps[N], prev = ps[N - 1];
    const ang = Math.atan2(last.y - prev.y, last.x - prev.x);

    const sa = parseFloat(getComputedStyle(root).getPropertyValue('--cord-shadow')) || .2;
    c.save();
    c.translate(7, 11);
    if ('filter' in c) c.filter = 'blur(3px)';
    c.strokeStyle = `rgba(0,0,0,${sa * .8})`; c.lineWidth = thick + 1; c.lineCap = 'round';
    pathThrough(c, ps); c.stroke();
    c.fillStyle = `rgba(0,0,0,${sa})`;
    drawKnob(c, last.x, last.y, ang, true);
    c.restore();

    c.lineCap = 'round'; c.lineJoin = 'round';
    pathThrough(c, ps);
    c.strokeStyle = '#6f6455'; c.lineWidth = thick + 1.3; c.stroke();
    c.strokeStyle = '#d6ccba'; c.lineWidth = thick; c.stroke();
    const sm = samples(ps, thick * 1.05);
    c.lineWidth = Math.max(.6, thick * .24);
    c.strokeStyle = 'rgba(96,82,64,.55)';
    c.beginPath();
    for (const q of sm) {
      if (q.y < -2) continue;
      const nx = -q.ty, ny = q.tx, h = thick * .5;
      c.moveTo(q.x - nx * h - q.tx * h * .7, q.y - ny * h - q.ty * h * .7);
      c.lineTo(q.x + nx * h + q.tx * h * .7, q.y + ny * h + q.ty * h * .7);
    }
    c.stroke();
    c.save();
    c.translate(-thick * .2, -thick * .05);
    pathThrough(c, ps);
    c.strokeStyle = 'rgba(255,252,244,.55)'; c.lineWidth = thick * .28; c.stroke();
    c.restore();

    drawKnob(c, last.x, last.y, ang, false);

    const kx = last.x + Math.cos(ang) * 20 * knobS, ky = last.y + Math.sin(ang) * 20 * knobS;
    hit.style.transform = `translate(${kx}px, ${ky}px)`;
  }

  let sleeping = false, still = 0;
  let touchedAt = 0;
  function wake() { still = 0; touchedAt = performance.now(); if (!sleeping) return; sleeping = false; lastT = 0; acc = 0; requestAnimationFrame(loop); }
  window.__cordWake = wake;
  function loop(now) {
    if (!lastT) lastT = now;
    let dt = Math.min((now - lastT) / 1000, 1 / 20); lastT = now;
    updateDrag();
    acc += dt;
    while (acc >= STEP) { step(STEP); acc -= STEP; }
    if (dropped && live && grab < 0 && now - touchedAt > 2500) for (const q of pts) { q.px += (q.x - q.px) * .06; q.py += (q.y - q.py) * .06; }
    draw();
    let motion = Math.abs(extV) + Math.abs(ext);
    for (const q of pts) motion = Math.max(motion, Math.abs(q.x - q.px) + Math.abs(q.y - q.py));
    if (dropped && live && grab < 0 && motion < .06) { if (++still > 30) { for (const q of pts) { q.px = q.x; q.py = q.y; } sleeping = true; return; } } else still = 0;
    requestAnimationFrame(loop);
  }

  layout();
  pts.forEach((p, i) => { p.y = p.py = -HIDDEN - i * seg * .98; p.x = p.px = ax + Math.sin(i * .5) * 1.5; });
  const drop = () => {
    dropped = true;
    for (const p of pts) { p.px = p.x - .45; }
    setTimeout(() => { live = true; }, 900);
  };
  if (document.body.classList.contains('ready')) drop();
  else window.addEventListener('intro:ready', () => setTimeout(drop, 650), { once: true });
  addEventListener('resize', () => { wake(); clearTimeout(layout._t); layout._t = setTimeout(() => { layout(); wake(); }, 100); });
  new MutationObserver(wake).observe(root, { attributes: true, attributeFilter: ['data-mode'] });
  requestAnimationFrame(loop);
})();

// ─── NAVIGATION & FULLSCREEN MENU ───
(() => {
  const hdr = $('.hdr'), navOpen = $('#navOpen') || $('#menuBtn'), navClose = $('#navClose'), navm = $('#navm');
  if (!hdr) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.pageYOffset;
    if (y > 80) hdr.classList.add('scrolled');
    else hdr.classList.remove('scrolled');

    if (y > 300 && y > lastY && !navm?.classList.contains('on')) {
      hdr.classList.add('away');
    } else {
      hdr.classList.remove('away');
    }
    lastY = y;
  }, { passive: true });

  if (navOpen && navm) {
    navOpen.addEventListener('click', () => {
      navm.hidden = false;
      requestAnimationFrame(() => navm.classList.add('open', 'on'));
      stopScroll();
    });
  }

  function closeMenu() {
    if (!navm) return;
    navm.classList.remove('open', 'on');
    setTimeout(() => { navm.hidden = true; startScroll(); }, 350);
  }

  navClose?.addEventListener('click', closeMenu);

  $$('[data-go]').forEach(b => {
    b.addEventListener('click', e => {
      e.preventDefault();
      closeMenu();
      scrollToId(b.dataset.go);
    });
  });
})();

// ─── EXACT 3D FLIP DESK CALENDAR (#cal) FROM THERISHITHAKOR.COM ───
(function flipCalendar() {
  const SKILLS = [
    'iOS Developer',
    'Android Developer',
    'Web Developer',
    'AI & ML Engineer',
    'Systems Architect'
  ];
  const HOLD = 1800, FLIP = 1250;
  const cal = $('#cal'); if (!cal) return;
  const body = $('.cal__body', cal), leaf = $('.cal__leaf', cal);
  const under = $('[data-under]', cal), face = $('.cal__face', cal);
  const measure = $('.cal__measure', cal), rings = $('.cal__rings', cal);
  const n = SKILLS.length;
  let i = 0, timer = 0, flipping = false, started = false;

  const paint = (page, k) => {
    $('.cal__word', page).textContent = SKILLS[k];
    $('.cal__no', page).textContent = `${String(k + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
  };
  paint(face, 0);
  paint(under, 1);

  // Dynamically size the page to the longest skill word
  function fit() {
    cal.style.fontSize = '';
    const fs = parseFloat(getComputedStyle(cal).fontSize) || 16;
    if (measure) {
      measure.innerHTML = SKILLS.map(w => `<span style="display:inline-block;white-space:nowrap">${w}</span>`).join('');
      const widths = Array.from(measure.children).map(c => c.getBoundingClientRect().width);
      const max = Math.max(0, ...widths);
      const wEm = max / fs + 1.45; // generous padding so words never clip or overflow edge
      body.style.setProperty('--cal-w', wEm.toFixed(3) + 'em');
      cal.style.setProperty('--cal-w', wEm.toFixed(3) + 'em');
      const avail = (cal.closest('.h1')?.getBoundingClientRect().width || window.innerWidth) - fs * 0.25;
      const need = wEm * fs;
      if (need > avail && avail > 0) {
        cal.style.fontSize = (fs * avail / need).toFixed(2) + 'px';
      }
      // Spiral rings + punched holes spaced every ~0.62em
      const count = Math.max(5, Math.round((wEm - 0.64) / 0.7) + 1);
      rings.innerHTML = '<i></i>'.repeat(count);
      cal.querySelectorAll('.cal__holes').forEach(h => h.innerHTML = '<i></i>'.repeat(count));
    }
  }
  fit();
  document.fonts?.ready.then(fit);
  window.addEventListener('resize', () => {
    clearTimeout(fit._t);
    fit._t = setTimeout(fit, 120);
  });

  function flip() {
    if (document.hidden) { timer = setTimeout(flip, 600); return; }
    flipping = true;
    const next = (i + 1) % n;
    if (reduced) {
      i = next;
      paint(face, i);
      paint(under, (i + 1) % n);
      flipping = false;
      timer = setTimeout(flip, HOLD + 700);
      return;
    }

    const timing = { duration: FLIP, easing: 'cubic-bezier(.5,.05,.2,1)', fill: 'forwards' };

    // Opacity snap at .285 completely hides front word while perpendicular to prevent double letters!
    face.animate([
      { opacity: 1 },
      { opacity: 1, offset: .22 },
      { opacity: 0, offset: .24 },
      { opacity: 0 }
    ], { duration: FLIP, easing: 'linear', fill: 'forwards' });

    $('.cal__rear', leaf).animate([
      { filter: 'brightness(1)' },
      { filter: 'brightness(1.02)', offset: .29 },
      { filter: 'brightness(.96)', offset: .45 },
      { filter: 'brightness(.9)' }
    ], { duration: FLIP, easing: 'linear', fill: 'forwards' });

    const a = leaf.animate([
      { transform: 'translateZ(.004em) rotateX(0deg)' },
      { transform: 'translateZ(.004em) rotateX(352deg)' }
    ], timing);

    $('.cal__shade', face).animate([
      { opacity: 0 },
      { opacity: .45, offset: .2 },
      { opacity: 0, offset: .275 },
      { opacity: 0 }
    ], { duration: FLIP, easing: 'linear', fill: 'forwards' });

    $('.cal__shade', under).animate([
      { opacity: .7 },
      { opacity: 0 }
    ], { duration: FLIP * .9, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards' });

    a.onfinish = () => {
      i = next;
      paint(face, i);
      leaf.getAnimations({ subtree: true }).forEach(x => x.cancel());
      cal.querySelectorAll('.cal__shade').forEach(sh => sh.getAnimations().forEach(x => x.cancel()));
      paint(under, (i + 1) % n);
      flipping = false;
      timer = setTimeout(flip, HOLD);
    };
  }

  const start = () => {
    if (started) return;
    started = true;
    timer = setTimeout(flip, 1400);
  };

  if (document.body.classList.contains('ready')) start();
  else window.addEventListener('intro:ready', start, { once: true });
})();

// ─── HERO PORTRAIT LIQUID SCRATCH REVEAL ───
function liquidReveal(stage, canvas, afterSrc, { brushRadius = 140, decay = 0.016 } = {}) {
  if (reduced) { canvas?.remove(); return; }
  const base = stage.querySelector('img');
  if (!base || !canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const mk = () => { const c = document.createElement('canvas'); return [c, c.getContext('2d')]; };
  const [bwC, bwX] = mk(), [colC, colX] = mk(), [mask, mX] = mk(), [tmp, tX] = mk();

  let w = 0, h = 0, dirty = false;
  const afterImg = new Image();
  afterImg.src = afterSrc;

  function resize() {
    w = stage.clientWidth; h = stage.clientHeight;
    if (!w || !h) return;
    [canvas, bwC, colC, mask, tmp].forEach(c => {
      c.width = w * dpr;
      c.height = h * dpr;
    });
    ctx.scale(dpr, dpr);

    const drawAspect = (context, img) => {
      if (!img.complete || !img.naturalWidth) return;
      const nw = img.naturalWidth, nh = img.naturalHeight;
      const s = Math.max((w * dpr) / nw, (h * dpr) / nh);
      const dw = nw * s, dh = nh * s;
      context.drawImage(img, (w * dpr - dw) / 2, (h * dpr - dh) / 2, dw, dh);
    };

    if (base.complete) drawAspect(bwX, base);
    if (afterImg.complete) drawAspect(colX, afterImg);
    dirty = true;
    scheduleRender();
  }

  base.onload = resize;
  afterImg.onload = resize;
  window.addEventListener('resize', resize);
  window.addEventListener('intro:ready', resize, { once: true });

  let trail = [];
  let rafId = null;

  function scheduleRender() {
    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  }

  function addPoint(x, y) {
    trail.push({ x: x * dpr, y: y * dpr, r: brushRadius * dpr, a: 1 });
    dirty = true;
    scheduleRender();
  }

  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    addPoint(e.clientX - r.left, e.clientY - r.top);
  });
  stage.addEventListener('pointerdown', e => {
    const r = stage.getBoundingClientRect();
    addPoint(e.clientX - r.left, e.clientY - r.top);
  });
  stage.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) {
      const r = stage.getBoundingClientRect();
      addPoint(e.touches[0].clientX - r.left, e.touches[0].clientY - r.top);
    }
  }, { passive: true });

  function render() {
    rafId = null;
    if (dirty && w && h) {
      mX.clearRect(0, 0, w * dpr, h * dpr);
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.a -= decay;
        if (p.a <= 0) { trail.splice(i, 1); continue; }
        const grad = mX.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(255,255,255,${p.a})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        mX.fillStyle = grad;
        mX.beginPath();
        mX.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        mX.fill();
      }

      tX.clearRect(0, 0, w * dpr, h * dpr);
      tX.drawImage(colC, 0, 0);
      tX.globalCompositeOperation = 'destination-in';
      tX.drawImage(mask, 0, 0);
      tX.globalCompositeOperation = 'source-over';

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(bwC, 0, 0, w, h);
      ctx.drawImage(tmp, 0, 0, w, h);

      if (trail.length === 0) {
        dirty = false;
      } else {
        scheduleRender();
      }
    }
  }
  resize();
}

// ─── HOLOGRAPHIC CARD (#holo) ───
(() => {
  const layer = $('#holo'), openBtn = $('#holoOpen'), closeBtn = $('#holoClose');
  const hc = $('#hc'), ld = $('#holoLd'), lite = $('#holoLite'), pct = $('#holoPct');
  if (!layer || !openBtn || !hc) return;

  let isOpen = false, tx = 0, ty = 0, cx = 0, cy = 0, held = false, loop = 0, t0 = 0;
  const RX = 12, RY = 15;

  function step(now) {
    const sway = held ? 0 : 1;
    const t = (now - t0) / 1000;
    cx += ((tx + sway * Math.sin(t * 0.62) * 0.34) - cx) * 0.12;
    cy += ((ty + sway * Math.sin(t * 0.47 + 1.1) * 0.22) - cy) * 0.12;

    hc.style.setProperty('--px', cx.toFixed(4));
    hc.style.setProperty('--py', cy.toFixed(4));
    hc.style.setProperty('--ry', (cx * RY).toFixed(2) + 'deg');
    hc.style.setProperty('--rx', (-cy * RX).toFixed(2) + 'deg');
    hc.style.setProperty('--lift', Math.min(1, Math.hypot(cx, cy) * 1.3).toFixed(3));
    loop = requestAnimationFrame(step);
  }

  function openCard() {
    if (isOpen) return;
    isOpen = true;
    layer.hidden = false;
    requestAnimationFrame(() => layer.classList.add('on'));
    stopScroll();

    let p = 0;
    const iv = setInterval(() => {
      p += 12;
      if (pct) pct.textContent = `${Math.min(100, p)}%`;
      if (p >= 100) {
        clearInterval(iv);
        ld?.classList.add('out');
        lite.hidden = false;
        requestAnimationFrame(() => lite.classList.add('in'));
        t0 = performance.now();
        loop = requestAnimationFrame(step);
      }
    }, 35);
  }

  function closeCard() {
    if (!isOpen) return;
    isOpen = false;
    cancelAnimationFrame(loop);
    layer.classList.remove('on');
    lite.classList.remove('in');
    setTimeout(() => {
      layer.hidden = true;
      lite.hidden = true;
      ld?.classList.remove('out');
      if (pct) pct.textContent = '0%';
      startScroll();
    }, 350);
  }

  openBtn.addEventListener('click', openCard);
  closeBtn?.addEventListener('click', closeCard);
  layer.addEventListener('click', e => { if (e.target === layer) closeCard(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeCard(); });

  hc.addEventListener('pointermove', e => {
    const r = hc.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    held = true;
  });
  hc.addEventListener('pointerleave', () => { tx = 0; ty = 0; held = false; });
  hc.addEventListener('click', () => { hc.classList.toggle('flip'); });
})();

// ─── HERO ROTATING CONTROL CARD (#hcard) ───
(() => {
  const hcard = $('#hcard'); if (!hcard) return;
  const slides = $$('.slide', hcard);
  const dots = $$('.dots i', hcard);
  const iconImg = $('#hcardIcon');
  const prevBtn = $('#hcardPrev');
  const nextBtn = $('#hcardNext');
  const N = slides.length;
  if (!N) return;

  const ICONS = [
    'assets/apps/zenlife-icon.webp',
    'assets/apps/viana360-icon.webp',
    'assets/apps/vianabuy-icon.webp',
    'assets/apps/velloreads-icon.webp',
    'assets/apps/codeshift-icon.svg',
    'assets/apps/cleanmac-icon.webp'
  ];

  let cur = 0;
  let timer = null;
  let isHovered = false;

  function show(i) {
    cur = (i + N) % N;
    slides.forEach((s, idx) => {
      const on = idx === cur;

      s.classList.toggle('active', on);
      s.style.opacity = on ? '1' : '0';
      s.style.transform = on ? 'none' : 'translateY(6px)';
      s.style.pointerEvents = on ? 'auto' : 'none';
    });
    dots.forEach((d, idx) => d.classList.toggle('on', idx === cur));
    if (iconImg && ICONS[cur]) {
      iconImg.style.opacity = '0.35';
      iconImg.style.transform = 'scale(0.92)';
      setTimeout(() => {
        iconImg.src = ICONS[cur];
        iconImg.style.opacity = '1';
        iconImg.style.transform = 'none';
      }, 150);
    }
  }

  function next() { show(cur + 1); }
  function prev() { show(cur - 1); }

  prevBtn?.addEventListener('click', e => { e.stopPropagation(); prev(); resetTimer(); });
  nextBtn?.addEventListener('click', e => { e.stopPropagation(); next(); resetTimer(); });
  dots.forEach((d, idx) => {
    d.style.cursor = 'pointer';
    d.addEventListener('click', e => { e.stopPropagation(); show(idx); resetTimer(); });
  });

  // Clicking the hcard opens the corresponding door
  hcard.addEventListener('click', () => {
    const activeSlide = slides[cur];
    const doorIdx = activeSlide ? parseInt(activeSlide.dataset.door || '0', 10) : 0;
    const works = document.getElementById('works');
    if (works) {
      window.__snapTo ? window.__snapTo(works.offsetTop) : works.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const doorBtn = document.querySelector(`.doorway[data-door="${doorIdx}"]`);
        doorBtn?.click();
      }, 700);
    }
  });

  function startTimer() {
    stopTimer();
    timer = setInterval(() => {
      if (!isHovered && !document.hidden) next();
    }, 3800);
  }
  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function resetTimer() {
    startTimer();
  }

  hcard.addEventListener('mouseenter', () => { isHovered = true; });
  hcard.addEventListener('mouseleave', () => { isHovered = false; });

  show(0);
  startTimer();
})();

// ══════════════════════════════════════════════════════════════
// ─── 3D DOORS SYSTEM & WALK-THROUGH EXQUISITE ROOM ───
// ══════════════════════════════════════════════════════════════

const ROOMS_DATA = [
  {
    id: 'ios',
    doorName: 'Door 01 · iOS Development',
    title: 'iOS Native Ecosystem',
    desc: 'High-performance native iOS applications built with Swift, SwiftUI, Combine, and CoreData. Designed with Apple Human Interface Guidelines and fluid micro-interactions.',
    count: '04 Featured Projects',
    accent: '#6B5C5C',
    projects: [
      {
        icon: '🧘',
        iconImg: 'assets/apps/zenlife-icon.webp',
        isStoreApp: true,
        screenshots: [
          'assets/apps/zenlife-screen-1.jpg',
          'assets/apps/zenlife-screen-2.jpg',
          'assets/apps/zenlife-screen-3.jpg',
          'assets/apps/zenlife-screen-4.jpg'
        ],
        iconBg: '#2D1B2D',
        num: '01 / 04',
        category: 'iOS App · Health & Sound',
        title: 'ZENLIFE',
        sub: 'Sound-Based Stress Relief App · Apple App Store',
        desc: 'Delivers calming, mood-tailored acoustic soundscapes and frequency sessions (432 Hz Solfeggio). Features real-time mood logging, psychometric analytics, on-device CoreData persistence, and fluid SwiftUI micro-interactions.',
        tags: ['SwiftUI', 'AVAudioEngine', 'CoreData', 'Biometrics', 'Combine', 'App Store'],
        liveLink: 'https://apps.apple.com/in/app/zenlife-stress-sound-relief/id6753105286',
        liveText: 'View on App Store ↗',
        gitLink: 'https://github.com/kaushalboii/Zenlife-Stress-relief-app-using-sound-and-music',
        gitText: 'Free on GitHub ↗',
        note: 'Live on Apple App Store & Open Source',
        screenBg: 'radial-gradient(circle at 50% 20%, #2f2233 0%, #150f18 80%)',
        mockupContent: `
          <div class="mockup-zen">
            <div class="zen-freq">
              <span class="zen-freq__num">432</span>
              <span class="zen-freq__unit">Hz Solfeggio</span>
            </div>
            <div class="zen-wave">
              <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
            </div>
            <div class="zen-card">
              <span class="zen-card__label">Soundscape</span>
              <p class="zen-card__title">Deep Forest Rain & Singing Bowls</p>
              <div class="zen-bar"><div class="zen-bar__fill" style="width:68%"></div></div>
            </div>
            <div class="zen-mood">
              <span>Mood: Calm & Focused</span>
              <button class="zen-play-btn" aria-label="Play audio">▶</button>
            </div>
          </div>
        `
      },
      {
        icon: '📡',
        iconImg: 'assets/apps/viana360-icon.webp',
        isStoreApp: true,
        screenshots: [
          'assets/apps/viana360-screen-1.jpg',
          'assets/apps/viana360-screen-2.jpg',
          'assets/apps/viana360-screen-3.jpg'
        ],
        iconBg: '#1B263B',
        num: '02 / 04',
        category: 'iOS App · Industrial IoT',
        title: 'Viana 360',
        sub: 'Real-Time Telemetry & Systems · Apple App Store',
        desc: 'Enterprise telemetry monitoring application providing comprehensive 360-degree data visualization, real-time alert notifications, and multi-sensor dashboard analytics for industrial machinery.',
        tags: ['Swift', 'Combine', 'Real-time Telemetry', 'Custom Charts', 'WebSockets'],
        liveLink: 'https://apps.apple.com/in/app/viana-360/id6760163659',
        liveText: 'View on App Store ↗',
        note: 'Live on Apple App Store',
        screenBg: 'radial-gradient(circle at 50% 20%, #1c2b42 0%, #0d1522 80%)',
        mockupContent: `
          <div class="mockup-tel">
            <div class="tel-header">
              <span class="tel-badge live-pulse"><i></i>Live Telemetry</span>
              <span class="tel-ping">18 ms</span>
            </div>
            <div class="tel-gauge">
              <div class="tel-dial">
                <span class="tel-val">98.4<small>%</small></span>
                <span class="tel-lbl">System Efficiency</span>
              </div>
            </div>
            <div class="tel-metrics">
              <div class="tel-mcard"><span>Temperature</span><b>42.1°C</b></div>
              <div class="tel-mcard"><span>Throughput</span><b>1.4 GB/s</b></div>
            </div>
            <div class="tel-chart">
              <div class="sparkline"></div>
            </div>
          </div>
        `
      },
      {
        icon: '🛍️',
        iconImg: 'assets/apps/vianabuy-icon.webp',
        isStoreApp: true,
        screenshots: [
          'assets/apps/vianabuy-screen-1.jpg',
          'assets/apps/vianabuy-screen-2.jpg',
          'assets/apps/vianabuy-screen-3.jpg'
        ],
        iconBg: '#2D281B',
        num: '03 / 04',
        category: 'iOS App · Lifestyle Commerce',
        title: 'Viana Buy',
        sub: 'Everyday Essentials & Commerce · Apple App Store',
        desc: 'High-performance iOS lifestyle platform designed to streamline everyday grocery and product purchases. Combines daily essentials, product shopping, and local services into an intuitive, rapid checkout experience.',
        tags: ['SwiftUI', 'REST APIs', 'E-Commerce', 'Cart Engine', 'Vellore Logistics'],
        liveLink: 'https://apps.apple.com/in/app/viana-buy/id6772468488',
        liveText: 'View on App Store ↗',
        note: 'Live on Apple App Store',
        screenBg: 'radial-gradient(circle at 50% 20%, #30281d 0%, #17120b 80%)',
        mockupContent: `
          <div class="mockup-shop">
            <div class="shop-search">
              <span>🔍 Search groceries & essentials...</span>
            </div>
            <div class="shop-chips">
              <span class="chip-on">Organic</span>
              <span>Dairy</span>
              <span>Produce</span>
            </div>
            <div class="shop-card">
              <div class="shop-card__thumb">🥑</div>
              <div class="shop-card__meta">
                <b>Fresh Farm Avocados</b>
                <span>Pack of 4 · Express 20m</span>
                <div class="shop-price"><b>₹180</b><span class="shop-btn">+ Add</span></div>
              </div>
            </div>
            <div class="shop-checkout">
              <span>2 Items in Cart</span>
              <button class="shop-pay-pill">Checkout ₹340 →</button>
            </div>
          </div>
        `
      },
      {
        icon: '⌨️',
        iconImg: 'assets/apps/cleanmac-icon.webp',
        isStoreApp: true,
        storeType: 'macos',
        screenshots: [
          'assets/apps/cleanmac-keyboard-app.jpg'
        ],
        iconBg: '#1E252B',
        num: '04 / 04',
        category: 'macOS App · Utilities',
        title: 'CleanYourMac Keyboard',
        sub: 'macOS Keyboard Lock Utility · Free & Open Source',
        desc: 'Native macOS Swift menu bar utility that safely locks all keyboard and touch bar input with a single click, allowing users to wipe down and sanitize their keyboard without triggering unwanted keypresses or terminal inputs.',
        tags: ['macOS', 'Swift', 'AppKit', 'Input Monitoring', 'Free & Open Source'],
        liveLink: 'https://kaushalboii.github.io/CleanYourMacKeyboard/',
        liveText: 'Official Website ↗',
        gitLink: 'https://github.com/kaushalboii/CleanYourMacKeyboard',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source · Universal Binary (Intel & Apple Silicon)',
        screenBg: 'radial-gradient(circle at 50% 20%, #202b33 0%, #0e1418 80%)'
      }
    ]
  },
  {
    id: 'android',
    doorName: 'Door 02 · Android Development',
    title: 'Android Native Applications',
    desc: 'Robust Android apps engineered using modern Kotlin conventions, Jetpack Compose, Coroutines, ROOM SQLite, and Material 3 design systems.',
    count: '04 Featured Projects',
    accent: '#4A3540',
    projects: [
      {
        icon: '📢',
        iconImg: 'assets/apps/velloreads-icon.webp',
        isStoreApp: true,
        storeType: 'play',
        screenshots: [
          'assets/apps/velloreads-screen-1.jpg',
          'assets/apps/velloreads-screen-2.jpg',
          'assets/apps/velloreads-screen-3.jpg',
          'assets/apps/velloreads-screen-4.jpg',
          'assets/apps/velloreads-screen-5.jpg'
        ],
        iconBg: '#341E2B',
        num: '01 / 04',
        category: 'Android App · Classifieds & Ads',
        title: 'Vellore Ads Platform',
        sub: 'Commercial Listing Platform · Google Play Store',
        desc: 'Commercial listing and advertising directory. Features instant location filters, high-density listing catalogues, verified merchant profiles, and region-specific classified ad management.',
        tags: ['Kotlin', 'Jetpack Compose', 'Coroutines', 'Material 3', 'Google Play'],
        liveLink: 'https://play.google.com/store/apps/details?id=com.velloreads.app&hl=en',
        liveText: 'View on Google Play ↗',
        note: 'Live on Google Play Store',
        screenBg: 'radial-gradient(circle at 50% 20%, #361f2c 0%, #190e14 80%)'
      },
      {
        icon: '📜',
        iconImg: 'assets/apps/constitution-icon.webp',
        isStoreApp: true,
        storeType: 'play',
        screenshots: [
          'assets/apps/constitution-screen-1.jpg',
          'assets/apps/constitution-screen-2.jpg',
          'assets/apps/constitution-screen-3.jpg',
          'assets/apps/constitution-screen-4.jpg',
          'assets/apps/constitution-screen-5.jpg'
        ],
        iconBg: '#212B23',
        num: '02 / 04',
        category: 'Android App · Constitutional Law',
        title: 'Constitution of India (REF)',
        sub: 'Complete Bare Act, Schedules & Amendments · Google Play Store',
        desc: 'Engineered for advocates, legal scholars, and competitive exam aspirants. Comprehensive offline reference featuring all 395 Articles, Schedules, 106+ Amendments, bilingual reading modes, and lightning-fast FTS5 search.',
        tags: ['Kotlin', 'SQLite FTS5', 'Offline First', 'Material You', 'Google Play'],
        liveLink: 'https://play.google.com/store/apps/details?id=com.kaushal.constitutionindia&hl=en',
        liveText: 'View on Google Play ↗',
        note: 'Live on Google Play Store · Kaushal Maran',
        screenBg: 'radial-gradient(circle at 50% 20%, #202e24 0%, #0d1610 80%)'
      },
      {
        icon: '⚖️',
        iconImg: 'assets/apps/bns-icon.webp',
        isStoreApp: true,
        storeType: 'play',
        screenshots: [
          'assets/apps/bns-screen-1.jpg',
          'assets/apps/bns-screen-2.jpg',
          'assets/apps/bns-screen-3.jpg',
          'assets/apps/bns-screen-4.jpg',
          'assets/apps/bns-screen-5.jpg',
          'assets/apps/bnss-screen-1.jpg',
          'assets/apps/bnss-screen-2.jpg',
          'assets/apps/bsa-screen-1.jpg'
        ],
        iconBg: '#2D231E',
        num: '03 / 04',
        category: 'Android App · Criminal Law Reform',
        title: 'BNS & BNSS 2023 Pocket Reference',
        sub: 'Bharatiya Nyaya Sanhita & Bharatiya Nagarik Suraksha · Google Play',
        desc: 'Instant statutory pocket guide for India’s landmark 2023 criminal codes: Bharatiya Nyaya Sanhita (BNS), BNSS, and Bharatiya Sakshya Adhiniyam (BSA). Features full cross-reference mapping from old IPC & CrPC sections.',
        tags: ['Kotlin', 'Coroutines', 'IPC Conversion Matrix', 'Material 3', 'Google Play'],
        liveLink: 'https://play.google.com/store/apps/details?id=com.bns.pocketreference&hl=en',
        liveText: 'Get BNS on Google Play ↗',
        suiteLinks: [
          { title: 'BNS Act 2023', url: 'https://play.google.com/store/apps/details?id=com.bns.pocketreference&hl=en' },
          { title: 'BNSS 2023 Reference', url: 'https://play.google.com/store/apps/details?id=com.bnss.pocketreference&hl=en' },
          { title: 'BSA Evidence Act', url: 'https://play.google.com/store/apps/details?id=com.bsa.pocketreference&hl=en' }
        ],
        note: 'Live on Google Play Store · 3 Acts Suite',
        screenBg: 'radial-gradient(circle at 50% 20%, #2e231e 0%, #140d0a 80%)'
      },
      {
        icon: '⚖️',
        iconImg: 'assets/apps/cpc-icon.webp',
        isStoreApp: true,
        storeType: 'play',
        screenshots: [
          'assets/apps/cpc-screen-1.jpg',
          'assets/apps/cpc-screen-2.jpg',
          'assets/apps/cpc-screen-3.jpg',
          'assets/apps/cpc-screen-4.jpg',
          'assets/apps/cpc-screen-5.jpg'
        ],
        iconBg: '#1F2936',
        num: '04 / 04',
        category: 'Android App · Civil Procedure Law',
        title: 'CPC Act - Pocket Reference App',
        sub: 'Code of Civil Procedure 1908 · Google Play Store',
        desc: 'Comprehensive, offline-first statutory reference for the Code of Civil Procedure 1908. Features instant Order & Rule lookup, bilingual section navigation, high-speed full-text search, and case-law bookmarking for advocates and civil judges.',
        tags: ['Kotlin', 'Jetpack Compose', 'Offline First', 'FTS5 Search', 'Google Play'],
        liveLink: 'https://play.google.com/store/apps/details?id=com.cpc.pocketreference&hl=en',
        liveText: 'View CPC on Google Play ↗',
        suiteLinks: [
          { title: 'POSH Act Reference', url: 'https://play.google.com/store/apps/details?id=com.posh.pocketreference&hl=en' },
          { title: 'Police Act Reference', url: 'https://play.google.com/store/apps/details?id=com.policeact.pocketreference.app&hl=en' },
          { title: 'BCTNPY Election 2026', url: 'https://play.google.com/store/apps/details?id=com.bctnpy.election2026&hl=en' }
        ],
        note: 'Live on Google Play Store · 100% Offline Reference',
        screenBg: 'radial-gradient(circle at 50% 20%, #1e2837 0%, #0c121b 80%)'
      }
    ]
  },
  {
    id: 'web',
    doorName: 'Door 03 · Web Development & Real-Time Apps',
    title: 'Modern Web Applications & Real-Time Systems',
    desc: 'High-performance real-time web applications, collaborative developer platforms, and reactive frontend architectures built with Microsoft Monaco Editor, WebSockets / Firebase Realtime DB, client-side AES encryption, and responsive interactive SVG maps.',
    count: '02 Featured Web Platforms',
    accent: '#7A8670',
    projects: [
      {
        iconImg: 'assets/apps/codeshift-icon.svg',
        iconBg: '#000000',
        num: '01 / 02',
        isStoreApp: true,
        storeType: 'web',
        category: 'Real-Time Collaborative Code Editor',
        title: 'CodeShift — Real-Time Collaborative Code Editor',
        sub: 'Instant Encrypted Code Sharing, VS Code Monaco Engine & Peer Cursors',
        desc: 'High-performance open-source real-time code editor powered by Monaco engine. Features zero-login instant room sharing, client-side AES-GCM encryption with LZW compression, live peer cursor presence, and dual sync via Firebase & BroadcastChannel.',
        tags: ['Real-Time Web', 'Monaco Editor', 'AES-GCM Encryption', 'Firebase Realtime DB', 'JavaScript ES6+', 'Open Source'],
        urlBar: 'kaushalboii.github.io/codeshift',
        previewImg: 'assets/apps/codeshift-preview.svg',
        liveLink: 'https://kaushalboii.github.io/codeshift/',
        liveText: 'Launch CodeShift Live ↗',
        gitLink: 'https://github.com/kaushalboii/codeshift',
        gitText: 'Source Code ↗',
        note: 'Live Production Web Platform · End-to-End Encrypted Collaboration',
        screenBg: '#000000'
      },
      {
        icon: '🛰️',
        iconBg: '#0F172A',
        num: '02 / 02',
        isStoreApp: true,
        storeType: 'web',
        category: 'Geotagged News Radar',
        title: 'India News Radar — Real-Time Geotagged Intelligence',
        sub: 'Live Interactive Geotagged News Map, Breaking Bulletins & Multi-Source Intelligence',
        desc: 'Interactive real-time news radar delivering geotagged intelligence across India. Features an interactive SVG map with pulsating incident coordinates, multi-source live event correlation, category filtering, and real-time breaking bulletins.',
        tags: ['Web Development', 'Geotagged Maps', 'Live News API', 'Real-Time Intelligence', 'JavaScript ES6+'],
        urlBar: 'kaushalboii.github.io/Live-news-updated-India',
        previewImg: 'assets/apps/radar-preview.jpg',
        liveLink: 'https://kaushalboii.github.io/Live-news-updated-India/',
        liveText: 'Launch Live Web Radar ↗',
        gitLink: 'https://github.com/kaushalboii/Live-news-updated-India',
        gitText: 'Source Code ↗',
        note: 'Live Production Web Platform · Embedded Interactive Radar',
        screenBg: '#0B0F19'
      }
    ]
  },
  {
    id: 'ai',
    doorName: 'Door 04 · AI & Neural Nets',
    title: 'Deep Learning & Neural Synthesis',
    desc: 'Deep generative adversarial networks, real-time psychoacoustic DSP models, spatial computer vision pipelines, and predictive machine learning architectures.',
    count: '03 Featured Architectures',
    accent: '#A4552C',
    projects: [
      {
        icon: '🎨',
        iconBg: '#2E1E1E',
        num: '01 / 03',
        category: 'Deep Generative Models · PyTorch DCGAN',
        title: 'Automatic Comic Generator with DCGAN',
        sub: 'Deep Convolutional Adversarial Narrative Synthesis',
        desc: 'Engineered a deep convolutional generative adversarial network (DCGAN) in PyTorch to synthesize multi-panel comic artwork from latent noise vectors. Features transposed strided convolutions, batch normalization layers, LeakyReLU activations, and minimax loss convergence.',
        tags: ['PyTorch', 'DCGAN', 'Generative Adversarial Nets', 'Computer Vision', 'Deep Learning'],
        note: 'PyTorch Deep Learning Architecture',
        screenBg: 'radial-gradient(circle at 50% 20%, #341e1e 0%, #150a0a 80%)',
        mockupContent: `
          <div class="mockup-gan">
            <div class="gan-prompt">"Cyberpunk hero walking through rain-slick neon alley"</div>
            <div class="gan-grid">
              <div class="gan-panel"><div class="gan-thumb g1"></div><span>Panel 01</span></div>
              <div class="gan-panel"><div class="gan-thumb g2"></div><span>Panel 02</span></div>
            </div>
            <div class="gan-metrics">
              <span>Epoch 180 / 200</span>
              <span style="color:#4ade80">Loss 0.218</span>
            </div>
          </div>
        `
      },
      {
        icon: '🧠',
        iconBg: '#261F2E',
        num: '02 / 03',
        category: 'Psychoacoustics · Audio Neural DSP',
        title: 'ZenLife Acoustic AI & Binaural Frequency Engine',
        sub: '432 Hz Solfeggio Mathematical Synthesis & Wavelet Filters',
        desc: 'Algorithmic psychoacoustic audio synthesis pipeline in Python modeling acoustic harmonic resonance at 432 Hz Solfeggio frequencies. Implements Fast Fourier Transforms (FFT), Butterworth bandpass filtering, and dynamic wavelet synthesis for stress reduction.',
        tags: ['Python', 'DSP', 'Psychoacoustics', 'NumPy / SciPy', 'Binaural Synthesis', 'FFT'],
        liveLink: 'https://apps.apple.com/in/app/zenlife-stress-sound-relief/id6753105286',
        liveText: 'Explore Sound Engine ↗',
        note: 'Python DSP & Psychoacoustic Synthesis',
        screenBg: 'radial-gradient(circle at 50% 20%, #291d34 0%, #110a18 80%)',
        mockupContent: `
          <div class="mockup-dsp">
            <div class="dsp-header">
              <b>Harmonic Resonator</b>
              <span class="dsp-pill">432 Hz Solfeggio</span>
            </div>
            <div class="dsp-spectrogram">
              <div class="spec-bar s1"></div>
              <div class="spec-bar s2"></div>
              <div class="spec-bar s3"></div>
              <div class="spec-bar s4"></div>
              <div class="spec-bar s5"></div>
            </div>
            <div class="dsp-controls">
              <span>Binaural Waveform Synthesis</span>
              <div class="dsp-slider"><div class="dsp-fill" style="width:78%"></div></div>
            </div>
          </div>
        `
      },
      {
        icon: '👁️',
        iconBg: '#1D2730',
        num: '03 / 03',
        category: 'Spatial Intelligence · OpenCV Labs',
        title: 'Computer Vision & Spatial Intelligence Labs',
        sub: '40+ OpenCV Experimental Vision Laboratories',
        desc: 'Experimental laboratory suite covering 40+ computer vision pipelines in Python and OpenCV. Features Canny & Sobel spatial edge detection, morphological kernel dilation, contour polygon approximation, and Haar cascade spatial tracking.',
        tags: ['Python', 'OpenCV', 'Spatial Filtering', 'Edge Detection', 'Feature Extraction'],
        gitLink: 'https://github.com/kaushalboii/COMPUTER-VISION',
        gitText: 'Free on GitHub ↗',
        note: 'Open Source Vision Labs · kaushalboii/COMPUTER-VISION',
        screenBg: 'radial-gradient(circle at 50% 20%, #1d2730 0%, #0a1118 80%)',
        mockupContent: `
          <div class="mockup-cv">
            <div class="cv-header">
              <b>OpenCV Spatial Pipeline</b>
              <span class="cv-tag">40+ Labs</span>
            </div>
            <div class="cv-grid">
              <div class="cv-box"><span>Canny Edge</span><div class="cv-edge"></div></div>
              <div class="cv-box"><span>Sobel Filter</span><div class="cv-sobel"></div></div>
              <div class="cv-box"><span>Morphology</span><div class="cv-morph"></div></div>
            </div>
          </div>
        `
      }
    ]
  }];

// Doors Controller
(() => {
  const sec = $('#works'); if (!sec) return;
  const units = [...sec.querySelectorAll('.unit')];
  const MOB = matchMedia('(max-width: 639.98px)');
  const mRow = $('.doors__row', sec);
  const mDots = $('.doors__dots', sec);
  const dinfo = $('#dinfo'), wallEl = $('.doors__wall', sec);
  const badge = $('#doorCursor');
  const roomv = $('#roomv'), roomvGlow = $('#roomvGlow');
  const roomvDoor = $('#roomvDoor'), roomvTitle = $('#roomvTitle'), roomvDesc = $('#roomvDesc'), roomvCount = $('#roomvCount');
  const roomvStack = $('#roomvStack'), roomvBack = $('#roomvBack'), roomvBackBottom = $('#roomvBackBottom');

  // Door hover spring state
  function spring({ tension = 120, friction = 14 }, onUpdate) {
    let pos = 0, vel = 0, target = 0, raf = 0;
    function loop() {
      const f = -tension * (pos - target);
      const d = -friction * vel;
      vel += (f + d) * 0.016;
      pos += vel * 0.016;
      onUpdate(pos);
      if (Math.abs(pos - target) > 0.001 || Math.abs(vel) > 0.001) {
        raf = requestAnimationFrame(loop);
      } else {
        pos = target;
        onUpdate(pos);
        raf = 0;
      }
    }
    return {
      set(val) {
        target = val;
        if (!raf) raf = requestAnimationFrame(loop);
      }
    };
  }

  const doorsState = units.map(u => {
    const way = $('.doorway', u), door = $('.door', u);
    const s = spring({ tension: 130, friction: 15 }, v => {
      door.style.transform = `rotateY(${- v * 72}deg)`;
      const spill = $('.spill', u);
      if (spill) spill.style.opacity = String(Math.min(1, v * 1.5));
    });
    return { u, way, door, s };
  });

  const INFO = [
    ['iOS Development', 'Swift, SwiftUI & Apple Ecosystem', [
      'ZenLife — Sound-Based Stress Relief (App Store)',
      'Viana 360 — Real-Time Systems Telemetry (App Store)',
      'Viana Buy — Everyday Essentials & Commerce (App Store)',
      'CleanYourMacKeyboard — Free macOS App (Open Source)',
      'CoreData, Audio Engine & Liquid Micro-interactions'
    ]],
    ['Android Development', 'Kotlin, Jetpack Compose & Clean Architecture', [
      'Vellore Ads — Commercial Listing Platform (Google Play)',
      'Constitution of India — Complete Bare Act (Google Play)',
      'BNS, BNSS & BSA — Criminal Law Suite 2023 (Google Play)',
      'CPC Act 1908, POSH & Police Act Pocket References (Google Play)',
      'Coroutines, FTS5 Offline SQLite & Material 3'
    ]],
    ['Web Development', 'Real-Time Apps, Monaco Code Editor & Live Radar', [
      'CodeShift — Real-Time Collaborative Code Editor (Monaco)',
      'Client-Side AES-GCM Encryption & Live Peer Cursor Presence',
      'India News Radar — Real-Time Geotagged Intelligence Platform',
      'Interactive Geotagged SVG Map with Coordinate Intelligence',
      'Semantic HTML5, Modern Responsive CSS & JavaScript ES6+'
    ]],
    ['AI & Neural Nets', 'Deep Learning, Computer Vision & Audio DSP', [
      'Automatic Comic Generator with DCGAN (PyTorch)',
      'ZenLife Acoustic AI & Binaural Frequency Synthesis',
      'Computer Vision Suite — 40+ OpenCV Processing Labs',
      'Deep Convolutional Feature Maps & Latent Representation',
      'Predictive Algorithms & Scikit-Learn Classifiers'
    ]]
  ];

  const setInfo = i => {
    if (!dinfo || !INFO[i]) return;
    dinfo.querySelector('.dinfo__h').textContent = INFO[i][0];
    dinfo.querySelector('.dinfo__t').textContent = INFO[i][1];
    dinfo.querySelector('.dinfo__p').innerHTML = INFO[i][2].map(s => `<li> ${ s }</li> `).join('');
  };

  // Cursor Badge Tracking
  let badgeOver = false;
  const placeBadge = e => {
    if (!badge) return;
    badge.style.transform = `translate3d(${ e.clientX }px, ${ e.clientY }px, 0) translate(-50%, -50%)`;
  };
  const showBadge = on => {
    badgeOver = on;
    badge?.classList.toggle('on', on);
  };

  if (canHover) {
    window.addEventListener('pointermove', e => { if (badgeOver) placeBadge(e); }, { passive: true });
    units.forEach(u => {
      const w = $('.doorway', u);
      w?.addEventListener('pointerenter', e => { placeBadge(e); if (!busy) showBadge(true); });
      w?.addEventListener('pointerleave', () => showBadge(false));
    });
  }

  // Hover Focus on Desktop Wall
  let busy = false, inRoom = false;

  const showDoorInfo = i => {
    units.forEach((u, k) => u.classList.toggle('on', k === i));
    sec.classList.add('focus');

    const visible = units.filter(u => getComputedStyle(u).visibility !== 'hidden');
    const vi = visible.indexOf(units[i]); if (vi < 0) return;
    const wr = wallEl.getBoundingClientRect(), r = units[i].getBoundingClientRect();
    const rightSide = vi >= Math.ceil(visible.length / 2);
    const left = rightSide ? r.left - wr.left - 290 : r.right - wr.left + 36;
    dinfo.style.left = `${ Math.max(16, left) }px`;
    dinfo.style.top = `${ r.top - wr.top + 20 }px`;
    dinfo.style.textAlign = rightSide ? 'right' : 'left';
    setInfo(i);
    dinfo.classList.add('on');
  };

  const hideDoorInfo = () => {
    units.forEach(u => u.classList.remove('on'));
    sec.classList.remove('focus');
    dinfo?.classList.remove('on');
  };

  doorsState.forEach((d, i) => {
    d.way = $('.doorway', d.u);
    if (canHover) {
      d.way.addEventListener('mouseenter', () => {
        if (!busy && !inRoom && !MOB.matches) {
          d.s.set(0.18);
          showDoorInfo(i);
        }
      });
      d.way.addEventListener('mouseleave', () => {
        if (!busy && !inRoom && !MOB.matches) {
          d.s.set(0);
          hideDoorInfo();
        }
      });
    }
    d.way.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      enterRoom(i);
    });
  });

  // ─── MOBILE PINNED WALL HORIZONTAL SCROLL & TOUCH SWIPE ───
  let mIdx = 0, mForce = -1, mShown = -1;
  const mSpan = () => Math.max(1, sec.offsetHeight - window.innerHeight);
  const mobY = i => sec.getBoundingClientRect().top + window.pageYOffset + (Math.min(3, Math.max(0, i)) / 3) * mSpan();
  let mCur = 0, mRaf = 0, mLast = 0, mSettle = 0, swipeLock = 0;

  // Dwell curve: rests on each door, then glides smoothly across
  const mDwell = f => {
    const i = Math.floor(f), t = f - i, u = Math.min(1, Math.max(0, (t - .2) / .6));
    return i + u * u * (3 - 2 * u);
  };
  const mProgress = () => Math.min(1, Math.max(0, -sec.getBoundingClientRect().top / mSpan()));
  const mTarget = () => mForce >= 0 ? mForce : mDwell(mProgress() * 3);

  function mShow(i) {
    if (i === mShown) return;
    mShown = i;
    setInfo(i);
    mDots?.querySelectorAll('i').forEach((d, k) => d.classList.toggle('on', k === Math.min(3, i)));
    dinfo?.getAnimations().forEach(a => a.cancel());
    if (!reduced && dinfo) {
      dinfo.animate([{ opacity: 0, transform: 'translateY(.4rem)' }, { opacity: 1, transform: 'none' }], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
  }

  function mFrame(now) {
    mRaf = 0;
    if (!MOB.matches) {
      if (mRow) mRow.style.transform = '';
      return;
    }
    const dt = Math.min(64, now - (mLast || now));
    mLast = now;
    const t = mTarget();
    mCur = reduced ? t : mCur + (t - mCur) * Math.min(1, dt / 1000 * 10);
    mCur = Math.max(t - 1, Math.min(t + 1, mCur));
    if (Math.abs(t - mCur) < 0.001) mCur = t;

    const step = units[1] && units[0] ? (units[1].offsetLeft - units[0].offsetLeft) : (window.innerWidth * 0.6);
    if (mRow) mRow.style.transform = `translate3d(${(-mCur * step).toFixed(2)}px, 0, 0)`;
    mIdx = Math.round(t);
    mShow(mForce >= 0 ? mForce : mIdx);

    if (mCur !== t) mRaf = requestAnimationFrame(mFrame);
  }

  function mApply() {
    if (!mRaf) mRaf = requestAnimationFrame(mFrame);
  }

  const mPin = $('.doors__pin', sec);
  function mSize() {
    if (!MOB.matches) {
      mPin?.style.removeProperty('--uw');
      sec.classList.remove('compact');
      return;
    }
    const fit = () => {
      const pr = mPin ? mPin.getBoundingClientRect() : { bottom: window.innerHeight };
      const rr = mRow ? mRow.getBoundingClientRect() : { top: 0 };
      const avail = pr.bottom - rr.top - (mRow ? parseFloat(getComputedStyle(mRow).paddingTop) : 0) - 2;
      return Math.min(window.innerWidth * 0.6, avail / 2.25);
    };
    sec.classList.remove('compact');
    let w = fit();
    if (w < 150) {
      sec.classList.add('compact');
      w = fit();
    }
    mPin?.style.setProperty('--uw', Math.max(110, w).toFixed(1) + 'px');
    mApply();
  }
  mSize();
  window.addEventListener('resize', mSize);
  document.fonts?.ready.then(mSize);

  const mGo = top => window.__snapTo(top);
  function mFromScroll() {
    if (!MOB.matches || busy) return;
    mApply();
    clearTimeout(mSettle);
    mSettle = setTimeout(function settle() {
      if (window.__touching) { mSettle = setTimeout(settle, 120); return; }
      if (busy || mForce >= 0 || performance.now() < swipeLock) return;
      const r = sec.getBoundingClientRect();
      if (r.top > 0 || r.bottom < window.innerHeight) return;
      const want = mobY(Math.round(mProgress() * 3));
      if (Math.abs(window.pageYOffset - want) > 2) mGo(want);
    }, 220);
  }

  window.addEventListener('scroll', mFromScroll, { passive: true });
  lenis?.on('scroll', mFromScroll);

  // Sideways touch swipe on the pinned doors wall
  let tx0 = 0, ty0 = 0, i0 = 0;
  sec.addEventListener('touchstart', e => {
    tx0 = e.touches[0].clientX;
    ty0 = e.touches[0].clientY;
    i0 = Math.round(mProgress() * 3);
  }, { passive: true });

  sec.addEventListener('touchend', e => {
    if (!MOB.matches || busy || mForce >= 0) return;
    const dx = e.changedTouches[0].clientX - tx0;
    const dy = e.changedTouches[0].clientY - ty0;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    const to = Math.min(3, Math.max(0, i0 + (dx < 0 ? 1 : -1)));
    swipeLock = performance.now() + 700;
    mGo(mobY(to));
  }, { passive: true });

  if (MOB.matches) {
    mShown = -1;
    mShow(0);
    dinfo?.classList.add('on');
    mCur = mTarget();
    mApply();
  }
  MOB.addEventListener?.('change', () => {
    mForce = -1;
    mShown = -1;
    mFromScroll();
    mApply();
    if (MOB.matches) dinfo?.classList.add('on');
  });

  // Reveal Secret 5th Door
  const SECRET = 4, secretUnit = units[SECRET];
  function revealSecretDoor(on = true) {
    sec.classList.toggle('reveal', on);
    if (secretUnit) {
      if (on) secretUnit.removeAttribute('inert');
      else secretUnit.setAttribute('inert', '');
    }
  }

  // ─── WALK-THROUGH DOOR ZOOM & EXHIBITION ROOM ───
  let walkRaf = 0, currentRoomIdx = 0;

  function enterRoom(i) {
    if (busy || inRoom) return;
    busy = true;
    currentRoomIdx = i;
    showBadge(false);
    hideDoorInfo();

    // Safety fallback: ensure busy never gets permanently stuck
    const safetyTimer = setTimeout(() => {
      if (!inRoom) {
        busy = false;
        sec.style.transform = '';
        sec.classList.remove('through');
      }
    }, 2500);

    const d = doorsState[i];
    if (d && d.u) {
      doorsState.forEach((o, k) => { if (k !== i && o.s) o.s.set(0); });
      // 1. Lever presses down
      d.u.classList.add('press');
      setTimeout(() => d.u.classList.remove('press'), 240);

      // 2. Door swings open wide into the room
      setTimeout(() => d.s.set(1), reduced ? 0 : 80);
    }

    // 3. Snappy zoom straight into the doorway gap
    setTimeout(() => {
      const u = units[i];
      if (!u) {
        clearTimeout(safetyTimer);
        renderRoomContent(i);
        return;
      }
      const opening = $('.opening', u);
      const doorEl = $('.door', u);
      const r = opening ? opening.getBoundingClientRect() : u.getBoundingClientRect();
      const dr = doorEl ? doorEl.getBoundingClientRect() : r;
      const gapL = Math.min(Math.max(dr.right, r.left), r.right - 6);
      const gw = Math.max(r.right - gapL, 10), gh = Math.max(r.height, 10);
      const cx = (gapL + r.right) / 2, cy = r.top + gh * 0.5;
      const tx = window.innerWidth / 2 - cx, ty = window.innerHeight / 2 - cy;
      const sEnd = Math.min(18, Math.max(window.innerWidth / gw, window.innerHeight / gh) * 1.15);

      stopScroll();
      $('#cord')?.classList.add('away');
      $('.hdr')?.classList.add('away');

      const sr = sec.getBoundingClientRect();
      sec.style.transformOrigin = `${ (cx - sr.left).toFixed(2) }px ${ (cy - sr.top).toFixed(2) }px`;
      sec.classList.add('through');

      const t0 = performance.now(), D = reduced ? 1 : 650;
      const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      const zoomOf = e => Math.exp(Math.log(sEnd) * e);

      let handed = false;
      const step = now => {
        const p = Math.min(1, (now - t0) / D), e = ease(p), sc = zoomOf(e);
        const f = Math.min(1, e * 1.5);
        sec.style.transform = `translate(${ (tx * f).toFixed(2) }px, ${ (ty * f).toFixed(2) }px) scale(${ sc.toFixed(3) })`;

        if (!handed && (sc >= sEnd / 1.15 || p >= 0.85)) {
          handed = true;
          clearTimeout(safetyTimer);
          renderRoomContent(i);
        }
        if (p < 1) walkRaf = requestAnimationFrame(step);
      };
      walkRaf = requestAnimationFrame(step);
    }, reduced ? 0 : 200);
  }

  function renderRoomContent(i) {
    try {
      const data = ROOMS_DATA[i];
      if (!data || !roomv) return;
      inRoom = true;

      roomvDoor.textContent = data.doorName;
      roomvTitle.textContent = data.title;
      roomvDesc.textContent = data.desc;
      roomvCount.textContent = data.count;


    // ─── CONTINUOUS CINEMATIC VIDEO-LIKE APP REEL ENGINE ───
    function initVideoReels(container = document) {
      const reels = container.querySelectorAll('.video-reel');
      reels.forEach(reel => {
        if (reel.__initialized) return;
        reel.__initialized = true;

        const slides = reel.querySelectorAll('.video-reel__slide');
        const bar = reel.querySelector('.video-reel__bar i');
        const curEl = reel.querySelector('.reel-cur');
        const timeEl = reel.querySelector('[data-reel-time]');
        const statusEl = reel.querySelector('.video-reel__status-text');
        const playIcon = reel.querySelector('.video-reel__play-icon');
        const prevBtn = reel.querySelector('.reel-nav--prev');
        const nextBtn = reel.querySelector('.reel-nav--next');
        const N = slides.length;
        if (N <= 1) return;

        let cur = 0;
        let playing = true;
        let progress = 0;
        let seconds = 1;
        const SLIDE_DURATION = 3200; // 3.2s per slide
        let lastTime = performance.now();
        let rafId = null;

        function setSlide(nextIdx) {
          slides[cur].classList.remove('active');
          cur = (nextIdx + N) % N;
          slides[cur].classList.add('active');
          if (curEl) curEl.textContent = String(cur + 1).padStart(2, '0');
          progress = 0;
          if (bar) bar.style.width = '0%';
        }

        function tick(now) {
          const dt = now - lastTime;
          lastTime = now;

          if (playing) {
            progress += dt / SLIDE_DURATION;
            if (bar) bar.style.width = `${ Math.min(100, progress * 100).toFixed(1) }% `;

            if (progress >= 1) {
              setSlide(cur + 1);
              seconds = (seconds % 99) + 1;
              if (timeEl) timeEl.textContent = `00:${ String(seconds).padStart(2, '0') } `;
            }
          }

          rafId = requestAnimationFrame(tick);
        }

        rafId = requestAnimationFrame(tick);

        // Hover / touch slows down & pauses
        function pause() {
          playing = false;
          if (statusEl) statusEl.textContent = 'Paused · Tap to inspect';
          if (playIcon) playIcon.textContent = '⏸';
          reel.classList.add('is-paused');
        }
        function resume() {
          playing = true;
          lastTime = performance.now();
          if (statusEl) statusEl.textContent = 'Playing App Demo';
          if (playIcon) playIcon.textContent = '▶';
          reel.classList.remove('is-paused');
        }

        reel.addEventListener('mouseenter', pause);
        reel.addEventListener('mouseleave', resume);
        reel.addEventListener('touchstart', pause, { passive: true });
        reel.addEventListener('touchend', () => setTimeout(resume, 2500), { passive: true });

        prevBtn?.addEventListener('click', e => {
          e.stopPropagation();
          setSlide(cur - 1);
          pause();
        });
        nextBtn?.addEventListener('click', e => {
          e.stopPropagation();
          setSlide(cur + 1);
          pause();
        });
      });
    }

    roomvStack.innerHTML = data.projects.map((p, idx) => `
  <article class="card ${idx % 2 === 1 ? 'flip' : ''}" style="--i:${idx}" aria-labelledby="p${i}_${idx}">
    <div class="card__in">
      <div class="card__info">
        <div class="app">
          <div class="app__icon" style="background:${p.iconBg}">
            ${p.iconImg ? `<img src="${p.iconImg}" alt="${p.title}" class="app__icon-img">` : p.icon}
          </div>
          <div class="card__meta">
            <span class="no">${p.num}</span><i></i><span class="card__cat">${p.category}</span>
            ${p.isStoreApp ? (
              p.storeType === 'play' ? `
                    <span class="play-store-pill">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186c-.328-.31-.52-.756-.52-1.286V3.1c0-.53.192-.976.519-1.286zm11.238 9.131l2.368-2.368-11.45-6.52c-.443-.252-.888-.242-1.205-.07l10.287 8.958zm0 2.11l-10.287 8.958c.317.172.762.182 1.205-.07l11.45-6.52-2.368-2.368zm1.055-1.055l3.208 1.828c.954.543.954 1.428 0 1.971l-3.208 1.828-2.072-2.072 2.072-2.072z"/></svg>
                      Google Play
                    </span>
                  ` : (
                p.storeType === 'macos' ? `
                      <span class="app-store-pill app-store-pill--macos">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.06-1.82.94-2.87-.91.04-2.02.61-2.67 1.37-.58.67-1.08 1.75-.95 2.78 1.02.08 2.05-.52 2.68-1.28z"/></svg>
                        macOS App
                      </span>
                    ` : (
                  p.storeType === 'web' ? `
                      <span class="app-store-pill app-store-pill--web">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:10px;height:10px"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                        Live Web App
                      </span>
                    ` : `
                      <span class="app-store-pill">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.06-1.82.94-2.87-.91.04-2.02.61-2.67 1.37-.58.67-1.08 1.75-.95 2.78 1.02.08 2.05-.52 2.68-1.28z"/></svg>
                        App Store
                      </span>
                    `
                )
              )
            ) : ''}
          </div>
        </div>
        <h2 id="p${i}_${idx}">${p.title}</h2>
        <p class="sub">${p.sub}</p>
        <p class="desc">${p.desc}</p>
        <ul class="tags">
          ${p.tags.map(t => `<li>${t}</li>`).join('')}
        </ul>
        <div class="card__actions">
          ${p.liveLink ? `
                <a href="${p.liveLink}" target="_blank" rel="noopener" class="live-badge">
                  <span>${p.liveText}</span>
                </a>
              ` : ''}
          ${p.gitLink ? `
                <a href="${p.gitLink}" target="_blank" rel="noopener" class="git-badge">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  <span>${p.gitText}</span>
                </a>
              ` : ''}
        </div>
        ${p.suiteLinks && p.suiteLinks.length > 0 ? `
              <div class="suite-links" style="display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;">
                ${p.suiteLinks.map(s => `
                  <a href="${s.url}" target="_blank" rel="noopener" class="suite-pill" style="display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:500;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,0.08);color:var(--foreground);text-decoration:none;border:1px solid rgba(255,255,255,0.14);transition:all .2s">
                    ${s.title} ↗
                  </a>
                `).join('')}
              </div>
            ` : ''}
        <span class="note">${p.note}</span>
      </div>

      <div class="stage"${p.storeType === 'web' ? '' : ' aria-hidden="true"'}>
        ${p.storeType === 'macos' ? `
              <div class="mac-frame">
                <div class="mac-frame__body">
                  <div class="mac-frame__topbar">
                    <div class="mac-frame__dots">
                      <span class="m-dot red"></span>
                      <span class="m-dot yellow"></span>
                      <span class="m-dot green"></span>
                    </div>
                    <div class="mac-frame__title">CleanYourMacKeyboard — Free macOS App</div>
                    <div class="mac-frame__badge">macOS 14+</div>
                  </div>
                  <div class="mac-frame__screen">
                    <img src="${p.screenshots[0]}" alt="${p.title} Web Preview" class="mac-frame__img" loading="lazy">
                  </div>
                </div>
              </div>
            ` : (
          p.storeType === 'web' ? `
              <div class="mac-frame mac-frame--web">
                <div class="mac-frame__body">
                  <div class="mac-frame__topbar">
                    <div class="mac-frame__dots">
                      <span class="m-dot red"></span>
                      <span class="m-dot yellow"></span>
                      <span class="m-dot green"></span>
                    </div>
                    <div class="mac-frame__urlbar">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                      <span>${p.urlBar || 'kaushalboii.github.io'}</span>
                    </div>
                    <a href="${p.liveLink || '#'}" target="_blank" rel="noopener" class="mac-frame__badge mac-frame__badge--live" onclick="event.stopPropagation()">
                      <span class="live-dot"></span> LIVE WEB ↗
                    </a>
                  </div>
                  <div class="mac-frame__screen mac-frame__screen--web" style="background:${p.screenBg || '#000000'}">
                    <a href="${p.liveLink || '#'}" target="_blank" rel="noopener" class="mac-frame__preview-link" onclick="event.stopPropagation()">
                      <img src="${p.previewImg}" alt="${p.title} Preview" class="mac-frame__img mac-frame__img--web" loading="lazy">
                      <span class="mac-frame__hover-pill">
                        <span class="live-dot"></span> Launch Live App ↗
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ` : `
            <div class="phone">
              <div class="phone__body">
                <i class="phone__btn l" style="top:19%;height:4%"></i>
                <i class="phone__btn l" style="top:26%;height:7.5%"></i>
                <i class="phone__btn l" style="top:35%;height:7.5%"></i>
                <i class="phone__btn r" style="top:28%;height:11%"></i>
                <div class="phone__screen" style="background:${p.screenBg}">
                  <div class="island"></div>
                  <div class="sbar">
                    <span>9:41</span>
                    <span>
                      <svg viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
                      <svg viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.3-1.4A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .7 3.2L2 4.6a8.7 8.7 0 0 1 6-2.4z"/></svg>
                    </span>
                  </div>
                  ${p.screenshots && p.screenshots.length > 0 ? `
                    <div class="video-reel" data-reel-id="${idx}">
                      <div class="video-reel__viewport">
                        <div class="video-reel__slides">
                          ${p.screenshots.map((src, sIdx) => `
                            <div class="video-reel__slide ${sIdx === 0 ? 'active' : ''}" data-idx="${sIdx}">
                              <img src="${src}" alt="${p.title} Screen ${sIdx + 1}" loading="lazy">
                            </div>
                          `).join('')}
                        </div>
                      </div>
                      <div class="video-reel__overlay">
                        <div class="video-reel__badge">
                          <span class="video-reel__rec"></span>
                          <span class="video-reel__tag">${p.storeType === 'play' ? 'GOOGLE PLAY PREVIEW' : (p.storeType === 'macos' ? 'MACOS APP PREVIEW' : (p.isStoreApp ? 'APP STORE PREVIEW' : 'PROJECT SHOWCASE'))}</span>
                          <span class="video-reel__time" data-reel-time>00:01</span>
                        </div>
                        <div class="video-reel__scrubber">
                          <div class="video-reel__bar"><i style="width:0%"></i></div>
                        </div>
                        <div class="video-reel__foot">
                          <div class="video-reel__status">
                            <span class="video-reel__play-icon">▶</span>
                            <span class="video-reel__status-text">Playing App Demo</span>
                          </div>
                          <div class="video-reel__counter">
                            <span class="reel-cur">01</span> / <span>${String(p.screenshots.length).padStart(2, '0')}</span>
                          </div>
                        </div>
                      </div>
                      <button class="reel-nav reel-nav--prev" type="button" aria-label="Previous screenshot">‹</button>
                      <button class="reel-nav reel-nav--next" type="button" aria-label="Next screenshot">›</button>
                    </div>
                  ` : p.mockupContent}
                </div>
              </div>
            </div>
            `)}
      </div>
    </div>
      </article>
  `).join('');

    initVideoReels(roomvStack);

    roomv.scrollTop = 0;
    roomv.hidden = false;
    requestAnimationFrame(() => {
      roomv.classList.add('lit');
    });
  } catch (err) {
    console.error('Error rendering room:', err);
    if (roomv) {
      inRoom = true;
      roomv.hidden = false;
      roomv.classList.add('lit');
    }
  }
}

  function leaveRoom() {
    if (!inRoom) return;
    inRoom = false;
    roomv.classList.remove('lit');

    const safetyLeave = setTimeout(() => {
      busy = false;
      sec.style.transform = '';
      sec.classList.remove('through');
      startScroll();
    }, 1500);

    setTimeout(() => {
      roomv.hidden = true;
      cancelAnimationFrame(walkRaf);

      const from = sec.style.transform || '';
      const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([\d.]+)\)/.exec(from);
      const X = m ? parseFloat(m[1]) : 0;
      const Y = m ? parseFloat(m[2]) : 0;
      const S = m ? Math.max(1, parseFloat(m[3])) : 1;
      const t0 = performance.now(), D = reduced ? 1 : 650;
      const ease = x => 1 - Math.pow(1 - x, 3);

      const stepBack = now => {
        const p = Math.min(1, (now - t0) / D), e = ease(p);
        const sc = Math.exp(Math.log(S) * (1 - e));
        sec.style.transform = `translate(${ (X * (1 - e)).toFixed(2) }px, ${ (Y * (1 - e)).toFixed(2) }px) scale(${ sc.toFixed(3) })`;

        if (p < 1) requestAnimationFrame(stepBack);
        else {
          clearTimeout(safetyLeave);
          sec.style.transform = '';
          sec.classList.remove('through');
          if (doorsState[currentRoomIdx]?.s) {
            doorsState[currentRoomIdx].s.set(0);
          }
          $('#cord')?.classList.remove('away');
          $('.hdr')?.classList.remove('away');
          busy = false;
          startScroll();
        }
      };
      requestAnimationFrame(stepBack);
    }, reduced ? 0 : 200);
  }

  roomvBack?.addEventListener('click', leaveRoom);
  roomvBackBottom?.addEventListener('click', leaveRoom);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && inRoom) leaveRoom(); });

  // ─── STACKING CARD SCROLL DEPTH ANIMATION ───
  let roomScrollRaf = 0;
  roomv?.addEventListener('scroll', () => {
    if (roomScrollRaf || !inRoom) return;
    roomScrollRaf = requestAnimationFrame(() => {
      roomScrollRaf = 0;
      const cards = roomvStack?.querySelectorAll('.card');
      if (!cards || cards.length <= 1) return;
      cards.forEach((card, idx) => {
        const next = cards[idx + 1];
        if (next) {
          const nextRect = next.getBoundingClientRect();
          const cardRect = card.getBoundingClientRect();
          const overlap = Math.max(0, cardRect.bottom - nextRect.top);
          const progress = Math.min(1, Math.max(0, overlap / (cardRect.height * 0.75)));
          const scale = 1 - progress * 0.035;
          const brightness = 1 - progress * 0.14;
          card.style.transform = `scale(${scale.toFixed(4)})`;
          card.style.filter = `brightness(${brightness.toFixed(3)})`;
        } else {
          card.style.transform = '';
          card.style.filter = '';
        }
      });
    });
  }, { passive: true });

  window.openDoor = i => {
    if (busy || inRoom) return;
    const secRect = sec.getBoundingClientRect();
    const isVisible = secRect.top >= -120 && secRect.bottom <= window.innerHeight + 120;
    if (!isVisible) {
      const top = secRect.top + window.pageYOffset;
      window.__snapTo ? window.__snapTo(top) : window.scrollTo({ top, behavior: 'smooth' });
      setTimeout(() => {
        if (i === SECRET) {
          revealSecretDoor(true);
          setTimeout(() => enterRoom(i), 500);
        } else {
          enterRoom(i);
        }
      }, 400);
    } else {
      if (i === SECRET) {
        revealSecretDoor(true);
        setTimeout(() => enterRoom(i), 500);
      } else {
        enterRoom(i);
      }
    }
  };

  $$('[data-door]:not(.doorway)').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const d = parseInt(btn.dataset.door, 10);
      if (!isNaN(d)) window.openDoor(d);
    });
  });
})();

// ─── STORY TIMELINE, ROLLING YEAR COUNTER & 3D CLOCK TUNNEL ───
(() => {
  const sec = document.querySelector('.story'); if (!sec) return;
  const line = sec.querySelector('.story__line'), list = sec.querySelector('.story__list');
  const chs = [...list.querySelectorAll('.ch')], N = chs.length;
  const cols = [...sec.querySelectorAll('.dg__c')], when = sec.querySelector('.story__when'), count = sec.querySelector('.story__count');
  const dot = sec.querySelector('.story__dot'), rail = sec.querySelector('.story__rail'), cv = sec.querySelector('.story__bg');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  const root = document.documentElement;
  let shownYear = '', shown = -1;

  const setYear = y => {
    if (y === shownYear) return;
    shownYear = y;
    const digits = String(y).padStart(4, '0').split('');
    digits.forEach((d, k) => {
      if (cols[k]) {
        cols[k].style.setProperty('--d', d);
        cols[k].style.transform = `translateY(-${ Number(d) * 10}%)`;
      }
    });
  };

  const show = i => {
    if (i === shown) return;
    shown = i;
    chs.forEach((c, k) => c.classList.toggle('on', k === i));
    setYear(chs[i].dataset.y);
    if (when) when.textContent = chs[i].dataset.when;
    if (count) count.textContent = String(i + 1).padStart(2, '0');
    sec.classList.toggle('is-now', i === 0);
    sec.dataset.ch = i;
  };

  // ---- the tunnel ----
  let W = 0, H = 0, dpr = 1, rgb = '26,24,24';
  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth;
    H = cv.clientHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
  };
  const readRgb = () => {
    rgb = (getComputedStyle(root).getPropertyValue('--fg-rgb') || '26,24,24').trim();
  };
  new MutationObserver(readRgb).observe(root, { attributes: true, attributeFilter: ['data-mode'] });

  const RINGS = 16, GAP = 340, FOCAL = 520, R = 620, TICKS = 60;
  const dust = Array.from({ length: 70 }, () => ({
    a: Math.random() * Math.PI * 2,
    r: 120 + Math.random() * 760,
    z: Math.random() * RINGS * GAP,
    s: .6 + Math.random() * 1.4
  }));

  function tunnel(p, t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const cx = W * .5, cy = H * .55, k = Math.min(W, H) / 900;
    const camZ = p * (N - 1) * GAP * 1.6 + t * 18;
    const spin = -p * Math.PI * 1.5 - t * .02;
    const len = RINGS * GAP;
    ctx.lineCap = 'round';

    for (let i = 0; i < RINGS; i++) {
      let z = ((i * GAP - camZ) % len + len) % len + 60;
      const s = FOCAL / z * k, fog = Math.min(1, Math.max(0, (z - 260) / 1100)) * Math.max(0, 1 - z / len);
      if (fog <= .01) continue;
      const rr = R * s, rot = spin + i * .21;

      ctx.strokeStyle = `rgba(${ rgb }, ${(fog * .12).toFixed(3)})`;
      ctx.lineWidth = Math.max(.5, 1.2 * s);
      ctx.beginPath();
      ctx.arc(cx, cy, rr, 0, Math.PI * 2);
      ctx.stroke();

      const T = W < 768 ? 36 : TICKS, every = T / 12;
      for (const hour of [false, true]) {
        const l = (hour ? 46 : 18) * s;
        ctx.beginPath();
        for (let j = 0; j < T; j++) {
          if ((j % every === 0) !== hour) continue;
          const a = rot + j / T * Math.PI * 2, c = Math.cos(a), d = Math.sin(a);
          ctx.moveTo(cx + c * (rr - l), cy + d * (rr - l));
          ctx.lineTo(cx + c * rr, cy + d * rr);
        }
        ctx.strokeStyle = `rgba(${ rgb }, ${(fog * (hour ? .3 : .14)).toFixed(3)})`;
        ctx.lineWidth = Math.max(.5, (hour ? 3 : 1.4) * s);
        ctx.stroke();
      }

      const ha = rot * 3 + i;
      ctx.strokeStyle = `rgba(${ rgb }, ${(fog * .16).toFixed(3)})`;
      ctx.lineWidth = Math.max(.5, 2 * s);
      if (rr < Math.min(W, H) * .45) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ha) * rr * .55, cy + Math.sin(ha) * rr * .55);
        ctx.stroke();
      }
    }

    for (const q of dust) {
      const z = ((q.z - camZ * 1.1) % len + len) % len + 40, s = FOCAL / z * k, fog = Math.min(1, Math.max(0, (z - 300) / 900)) * Math.max(0, 1 - z / len);
      const a = q.a + spin * .3;
      ctx.fillStyle = `rgba(${ rgb }, ${(fog * .35).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * q.r * s, cy + Math.sin(a) * q.r * s, Math.max(.4, q.s * s * 2.2), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  let firstY = 0, lastY = 0, endY = 0;
  const measure = () => {
    if (!line || !list || !chs[0]) return;
    const mark = c => line.offsetTop * 0 + list.offsetTop + c.offsetTop + c.firstElementChild.offsetTop + 8;
    firstY = mark(chs[0]);
    lastY = mark(chs[N - 1]);
    const last = chs[N - 1];
    endY = list.offsetTop + last.offsetTop + last.offsetHeight - parseFloat(getComputedStyle(last).paddingBottom);
    for (const el of [rail, sec.querySelector('.story__dtrack'), sec.querySelector('.story__ttrack')]) {
      if (el) {
        el.style.setProperty('--r0', firstY + 'px');
        el.style.setProperty('--rh', (endY - firstY) + 'px');
      }
    }
    if (innerWidth >= 768) size();
  };

  let raf = 0, p = 0, lastT = 0;
  function update() {
    raf = 0;
    if (!line) return;
    const lr = line.getBoundingClientRect(), mid = innerHeight * .5;
    const y = Math.min(lastY, Math.max(firstY, mid - lr.top));
    p = (y - firstY) / Math.max(1, lastY - firstY);
    sec.style.setProperty('--p', p.toFixed(4));
    sec.style.setProperty('--warm', p.toFixed(3));
    sec.classList.toggle('at-start', p < .002);
    let i = 0;
    for (let k = 0; k < N; k++) {
      if (lr.top + list.offsetTop + chs[k].offsetTop < mid + 40) i = k;
    }
    show(i);
    if (innerWidth >= 768 && !reduced && !root.classList.contains('lite')) tunnel(p, 0);
  }

  const q = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', q, { passive: true });
  lenis?.on?.('scroll', q);
  window.addEventListener('resize', () => { measure(); q(); });
  new MutationObserver(() => { readRgb(); q(); }).observe(root, { attributes: true, attributeFilter: ['data-mode'] });
  readRgb();
  measure();
  show(0);
  update();
  document.fonts?.ready?.then(() => { measure(); q(); });
  window.addEventListener('load', () => { measure(); q(); });

  let driftT = 0, driftRaf = null;
  function runDrift(now) {
    if (innerWidth < 768 || reduced || root.classList.contains('lite')) {
      driftRaf = null;
      return;
    }
    const dt = Math.min(64, now - (lastT || now));
    lastT = now;
    driftT += dt / 1000;
    tunnel(p, driftT);
    driftRaf = requestAnimationFrame(runDrift);
  }
  function checkDrift() {
    if (innerWidth >= 768 && !reduced && !root.classList.contains('lite')) {
      if (!driftRaf) driftRaf = requestAnimationFrame(runDrift);
    } else if (driftRaf) {
      cancelAnimationFrame(driftRaf);
      driftRaf = null;
    }
  }
  checkDrift();
  window.addEventListener('resize', checkDrift, { passive: true });
})();

// ─── CONTACT MODAL (#modal) & START A PROJECT BUTTONS ───
(() => {
  const modal = $('#modal'), closeBtn = $('#mClose');
  const form = $('#reqForm');
  if (!modal) return;

  function openModal() {
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('open', 'on'));
    stopScroll();
  }

  function closeModal() {
    modal.classList.remove('open', 'on');
    setTimeout(() => { modal.hidden = true; startScroll(); }, 350);
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-contact], #navStart');
    if (btn) {
      e.preventDefault();
      openModal();
    }
  });

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#f-name')?.value || '';
    const email = $('#f-email')?.value || '';
    const project = $('#f-project')?.value || '';
    const subject = encodeURIComponent(`Project Inquiry from ${ name } `);
    const body = encodeURIComponent(`Hi Kaushal, \n\nName: ${ name } \nEmail: ${ email } \n\nProject Details: \n${ project } `);
    window.location.href = `mailto:kaushalmaranm@gmail.com?subject= ${ subject }&body=${ body } `;
    closeModal();
  });
})();

// ─── DYNAMIC FOOTER WATERMARK AUTO-FIT: "M KAUSHAL MARAN" ───
(() => {
  let offCanvas = null;
  function fitFooterWord() {
    const wordEl = document.querySelector('.sf__word');
    const spanEl = document.querySelector('.sf__word .full');
    if (!wordEl || !spanEl) return;
    const availWidth = Math.max(300, window.innerWidth - 48);
    if (!offCanvas) offCanvas = document.createElement('canvas');
    const ctx = offCanvas.getContext('2d');
    ctx.font = '700 100px Onest, sans-serif';
    const textWidth = ctx.measureText(spanEl.textContent || 'M KAUSHAL MARAN').width || 1;
    const scale = (availWidth * 0.90) / textWidth;
    const targetPx = Math.floor(100 * scale);
    const clampedPx = Math.max(18, Math.min(130, targetPx));
    wordEl.style.fontSize = `${clampedPx}px`;
    wordEl.style.setProperty('--wf', `${clampedPx}px`);
  }

  window.addEventListener('resize', fitFooterWord, { passive: true });
  window.addEventListener('orientationchange', fitFooterWord, { passive: true });
  if ('requestIdleCallback' in window) {
    requestIdleCallback(fitFooterWord);
  } else {
    setTimeout(fitFooterWord, 300);
  }
})();

// ─── INITIALIZATION & READY DISPATCH ───
function onReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true });
  } else {
    fn();
  }
}

onReady(() => {
  const fig = $('#fig'), figCanvas = $('#figCanvas');
  if (fig && figCanvas) {
    liquidReveal(fig, figCanvas, 'assets/kaushal-opt.webp');
  }

  // Fade out loader & signal intro ready
  const loader = $('#loader');
  if (loader && !loader.classList.contains('out')) {
    setTimeout(() => {
      loader.classList.add('out');
      setTimeout(() => {
        try { loader.remove(); } catch (e) { }
      }, 850);
      document.body.classList.add('ready');
      window.dispatchEvent(new CustomEvent('intro:ready'));
    }, 900);
  } else {
    document.body.classList.add('ready');
    window.dispatchEvent(new CustomEvent('intro:ready'));
  }
});

// ─── GOOGLE ANALYTICS & COOKIE CONSENT ───
(() => {
  const GA_ID = 'G-7J3EE7B9EE';
  const K = 'kaushal-analytics';
  let v = null;
  try { v = localStorage.getItem(K); } catch (e) { }
  const load = () => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  };
  if (v === 'yes') return load();
  if (v === 'no') return;
  const b = document.getElementById('ck');
  if (!b) return;
  b.hidden = false;
  b.addEventListener('click', e => {
    const c = e.target.closest('[data-ck]');
    if (!c) return;
    try { localStorage.setItem(K, c.dataset.ck); } catch (err) { }
    b.hidden = true;
    if (c.dataset.ck === 'yes') load();
  });
})();
