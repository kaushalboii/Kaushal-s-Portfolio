# 🚪 M Kaushal Maran — Portfolio

An architectural, editorial portfolio for **M Kaushal Maran**, Mobile App Developer and final-year B.Tech Information Technology student at SIMATS Engineering College (CGPA 8.1), engineered with the craft, animations, and interaction design of [therishithakor.com](https://therishithakor.com/).

🔗 **Live Preview**: [https://kaushalboii.github.io/Kaushal-s-Portfolio/](https://kaushalboii.github.io/Kaushal-s-Portfolio/)

---

## ✨ Signature Architecture & Interactions

### 1. Liquid Color Reveal Hero (`#fig`)
- **Dual Layer Cut-Out Portrait**: Grayscale base portrait (`assets/kaushal-bw.png`) and full-color high-res cut-out (`assets/kaushal-opt.png`).
- **Cursor-Tracked Fluid Trail**: Mouse sweeps across the portrait dynamically paint the color portrait with soft radial gradient masking and automatic smooth decay back to B&W.
- **Hero Watermark & CTAs**: Crisp typographic headline with 3D Flip Desk Calendar cycling through Kaushal's core roles (`iOS Developer`, `Android Developer`, `UI/UX Designer`, `AI & ML Engineer`, `Systems Architect`).

### 2. 3D Architectural Doors Gallery (`#works`)
- **Physics-Damped Doors**: 4 primary discipline doors in an adaptive proportional grid (iOS, Android, UI/UX, AI/ML) engineered with custom spring mechanics.
- **Custom Floating Door Cursor**: `#doorCursor` magnetic pill badge ("Click to enter") tracks cursor over doorways, replacing the standard system pointer.
- **Focus & Empty Space Positioning**: Hovering a door dims background doors down to 3% opacity (`opacity: .03; filter: saturate(.2)`), while `#dinfo` dynamically centers itself in the open space of the faded doors with animated checkmark bullets.
- **Walk-Through Zoom Animation**: On door click, the brass lever handle depresses 32°, the door swings open (-80°), and the camera scales straight into the doorway gap before handing off to the exhibition room.

### 3. Skill Exhibition Rooms (`#roomv`)
- **Stacked Project Cards**: Sticky elevation cards with smooth scroll stacking and alternating layouts.
- **3D Angled Phone Mockups**: High-fidelity titanium iPhone bodies turned in 3D perspective with dynamic islands, status bars, glass sheen reflections, and live UI previews.
- **Verified Applications & Open Source Ecosystem**:
  - 🧘 **ZenLife** — Sound-Based Stress Relief App (*Live on Apple App Store*)
  - 📡 **Viana 360** — Real-Time Telemetry & Systems Monitoring (*Live on Apple App Store*)
  - 🛍️ **Viana Buy** — Everyday Essentials & Commerce (*Live on Apple App Store*)
  - ⌨️ **CleanYourMacKeyboard** — macOS Menu Bar Keyboard Shield (*Free & Open Source*)
  - 📢 **Vellore Ads Platform** — Commercial Listing Directory (*Live on Google Play Store*)
  - 📜 **Constitution of India (REF)** — Bilingual Bare Act & FTS5 Search (*Live on Google Play Store*)
  - ⚖️ **BNS & BNSS 2023 Pocket Reference** — Criminal Law Reform Suite (*Live on Google Play Store*)
  - 🏛️ **CPC Act - Pocket Reference App** — Code of Civil Procedure 1908 (*Live on Google Play Store*)
  - 🗳️ **ClearVote DAO Governance Assistant** — AI-Powered Web3 Governance (*Open Source on GitHub*)
  - 💬 **Anonymous Chat Platform** — Real-Time Ephemeral WebSocket Messenger (*Open Source on GitHub*)
  - 🧠 **Machine Learning Suite** — Scikit-Learn Predictive Algorithms (*Open Source on GitHub*)
  - 👁️ **Computer Vision Labs** — 40+ OpenCV Image Processing Pipelines (*Open Source on GitHub*)

### 4. Astronomical Time Tunnel Clock Canvas (`#about.story`)
- **3D Clock Dials Tunnel**: Dynamic HTML5 canvas (`story__bg`) rendering 16 concentric perspective rings, hour ticks, rotating clock hands, and drifting cosmic dust, winding backwards as you scroll through history.
- **Rolling Year Digits (`.story__yr`)**: Four-digit reels (`.dg__c`) spinning smoothly between career milestones (2026 → 2025 → 2024 → 2022).
- **Scrubber Meter**: Circular SVG meter rotating with scroll progress (`calc(var(--p) * -720deg)`), counter HUD (`01 / 04`), and ambient color wash.

### 5. Interactive 3D Holographic Ability Card (`#holo`)
- **Realistic 3D Tilt & Gyro**: Follows mouse coordinates and touch drag with ambient idle sway.
- **Holographic Shading**: Gilt sheen, rainbow foil, reflection glare, and embossed monogram card back.
- **Interactive Flip**: Tap or click to flip the card 180° in 3D.

### 6. Verlet Physics Pull Cord
- **Numerical Verlet Integration**: Multi-segment rope simulation on HTML5 canvas with realistic gravity and momentum.
- **Turned Walnut Knob**: Realistic 3D lighting, drag haptics, and spring recoil.
- **Theme Engine**: Seamless toggle between warm Travertine Light Mode (`#E8E4E0`) and Charcoal Dark Mode (`#1A1818`).

### 7. Fixed Header & Statement Footer
- **Live Vellore IST Clock**: Real-time Indian Standard Time (IST, UTC+5:30) and formatted calendar date.
- **Spring Hover Nav**: Magnetic translation on buttons.
- **Giant Footer Watermark**: Full-bleed `M KAUSHAL MARAN` typography with live status and circular scroll progress tracker (`.totop`).

---

## 🛠️ Tech Stack

- **Core**: Semantic HTML5, Vanilla JavaScript (ES Modules), Modern CSS3 (Grid & Container Queries)
- **Smooth Scroll**: Lenis v1.3.23
- **Typography**: Local high-performance Onest (`onest-latin.woff2`, `onest-latin-ext.woff2`)
- **Physics**: Canvas Verlet Rope Simulation & Damped Harmonic Spring Mechanics

---

## 📂 Repository Layout

```text
Kaushal-s-Portfolio/
├── index.html            # Semantic markup, hero stage, doors, and story
├── README.md             # Architecture documentation
├── css/
│   └── style.css         # Complete design system, 3D doors, roomv, and themes
├── js/
│   └── main.js           # Lenis, liquidReveal, doors walk-through, and story engine
├── assets/
│   ├── kaushal-opt.png   # Full-color high-res portrait cut-out
│   ├── kaushal-bw.png    # Grayscale portrait base for liquid reveal
│   └── kaushal.png       # Original portrait
├── card/
│   ├── plate.webp        # Holographic card front plate & stats
│   ├── back.webp         # Embossed monogram card back
│   ├── win_bg.webp       # Holographic illustration background
│   ├── win_sub.webp      # Holographic window overlay
│   ├── sheen.webp        # Specular gilt mask
│   └── body.webp         # Holographic rainbow foil mask
├── fonts/
│   ├── onest-latin.woff2
│   └── onest-latin-ext.woff2
└── vendor/
    └── lenis.min.mjs     # Lenis smooth scroll engine
```

---

© 2026 M Kaushal Maran. Designed and built with architectural craft.
