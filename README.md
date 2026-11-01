# 🚪 M Kaushal Maran — Portfolio & Systems Architecture

[![Live Portfolio](https://img.shields.io/badge/Live%20Portfolio-kaushalboii.github.io-000000?style=for-the-badge&logo=safari&logoColor=white)](https://kaushalboii.github.io/Kaushal-s-Portfolio/)
[![Swift](https://img.shields.io/badge/Swift-5.10-FA7343?style=for-the-badge&logo=swift&logoColor=white)](https://developer.apple.com/swift/)
[![Kotlin](https://img.shields.io/badge/Kotlin-2.0-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white)](https://kotlinlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Lenis](https://img.shields.io/badge/Lenis-v1.3.23-111111?style=for-the-badge)](https://lenis.darkroom.engineering/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

An architectural, editorial portfolio for **M Kaushal Maran**, Mobile App Developer and final-year B.Tech Information Technology student at SIMATS Engineering College (CGPA 8.1). Built from first principles using vanilla web technologies, physics-driven canvas simulations, and tactile 3D interactions inspired by world-class editorial design.

🔗 **Production Deployment**: [https://kaushalboii.github.io/Kaushal-s-Portfolio/](https://kaushalboii.github.io/Kaushal-s-Portfolio/)

---

## 🏛️ Architecture & Signature Interactions

```
                                      ┌──────────────────────────────────────────────┐
                                      │         M Kaushal Maran Portfolio            │
                                      └──────────────────────┬───────────────────────┘
                                                             │
         ┌─────────────────────────┬─────────────────────────┼─────────────────────────┬─────────────────────────┐
         │                         │                         │                         │                         │
         ▼                         ▼                         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│  Hero Stage      │      │  3D Doors Wall   │      │ Exhibition Rooms │      │ Story Time       │      │ Statement        │
│  & Liquid Reveal │      │  & Custom Cursor │      │ & Device Mockups │      │ Tunnel Canvas    │      │ Footer & ASCII   │
└──────────────────┘      └──────────────────┘      └──────────────────┘      └──────────────────┘      └──────────────────┘
```

### 1. Liquid Color Reveal Hero (`#home`)
- **Dual-Layer Portrait System**: Features a high-resolution monochrome baseline photograph (`assets/kaushal-bw.png`) composited beneath a pixel-aligned full-color photograph (`assets/kaushal-opt.png`).
- **Cursor Fluid Brush Canvas (`#figCanvas`)**: Mouse and touch sweeps paint a real-time fluid trail using soft radial gradients, revealing the natural color portrait beneath and gently decaying back to monochrome via quadratic dissipation.
- **Background "KAUSHAL" 11rem Watermark (`.fig__wm`)**: Bold typography set across the dark hero backdrop, engineered without container clipping to preserve full-bleed atmospheric depth.
- **3D Desk Flip Calendar (`#cal`)**: Mechanical ring-bound calendar cycling between Kaushal's core engineering identities with perspective curl and flip mechanics:
  1. `iOS Developer`
  2. `Android Developer`
  3. `UI/UX Designer`
  4. `AI & ML Engineer`
  5. `Systems Architect`
- **Floating Live App Showcase (`#hcard`)**: Interactive preview card showcasing verified App Store and open-source applications (ZenLife, Viana 360, Viana Buy, CleanYourMac Keyboard) with live rating badges, store links, and active engineering stack chips (`SwiftUI`, `Kotlin`, `CoreData & Room`, `macOS AppKit`).
- **Tactile Ability Card Trigger (`#holoOpen`)**: Glassmorphic pill button launching the 3D holographic ability card modal.

---

### 2. 3D Architectural Doors Gallery (`#works`)
- **Harmonic Spring Physics**: 4 bespoke discipline doors engineered with damped harmonic spring mechanics (`tension: 120`, `friction: 14`) controlling brass lever depressions and door swing angles.
- **Magnetic Pill Cursor (`#doorCursor`)**: Context-aware floating badge (*"Click to enter"*) that magnetically tracks cursor movement across doorways, smoothly replacing the system pointer.
- **Dynamic Empty-Space Information Card (`#dinfo`)**: Hovering any door dims the remaining three doors down to 3% opacity (`opacity: .03; filter: saturate(.2)`). The `#dinfo` card dynamically measures screen geometry and docks directly in the negative space of the faded doors, presenting animated checkmark bullets.
- **Camera Walk-Through Zoom Transition**: When a door is selected, its brass handle depresses 32°, the door swings open (-80°), and the camera scales straight through the doorway portal before handing off into the full-screen exhibition room modal.
- **Mobile Touch Carousel**: On touchscreens and mobile viewports (`< 640px`), the doors wall seamlessly shifts into a horizontally paged carousel with swipe velocity sensing, touch-action isolation, and synchronized pagination dots (`.doors__dots`).

---

### 3. Skill Exhibition Rooms (`#roomv`) & Device Showcases
Full-screen modal room experience featuring smooth stacked elevation cards with sticky pinning, alternating editorial layouts, and high-fidelity device frames:

- **3D Titanium iPhone Frame (`.phone`)**: Rendered in 3D perspective with Dynamic Island, native status bars, specular glass sheens, and live mobile UI captures. Automatically flattens (`transform: none !important;`) on mobile screens for pixel-crisp legibility.
- **macOS Window Frame (`.mac-frame`)**: Native AppKit desktop frame with traffic light controls (close, minimize, zoom), dark navigation bar, and focused utility screenshots.
- **Bespoke Case Studies & Verified Projects**:

#### 🚪 Door 01 · iOS Development (`Swift, SwiftUI & Apple Ecosystem`)
| Project | Platform | Architecture & Technologies | Distribution |
| :--- | :--- | :--- | :--- |
| **ZenLife** | iOS 17+ | SwiftUI, AVAudioEngine, CoreData, Combine, Biometrics, 432 Hz Solfeggio Audio Engine | [Live on Apple App Store](https://apps.apple.com/app/id6742334816) |
| **Viana 360** | iOS 17+ | Swift, Combine, Real-Time WebSockets, Custom Telemetry Visualizers, High-Frequency Radar | [Live on Apple App Store](https://apps.apple.com/app/id6743789472) |
| **Viana Buy** | iOS 17+ | SwiftUI, RESTful APIs, Local Cart Persistence, High-Velocity Checkout, Vellore Logistics | [Live on Apple App Store](https://apps.apple.com/app/id6743789966) |
| **CleanYourMac Keyboard** | macOS 14+ | Swift, AppKit, CGEventTap Input Monitoring, Universal Binary (Apple Silicon & Intel) | [Free & Open Source on GitHub](https://github.com/kaushalboii/CleanYourMacKeyboard) |

#### 🚪 Door 02 · Android Development (`Kotlin, Jetpack Compose & Clean Architecture`)
| Project | Platform | Architecture & Technologies | Distribution |
| :--- | :--- | :--- | :--- |
| **Vellore Ads Platform** | Android 8.0+ | Kotlin, Jetpack Compose, Kotlin Coroutines, Material 3, Classified Directory Engine | [Live on Google Play Store](https://play.google.com/store/apps/details?id=com.velloreads.app) |
| **Constitution of India (REF)** | Android 8.0+ | Kotlin, SQLite FTS5 Full-Text Search, Offline First, Bilingual Hindi/English, Material You | [Live on Google Play Store](https://play.google.com/store/apps/details?id=com.law.constitutionofindia) |
| **BNS & BNSS 2023 Reference** | Android 8.0+ | Kotlin, Room Database, IPC to BNS Cross-Conversion Matrix, Criminal Procedure Reforms | [Live on Google Play Store](https://play.google.com/store/apps/details?id=com.law.bns) |
| **CPC Act - Pocket Reference** | Android 8.0+ | Kotlin, Jetpack Compose, Offline First, Instant Section & Order FTS Search, Material 3 | [Live on Google Play Store](https://play.google.com/store/apps/details?id=com.law.cpc) |

#### 🚪 Door 03 · UI/UX Design (`Design Systems, Micro-Interactions & Ergonomics`)
| Project | Discipline | Design System & Deliverables | Access |
| :--- | :--- | :--- | :--- |
| **ZenLife — Mindful Audio UI** | Mobile Product Design | Figma Design Tokens, 432 Hz Soundwave Visualizer, Micro-Interactions, WCAG 2.1 AAA | [Interactive Showcase](https://kaushalboii.github.io/Kaushal-s-Portfolio/) |
| **SIMATS Academic Portal** | Enterprise UX Overhaul | UX Field Research, Information Architecture, Mobile Thumb-Zone Ergonomics, Figma System | [Academic System](https://kaushalboii.github.io/Kaushal-s-Portfolio/) |
| **Vellore Ads — Marketplace UX** | Consumer Marketplace | High-Density Mobile Feed, Category Filtering Taxonomy, Localized Micro-Interactions | [Google Play](https://play.google.com/store/apps/details?id=com.velloreads.app) |

#### 🚪 Door 04 · AI & Neural Nets (`Deep Learning, Computer Vision & Audio DSP`)
| Project | Domain | Model Architecture & Technologies | Source |
| :--- | :--- | :--- | :--- |
| **Automatic Comic Generator** | Generative AI | PyTorch, Deep Convolutional GAN (DCGAN), Latent Space Interpolation, Character Synthesis | [GitHub Repository](https://github.com/kaushalboii) |
| **ZenLife Acoustic AI Engine** | Audio DSP & AI | Python, Psychoacoustics, SciPy / NumPy, Real-Time FFT Spectral Shaping, 432 Hz Synthesis | [App Store & Python Suite](https://apps.apple.com/app/id6742334816) |
| **Computer Vision Suite** | Spatial Intelligence | Python, 40+ OpenCV Labs: Spatial Filtering, Canny Edge Detection, Haar Cascades, Contours | [GitHub Repository](https://github.com/kaushalboii) |

---

### 4. Astronomical Time Tunnel Clock Canvas (`#about`)
- **Concentric Perspective Rings**: Multi-tier HTML5 Canvas (`.story__bg`) rendering 16 depth-calibrated perspective dials, rotating hour indices, clock hands, and drifting cosmic particle fields.
- **Scroll Time Scrubbing**: As the user scrolls through the timeline, the clock dial physically winds counter-clockwise into the past.
- **Rolling Year Digits (`.story__yr`)**: Mechanical 4-digit odometer reels (`.dg__c`) that smoothly spin through career milestones:
  - **2026** — Mobile App Developer @ SIMATS Engineering College
  - **2025** — Mobile App Development Intern @ Redback IT Solutions
  - **2024** — Independent iOS & Android Application Architect
  - **2022** — B.Tech Information Technology, SIMATS (CGPA 8.1)
- **Sticky Viewport Pinning**: Cleanly pinned using `overflow-x: clip` on root document elements, ensuring Lenis smooth scroll and native `position: sticky` operate in lockstep without scroll freezing.

---

### 5. Interactive 3D Holographic Ability Card (`#holo`)
- **Gyroscopic 3D Motion**: Follows pointer position on desktop and device orientation on mobile devices with realistic spherical roll and idle sway.
- **Multi-Layer Specular Composite**:
  - `plate.webp` — Base card face with typography, role badges, and verified credentials.
  - `sheen.webp` — Gilt specular highlight responding to light direction.
  - `body.webp` — Dynamic rainbow diffraction foil with chromatic dispersion.
  - `win_bg.webp` & `win_sub.webp` — Multi-layered architectural illustration depth.
  - `back.webp` — Embossed monogram reverse plate.
- **180° 3D Flip**: Double-sided 3D flip card mechanic on click or tap.

---

### 6. Verlet Numerical Physics Pull Cord
- **Physical Rope Simulation**: Real-time numerical Verlet particle integration running on HTML5 canvas with segment distance constraints, gravity, drag, and inertia.
- **Turned Walnut Knob**: Photorealistic specular lighting, tactile grab threshold, and elastic spring recoil.
- **Design System Theme Engine**: Seamless instantaneous toggle between:
  - **Travertine Light Mode** (`#E8E4E0`) — Warm architectural stone aesthetic.
  - **Charcoal Dark Mode** (`#1A1818`) — Deep obsidian editorial contrast.

---

### 7. Statement Footer & Code ASCII Art (`#contact-footer`)
- **Full-Bleed Code ASCII Portrait (`.sf__ascii-bg`)**: Bespoke ASCII art rendering of Kaushal Maran generated from high-contrast terminal code typography, anchored in the footer background.
- **Full-Bleed Watermark**: Running typography `M KAUSHAL MARAN` spanning the horizon.
- **Live Local Time**: Header and footer synchronized to Vellore, India (IST, UTC+5:30).
- **Smooth Back-to-Top**: Native smooth scroll engine return to hero with magnetic button translations.

---

## 📱 Mobile Responsiveness & Touch Ergonomics

- **Fluid Viewport Clamp Scaling**: Typography, door dimensions (`clamp(170px, 46vw, 230px)`), and modal cards scale smoothly from `320px` iPhone SE screens to `2560px` ultra-wide monitors.
- **Mobile Hardware Acceleration**: 3D perspective transforms on phone mockups automatically disable (`transform: none !important;`) on viewports `< 640px` to guarantee 60fps GPU rasterization and prevent anti-aliasing blur.
- **Safe Vertical Flow**: Hero portrait coordinates, desk calendar dimensions (`max-width: min(100%, 36rem)`), ability button, and live app carousel maintain collision-free vertical clearance.
- **Accessibility & Reduced Motion**: Full support for `prefers-reduced-motion: reduce`, ARIA roles (`role="dialog"`, `aria-modal="true"`, `aria-labelledby`), semantic headings, and high-contrast WCAG 2.1 compliant color tokens.

---

## 🛠️ Technology Stack & Engineering Standards

- **Core Engine**: Pure Semantic HTML5, Modular Vanilla JavaScript (ES2022+), Modern CSS3 (CSS Grid, Subgrid, Container Queries, CSS Variables).
- **Smooth Motion & Physics**: [Lenis v1.3.23](https://github.com/darkroomengineering/lenis), Canvas Verlet Particle Physics, Damped Harmonic Oscillators.
- **Typography**: Local high-performance WOFF2 font subsets of [Onest](https://fonts.google.com/specimen/Onest) (`onest-latin.woff2`, `onest-latin-ext.woff2`).
- **Asset Optimization**: WebP and high-efficiency PNG assets with `fetchpriority="high"` and lazy decoding.

---

## 📂 Repository Layout

```text
Kaushal-s-Portfolio/
├── index.html                   # Semantic markup, hero stage, doors wall, story, & footer
├── README.md                    # Systems architecture & project documentation
├── apple-touch-icon.png         # iOS home screen web clip icon
├── favicon.svg                  # SVG vector favicon
├── favicon.ico                  # Fallback ICO icon
├── .nojekyll                    # GitHub Pages raw asset pass-through
├── css/
│   └── style.css                # Design system, 3D doors, rooms, themes, & responsive queries
├── js/
│   └── main.js                  # Lenis engine, liquid reveal, door springs, & story controller
├── assets/
│   ├── kaushal-opt.png          # Full-color high-res cut-out portrait
│   ├── kaushal-bw.png           # Monochrome baseline portrait for liquid color reveal
│   ├── kaushal.png              # Original photographic asset
│   └── apps/                    # Verified app store screenshots & icons
│       ├── zenlife-icon.jpg
│       ├── zenlife-screen-1.jpg
│       ├── viana360-icon.jpg
│       ├── viana360-screen-1.jpg
│       ├── vianabuy-icon.jpg
│       ├── vianabuy-screen-1.jpg
│       ├── cleanmac-dmg-bg.png
│       ├── cleanmac-icon.png
│       ├── cleanmac-keyboard-app.jpg
│       ├── velloreads-icon.jpg
│       ├── constitution-icon.jpg
│       ├── bns-icon.jpg
│       └── cpc-icon.jpg
├── card/                        # 3D holographic ability card assets
│   ├── plate.webp               # Front credential plate
│   ├── back.webp                # Embossed monogram reverse face
│   ├── sheen.webp               # Gilt specular highlight mask
│   ├── body.webp                # Rainbow diffraction foil mask
│   ├── win_bg.webp              # Architectural illustration background
│   └── win_sub.webp             # Holographic illustration overlay
├── fonts/                       # Local typography subsets
│   ├── onest-latin.woff2
│   └── onest-latin-ext.woff2
└── vendor/
    └── lenis.min.mjs            # Lenis smooth scroll engine
```

---

## 🚀 Local Development Setup

No complex build pipelines, bundlers, or Node dependencies are required. Run directly in any modern browser:

```bash
# Clone the repository
git clone https://github.com/kaushalboii/Kaushal-s-Portfolio.git

# Navigate into the project directory
cd Kaushal-s-Portfolio

# Start a lightweight local HTTP server
python3 -m http.server 8000
# or using npx
npx serve .
```

Open `http://localhost:8000` in your web browser.

---

## 👨‍💻 Author & Connect

**M Kaushal Maran**  
*Mobile App Developer · SIMATS Engineering College, Information Technology '26*  
- **Portfolio**: [https://kaushalboii.github.io/Kaushal-s-Portfolio/](https://kaushalboii.github.io/Kaushal-s-Portfolio/)  
- **GitHub**: [@kaushalboii](https://github.com/kaushalboii)  
- **Email**: [kaushalmaranm@gmail.com](mailto:kaushalmaranm@gmail.com)  
- **Location**: Vellore / Chennai, Tamil Nadu, India

---

© 2026 M Kaushal Maran. Designed and engineered with architectural craft and first-principles execution.
