/* ══════════════════════════════════════════════════════════════
   KAUSHAL MARAN PORTFOLIO — COMPLETE ENGINE
   Exact Recreation & Mechanics from therishithakor.com
   ══════════════════════════════════════════════════════════════ */

import Lenis from 'lenis';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
const root = document.documentElement;

// ─── EXHIBITION ROOM DATA (DOORS) ───
const ROOMS_DATA = [
  {
    id: 'ios',
    doorName: 'Door 01 · iOS Development',
    title: 'iOS Native Ecosystem',
    desc: 'High-performance native iOS applications built with Swift, SwiftUI, Combine, and CoreData. Designed with Apple Human Interface Guidelines and fluid micro-interactions.',
    count: '03 Featured Projects',
    accent: '#6B5C5C',
    projects: [
      {
        icon: '🧘',
        num: '01',
        title: 'ZENLIFE',
        sub: 'Sound-Based Stress Relief App · Apple App Store',
        desc: 'Delivers calming, mood-tailored acoustic soundscapes. Features real-time mood logging, psychometric analytics, local CoreData persistence, and secure PHP/MySQL cloud sync.',
        tags: ['SwiftUI', 'CoreData', 'AVAudioEngine', 'MySQL', 'PHP REST'],
        link: 'https://apps.apple.com/in/app/zenlife-stress-sound-relief/id6753105286',
        linkText: 'View on App Store ↗',
        theme: 'radial-gradient(circle at 50% 25%, #2d242a 0%, #151114 80%)',
        uiTitle: 'ZenLife Audio',
        uiStatus: 'Active Session · 432 Hz'
      },
      {
        icon: '📡',
        num: '02',
        title: 'Viana 360',
        sub: 'Real-Time Monitoring & Telemetry · Apple App Store',
        desc: 'Enterprise telemetry monitoring application providing comprehensive 360-degree data visualization, real-time alert notifications, and multi-sensor dashboard analytics.',
        tags: ['iOS', 'Swift', 'Real-time Telemetry', 'Custom Charts', 'Combine'],
        link: 'https://apps.apple.com/in/app/viana-360/id6760163659',
        linkText: 'View on App Store ↗',
        theme: 'radial-gradient(circle at 50% 25%, #242838 0%, #0f121d 80%)',
        uiTitle: 'Telemetry Viana',
        uiStatus: 'Sensors 100% · Live'
      },
      {
        icon: '🛍️',
        num: '03',
        title: 'Viana Buy',
        sub: 'Everyday Essentials & Commerce · Apple App Store',
        desc: 'An all-in-one iOS lifestyle platform designed to streamline everyday grocery and product purchases. Combines daily essentials, product shopping, and local services into an intuitive, high-performance checkout experience.',
        tags: ['iOS', 'SwiftUI', 'REST APIs', 'E-Commerce', 'Order Tracking'],
        link: 'https://apps.apple.com/in/app/viana-buy/id6772468488',
        linkText: 'View on App Store ↗',
        theme: 'radial-gradient(circle at 50% 25%, #2d2a24 0%, #171510 80%)',
        uiTitle: 'Viana Commerce',
        uiStatus: 'Instant Delivery · Vellore'
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
        num: '01',
        title: 'Vellore Ads',
        sub: 'Commercial Listing Platform · Google Play Store',
        desc: 'Multi-city advertising and commercial listing directory. Features instant location filters, high-density listing catalogues, verified merchant profiles, and region-specific ad management.',
        tags: ['Kotlin', 'Jetpack Compose', 'MySQL', 'PHP REST APIs', 'Material 3'],
        link: 'https://play.google.com/store/apps/details?id=com.velloreads.app&hl=en_IN',
        linkText: 'Get on Google Play ↗',
        theme: 'radial-gradient(circle at 50% 25%, #34222c 0%, #180f14 80%)',
        uiTitle: 'Vellore Ads Live',
        uiStatus: '10,000+ Listings Active'
      },
      {
        icon: '⚖️',
        num: '02',
        title: 'Indian Law Reference Suite',
        sub: '11 Indian Languages · Complete Legal Statutes',
        desc: 'Comprehensive offline statutory reference suite containing Bharatiya Nyaya Sanhita (BNS), BNSS, BSA, IPC, CrPC, and the Constitution of India in 11 Indian languages with instantaneous FTS5 search.',
        tags: ['Kotlin', 'SQLite FTS5', 'Multi-Lingual', 'Material Design', 'Offline'],
        link: 'https://github.com/kaushalboii/Indian-Law-Bilingual-Pocket-Reference-App',
        linkText: 'View Repository ↗',
        theme: 'radial-gradient(circle at 50% 25%, #28332a 0%, #101811 80%)',
        uiTitle: 'Law Suite · 11 Langs',
        uiStatus: 'Offline FTS Index Ready'
      },
      {
        icon: '🗳️',
        num: '03',
        title: 'Election 2026',
        sub: 'Public Information Architecture · Real-Time Updates',
        desc: 'High-density election reporting and constituency data architecture designed for peak concurrent traffic during public election cycles.',
        tags: ['Kotlin', 'Jetpack Compose', 'RESTful APIs', 'GeoJSON', 'Architecture'],
        link: 'https://github.com/kaushalboii',
        linkText: 'Explore System ↗',
        theme: 'radial-gradient(circle at 50% 25%, #362620 0%, #1b120f 80%)',
        uiTitle: 'Election 2026 Telemetry',
        uiStatus: '234 Constituencies Synced'
      }
    ]
  },
  {
    id: 'uiux',
    doorName: 'Door 03 · UI/UX Design',
    title: 'Interface Design & Ergonomics',
    desc: 'Research-first design systems, thumb-zone mobile ergonomics, high-contrast dark palettes, and spring-physics micro-interactions.',
    count: '03 Design Studies',
    accent: '#7A8670',
    projects: [
      {
        icon: '🎨',
        num: '01',
        title: 'ZenLife & Viana Design Tokens',
        sub: 'Comprehensive Figma Token Hierarchy & Ergonomics',
        desc: 'End-to-end design token hierarchy covering typographic scales, accessible contrast ratios, glassmorphism translucency, and thumb-zone ergonomics for multi-app ecosystems.',
        tags: ['Figma', 'Design Tokens', 'Thumb-Zone', 'Micro-Interactions'],
        link: 'https://github.com/kaushalboii',
        linkText: 'View Design Specs ↗',
        theme: 'radial-gradient(circle at 50% 25%, #2a3528 0%, #121811 80%)',
        uiTitle: 'Token System v2.4',
        uiStatus: 'WCAG AAA Compliant'
      },
      {
        icon: '⚡',
        num: '02',
        title: 'Liquid Motion Physics',
        sub: 'Spring-Damped Harmonic Touch Interfaces',
        desc: 'Natural finger-tracking transitions, spring physics gesture interactions, and haptic feedback design for native mobile applications.',
        tags: ['Spring Physics', 'Ergonomics', 'Interaction Design', 'Haptics'],
        link: 'https://github.com/kaushalboii',
        linkText: 'Motion Lab ↗',
        theme: 'radial-gradient(circle at 50% 25%, #382c38 0%, #1a121a 80%)',
        uiTitle: 'Spring Engine 120Hz',
        uiStatus: 'Zero Latency Response'
      },
      {
        icon: '🌓',
        num: '03',
        title: 'Deep Charcoal Dark Mode',
        sub: 'Optical Contrast & Halation Prevention',
        desc: 'Cohesive light-paper and deep-charcoal palette pairings designed to prevent optical halation while maintaining contrast standards across OLED displays.',
        tags: ['Color Theory', 'Dark Mode', 'Glassmorphism', 'Design Tokens'],
        link: 'https://github.com/kaushalboii',
        linkText: 'Palette Guide ↗',
        theme: 'radial-gradient(circle at 50% 25%, #252426 0%, #0e0e10 80%)',
        uiTitle: 'Charcoal Tokens',
        uiStatus: 'Pure OLED Neutral'
      }
    ]
  },
  {
    id: 'aiml',
    doorName: 'Door 04 · AI & Machine Learning',
    title: 'Artificial Intelligence & Neural Nets',
    desc: 'Deep generative models, natural language processing pipelines, knowledge graph recommendation systems, and on-device neural edge computing.',
    count: '03 Research Systems',
    accent: '#A4552C',
    projects: [
      {
        icon: '🤖',
        num: '01',
        title: 'Automatic Comic Generator',
        sub: 'Deep Generative Adversarial Networks (GANs)',
        desc: 'Generative Adversarial Network pipeline creating cohesive illustrated storyboards from unstructured natural language plot scripts.',
        tags: ['Python', 'PyTorch', 'GANs', 'Computer Vision', 'Generative AI'],
        link: 'https://github.com/kaushalboii/Automatic-Comic-Generation-using-GAN',
        linkText: 'View Research Code ↗',
        theme: 'radial-gradient(circle at 50% 25%, #3a2218 0%, #1c0e08 80%)',
        uiTitle: 'GAN Generator v3',
        uiStatus: 'Generator Loss 0.042'
      },
      {
        icon: '🧠',
        num: '02',
        title: 'AI Personalized Learning Paths',
        sub: 'Knowledge Graphs & NLP Competency Mapping',
        desc: 'Graph neural network and NLP embedding pipeline tailoring technical curricula to student competency profiles in real-time.',
        tags: ['NLP', 'Embeddings', 'Knowledge Graphs', 'Python', 'SIMATS'],
        link: 'https://github.com/kaushalboii',
        linkText: 'View Architecture ↗',
        theme: 'radial-gradient(circle at 50% 25%, #362a1c 0%, #19120a 80%)',
        uiTitle: 'Curriculum Neural Map',
        uiStatus: 'Adaptive Pathways Active'
      },
      {
        icon: '⚡',
        num: '03',
        title: 'Edge Neural Inference',
        sub: 'Quantized Mobile Neural Execution',
        desc: 'Quantized neural network models optimized for sub-10ms inference latency on mobile hardware using CoreML and TensorFlow Lite.',
        tags: ['CoreML', 'TFLite', 'Quantization', 'Edge AI', 'Swift'],
        link: 'https://github.com/kaushalboii',
        linkText: 'Edge Benchmark ↗',
        theme: 'radial-gradient(circle at 50% 25%, #32252c 0%, #181015 80%)',
        uiTitle: 'CoreML Engine',
        uiStatus: '8.4ms Inference Time'
      }
    ]
  },
  {
    id: 'backend',
    doorName: 'Door 05 · Backend Systems (Secret)',
    title: 'Scalable Systems & Distributed APIs',
    desc: 'High-concurrency MySQL schemas, stateless JWT REST APIs in PHP, delta synchronization engines, and low-latency cloud infrastructure.',
    count: '03 Systems Architectures',
    accent: '#262523',
    projects: [
      {
        icon: '🗄️',
        num: '01',
        title: 'High-Concurrency MySQL Architecture',
        sub: 'Sub-5ms Query Latency & Index Optimization',
        desc: 'Low-latency database schemas powering multi-tenant directories with sub-5ms indexed query latency under heavy read and write load.',
        tags: ['MySQL', 'Indexing', 'Query Optimization', 'Relational Schemas'],
        link: 'https://github.com/kaushalboii',
        linkText: 'Database Schemas ↗',
        theme: 'radial-gradient(circle at 50% 25%, #242426 0%, #0d0d0f 80%)',
        uiTitle: 'MySQL Engine v8.0',
        uiStatus: 'Sub-5ms Latency'
      },
      {
        icon: '🔒',
        num: '02',
        title: 'Secure Token RESTful Services',
        sub: 'High-Throughput PHP 8 API Services',
        desc: 'High-throughput REST API services supporting thousands of daily mobile requests with JWT token authentication, rate limiting, and structured payloads.',
        tags: ['PHP 8', 'REST APIs', 'JWT Auth', 'Rate Limiting', 'Security'],
        link: 'https://github.com/kaushalboii',
        linkText: 'API Gateway ↗',
        theme: 'radial-gradient(circle at 50% 25%, #282522 0%, #11100e 80%)',
        uiTitle: 'PHP REST Endpoints',
        uiStatus: '99.98% Uptime'
      },
      {
        icon: '🔄',
        num: '03',
        title: 'Offline Sync & Delta Engine',
        sub: 'Conflict-Free Distributed Mobile State',
        desc: 'Robust sync engine enabling seamless offline CRUD actions on mobile devices with deterministic server reconciliation.',
        tags: ['Delta Sync', 'Conflict Resolution', 'Caching', 'Cloud State'],
        link: 'https://github.com/kaushalboii',
        linkText: 'Sync Architecture ↗',
        theme: 'radial-gradient(circle at 50% 25%, #202626 0%, #0c1111 80%)',
        uiTitle: 'Delta Sync Protocol',
        uiStatus: 'Zero Conflict Loss'
      }
    ]
  }
];

// ─── SMOOTH SCROLL (LENIS) ───
let lenis = null;
if (!reduced) {
  lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    orientation: 'vertical'
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function stopScroll() { lenis?.stop(); }
function startScroll() { lenis?.start(); }

// ─── SPRING PHYSICS HELPER ───
function spring(cfg, onUpdate) {
  const tension = cfg.tension || 170, friction = cfg.friction || 26;
  let target = 0, current = 0, velocity = 0, rafId = 0, running = false;
  function step() {
    const fSpring = -tension * (current - target);
    const fDamper = -friction * velocity;
    const accel = fSpring + fDamper;
    velocity += accel * 0.016;
    current += velocity * 0.016;
    onUpdate(current);
    if (Math.abs(velocity) < 0.001 && Math.abs(current - target) < 0.001) {
      current = target;
      velocity = 0;
      onUpdate(current);
      running = false;
    } else {
      rafId = requestAnimationFrame(step);
    }
  }
  return {
    set(v) {
      target = v;
      if (!running) { running = true; rafId = requestAnimationFrame(step); }
    },
    stop() { cancelAnimationFrame(rafId); running = false; }
  };
}

// ─── LIVE VELLORE TIME & DATE ───
function updateClock() {
  const now = new Date();
  const timeOpts = { timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true };
  const dateOpts = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'long', year: 'numeric' };
  const dshortOpts = { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short' };

  const timeStr = new Intl.DateTimeFormat('en-US', timeOpts).format(now).toLowerCase().replace(' ', '');
  const dateStr = new Intl.DateTimeFormat('en-US', dateOpts).format(now);
  const dshortStr = new Intl.DateTimeFormat('en-US', dshortOpts).format(now);

  $$('[data-time]').forEach(el => el.textContent = timeStr);
  $$('[data-date]').forEach(el => el.textContent = dateStr);
  $$('[data-dshort]').forEach(el => el.textContent = dshortStr);
  $$('[data-ftime]').forEach(el => el.textContent = timeStr + ' IST');
  $$('[data-navtime]').forEach(el => el.textContent = ' ' + timeStr + ' IST');
}
updateClock();
setInterval(updateClock, 1000);

// ─── PAGE LOADER SEQUENCE ───
(() => {
  const loader = $('#loader'), countEl = $('#ldCount');
  if (!loader) { document.body.classList.add('ready'); return; }

  let count = 0;
  const start = performance.now(), duration = 1400;

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    count = Math.floor(ease * 100);
    loader.style.setProperty('--p', ease.toFixed(3));
    if (countEl) countEl.textContent = String(count).padStart(3, '0');

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      loader.classList.add('out');
      setTimeout(() => {
        document.body.classList.add('ready');
        window.dispatchEvent(new CustomEvent('intro:ready'));
      }, 350);
      setTimeout(() => loader.remove(), 1200);
    }
  }
  requestAnimationFrame(tick);
})();

// ─── THEME MODE SWITCH (LIGHT / CHARCOAL DARK) ───
const MODE_KEY = 'kaushal-mode';
function getMode() { return root.dataset.mode === 'dark' ? 'dark' : 'light'; }
function setMode(m, animate = true) {
  if (animate && !reduced && document.startViewTransition) {
    document.startViewTransition(() => setMode(m, false));
    return;
  }
  if (m === 'dark') root.dataset.mode = 'dark';
  else delete root.dataset.mode;
  try { localStorage.setItem(MODE_KEY, m); } catch (e) {}
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.content = m === 'dark' ? '#1A1818' : '#E8E4E0';
  const cordHit = $('#cordHit');
  if (cordHit) cordHit.setAttribute('aria-checked', m === 'dark' ? 'true' : 'false');
}

try {
  const saved = localStorage.getItem(MODE_KEY);
  if (saved) setMode(saved, false);
} catch (e) {}

// ─── VERLET PHYSICS PULL CORD ───
(() => {
  const cv = $('.cord__cv'), hit = $('#cordHit');
  if (!cv || !hit) return;
  const ctx = cv.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  let W = 0, H = 0;
  function resize() {
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
  }
  resize();
  window.addEventListener('resize', resize);

  const N = 9, segLen = 22;
  const pts = [];
  for (let i = 0; i < N; i++) {
    pts.push({ x: W - 40, y: 15 + i * segLen, oldX: W - 40, oldY: 15 + i * segLen });
  }

  let dragging = false, dragOffset = { x: 0, y: 0 };

  function verlet() {
    for (let i = 1; i < N; i++) {
      const p = pts[i];
      if (i === N - 1 && dragging) continue;
      const vx = (p.x - p.oldX) * 0.94;
      const vy = (p.y - p.oldY) * 0.94 + 0.35;
      p.oldX = p.x; p.oldY = p.y;
      p.x += vx; p.y += vy;
    }
    pts[0].x = W - 40; pts[0].y = 0;

    for (let iter = 0; iter < 4; iter++) {
      for (let i = 0; i < N - 1; i++) {
        const p1 = pts[i], p2 = pts[i + 1];
        const dx = p2.x - p1.x, dy = p2.y - p1.y;
        const dist = Math.hypot(dx, dy) || 1;
        const diff = (dist - segLen) / dist;
        if (i > 0) { p1.x += dx * 0.5 * diff; p1.y += dy * 0.5 * diff; }
        if (!(i + 1 === N - 1 && dragging)) {
          p2.x -= dx * 0.5 * diff; p2.y -= dy * 0.5 * diff;
        }
      }
    }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < N; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.strokeStyle = root.dataset.mode === 'dark' ? '#C4B0B0' : '#857878';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    const end = pts[N - 1];
    hit.style.transform = `translate(${end.x}px, ${end.y}px)`;

    ctx.save();
    ctx.translate(end.x, end.y);
    const grad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 14);
    grad.addColorStop(0, '#A68B7C');
    grad.addColorStop(0.4, '#6B5446');
    grad.addColorStop(1, '#382A22');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    verlet();
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  hit.addEventListener('pointerdown', e => {
    dragging = true;
    dragOffset.x = e.clientX - pts[N - 1].x;
    dragOffset.y = e.clientY - pts[N - 1].y;
    hit.setPointerCapture(e.pointerId);
  });
  window.addEventListener('pointermove', e => {
    if (!dragging) return;
    const end = pts[N - 1];
    end.x = Math.max(W - 120, Math.min(W - 10, e.clientX - dragOffset.x));
    end.y = Math.max(120, Math.min(380, e.clientY - dragOffset.y));
  });
  window.addEventListener('pointerup', e => {
    if (!dragging) return;
    dragging = false;
    if (pts[N - 1].y > 220) {
      setMode(getMode() === 'dark' ? 'light' : 'dark');
    }
  });
})();

// ─── 3D FLIP DESK CALENDAR (#cal) ───
(() => {
  const cal = $('#cal'); if (!cal) return;
  const ROLES = [
    ['01', 'iOS Developer'],
    ['02', 'Android Developer'],
    ['03', 'UI/UX Designer'],
    ['04', 'AI & ML Engineer'],
    ['05', 'Systems Architect']
  ];
  const leaf = $('.cal__leaf', cal), under = $('[data-under]', cal);
  const faceWord = $('.cal__face .cal__word', cal), faceNo = $('.cal__face .cal__no', cal);
  const underWord = $('.cal__word', under), underNo = $('.cal__no', under);

  let cur = 0;
  function paint(wordEl, noEl, idx) {
    if (wordEl) wordEl.textContent = ROLES[idx][1];
    if (noEl) noEl.textContent = ROLES[idx][0];
  }

  paint(faceWord, faceNo, 0);
  paint(underWord, underNo, 1);

  let flipping = false;
  function flipNext() {
    if (flipping || reduced) return;
    flipping = true;
    const nextIdx = (cur + 1) % ROLES.length;
    paint(underWord, underNo, nextIdx);

    leaf.style.transition = 'transform .85s cubic-bezier(.22, 1, .36, 1)';
    leaf.style.transform = 'rotateX(-180deg)';

    setTimeout(() => {
      cur = nextIdx;
      paint(faceWord, faceNo, cur);
      leaf.style.transition = 'none';
      leaf.style.transform = 'rotateX(0deg)';
      paint(underWord, underNo, (cur + 1) % ROLES.length);
      flipping = false;
    }, 870);
  }

  let timer = setInterval(flipNext, 3400);
  cal.addEventListener('mouseenter', () => clearInterval(timer));
  cal.addEventListener('mouseleave', () => { clearInterval(timer); timer = setInterval(flipNext, 3400); });
})();

// ─── HERO PORTRAIT LIQUID REVEAL ───
function liquidReveal(stage, canvas, afterSrc, { brushRadius = 140, decay = 0.016 } = {}) {
  if (reduced) { canvas?.remove(); return; }
  const base = stage.querySelector('img');
  if (!base || !canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const mk = () => { const c = document.createElement('canvas'); return [c, c.getContext('2d')]; };
  const [bwC, bwX] = mk(), [colC, colX] = mk(), [mask, mX] = mk(), [tmp, tX] = mk();
  const bwImg = new Image(), colImg = new Image();
  bwImg.src = base.currentSrc || base.src;
  colImg.src = afterSrc;

  let W = 1, H = 1, radius = brushRadius * dpr;
  const points = [];
  let last = null, idle = 999, running = false, showing = false;

  function fitDraw(x, img) {
    x.clearRect(0, 0, W, H);
    if (!img.naturalWidth) return;
    const s = Math.min(W / img.naturalWidth, H / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    x.drawImage(img, (W - dw) / 2, H - dh, dw, dh);
  }

  function measure() {
    const r = stage.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width * dpr));
    H = Math.max(1, Math.round(r.height * dpr));
    for (const c of [canvas, bwC, colC, mask, tmp]) { c.width = W; c.height = H; }
    radius = brushRadius * dpr;
    fitDraw(bwX, bwImg);
    fitDraw(colX, colImg);
    hide();
  }

  bwImg.onload = () => fitDraw(bwX, bwImg);
  colImg.onload = () => fitDraw(colX, colImg);

  function stamp(x, y) {
    const g = mX.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.55, 'rgba(255,255,255,.82)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    mX.globalCompositeOperation = 'source-over';
    mX.fillStyle = g;
    mX.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function render() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(bwC, 0, 0);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(mask, 0, 0);
    tX.globalCompositeOperation = 'source-over';
    tX.clearRect(0, 0, W, H);
    tX.drawImage(colC, 0, 0);
    tX.globalCompositeOperation = 'destination-in';
    tX.drawImage(mask, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(tmp, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
  }

  function show() {
    if (!showing) { showing = true; render(); base.style.visibility = 'hidden'; }
  }

  function hide() {
    showing = false;
    base.style.visibility = '';
    ctx.clearRect(0, 0, W, H);
    mX.clearRect(0, 0, W, H);
  }

  function frame() {
    const drawing = points.length > 0;
    if (drawing) idle = 0; else idle++;
    if (idle >= 120) { hide(); running = false; return; }
    const fade = drawing ? decay : Math.min(decay + idle * 0.004, 0.5);
    mX.globalCompositeOperation = 'destination-out';
    mX.fillStyle = `rgba(0,0,0,${fade})`;
    mX.fillRect(0, 0, W, H);
    if (drawing) {
      for (const p of points) stamp(p.x, p.y);
      points.length = 0;
    }
    render();
    show();
    requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', e => {
    if (!colImg.naturalWidth || !bwImg.naturalWidth) return;
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr;
    if (x < -radius || y < -radius || x > W + radius || y > H + radius) { last = null; return; }
    if (last) {
      const dx = x - last.x, dy = y - last.y, dist = Math.hypot(dx, dy);
      const step = Math.max(radius * 0.3, 1), n = Math.min(Math.ceil(dist / step), 60);
      for (let i = 1; i <= n; i++) points.push({ x: last.x + dx * i / n, y: last.y + dy * i / n });
    } else {
      points.push({ x, y });
    }
    last = { x, y };
    if (!running) { running = true; idle = 0; requestAnimationFrame(frame); }
  }, { passive: true });

  new ResizeObserver(measure).observe(stage);
  measure();
}

const COLOUR_SRC = 'assets/kaushal-opt.png';
const figEl = $('#fig'), figCanvasEl = $('#figCanvas');
if (figEl && figCanvasEl && canHover) {
  liquidReveal(figEl, figCanvasEl, COLOUR_SRC);
}

// ─── 3D DOORS SYSTEM & WALK-THROUGH EXQUISITE ROOM ───
(() => {
  const sec = $('#works'); if (!sec) return;
  const units = $$('.unit', sec);
  const dinfo = $('#dinfo'), wallEl = $('.doors__wall', sec);
  const badge = $('#doorCursor');
  const roomv = $('#roomv'), roomvGlow = $('#roomvGlow');
  const roomvDoor = $('#roomvDoor'), roomvTitle = $('#roomvTitle'), roomvDesc = $('#roomvDesc'), roomvCount = $('#roomvCount');
  const roomvStack = $('#roomvStack'), roomvBack = $('#roomvBack');

  const doorsState = units.map(u => {
    const way = $('.doorway', u), door = $('.door', u);
    const s = spring({ tension: 260, friction: 24 }, v => {
      door.style.transform = `rotateY(${-v * 80}deg)`;
      const spill = $('.spill', u);
      if (spill) spill.style.opacity = String(Math.min(1, v * 1.5));
    });
    return { u, way, door, s };
  });

  const INFO = [
    ['iOS Development', 'Swift, SwiftUI & App Store Ecosystem', ['ZenLife — Sound-Based Stress Relief (App Store)', 'Viana 360 — Real-Time Systems Telemetry (App Store)', 'Viana Buy — Everyday Essentials & Commerce (App Store)', 'CoreData, Audio Engine & Offline Sync', 'Human Interface Guidelines & Liquid Motion']],
    ['Android Development', 'Kotlin, Jetpack Compose & Clean Architecture', ['Vellore Ads — Commercial Listing Platform (Play Store)', 'Indian Law Reference Suite — 11 Indian Languages', 'Election 2026 — Public Information Architecture', 'ROOM SQLite, Coroutines & Material 3', 'Scalable Device Compatibility & Performance']],
    ['UI/UX Design', 'Ergonomics, Micro-interactions & Design Tokens', ['Figma component libraries & design systems', 'Thumb-zone accessibility & fluid navigation', 'High-contrast dark mode & glassmorphism tokens', 'Native-Web Hybrid bridges (WKWebView)', 'Interactive prototypes & motion physics']],
    ['AI & Machine Learning', 'Neural Networks & Content Automation', ['Automatic Comic Generator with GANs', 'AI-Driven Personalized Learning Paths (NLP)', 'Natural Language Processing & Embeddings', 'Python & algorithmic foundations', 'SIMATS Engineering research projects']],
    ['Backend & Systems', 'Scalable APIs, Databases & Cloud Sync', ['Relational database design in MySQL', 'RESTful backend services in PHP', 'Token auth & secure data exchange', 'API caching & payload optimization', 'Automated build delivery & deployment']]
  ];

  const setInfo = i => {
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
      w.addEventListener('pointerenter', e => { placeBadge(e); showBadge(true); });
      w.addEventListener('pointerleave', () => showBadge(false));
    });
  }

  // Hover Focus & Info Positioning
  let active = -1, token = 0, px = -1, py = -1, busy = false, inRoom = false;

  const showDoorInfo = i => {
    const my = ++token;
    units.forEach((u, k) => u.classList.toggle('on', k === i));
    sec.classList.add('focus');

    const visible = units.filter(u => getComputedStyle(u).visibility !== 'hidden');
    const vi = visible.indexOf(units[i]); if (vi < 0) return;
    const wr = wallEl.getBoundingClientRect(), r = units[i].getBoundingClientRect();
    const toRight = vi < 2 && visible[vi + 2];
    const a = toRight ? visible[vi + 1].getBoundingClientRect() : (visible[vi - 2] || visible[vi - 1]).getBoundingClientRect();
    const b = toRight ? visible[vi + 2].getBoundingClientRect() : visible[vi - 1].getBoundingClientRect();
    const left = Math.min(a.left, b.left), right = Math.max(a.right, b.right);

    const place = () => {
      if (my !== token || active !== i) return;
      setInfo(i);
      const w = Math.min(right - left, 22 * 16);
      dinfo.style.width = w + 'px';
      dinfo.style.left = (left - wr.left + (right - left - w) / 2) + 'px';
      dinfo.style.top = (r.top - wr.top + r.height * 0.5 - dinfo.offsetHeight / 2) + 'px';
      dinfo.classList.add('on');
    };
    if (dinfo.classList.contains('on')) {
      dinfo.classList.remove('on');
      setTimeout(place, 120);
    } else {
      place();
    }
  };

  const hideDoorInfo = () => {
    token++;
    sec.classList.remove('focus');
    units.forEach(u => u.classList.remove('on'));
    dinfo.classList.remove('on');
  };

  const setHover = i => {
    if (busy || inRoom) i = -1;
    if (i === active) return;
    active = i;
    if (i < 0) hideDoorInfo(); else showDoorInfo(i);
  };

  if (canHover) {
    units.forEach((d, i) => {
      d.way = $('.doorway', d);
      d.way.addEventListener('mouseenter', () => { if (!busy) doorsState[i].s.set(0.12); });
      d.way.addEventListener('mouseleave', () => { if (!busy) doorsState[i].s.set(0); });
      d.way.addEventListener('click', () => enterRoom(i));
    });

    const underDoor = el => {
      const w = el?.closest ? el.closest('.doorway') : null;
      return w ? units.findIndex(u => u.contains(w)) : -1;
    };
    window.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; setHover(underDoor(e.target)); }, { passive: true });
    window.addEventListener('scroll', () => { if (px >= 0) setHover(underDoor(document.elementFromPoint(px, py))); }, { passive: true });
  }

  // Secret Door Reveal (Door 4)
  function revealSecretDoor(on = true) {
    sec.classList.toggle('reveal', on);
    const secUnit = $('.unit.unit--secret', sec);
    if (secUnit) secUnit.inert = !on;
  }

  // ─── WALK-THROUGH DOOR ZOOM & ROOM PRESENTATION ───
  let walkRaf = 0, currentRoomIdx = 0;

  function enterRoom(i) {
    if (busy || inRoom) return;
    busy = true;
    currentRoomIdx = i;
    showBadge(false);
    hideDoorInfo();

    const d = doorsState[i];
    doorsState.forEach((o, k) => { if (k !== i) o.s.set(0); });

    // 1. Lever handle presses down
    d.u.classList.add('press');
    setTimeout(() => d.u.classList.remove('press'), 360);

    // 2. Door swings open wide
    setTimeout(() => d.s.set(1), reduced ? 0 : 160);

    // 3. Zoom straight into the doorway gap
    setTimeout(() => {
      const u = units[i];
      const r = $('.opening', u).getBoundingClientRect();
      const dr = $('.door', u).getBoundingClientRect();
      const gapL = Math.min(Math.max(dr.right, r.left), r.right - 6);
      const gw = Math.max(r.right - gapL, 10), gh = r.height;
      const cx = (gapL + r.right) / 2, cy = r.top + gh * 0.5;
      const tx = innerWidth / 2 - cx, ty = innerHeight / 2 - cy;
      const sEnd = Math.max(innerWidth / gw, innerHeight / gh) * 1.18;

      stopScroll();
      $('#cord')?.classList.add('away');
      $('.hdr')?.classList.add('away');

      const sr = sec.getBoundingClientRect();
      sec.style.transformOrigin = `${cx - sr.left}px ${cy - sr.top}px`;
      sec.classList.add('through');

      const t0 = performance.now(), D = reduced ? 1 : 1200;
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
    }, reduced ? 0 : 560);
  }

  function renderRoomContent(i) {
    const data = ROOMS_DATA[i]; if (!data || !roomv) return;
    inRoom = true;

    roomvDoor.textContent = data.doorName;
    roomvTitle.textContent = data.title;
    roomvDesc.textContent = data.desc;
    roomvCount.textContent = data.count;

    roomvStack.innerHTML = data.projects.map((p, idx) => `
      <article class="room-card ${idx % 2 === 1 ? 'flip' : ''}">
        <div class="room-card__in">
          <div class="room-card__info">
            <div class="room-card__app">
              <div class="room-card__icon">${p.icon}</div>
              <div class="room-card__meta"><span class="no">${p.num}</span><i></i><span>${data.id.toUpperCase()}</span></div>
            </div>
            <h3>${p.title}</h3>
            <p class="sub">${p.sub}</p>
            <p class="desc">${p.desc}</p>
            <ul class="room-card__tags">
              ${p.tags.map(t => `<li>${t}</li>`).join('')}
            </ul>
            <a href="${p.link}" target="_blank" rel="noopener" class="room-card__live">
              <span>${p.linkText}</span>
            </a>
          </div>

          <div class="stage">
            <div class="phone">
              <div class="phone__body">
                <div class="phone__screen" style="background:${p.theme}">
                  <div class="island"></div>
                  <div class="sbar"><span>9:41</span><span>5G ■</span></div>
                  <div class="mockup-ui">
                    <div class="mockup-ui__card">
                      <div class="mockup-ui__bar" style="width:45%"></div>
                      <h4 style="font-size:14px;font-weight:600;margin:4px 0">${p.uiTitle}</h4>
                      <p style="font-size:11px;opacity:.7;margin:0">${p.tags[0]} · Native Pipeline</p>
                    </div>
                    <div class="mockup-ui__card" style="flex:1;display:flex;flex-direction:column;justify-content:flex-end">
                      <div class="mockup-ui__pulse"><i></i>${p.uiStatus}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    `).join('');

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
      const t0 = performance.now(), D = reduced ? 1 : 1100;
      const ease = x => 1 - Math.pow(1 - x, 3);

      const stepBack = now => {
        const p = Math.min(1, (now - t0) / D), e = ease(p);
        const sc = Math.exp(Math.log(S) * (1 - e));
        sec.style.transform = `translate(${X * (1 - e)}px, ${Y * (1 - e)}px) scale(${sc})`;

        if (p < 1) {
          requestAnimationFrame(stepBack);
        } else {
          sec.classList.remove('through');
          sec.style.transform = '';
          sec.style.transformOrigin = '';
          $('#cord')?.classList.remove('away');
          $('.hdr')?.classList.remove('away');
          doorsState[currentRoomIdx].s.set(0);
          busy = false;
          startScroll();
        }
      };
      requestAnimationFrame(stepBack);
    }, 280);
  }

  roomvBack?.addEventListener('click', leaveRoom);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && inRoom) leaveRoom(); });

  // Direct trigger via navbar or footer
  window.openDoor = i => {
    if (busy || inRoom) return;
    if (i === 4 && !sec.classList.contains('reveal')) {
      revealSecretDoor(true);
      setTimeout(() => enterRoom(i), 750);
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

// ─── 3D ASTRONOMICAL TIME TUNNEL CANVAS (STORY) ───
(() => {
  const cv = $('.story__bg'); if (!cv) return;
  const ctx = cv.getContext('2d');
  const rootEl = document.documentElement;

  let W = 0, H = 0, dpr = 1, rgb = '26,24,24';
  const size = () => {
    dpr = Math.min(2, devicePixelRatio || 1);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
  };
  const readRgb = () => {
    rgb = (getComputedStyle(rootEl).getPropertyValue('--fg-rgb') || '26,24,24').trim();
  };
  new MutationObserver(readRgb).observe(rootEl, { attributes: true, attributeFilter: ['data-mode'] });
  readRgb();
  size();
  window.addEventListener('resize', size);

  const RINGS = 16, GAP = 340, FOCAL = 520, R = 620, TICKS = 60;
  const dust = Array.from({ length: 70 }, () => ({
    a: Math.random() * Math.PI * 2,
    r: 120 + Math.random() * 760,
    z: Math.random() * RINGS * GAP,
    s: 0.6 + Math.random() * 1.4
  }));

  let progress = 0, curTime = 0;

  function renderTunnel() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (W < 400) return;

    curTime += 0.012;
    const cx = W * 0.5, cy = H * 0.55, k = Math.min(W, H) / 900;
    const camZ = progress * 4 * GAP * 1.6 + curTime * 18;
    const spin = -progress * Math.PI * 1.5 - curTime * 0.02;
    const len = RINGS * GAP;
    ctx.lineCap = 'round';

    for (let i = 0; i < RINGS; i++) {
      let z = ((i * GAP - camZ) % len + len) % len + 60;
      const s = FOCAL / z * k;
      const fog = Math.min(1, Math.max(0, (z - 260) / 1100)) * Math.max(0, 1 - z / len);
      if (fog <= 0.01) continue;
      const rr = R * s, rot = spin + i * 0.21;

      ctx.strokeStyle = `rgba(${rgb},${(fog * 0.12).toFixed(3)})`;
      ctx.lineWidth = Math.max(0.5, 1.2 * s);
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
        ctx.strokeStyle = `rgba(${rgb},${(fog * (hour ? 0.3 : 0.14)).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.5, (hour ? 3 : 1.4) * s);
        ctx.stroke();
      }

      const ha = rot * 3 + i;
      ctx.strokeStyle = `rgba(${rgb},${(fog * 0.16).toFixed(3)})`;
      ctx.lineWidth = Math.max(0.5, 2 * s);
      if (rr < Math.min(W, H) * 0.45) {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ha) * rr * 0.55, cy + Math.sin(ha) * rr * 0.55);
        ctx.stroke();
      }
    }

    for (const q of dust) {
      const z = ((q.z - camZ * 1.1) % len + len) % len + 40, s = FOCAL / z * k;
      const fog = Math.min(1, Math.max(0, (z - 300) / 900)) * Math.max(0, 1 - z / len);
      const a = q.a + spin * 0.3;
      ctx.fillStyle = `rgba(${rgb},${(fog * 0.35).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * q.r * s, cy + Math.sin(a) * q.r * s, Math.max(0.4, q.s * s * 2.2), 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(renderTunnel);
  }
  requestAnimationFrame(renderTunnel);

  // Sync scroll with Story section
  const storySec = $('#about');
  if (storySec) {
    window.addEventListener('scroll', () => {
      const r = storySec.getBoundingClientRect();
      const h = storySec.offsetHeight - innerHeight;
      if (h > 0) {
        progress = Math.min(1, Math.max(0, -r.top / h));
      }
    }, { passive: true });
  }
})();

// ─── ROLLING YEAR DIGITS & STORY TIMELINE ───
(() => {
  const sec = $('#about'); if (!sec) return;
  const line = $('.story__line', sec), list = $('.story__list', sec);
  const chs = $$('.ch', list), N = chs.length;
  const cols = $$('.dg__c', sec), whenEl = $('.story__when', sec), countEl = $('.story__count', sec);
  const dot = $('.story__dot', sec), rail = $('.story__rail', sec);

  let shownYear = '', shown = -1;
  const setYear = y => {
    if (y === shownYear) return;
    shownYear = y;
    String(y).split('').forEach((d, k) => {
      if (cols[k]) cols[k].style.setProperty('--d', d);
    });
  };

  const showChapter = i => {
    if (i === shown) return;
    shown = i;
    chs.forEach((c, k) => c.classList.toggle('on', k === i));
    setYear(chs[i].dataset.y);
    if (whenEl) whenEl.textContent = chs[i].dataset.when;
    if (countEl) countEl.textContent = String(i + 1).padStart(2, '0');
    sec.classList.toggle('is-now', i === 0);
    sec.dataset.ch = i;
  };

  function updateTimeline() {
    const lr = line.getBoundingClientRect(), mid = innerHeight * 0.5;
    let i = 0;
    for (let k = 0; k < N; k++) {
      if (lr.top + list.offsetTop + chs[k].offsetTop < mid + 40) i = k;
    }
    showChapter(i);
  }
  window.addEventListener('scroll', updateTimeline, { passive: true });
  updateTimeline();
})();

// ─── 3D HOLOGRAPHIC ABILITY CARD (#holo) ───
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
    stopScroll();
    ld.classList.remove('out', 'gone');
    lite.hidden = true;
    lite.classList.remove('in');
    requestAnimationFrame(() => layer.classList.add('on'));

    let p = 0;
    const interval = setInterval(() => {
      p = Math.min(1, p + 0.16);
      if (pct) pct.textContent = Math.round(p * 100) + '%';
      if (p >= 1) {
        clearInterval(interval);
        setTimeout(() => {
          ld.classList.add('out');
          lite.hidden = false;
          lite.classList.add('in');
          t0 = performance.now();
          loop = requestAnimationFrame(step);
        }, 250);
      }
    }, 60);
  }

  function closeCard() {
    if (!isOpen) return;
    isOpen = false;
    cancelAnimationFrame(loop);
    layer.classList.remove('on');
    setTimeout(() => {
      layer.hidden = true;
      lite.hidden = true;
      startScroll();
    }, 360);
  }

  openBtn.addEventListener('click', openCard);
  closeBtn?.addEventListener('click', closeCard);
  window.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) closeCard(); });

  lite?.addEventListener('pointermove', e => {
    const r = hc.getBoundingClientRect(); if (!r.width) return;
    const u = (e.clientX - r.left) / r.width, v = (e.clientY - r.top) / r.height;
    if (u < -0.4 || u > 1.4 || v < -0.35 || v > 1.35) { held = false; tx = ty = 0; return; }
    held = true;
    tx = Math.max(-1, Math.min(1, (u - 0.5) * 2));
    ty = Math.max(-1, Math.min(1, (v - 0.5) * 2));
  }, { passive: true });

  lite?.addEventListener('pointerleave', () => { held = false; tx = ty = 0; });

  let pointerDownPos = null;
  hc.addEventListener('pointerdown', e => { pointerDownPos = [e.clientX, e.clientY]; });
  hc.addEventListener('pointerup', e => {
    if (pointerDownPos && Math.hypot(e.clientX - pointerDownPos[0], e.clientY - pointerDownPos[1]) < 10) {
      hc.classList.toggle('flip');
    }
    pointerDownPos = null;
  });
})();

// ─── NAV MENU DRAWER & CONTACT MODAL ───
(() => {
  const menuBtn = $('#menuBtn'), navm = $('#navm'), navClose = $('#navClose');
  const navList = $('#navList'), navStart = $('#navStart');
  const modal = $('#modal'), mClose = $('#mClose'), reqForm = $('#reqForm');

  const NAV_ITEMS = [
    { label: 'Home', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { label: 'iOS Development', action: () => window.openDoor(0) },
    { label: 'Android Apps', action: () => window.openDoor(1) },
    { label: 'UI/UX Design', action: () => window.openDoor(2) },
    { label: 'AI & Neural Nets', action: () => window.openDoor(3) },
    { label: 'Backend Systems', action: () => window.openDoor(4) },
    { label: 'My Story', action: () => $('#about')?.scrollIntoView({ behavior: 'smooth' }) },
    { label: 'Contact', action: () => openContact() }
  ];

  if (navList) {
    navList.innerHTML = NAV_ITEMS.map((item, idx) => `
      <li>
        <button class="navm__item" data-idx="${idx}" style="--d:${idx * 45}ms">
          <small>0${idx + 1}</small>
          <span>${item.label}</span>
        </button>
      </li>
    `).join('');

    $$('.navm__item', navList).forEach(btn => {
      btn.addEventListener('click', () => {
        closeMenu();
        const idx = parseInt(btn.dataset.idx, 10);
        NAV_ITEMS[idx]?.action();
      });
    });
  }

  function openMenu() {
    if (!navm) return;
    navm.hidden = false;
    stopScroll();
    requestAnimationFrame(() => navm.classList.add('open'));
  }
  function closeMenu() {
    if (!navm) return;
    navm.classList.remove('open');
    setTimeout(() => { navm.hidden = true; startScroll(); }, 400);
  }

  menuBtn?.addEventListener('click', openMenu);
  navClose?.addEventListener('click', closeMenu);
  navStart?.addEventListener('click', () => { closeMenu(); openContact(); });

  function openContact() {
    if (!modal) return;
    modal.hidden = false;
    stopScroll();
    requestAnimationFrame(() => modal.classList.add('open'));
  }
  function closeContact() {
    if (!modal) return;
    modal.classList.remove('open');
    setTimeout(() => { modal.hidden = true; startScroll(); }, 350);
  }

  $$('[data-contact]').forEach(b => b.addEventListener('click', openContact));
  mClose?.addEventListener('click', closeContact);
  modal?.addEventListener('click', e => { if (e.target === modal) closeContact(); });

  reqForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#f-name')?.value || '';
    const email = $('#f-email')?.value || '';
    const project = $('#f-project')?.value || '';
    const subject = encodeURIComponent(`Project Inquiry from ${name}`);
    const body = encodeURIComponent(`Hi Kaushal,\n\nName: ${name}\nEmail: ${email}\n\nProject Details:\n${project}`);
    window.location.href = `mailto:kaushalmaran@gmail.com?subject=${subject}&body=${body}`;
    closeContact();
  });
})();

// ─── SCROLL NAVIGATION HELPERS & TO-TOP ───
(() => {
  $$('[data-go]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.go;
      if (targetId === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const toTop = $('.totop');
  if (toTop) {
    const circle = toTop.querySelector('.ring circle');
    const radius = circle ? circle.r.baseVal.value : 24;
    const circumference = 2 * Math.PI * radius;
    toTop.style.setProperty('--len', `${circumference}px`);

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      toTop.classList.toggle('show', scrollY > 400);
      toTop.style.setProperty('--p', progress.toFixed(3));
    }, { passive: true });
  }
})();
