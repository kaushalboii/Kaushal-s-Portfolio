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

// ─── PULL CORD LIGHT / DARK TOGGLE ───
(() => {
  const cord = $('#cord'), pull = $('#cordPull');
  if (!cord || !pull) return;

  const savedMode = localStorage.getItem('kaushal-mode');
  if (savedMode) root.dataset.mode = savedMode;

  let y = 0, vy = 0, dragging = false, startY = 0, currentY = 0;
  const REST = 0, MAX_PULL = 90, THRESHOLD = 55;

  function updatePull(dy) {
    const clamped = Math.max(0, Math.min(MAX_PULL, dy));
    pull.style.transform = `translateY(${clamped}px)`;
  }

  function toggleMode() {
    const isDark = root.dataset.mode === 'dark';
    const next = isDark ? 'light' : 'dark';
    root.dataset.mode = next;
    try { localStorage.setItem('kaushal-mode', next); } catch (e) {}

    // Audio click feedback via Web Audio API
    try {
      const actx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isDark ? 880 : 440, actx.currentTime);
      gain.gain.setValueAtTime(0.08, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.08);
      osc.connect(gain); gain.connect(actx.destination);
      osc.start(); osc.stop(actx.currentTime + 0.08);
    } catch (e) {}
  }

  function snapBack() {
    dragging = false;
    pull.style.transition = 'transform .45s cubic-bezier(.175, .885, .32, 1.275)';
    pull.style.transform = `translateY(${REST}px)`;
    setTimeout(() => { pull.style.transition = ''; }, 450);
  }

  pull.addEventListener('pointerdown', e => {
    dragging = true;
    startY = e.clientY;
    pull.setPointerCapture(e.pointerId);
    pull.style.transition = 'none';
  });

  pull.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dy = e.clientY - startY;
    updatePull(dy);
    if (dy > THRESHOLD && !pull._triggered) {
      pull._triggered = true;
      toggleMode();
    }
  });

  const onRelease = () => {
    if (!dragging) return;
    pull._triggered = false;
    snapBack();
  };

  pull.addEventListener('pointerup', onRelease);
  pull.addEventListener('pointercancel', onRelease);
})();

// ─── NAVIGATION & FULLSCREEN MENU ───
(() => {
  const hdr = $('.hdr'), navOpen = $('#navOpen'), navClose = $('#navClose'), navm = $('#navm');
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
      requestAnimationFrame(() => navm.classList.add('on'));
      stopScroll();
    });
  }

  function closeMenu() {
    if (!navm) return;
    navm.classList.remove('on');
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
    'UI/UX Designer',
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
    let max = 0;
    for (const w of SKILLS) {
      measure.textContent = w;
      max = Math.max(max, measure.getBoundingClientRect().width);
    }
    const wEm = max / fs + 0.8 + 0.06; // word + side padding
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
      { opacity: 1, offset: .285 },
      { opacity: 0, offset: .295 },
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
  }

  base.onload = resize;
  afterImg.onload = resize;
  window.addEventListener('resize', resize);
  resize();

  let trail = [];
  function addPoint(x, y) {
    trail.push({ x: x * dpr, y: y * dpr, r: brushRadius * dpr, a: 1 });
    dirty = true;
  }

  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    addPoint(e.clientX - r.left, e.clientY - r.top);
  });

  function render() {
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

      if (trail.length === 0) dirty = false;
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
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
  const slides = $$('.slide', hcard), dots = $$('.dots i', hcard);
  let cur = 0;

  function show(i) {
    slides.forEach((s, idx) => {
      s.style.opacity = idx === i ? '1' : '0';
      s.style.transform = idx === i ? 'none' : 'translateY(10px)';
      s.style.pointerEvents = idx === i ? 'auto' : 'none';
    });
    dots.forEach((d, idx) => d.classList.toggle('on', idx === i));
    cur = i;
  }

  $('#prevSlide')?.addEventListener('click', () => show((cur - 1 + slides.length) % slides.length));
  $('#nextSlide')?.addEventListener('click', () => show((cur + 1) % slides.length));
  show(0);
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
        iconBg: '#2D1B2D',
        num: '01 / 04',
        category: 'iOS App · Health & Sound',
        title: 'ZENLIFE',
        sub: 'Sound-Based Stress Relief App · Apple App Store',
        desc: 'Delivers calming, mood-tailored acoustic soundscapes and frequency sessions (432 Hz Solfeggio). Features real-time mood logging, psychometric analytics, local CoreData persistence, and secure PHP/MySQL cloud sync.',
        tags: ['SwiftUI', 'AVAudioEngine', 'CoreData', 'Biometrics', 'PHP REST', 'MySQL'],
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
        iconBg: '#1E252B',
        num: '04 / 04',
        category: 'macOS App · Utilities',
        title: 'CleanYourMacKeyboard',
        sub: 'macOS Keyboard Lock Utility · Free & Open Source',
        desc: 'Native macOS Swift menu bar utility that safely locks all keyboard and touch bar input with a single click, allowing users to wipe down and sanitize their keyboard without triggering unwanted keypresses or terminal inputs.',
        tags: ['macOS', 'Swift', 'AppKit', 'Input Monitoring', 'Free & Open Source'],
        gitLink: 'https://github.com/kaushalboii/CleanYourMacKeyboard',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source Repository',
        screenBg: 'radial-gradient(circle at 50% 20%, #202b33 0%, #0e1418 80%)',
        mockupContent: `
          <div class="mockup-mac">
            <div class="mac-lock-badge">
              <span class="mac-lock-icon">🔒</span>
              <span class="mac-lock-status">Cleaning Mode Active</span>
            </div>
            <div class="mac-timer">
              <span class="mac-timer__sec">00:24</span>
              <span class="mac-timer__lbl">Keyboard Inputs Suppressed</span>
            </div>
            <div class="mac-hud">
              <p>Wipe keys cleanly with microfiber cloth</p>
              <span class="mac-esc-pill">Hold ESC 3s to Unlock</span>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'android',
    doorName: 'Door 02 · Android Development',
    title: 'Android Native Applications',
    desc: 'Robust Android apps engineered using modern Kotlin conventions, Jetpack Compose, Coroutines, ROOM SQLite, and Material 3 design systems.',
    count: '03 Featured Projects',
    accent: '#4A3540',
    projects: [
      {
        icon: '📢',
        iconBg: '#341E2B',
        num: '01 / 03',
        category: 'Android App · Classifieds & Ads',
        title: 'Vellore Ads',
        sub: 'Commercial Listing Platform · Google Play Store',
        desc: 'Commercial listing and advertising directory. Features instant location filters, high-density listing catalogues, verified merchant profiles, and region-specific classified ad management.',
        tags: ['Kotlin', 'Jetpack Compose', 'MySQL', 'PHP REST APIs', 'Material 3'],
        liveLink: 'https://play.google.com/store/apps/details?id=com.velloreads.app&hl=en_IN',
        liveText: 'Get on Google Play ↗',
        note: 'Live on Google Play Store',
        screenBg: 'radial-gradient(circle at 50% 20%, #361f2c 0%, #190e14 80%)',
        mockupContent: `
          <div class="mockup-ads">
            <div class="ads-header">
              <span class="ads-loc">📍 Vellore, Tamil Nadu</span>
              <span class="ads-filter">Filter ▾</span>
            </div>
            <div class="ads-banner">
              <b>Commercial Hub Spotlight</b>
              <span>Featured Local Services & Retail</span>
            </div>
            <div class="ads-card">
              <div class="ads-card__tag">Verified Merchant</div>
              <b>Sri Sai Automotive Spares</b>
              <span>Katpadi Road · Open Now</span>
              <div class="ads-actions"><span class="call-btn">📞 Call Now</span><span class="view-btn">Details →</span></div>
            </div>
          </div>
        `
      },
      {
        icon: '⚖️',
        iconBg: '#212B23',
        num: '02 / 03',
        category: 'Android App · Legal Reference',
        title: 'Indian Law Reference Suite',
        sub: 'Statutory Legal Suite in 11 Indian Languages · Free on GitHub',
        desc: 'Comprehensive offline statutory reference suite containing Bharatiya Nyaya Sanhita (BNS), BNSS, BSA, IPC, CrPC, and Constitution of India in 11 Indian languages with instantaneous FTS5 SQLite search.',
        tags: ['Kotlin', 'SQLite FTS5', '11 Languages', 'Material You', 'Free & Open Source'],
        gitLink: 'https://github.com/kaushalboii/Indian-Law-Bilingual-Pocket-Reference-App',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source Repository',
        screenBg: 'radial-gradient(circle at 50% 20%, #202e24 0%, #0d1610 80%)',
        mockupContent: `
          <div class="mockup-law">
            <div class="law-lang-pills">
              <span class="lang-on">English</span>
              <span>தமிழ்</span>
              <span>हिन्दी</span>
              <span>తెలుగు</span>
            </div>
            <div class="law-search">
              <span>🔍 Search Section, Act or Keyword...</span>
            </div>
            <div class="law-card">
              <div class="law-badge">BNS § 103 (1)</div>
              <b>Punishment for Murder</b>
              <p>Whoever commits murder shall be punished with death or imprisonment for life...</p>
              <div class="law-meta"><span>Cross-ref: IPC § 302</span><span class="bookmark-icon">★</span></div>
            </div>
          </div>
        `
      },
      {
        icon: '🗳️',
        iconBg: '#1F2936',
        num: '03 / 03',
        category: 'Android / Web · Democracy & Security',
        title: 'ClearVote',
        sub: 'Cryptographically Verified Voting System · Free on GitHub',
        desc: 'Modern democratic voting interface featuring tamper-proof cryptographic audit receipts, voter credential validation, and decentralized tally integrity verification.',
        tags: ['Android', 'Cryptography', 'JavaScript', 'Security Auditing', 'Open Source'],
        gitLink: 'https://github.com/kaushalboii/ClearVote',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source Repository',
        screenBg: 'radial-gradient(circle at 50% 20%, #1e2837 0%, #0c121b 80%)',
        mockupContent: `
          <div class="mockup-vote">
            <div class="vote-badge">
              <span class="vote-shield">🛡️</span>
              <span>Cryptographic Ballot Ready</span>
            </div>
            <div class="vote-candidate">
              <b>Election 2026 Constituency Ballot</b>
              <span class="vote-opt opt-selected">● Representative Candidate Alpha</span>
              <span class="vote-opt">○ Representative Candidate Beta</span>
            </div>
            <div class="vote-receipt">
              <span class="vote-hash">SHA: 7f8a9...4b1c</span>
              <button class="vote-submit-btn">Cast Verified Ballot ✓</button>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'ai',
    doorName: 'Door 03 · AI & Machine Learning',
    title: 'AI & Deep Learning Systems',
    desc: 'Deep learning architectures, generative adversarial networks (GANs), audio digital signal processing (DSP), and natural language embeddings.',
    count: '03 Featured Projects',
    accent: '#3A4B56',
    projects: [
      {
        icon: '🎨',
        iconBg: '#2C1F33',
        num: '01 / 03',
        category: 'Deep Learning · Computer Vision',
        title: 'Automatic Comic GAN',
        sub: 'Deep Learning Storyboard Generator · Free on GitHub',
        desc: 'Generative Adversarial Network pipeline built with PyTorch to automatically synthesize sequential comic panels and visual narrative storyboards from written textual prompts.',
        tags: ['PyTorch', 'DCGAN', 'Computer Vision', 'Neural Networks', 'Python'],
        gitLink: 'https://github.com/kaushalboii/Automatic-Comic-Generation-using-GAN',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source Repository',
        screenBg: 'radial-gradient(circle at 50% 20%, #301f38 0%, #140b19 80%)',
        mockupContent: `
          <div class="mockup-gan">
            <div class="gan-prompt">
              <span>Prompt: "Hero standing on rooftop neon rain"</span>
            </div>
            <div class="gan-grid">
              <div class="gan-panel"><div class="gan-thumb g1"></div><span>Panel 1</span></div>
              <div class="gan-panel"><div class="gan-thumb g2"></div><span>Panel 2</span></div>
            </div>
            <div class="gan-metrics">
              <span>Generator Loss: 0.041</span>
              <span class="gan-tag">Epoch 180</span>
            </div>
          </div>
        `
      },
      {
        icon: '🧬',
        iconBg: '#1B2E33',
        num: '02 / 03',
        category: 'Audio DSP · Neural Synthesis',
        title: 'ZenLife Audio Synthesis Backend',
        sub: 'Binaural DSP & Audio Synthesis Engine · Free on GitHub',
        desc: 'Backend algorithmic audio engine that dynamically generates harmonic acoustic waves, binaural beats, and pink noise soundscapes tailored to user heart rate and mood input.',
        tags: ['Python', 'FastAPI', 'DSP', 'NumPy', 'Binaural Audio', 'Free & Open Source'],
        gitLink: 'https://github.com/kaushalboii/zenlife-backend',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source Repository',
        screenBg: 'radial-gradient(circle at 50% 20%, #1b3036 0%, #0b1518 80%)',
        mockupContent: `
          <div class="mockup-dsp">
            <div class="dsp-header">
              <b>Harmonic Audio DSP Engine</b>
              <span class="dsp-pill">48 kHz · 24-bit</span>
            </div>
            <div class="dsp-spectrogram">
              <div class="spec-bar s1"></div><div class="spec-bar s2"></div><div class="spec-bar s3"></div><div class="spec-bar s4"></div><div class="spec-bar s5"></div>
            </div>
            <div class="dsp-controls">
              <span>Binaural Beat: 8.0 Hz (Theta)</span>
              <div class="dsp-slider"><div class="dsp-fill" style="width:72%"></div></div>
            </div>
          </div>
        `
      },
      {
        icon: '🧠',
        iconBg: '#272F1F',
        num: '03 / 03',
        category: 'NLP · Educational Tech',
        title: 'Personalized Learning Paths',
        sub: 'Adaptive Educational Path Recommendation System',
        desc: 'Natural language processing model that assesses student knowledge gaps and constructs dynamic, non-linear study curricula with optimal spaced repetition intervals.',
        tags: ['Python', 'NLP', 'Embeddings', 'Cosine Similarity', 'SIMATS Research'],
        gitLink: 'https://github.com/kaushalboii',
        gitText: 'View on GitHub ↗',
        note: 'SIMATS IT Research Project',
        screenBg: 'radial-gradient(circle at 50% 20%, #28331e 0%, #10160b 80%)',
        mockupContent: `
          <div class="mockup-nlp">
            <div class="nlp-target">
              <b>Curriculum Knowledge Graph</b>
              <span>Mastery: 88.5%</span>
            </div>
            <div class="nlp-nodes">
              <span class="node-done">Algorithms ✓</span>
              <span class="node-curr">System Design ●</span>
              <span class="node-next">Distributed DBs ◌</span>
            </div>
            <div class="nlp-card">
              <span>Next Recommended Session:</span>
              <b>High-Throughput Message Queues</b>
            </div>
          </div>
        `
      }
    ]
  },
  {
    id: 'ui',
    doorName: 'Door 04 · UI/UX & Web Design',
    title: 'Interactive Web & Design Systems',
    desc: 'Award-caliber digital interfaces, design tokens, micro-interactions, liquid canvas physics, and 3D WebGL scenes engineered for high engagement.',
    count: '03 Featured Projects',
    accent: '#7A8670',
    projects: [
      {
        icon: '🌐',
        iconBg: '#262F21',
        num: '01 / 03',
        category: 'Creative Engineering · WebGL',
        title: 'Crafted Interactive Portfolio',
        sub: 'Exact Motion Recreation of therishithakor.com · Free on GitHub',
        desc: 'High-precision creative engineering featuring real-time 3D desk calendar flip, liquid scratch canvas shader, Lenis smooth scrolling, and walk-through exhibition rooms.',
        tags: ['Vanilla JS', 'CSS 3D', 'Lenis', 'Canvas API', 'Web Animations API'],
        gitLink: 'https://github.com/kaushalboii/Kaushal-s-Portfolio',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source Repository',
        screenBg: 'radial-gradient(circle at 50% 20%, #253120 0%, #0e160b 80%)',
        mockupContent: `
          <div class="mockup-web">
            <div class="web-bar">
              <span class="web-dots"><i></i><i></i><i></i></span>
              <span class="web-url">kaushalboii.github.io</span>
            </div>
            <div class="web-preview">
              <span class="wp-title">Hi, I'm Kaushal.</span>
              <div class="wp-cal-pill">iOS Developer</div>
              <div class="wp-doors-mini">
                <span class="wp-d d1"></span><span class="wp-d d2"></span><span class="wp-d d3"></span>
              </div>
            </div>
          </div>
        `
      },
      {
        icon: '📐',
        iconBg: '#30261E',
        num: '02 / 03',
        category: 'UX Audit · Design Tokens',
        title: 'SIMATS Academic Portal Ergonomic Redesign',
        sub: 'Enterprise Campus Interface System',
        desc: 'Comprehensive UX audit and design overhaul for university student information systems, reducing grade lookup time by 64% with accessible thumb-zone navigation.',
        tags: ['Figma', 'Design Tokens', 'WCAG AAA', 'Information Architecture'],
        gitLink: 'https://github.com/kaushalboii',
        gitText: 'View on GitHub ↗',
        note: 'Enterprise Campus Case Study',
        screenBg: 'radial-gradient(circle at 50% 20%, #33261c 0%, #160e0a 80%)',
        mockupContent: `
          <div class="mockup-portal">
            <div class="portal-card">
              <span>Attendance Rate</span>
              <b>94.8%</b>
              <div class="pbar"><div class="pfill" style="width:94.8%"></div></div>
            </div>
            <div class="portal-grid">
              <div class="pnode"><b>4.0 / 4.0</b><span>Term GPA</span></div>
              <div class="pnode"><b>0 Backlogs</b><span>Status: Clear</span></div>
            </div>
          </div>
        `
      },
      {
        icon: '🪟',
        iconBg: '#212433',
        num: '03 / 03',
        category: 'Design Systems · Tokens',
        title: 'Dark Mode & Glassmorphic Token System',
        sub: 'Reusable Multi-Platform Token System',
        desc: 'Cross-platform design tokens supporting native iOS, Android Material 3, and CSS variables for high-contrast dark mode with zero color bleed.',
        tags: ['Design Tokens', 'CSS Custom Properties', 'Style Dictionary', 'Figma'],
        gitLink: 'https://github.com/kaushalboii',
        gitText: 'View on GitHub ↗',
        note: 'Design Systems Architecture',
        screenBg: 'radial-gradient(circle at 50% 20%, #202436 0%, #0d0f19 80%)',
        mockupContent: `
          <div class="mockup-tokens">
            <div class="token-row">
              <span class="swatch s-bg"></span><b>--bg: #1A1818</b>
            </div>
            <div class="token-row">
              <span class="swatch s-card"></span><b>--card: #232020</b>
            </div>
            <div class="token-row">
              <span class="swatch s-acc"></span><b>--accent: #D9C6C6</b>
            </div>
            <div class="token-check"><span>WCAG Contrast: 11.4:1 AAA</span></div>
          </div>
        `
      }
    ]
  },
  {
    id: 'backend',
    doorName: 'Door 05 · Backend Systems (Secret)',
    title: 'Backend Systems Architecture',
    desc: 'High-concurrency relational databases, secure RESTful APIs, token-based authentication, and resilient cloud synchronization engines.',
    count: '03 Featured Projects',
    accent: '#5B4A3A',
    projects: [
      {
        icon: '⚡',
        iconBg: '#30261C',
        num: '01 / 03',
        category: 'Distributed Systems · Cloud Sync',
        title: 'ZenLife Cloud Sync & Delta Engine',
        sub: 'High-Performance PHP REST & MySQL Sync Engine',
        desc: 'Low-latency sync engine delivering sub-50ms mood session syncing between iOS CoreData and cloud MySQL databases with conflict resolution and cryptographic payload hashing.',
        tags: ['PHP 8', 'MySQL', 'RESTful APIs', 'JWT Auth', 'ETag Caching'],
        gitLink: 'https://github.com/kaushalboii/zenlife-backend',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source Repository',
        screenBg: 'radial-gradient(circle at 50% 20%, #33271c 0%, #150f09 80%)',
        mockupContent: `
          <div class="mockup-sync">
            <div class="sync-card">
              <span class="sync-status live-pulse"><i></i>Cloud Sync Online</span>
              <b>MySQL Cluster · 38ms</b>
            </div>
            <div class="sync-log">
              <code>POST /api/v1/sessions/sync</code>
              <code>HTTP 200 OK · Delta: 0 conflict</code>
            </div>
            <div class="sync-stats">
              <span>Sync Success: 99.98%</span>
            </div>
          </div>
        `
      },
      {
        icon: '🗄️',
        iconBg: '#1D2D2A',
        num: '02 / 03',
        category: 'Database Optimization · Spatial Query',
        title: 'Vellore Ads Regional Query Optimization',
        sub: 'High-Density Relational Database Architecture',
        desc: 'Specialized indexing and spatial query partitioning allowing 100,000+ regional advertisements to be filtered by coordinates and categories in under 12 milliseconds.',
        tags: ['MySQL', 'Spatial Indexing', 'Query Profiling', 'Database Normalization'],
        gitLink: 'https://github.com/kaushalboii',
        gitText: 'View on GitHub ↗',
        note: 'Production MySQL Indexing Case Study',
        screenBg: 'radial-gradient(circle at 50% 20%, #1e312d 0%, #0c1614 80%)',
        mockupContent: `
          <div class="mockup-sql">
            <div class="sql-box">
              <code>EXPLAIN SELECT * FROM ads WHERE MBRContains(geom, POINT(?))</code>
              <span class="sql-time">Query Execution: 8.4 ms</span>
            </div>
            <div class="sql-idx">
              <span>Spatial R-Tree Index Scan</span>
              <b>Rows examined: 12 / 104,280</b>
            </div>
          </div>
        `
      },
      {
        icon: '🔒',
        iconBg: '#2D1F1F',
        num: '03 / 03',
        category: 'Cryptography · Security',
        title: 'Cryptographic Microservice for ClearVote',
        sub: 'Immutable Election Audit Trail Engine',
        desc: 'Zero-knowledge verification and SHA-256 chained ledger ensuring voter anonymity while providing verifiable end-to-end election audit proofs.',
        tags: ['Node.js', 'SHA-256 Chaining', 'Cryptography', 'Security Audit'],
        gitLink: 'https://github.com/kaushalboii/ClearVote',
        gitText: 'Free on GitHub ↗',
        note: '100% Free / Open Source Repository',
        screenBg: 'radial-gradient(circle at 50% 20%, #301f1f 0%, #140b0b 80%)',
        mockupContent: `
          <div class="mockup-crypto">
            <div class="crypto-card">
              <span class="crypto-shield">🔐</span>
              <b>Zero-Knowledge Audit Trail</b>
            </div>
            <div class="crypto-blocks">
              <div class="cblock">Block #4829</div>
              <div class="cblock">Block #4830</div>
            </div>
            <div class="crypto-hash">
              <span>Merkle Root: e3b0c44298fc1c149afb...</span>
            </div>
          </div>
        `
      }
    ]
  }
];

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
      door.style.transform = `rotateY(${-v * 72}deg)`;
      const spill = $('.spill', u);
      if (spill) spill.style.opacity = String(Math.min(1, v * 1.5));
    });
    return { u, way, door, s };
  });

  const INFO = [
    ['iOS Development', 'Swift, SwiftUI & App Store Ecosystem', ['ZenLife — Sound-Based Stress Relief (App Store)', 'Viana 360 — Real-Time Systems Telemetry (App Store)', 'Viana Buy — Everyday Essentials & Commerce (App Store)', 'CleanYourMacKeyboard — Free macOS App on GitHub', 'CoreData, Audio Engine & Liquid Micro-interactions']],
    ['Android Development', 'Kotlin, Jetpack Compose & Clean Architecture', ['Vellore Ads — Commercial Listing Platform (Play Store)', 'Indian Law Reference Suite — 11 Indian Languages (Free)', 'ClearVote — Cryptographically Audited Voting (Free)', 'ROOM SQLite, Coroutines & Material 3', 'Scalable Device Compatibility & Performance']],
    ['AI & Machine Learning', 'Neural Networks & DSP Synthesis', ['Automatic Comic Generator with DCGAN (PyTorch)', 'ZenLife Acoustic AI & Binaural DSP Engine (Python)', 'Personalized Learning Paths via NLP & Embeddings', 'Algorithmic Optimization & Vector Search', 'SIMATS Engineering Research Projects']],
    ['UI/UX Design', 'Ergonomics, Micro-interactions & Design Tokens', ['Crafted Interactive Portfolio with 3D Motion', 'Figma Component Libraries & Design Tokens', 'SIMATS Academic Portal Ergonomic Redesign', 'High-contrast Dark Mode & Glassmorphism Tokens', 'Fluid Canvas Shader Physics & WCAG AAA Standards']],
    ['Backend & Systems', 'Scalable APIs, Databases & Cloud Sync', ['ZenLife Cloud Sync & Delta Engine (PHP 8 / MySQL)', 'Vellore Ads Regional Query Spatial Optimization', 'Cryptographic Ledger Microservice for ClearVote', 'Token Authentication & Conflict Resolution', 'Automated Production Build & Continuous Delivery']]
  ];

  const setInfo = i => {
    if (!dinfo || !INFO[i]) return;
    dinfo.querySelector('.dinfo__h').textContent = INFO[i][0];
    dinfo.querySelector('.dinfo__t').textContent = INFO[i][1];
    dinfo.querySelector('.dinfo__p').innerHTML = INFO[i][2].map(s => `<li>${s}</li>`).join('');
  };

  // Cursor Badge Tracking
  let badgeOver = false;
  const placeBadge = e => {
    if (!badge) return;
    badge.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  };
  const showBadge = on => {
    badgeOver = on;
    badge?.classList.toggle('on', on);
  };

  if (canHover) {
    window.addEventListener('pointermove', e => { if (badgeOver) placeBadge(e); }, { passive: true });
    units.forEach(u => {
      const w = $('.doorway', u);
      w.addEventListener('pointerenter', e => { placeBadge(e); if (!busy) showBadge(true); });
      w.addEventListener('pointerleave', () => showBadge(false));
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
    dinfo.style.left = `${Math.max(16, left)}px`;
    dinfo.style.top = `${r.top - wr.top + 20}px`;
    dinfo.style.textAlign = rightSide ? 'right' : 'left';
    setInfo(i);
    dinfo.classList.add('on');
  };

  const hideDoorInfo = () => {
    units.forEach(u => u.classList.remove('on'));
    sec.classList.remove('focus');
    dinfo?.classList.remove('on');
  };

  if (canHover) {
    doorsState.forEach((d, i) => {
      d.way = $('.doorway', d.u);
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
      d.way.addEventListener('click', () => enterRoom(i));
    });
  } else {
    doorsState.forEach((d, i) => {
      d.way = $('.doorway', d.u);
      d.way.addEventListener('click', () => enterRoom(i));
    });
  }

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
    if (mRow) mRow.style.transform = `translate3d(${(-mCur * step).toFixed(2)}px,0,0)`;
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

    const d = doorsState[i];
    doorsState.forEach((o, k) => { if (k !== i) o.s.set(0); });

    // 1. Lever presses down
    d.u.classList.add('press');
    setTimeout(() => d.u.classList.remove('press'), 360);

    // 2. Door swings open wide into the room
    setTimeout(() => d.s.set(1), reduced ? 0 : 160);

    // 3. Zoom straight into the doorway gap
    setTimeout(() => {
      const u = units[i];
      const r = $('.opening', u).getBoundingClientRect();
      const dr = $('.door', u).getBoundingClientRect();
      const gapL = Math.min(Math.max(dr.right, r.left), r.right - 6);
      const gw = Math.max(r.right - gapL, 10), gh = r.height;
      const cx = (gapL + r.right) / 2, cy = r.top + gh * 0.5;
      const tx = window.innerWidth / 2 - cx, ty = window.innerHeight / 2 - cy;
      const sEnd = Math.max(window.innerWidth / gw, window.innerHeight / gh) * 1.18;

      stopScroll();
      $('#cord')?.classList.add('away');
      $('.hdr')?.classList.add('away');

      const sr = sec.getBoundingClientRect();
      sec.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`;
      sec.classList.add('through');

      const t0 = performance.now(), D = reduced ? 1 : 1100;
      const ease = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      const zoomOf = e => Math.exp(Math.log(sEnd) * e);

      let handed = false;
      const step = now => {
        const p = Math.min(1, (now - t0) / D), e = ease(p), sc = zoomOf(e);
        const f = Math.min(1, e * 1.6);
        sec.style.transform = `translate(${tx * f}px, ${ty * f}px) scale(${sc})`;

        if (!handed && (sc >= sEnd / 1.15 || p >= 1)) {
          handed = true;
          renderRoomContent(i);
        }
        if (p < 1) walkRaf = requestAnimationFrame(step);
      };
      walkRaf = requestAnimationFrame(step);
    }, reduced ? 0 : 500);
  }

  function renderRoomContent(i) {
    const data = ROOMS_DATA[i];
    if (!data || !roomv) return;
    inRoom = true;

    roomvDoor.textContent = data.doorName;
    roomvTitle.textContent = data.title;
    roomvDesc.textContent = data.desc;
    roomvCount.textContent = data.count;

    roomvStack.innerHTML = data.projects.map((p, idx) => `
      <article class="card ${idx % 2 === 1 ? 'flip' : ''}" style="--i:${idx}" aria-labelledby="p${i}_${idx}">
        <div class="card__in">
          <div class="card__info">
            <div class="app">
              <div class="app__icon" style="background:${p.iconBg}">${p.icon}</div>
              <p class="card__meta"><span class="no">${p.num}</span><i></i><span>${p.category}</span></p>
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
            <span class="note">${p.note}</span>
          </div>

          <div class="stage" aria-hidden="true">
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
                  ${p.mockupContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    `).join('');

    roomv.scrollTop = 0;
    roomv.hidden = false;
    requestAnimationFrame(() => {
      roomv.classList.add('lit');
    });
  }

  function leaveRoom() {
    if (!inRoom) return;
    inRoom = false;
    roomv.classList.remove('lit');

    setTimeout(() => {
      roomv.hidden = true;
      cancelAnimationFrame(walkRaf);

      const from = sec.style.transform;
      const m = /translate\(([-\d.]+)px, ([-\d.]+)px\) scale\(([\d.]+)\)/.exec(from) || [0, 0, 0, 1];
      const X = +m[1], Y = +m[2], S = +m[3];
      const t0 = performance.now(), D = reduced ? 1 : 1000;
      const ease = x => 1 - Math.pow(1 - x, 3);

      const stepBack = now => {
        const p = Math.min(1, (now - t0) / D), e = ease(p);
        const sc = Math.exp(Math.log(S) * (1 - e));
        sec.style.transform = `translate(${X * (1 - e)}px, ${Y * (1 - e)}px) scale(${sc})`;

        if (p < 1) requestAnimationFrame(stepBack);
        else {
          sec.style.transform = '';
          sec.classList.remove('through');
          doorsState[currentRoomIdx].s.set(0);
          $('#cord')?.classList.remove('away');
          $('.hdr')?.classList.remove('away');
          busy = false;
          startScroll();
        }
      };
      requestAnimationFrame(stepBack);
    }, reduced ? 0 : 250);
  }

  roomvBack?.addEventListener('click', leaveRoom);
  roomvBackBottom?.addEventListener('click', leaveRoom);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && inRoom) leaveRoom(); });

  window.openDoor = i => {
    if (busy || inRoom) return;
    if (i === SECRET) {
      revealSecretDoor(true);
      setTimeout(() => enterRoom(i), 700);
    } else {
      enterRoom(i);
    }
  };

  $$('[data-door]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const d = parseInt(btn.dataset.door, 10);
      if (!isNaN(d)) window.openDoor(d);
    });
  });
})();

// ─── STORY TIMELINE & COUNTERS ───
(() => {
  const nums = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const dur = 1400;
        const start = performance.now();

        function tick(now) {
          const p = Math.min(1, (now - start) / dur);
          const ease = 1 - Math.pow(1 - p, 3);
          const val = target * ease;
          el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target + suffix;
        }
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.3 });
    nums.forEach(n => io.observe(n));
  }
})();

// ─── CONTACT MODAL (#modal) ───
(() => {
  const modal = $('#modal'), openBtn = $('#contactOpen'), closeBtn = $('#modalClose');
  const form = $('#contactForm'), sent = $('#contactSent'), resetBtn = $('#contactReset');
  if (!modal) return;

  function open() {
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('on'));
    stopScroll();
  }

  function close() {
    modal.classList.remove('on');
    setTimeout(() => { modal.hidden = true; startScroll(); }, 350);
  }

  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });

  form?.addEventListener('submit', e => {
    e.preventDefault();
    form.hidden = true;
    if (sent) sent.hidden = false;
  });

  resetBtn?.addEventListener('click', () => {
    form?.reset();
    if (form) form.hidden = false;
    if (sent) sent.hidden = true;
  });
})();

// ─── INITIALIZATION & READY DISPATCH ───
window.addEventListener('DOMContentLoaded', () => {
  const fig = $('#fig'), figCanvas = $('#figCanvas');
  if (fig && figCanvas) {
    liquidReveal(fig, figCanvas, 'assets/kaushal-opt.png');
  }

  // Fade out loader & signal intro ready
  const loader = $('#loader');
  setTimeout(() => {
    if (loader) {
      loader.classList.add('out');
      setTimeout(() => loader.remove(), 800);
    }
    document.body.classList.add('ready');
    window.dispatchEvent(new CustomEvent('intro:ready'));
  }, 900);
});
