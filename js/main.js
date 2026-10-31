/* ══════════════════════════════════════════════════════════════
   KAUSHAL MARAN PORTFOLIO — MAIN INTERACTIVITY ENGINE
   - Stacking Pill Loader
   - Canvas Verlet Physics Pull Cord (Theme Switcher)
   - 3D Flip Desk Calendar (#cal)
   - 3D Doors & Exhibition Room Showcase
   - Live Vellore Time Clock
   - Navigation & Project Inquiry Modals
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── 1. DISCIPLINE EXHIBITION ROOM DATA ───
  const ROOMS_DATA = [
    {
      id: 'ios',
      title: 'iOS Native Ecosystem',
      tag: 'Door 01 · Swift & SwiftUI',
      desc: 'High-performance native iOS applications built with Swift, SwiftUI, Combine, and CoreData. Designed with human interface guidelines, micro-interactions, and distributed backend synchronization.',
      color: '#1f2d48',
      projects: [
        {
          title: 'ZENLIFE — Sound-Based Stress Relief App',
          meta: 'iOS · Wellness · Live on App Store',
          desc: 'An iOS wellness application delivering calming, mood-tailored acoustic soundscapes. Features real-time mood logging, psychometric analytics, local CoreData persistence, and secure PHP/MySQL cloud sync.',
          tags: ['SwiftUI', 'CoreData', 'AudioEngine', 'MySQL', 'PHP'],
          link: 'https://apps.apple.com/in/app/zenlife-stress-sound-relief/id6753105286',
          linkText: 'Download on App Store →'
        },
        {
          title: 'Viana 360 — Real-Time Monitoring & Telemetry',
          meta: 'iOS · Industrial / Commercial · Live on App Store',
          desc: 'Sophisticated telemetry monitoring app providing comprehensive 360-degree data visualization, real-time alert notifications, and multi-sensor dashboard analytics.',
          tags: ['iOS', 'Swift', 'Real-time Data', 'Custom Charts', 'UI/UX'],
          link: 'https://apps.apple.com/in/app/viana-360/id6760163659',
          linkText: 'Download on App Store →'
        },
        {
          title: 'Viana Buy — Everyday Essentials & Shopping',
          meta: 'iOS · E-Commerce & Retail · Live on App Store',
          desc: 'An all-in-one iOS lifestyle platform designed to streamline everyday grocery and product purchases. Integrates localized merchant delivery, dynamic cart computation, and fluid checkout UI.',
          tags: ['iOS', 'SwiftUI', 'REST APIs', 'E-Commerce', 'Order Tracking'],
          link: 'https://apps.apple.com/in/app/viana-buy/id6772468488',
          linkText: 'Download on App Store →'
        }
      ]
    },
    {
      id: 'android',
      title: 'Android Native Applications',
      tag: 'Door 02 · Kotlin & Jetpack Compose',
      desc: 'Robust Android apps engineered using modern Kotlin conventions, Jetpack Compose, Coroutines, ROOM SQLite, and Material 3 design systems.',
      color: '#203a2e',
      projects: [
        {
          title: 'Vellore Ads & Business Listing Platforms',
          meta: 'Android · Commercial Listings · Live on Play Store',
          desc: 'Comprehensive multi-city commerce and advertising networks. Features instant location filters, high-density listing catalogues, verified merchant profiles, and real-time ad distribution.',
          tags: ['Kotlin', 'Jetpack Compose', 'MySQL', 'PHP REST APIs'],
          link: 'https://play.google.com/store/apps/details?id=com.velloreads.app&hl=en_IN',
          linkText: 'Get on Google Play →'
        },
        {
          title: 'Indian Law Pocket Reference Suite',
          meta: 'Android · Legal Tech · 11 Indian Languages · Live Suite',
          desc: 'Offline-first legal reference suite encompassing Constitution of India, Bharatiya Nyaya Sanhita (BNS), BNSS, BSA, CPC, and POSH Act with multilingual translation in 11 Indian regional languages.',
          tags: ['Kotlin', 'ROOM Database', 'Offline Search', '11 Languages'],
          link: 'https://play.google.com/store/apps/details?id=com.kaushal.constitutionindia&hl=en_IN',
          linkText: 'Constitution on Play Store →'
        },
        {
          title: 'Election 2026 — Information Platform',
          meta: 'Android · Civic Governance · Live on Play Store',
          desc: 'Dedicated voter information and election resource directory for the 2026 civic elections. Designed for maximum accessibility across high- and low-end Android smartphones.',
          tags: ['Kotlin', 'Android Studio', 'Clean Architecture', 'Information Design'],
          link: 'https://play.google.com/store/apps/details?id=com.bctnpy.election2026&hl=en_IN',
          linkText: 'Get on Google Play →'
        }
      ]
    },
    {
      id: 'uiux',
      title: 'UI/UX & Mobile Architecture',
      tag: 'Door 03 · Design Systems & Hybrids',
      desc: 'From high-fidelity wireframing and interactive prototypes to native web bridges with WKWebView and Android WebView. Merging aesthetic precision with bulletproof software engineering.',
      color: '#4a2c3a',
      projects: [
        {
          title: 'Modern Mobile Design Systems',
          meta: 'UI/UX Design · Figma & Blender',
          desc: 'Component design libraries, micro-interaction motion curves, high-contrast dark palettes, and responsive layouts calibrated for thumbs and single-hand ergonomics.',
          tags: ['Figma', 'Blender 3D', 'Micro-interactions', 'Design Tokens'],
          link: '#contact',
          linkText: 'Request Design Portfolio →'
        },
        {
          title: 'Native-Web Hybrid Bridges (WKWebView / WebView)',
          meta: 'Cross-Platform Framework · Security & Performance',
          desc: 'Architected safe two-way JavaScript-to-Native communication bridges during development at Redback IT Solutions, optimizing memory cache and page load speeds for enterprise clients.',
          tags: ['WKWebView', 'Android WebView', 'JavaScript Bridge', 'Security'],
          link: '#contact',
          linkText: 'Explore Architecture →'
        }
      ]
    },
    {
      id: 'ai',
      title: 'AI & Emerging Systems',
      tag: 'Door 04 · Neural Networks & Machine Learning',
      desc: 'Applied machine learning, natural language processing, and generative neural models designed to personalize user workflows and automate creative production.',
      color: '#7c4828',
      projects: [
        {
          title: 'Automatic Comic Generator',
          meta: 'Java · Deep Learning · Neural Networks',
          desc: 'Generative pipeline automating graphic comic strip panel creation using generative adversarial networks (GANs) and neural style transfer algorithms.',
          tags: ['Java', 'Neural Networks', 'GANs', 'Style Transfer'],
          link: 'https://github.com/kaushalboii',
          linkText: 'View on GitHub →'
        },
        {
          title: 'AI-Driven Personalized Learning Paths',
          meta: 'Python · Natural Language Processing · EdTech',
          desc: 'Curriculum recommendation engine employing NLP models to analyze student competency gaps and dynamically generate custom tailored learning modules.',
          tags: ['Python', 'NLP', 'Machine Learning', 'Data Science'],
          link: 'https://github.com/kaushalboii',
          linkText: 'View on GitHub →'
        }
      ]
    }
  ];

  // ─── 2. STACKING LOADER ANIMATION ───
  function initLoader() {
    const loader = document.getElementById('loader');
    const pills = document.querySelectorAll('.ld__pill');
    const countEl = document.getElementById('ldCount');
    const barEl = document.getElementById('ldBarProgress');
    if (!loader) return;

    let progress = 0;
    const duration = 1400; // ms
    const startTime = performance.now();

    // Stagger in the pills
    pills.forEach((p, idx) => {
      setTimeout(() => {
        p.classList.add('on');
      }, 120 + idx * 140);
    });

    function updateProgress(now) {
      const elapsed = now - startTime;
      progress = Math.min(100, Math.floor((elapsed / duration) * 100));
      if (countEl) countEl.textContent = String(progress).padStart(3, '0');
      if (barEl) barEl.style.width = progress + '%';

      if (progress < 100) {
        requestAnimationFrame(updateProgress);
      } else {
        setTimeout(() => {
          loader.classList.add('out');
          setTimeout(() => {
            loader.classList.add('finished');
            document.body.classList.add('ready');
          }, 850);
        }, 250);
      }
    }
    requestAnimationFrame(updateProgress);
  }

  // ─── 3. THEME TOGGLER (Local Storage & Pull Cord Sync) ───
  function getTheme() {
    return localStorage.getItem('km-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(mode) {
    document.documentElement.dataset.mode = mode;
    localStorage.setItem('km-theme', mode);
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  applyTheme(getTheme());

  // ─── 4. VERLET PHYSICS PULL CORD ───
  function initPullCord() {
    const cordWrap = document.getElementById('cord');
    const canvas = document.getElementById('cordCanvas');
    const hitBtn = document.getElementById('cordHit');
    if (!cordWrap || !canvas || !hitBtn) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const W = 80;
    const H = 230;
    canvas.width = W * dpr;
    canvas.height = H * dpr;

    const N = 8; // rope segments
    const pts = [];
    const segLen = 14;
    const anchorX = 40;
    const anchorY = 0;

    for (let i = 0; i <= N; i++) {
      pts.push({
        x: anchorX,
        y: anchorY + i * segLen,
        px: anchorX,
        py: anchorY + i * segLen,
        pinned: i === 0
      });
    }

    let isDragging = false;
    let dragY = 0;
    let dragX = 0;
    let pullToggled = false;

    hitBtn.addEventListener('pointerdown', (e) => {
      isDragging = true;
      pullToggled = false;
      cordWrap.classList.add('dragging');
      const rect = canvas.getBoundingClientRect();
      dragX = e.clientX - rect.left;
      dragY = e.clientY - rect.top;
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    });

    function onPointerMove(e) {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      dragX = Math.max(10, Math.min(W - 10, e.clientX - rect.left));
      dragY = Math.max(segLen * N * 0.8, Math.min(H - 25, e.clientY - rect.top));

      // Trigger switch if pulled beyond threshold
      if (dragY > segLen * N + 45 && !pullToggled) {
        pullToggled = true;
        toggleTheme();
        if (navigator.vibrate) navigator.vibrate(15);
      }
    }

    function onPointerUp() {
      if (!isDragging) return;
      isDragging = false;
      cordWrap.classList.remove('dragging');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }

    // Tap fallback
    hitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
      // small physics bounce
      pts[N].py += 35;
    });

    function updatePhysics() {
      // Verlet integration
      for (let i = 1; i <= N; i++) {
        const p = pts[i];
        if (p.pinned) continue;
        const vx = (p.x - p.px) * 0.96;
        const vy = (p.y - p.py) * 0.96 + 0.35; // gravity
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy;
      }

      if (isDragging) {
        pts[N].x = dragX;
        pts[N].y = dragY;
      }

      // Relaxation constraints
      for (let step = 0; step < 5; step++) {
        for (let i = 0; i < N; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.hypot(dx, dy) || 1e-4;
          const diff = (dist - segLen) / dist;
          if (!p1.pinned) {
            p1.x += dx * 0.5 * diff;
            p1.y += dy * 0.5 * diff;
          }
          p2.x -= dx * 0.5 * diff;
          p2.y -= dy * 0.5 * diff;
        }
      }
    }

    function drawCord() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Draw shadow
      ctx.save();
      ctx.translate(3, 4);
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i <= N; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.restore();

      // Draw Braided Cord
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < N; i++) {
        const mx = (pts[i].x + pts[i + 1].x) / 2;
        const my = (pts[i].y + pts[i + 1].y) / 2;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      ctx.lineTo(pts[N].x, pts[N].y);
      ctx.strokeStyle = document.documentElement.dataset.mode === 'dark' ? '#8a786c' : '#57483b';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Draw Turned Acorn Walnut Knob
      const tip = pts[N];
      const prev = pts[N - 1];
      const angle = Math.atan2(tip.y - prev.y, tip.x - prev.x);

      ctx.save();
      ctx.translate(tip.x, tip.y);
      ctx.rotate(angle - Math.PI / 2);

      // Brass ferrule
      ctx.fillStyle = '#caa54d';
      ctx.fillRect(-3, 0, 6, 5);

      // Walnut Acorn Body
      ctx.fillStyle = '#4a2a16';
      ctx.beginPath();
      ctx.moveTo(-5, 5);
      ctx.bezierCurveTo(-9, 12, -7, 24, 0, 26);
      ctx.bezierCurveTo(7, 24, 9, 12, 5, 5);
      ctx.closePath();
      ctx.fill();

      // Soft Highlight
      ctx.fillStyle = 'rgba(255, 230, 200, 0.35)';
      ctx.beginPath();
      ctx.ellipse(-2, 12, 1.5, 5, -0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Reposition Hit button over knob
      hitBtn.style.left = (tip.x - 22) + 'px';
      hitBtn.style.top = (tip.y - 10) + 'px';

      updatePhysics();
      requestAnimationFrame(drawCord);
    }

    drawCord();
  }

  // ─── 5. 3D FLIP DESK CALENDAR (#cal) ───
  function initFlipCalendar() {
    const cal = document.getElementById('cal');
    if (!cal) return;

    const SKILLS = [
      'iOS Apps',
      'Android Apps',
      'Modern UI/UX',
      'Scalable APIs',
      'AI Products'
    ];

    const body = cal.querySelector('.cal__body');
    const leaf = cal.querySelector('.cal__leaf');
    const under = cal.querySelector('[data-under]');
    const face = cal.querySelector('.cal__face');
    const rings = cal.querySelector('.cal__rings');
    const measure = cal.querySelector('.cal__measure');
    const n = SKILLS.length;
    let idx = 0;

    function paint(el, k) {
      if (!el) return;
      const wEl = el.querySelector('.cal__word');
      const nEl = el.querySelector('.cal__no');
      if (wEl) wEl.textContent = SKILLS[k];
      if (nEl) nEl.textContent = `${String(k + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
    }

    paint(face, 0);
    paint(under, 1);

    // Compute dynamic width based on longest word
    function fitCalendar() {
      let maxW = 0;
      SKILLS.forEach((s) => {
        measure.textContent = s;
        maxW = Math.max(maxW, measure.getBoundingClientRect().width);
      });
      const emW = (maxW / 16) + 1.6;
      cal.style.setProperty('--cal-w', Math.max(6.2, emW) + 'em');

      // Rings and holes count
      const ringCount = 6;
      if (rings) rings.innerHTML = '<i></i>'.repeat(ringCount);
      cal.querySelectorAll('.cal__holes').forEach((h) => {
        h.innerHTML = '<i></i>'.repeat(ringCount);
      });
    }

    fitCalendar();
    window.addEventListener('resize', fitCalendar);

    function flipPage() {
      if (document.hidden) {
        setTimeout(flipPage, 1000);
        return;
      }

      const next = (idx + 1) % n;
      const anim = leaf.animate(
        [
          { transform: 'rotateX(0deg)' },
          { transform: 'rotateX(360deg)' }
        ],
        {
          duration: 900,
          easing: 'cubic-bezier(0.5, 0.05, 0.2, 1)',
          fill: 'forwards'
        }
      );

      // Halfway through rotation, swap face content
      setTimeout(() => {
        idx = next;
        paint(face, idx);
        paint(under, (idx + 1) % n);
      }, 450);

      anim.onfinish = () => {
        setTimeout(flipPage, 3200);
      };
    }

    setTimeout(flipPage, 2600);
  }

  // ─── 6. 3D DOORS INTERACTION & EXHIBITION MODAL ───
  function initDoors() {
    const doorways = document.querySelectorAll('.doorway');
    const modal = document.getElementById('doorModal');
    const closeBtn = document.getElementById('roomClose');
    const roomTitle = document.getElementById('roomTitle');
    const roomTag = document.getElementById('roomTag');
    const roomDesc = document.getElementById('roomDesc');
    const roomProjects = document.getElementById('roomProjects');

    doorways.forEach((dw) => {
      dw.addEventListener('click', () => {
        const doorIdx = parseInt(dw.dataset.door);
        openRoom(doorIdx);
      });
    });

    function openRoom(idx) {
      const data = ROOMS_DATA[idx];
      if (!data || !modal) return;

      // Animate door open
      const dw = document.querySelector(`.doorway[data-door="${idx}"]`);
      if (dw) dw.classList.add('open');

      if (roomTitle) roomTitle.textContent = data.title;
      if (roomTag) roomTag.textContent = data.tag;
      if (roomDesc) roomDesc.textContent = data.desc;

      if (roomProjects) {
        roomProjects.innerHTML = data.projects.map((p) => `
          <div class="proj-item">
            <div class="proj-item__head">
              <div>
                <h4 class="proj-item__title">${p.title}</h4>
                <span class="tag-pill" style="margin-top: .35rem; display: inline-block;">${p.meta}</span>
              </div>
            </div>
            <p class="proj-item__desc">${p.desc}</p>
            <div class="proj-item__tags">
              ${p.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
            </div>
            <a href="${p.link}" target="_blank" rel="noopener" class="proj-item__link">
              <span>${p.linkText}</span>
            </a>
          </div>
        `).join('');
      }

      setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 250);
    }

    function closeRoom() {
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
      doorways.forEach(dw => dw.classList.remove('open'));
    }

    if (closeBtn) closeBtn.addEventListener('click', closeRoom);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeRoom();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeRoom();
    });
  }

  // ─── 7. LIVE CLOCK (VELLORE, TAMIL NADU) ───
  function initClock() {
    const timeEls = document.querySelectorAll('[data-time]');
    const dateEls = document.querySelectorAll('[data-date]');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    function tick() {
      const d = new Date();
      // Local Indian Time Format
      let hours = d.getHours();
      const mins = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12 || 12;
      const timeStr = `${hours}:${mins}${ampm}`;
      const dateStr = `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;

      timeEls.forEach(el => el.textContent = timeStr);
      dateEls.forEach(el => el.textContent = dateStr);
    }

    tick();
    setInterval(tick, 1000);
  }

  // ─── 8. NAVIGATION DRAWER & CONTACT MODAL ───
  function initModals() {
    const navm = document.getElementById('navm');
    const menuBtn = document.getElementById('menuBtn');
    const navClose = document.getElementById('navClose');
    const modal = document.getElementById('modal');
    const contactBtns = document.querySelectorAll('[data-contact]');
    const mClose = document.getElementById('mClose');

    // Menu Drawer
    if (menuBtn && navm) {
      menuBtn.addEventListener('click', () => {
        navm.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (navClose && navm) {
      navClose.addEventListener('click', () => {
        navm.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    document.querySelectorAll('.navm__list button').forEach(b => {
      b.addEventListener('click', () => {
        const target = b.dataset.go;
        if (navm) navm.classList.remove('active');
        document.body.style.overflow = '';
        if (target) {
          const el = document.getElementById(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Contact Modal
    contactBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) {
          modal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    if (mClose && modal) {
      mClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }

    // Contact Form handling
    const reqForm = document.getElementById('reqForm');
    if (reqForm) {
      reqForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('f-name').value;
        const email = document.getElementById('f-email').value;
        const msg = document.getElementById('f-project').value;

        const subject = encodeURIComponent(`Project Inquiry from ${name}`);
        const body = encodeURIComponent(`Hi Kaushal,\n\nName: ${name}\nEmail: ${email}\n\nProject Overview:\n${msg}\n\nLooking forward to hearing from you!`);
        window.location.href = `mailto:kaushalmaranm@gmail.com?subject=${subject}&body=${body}`;
        if (modal) modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  }

  // ─── 9. SMOOTH NAV BUTTONS ───
  function initNavButtons() {
    document.querySelectorAll('button[data-go]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.go;
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    });

    const hdr = document.querySelector('.hdr');
    window.addEventListener('scroll', () => {
      if (hdr) hdr.classList.toggle('stuck', window.scrollY > 30);
    }, { passive: true });
  }

  // ─── DOM READY BOOTSTRAP ───
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initPullCord();
    initFlipCalendar();
    initDoors();
    initClock();
    initModals();
    initNavButtons();
  });

})();
