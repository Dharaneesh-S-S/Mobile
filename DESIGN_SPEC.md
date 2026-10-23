# RupeeFlow UI Redesign Specification (Futuristic Teal Glass Fintech)

> **Reference Source:** Attached screenshot (`media_1792644562289.png`)  
> **Target Scope:** RupeeFlow Personal Money Studio (`web_money_src` and shell integration)  
> **Status:** Pending User Review (Step 1)

---

## 1. Design Language & Visual Atmosphere

- **Aesthetic Direction:** High-end, futuristic dark-canvas fintech.  
- **Atmosphere:** Deep obsidian backdrop with ethereal radial teal light bleeding through multi-layered translucent glass cards, fine 1px etched borders, luminous cyan glows, and crisp white call-to-action pills.
- **Key Visual Metaphors:**
  - **Backdrop:** Near-black with subtle vertical ambient light pillars and ultra-faint grid texture.
  - **Glass Surfaces:** Dark smoky teal-tinted translucent panels (`rgba(8, 22, 22, 0.6)`) with `backdrop-filter: blur(20px)` and subtle 1px cyan rim-highlights.
  - **Featured Glows:** Hero/active elements receive a diffuse radial cyan aura (`rgba(25, 230, 200, 0.25)` to `rgba(13, 148, 136, 0.4)`).
  - **Typography:** Modern geometric sans with tight tracking, small glowing eyebrow tags, and tabular bold figures with soft text glow.

---

## 2. Color Palette & Design Tokens

### 2.1 Canvas & Backgrounds
| Token Name | Hex / Value | Description |
|---|---|---|
| `--color-canvas-base` | `#030707` | Deepest obsidian canvas background |
| `--color-canvas-surface` | `#051211` | Secondary page backdrop |
| `--color-canvas-elevated` | `#081a18` | Sub-level container tint |
| `--glow-teal-primary` | `#19E6C8` | Core neon cyan/teal light source |
| `--glow-teal-secondary` | `#0D9488` | Mid-depth emerald-teal ambient light |
| `--glow-teal-deep` | `#064E3B` | Deep shadow undertone |

### 2.2 Glass Surfaces & Borders
| Token Name | Hex / RGBA | Usage |
|---|---|---|
| `--glass-bg-subtle` | `rgba(6, 18, 17, 0.45)` | Regular cards, inactive state |
| `--glass-bg-medium` | `rgba(8, 24, 23, 0.65)` | Active cards, dialogs, drawers |
| `--glass-bg-elevated` | `rgba(12, 32, 30, 0.82)` | Modals, floating action pills |
| `--glass-border-faint` | `rgba(45, 212, 191, 0.08)` | Outer boundary line on dark surfaces |
| `--glass-border-glow` | `rgba(45, 212, 191, 0.22)` | Hover and focused border accent |
| `--glass-border-active` | `rgba(25, 230, 200, 0.50)` | Featured card border rim |
| `--glass-top-highlight` | `linear-gradient(90deg, transparent, rgba(45, 212, 191, 0.35), transparent)` | Top-edge specular glass reflection |

### 2.3 Typography & Foreground
| Token Name | Hex / Value | Description |
|---|---|---|
| `--text-white-heading` | `#F4FFFD` | Crisp, high-contrast headings |
| `--text-teal-body` | `#94B5B0` | Calibrated teal-grey body text |
| `--text-teal-muted` | `#5B7B76` | Captions, timestamps, secondary labels |
| `--text-teal-dim` | `#354F4B` | Disabled states, subtle divider text |
| `--text-accent-cyan` | `#2DD4BF` | Key metric values, active navigation |

### 2.4 Currency & Financial Semantics (Indian Rupee ₹)
> **Rule:** All currency formatted via `Intl.NumberFormat('en-IN')` (e.g., `₹1,23,456`).
| Semantic | Hex Token | Glow / Shadow | Usage |
|---|---|---|---|
| **Income (+)** | `#19E6C8` (Bright Teal) | `0 0 16px rgba(25, 230, 200, 0.35)` | Deposits, salary, interest |
| **Expense (-)** | `#FF6B6B` (Soft Coral) | `0 0 16px rgba(255, 107, 107, 0.25)` | Purchases, outgoing bills |
| **Transfer / Neutral** | `#38BDF8` (Ice Sky) | `0 0 16px rgba(56, 189, 248, 0.25)` | Account transfers, balance adjustments |
| **Net Savings Positive** | `#2DD4BF` (Neon Mint) | `0 0 20px rgba(45, 212, 191, 0.3)` | Positive net balance |

### 2.5 Button Hierarchy
- **Primary CTA:** High-contrast solid white pill (`#FFFFFF`), text `#04100F`, font-bold, `shadow-[0_0_25px_rgba(255,255,255,0.2)]`, hover `bg-slate-100`.
- **Secondary Ghost Pill:** Translucent teal (`rgba(13, 148, 136, 0.15)`), border `1px solid rgba(45, 212, 191, 0.3)`, text `#2DD4BF`, hover `rgba(13, 148, 136, 0.25)` & border `#19E6C8`.
- **Floating Accent Pill:** Deep teal glass (`rgba(6, 20, 20, 0.85)`), border `1px solid rgba(45, 212, 191, 0.2)`, backdrop-blur 20px.

---

## 3. Radii, Shadows & Elevation Scale

### Radii Scale
- **Small (Chips, mini badges):** `10px` (`rounded-xl`)
- **Medium (Inputs, action rows):** `16px` (`rounded-2xl`)
- **Large (Cards, bento cells):** `24px` to `30px` (`rounded-3xl`)
- **Pill (Buttons, nav bars, tags):** `9999px` (`rounded-full`)

### Shadows & Glows
```css
/* Standard ambient card shadow */
--shadow-glass-card: 0 20px 50px -15px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.05);

/* Featured/Active card outer teal aura */
--shadow-card-featured: 0 0 50px -10px rgba(25, 230, 200, 0.30), 0 25px 50px -12px rgba(0, 0, 0, 0.8);

/* Pill button white glow */
--shadow-btn-white: 0 0 20px rgba(255, 255, 255, 0.18), 0 4px 12px rgba(0, 0, 0, 0.4);

/* Text glow for key balance figures */
--text-glow-teal: 0 0 24px rgba(25, 230, 200, 0.35);
```

---

## 4. Typography Hierarchy

| Level | Size | Weight | Tracking | Color |
|---|---|---|---|---|
| **Eyebrow Tag** | `10px` / `0.65rem` | `700` (Bold) | `+0.08em` (Wide) | `--text-accent-cyan` in pill badge |
| **Hero Display** | `36px - 44px` | `700` (Bold) | `-0.03em` (Tight) | `--text-white-heading` |
| **Section Title** | `22px - 28px` | `600` (Semi-bold) | `-0.02em` | `--text-white-heading` |
| **Large Balance** | `26px - 34px` | `700` (Bold, Tabular) | `-0.025em` | `--text-white-heading` + text glow |
| **Card Header** | `15px - 17px` | `600` (Semi-bold) | `-0.01em` | `--text-white-heading` |
| **Body Regular** | `13px - 14px` | `400` / `500` | Normal | `--text-teal-body` |
| **Caption & Meta**| `11px - 12px` | `500` | Normal | `--text-teal-muted` |

---

## 5. Component Library Specifications

### 5.1 Floating Glass Navigation Pill
- **Desktop Top / Mobile Floating Pill:** Centered or anchored glass bar with `backdrop-blur-xl`, `bg-[#061413]/80`, border `1px solid rgba(45, 212, 191, 0.18)`.
- Left: RupeeFlow ₹ icon in glowing teal circle.
- Center: Active navigation links with cyan indicator dot.
- Right: Balance pill + White pill "+ New" action button.

### 5.2 BentoGrid & GlassCard
- Three-tier cards:
  1. **Standard Glass Card:** Translucent dark teal-black, 1px subtle cyan border, specular top rim reflection.
  2. **Featured / Spotlight Card:** Center card with radial gradient backlight (`radial-gradient(circle at 50% 0%, rgba(25, 230, 200, 0.22), transparent 70%)`), illuminated border rim.
  3. **Metric Tile:** Compact square/wide card with icon tile, small eyebrow tag, huge tabular rupee balance, and trend pill.

### 5.3 Inputs, Keypad & Forms
- **Inputs:** `bg-[rgba(5,18,17,0.7)]`, border `rgba(45, 212, 191, 0.15)`, focus ring `2px rgba(25, 230, 200, 0.5)`.
- **Segmented Type Switcher:** Three pill segments (Expense / Income / Transfer) inside a dark pill track; active segment glows (Coral for expense, Teal for income, Sky for transfer).
- **Calculator Keypad:** Glass pill keys with smooth tactile depression (`active:scale-95`).

### 5.4 Recharts Customization
- **Donut Chart:** Rounded corner segments (`cornerRadius={8}`), vibrant teal/coral/sky gradient fills, blurred drop shadow, center text with glowing net total.
- **Bar & Area Charts:** Linear gradient fills transitioning from `#19E6C8` at top to `rgba(25, 230, 200, 0.0)` at bottom; faint dashed grid lines (`rgba(45, 212, 191, 0.08)`).
- **Custom Tooltip:** Sleek glass box with 1px teal border, displaying date and formatted rupee amounts.

### 5.5 Optional Landing Page (`/welcome`)
- Matches the reference layout:
  1. Floating glass navigation bar
  2. Hero with confident typography: *"Books Done. Stress is Gone."* -> RupeeFlow adaptation: *"Money Mastered. Stress is Gone."*
  3. Interactive Dashboard Showcase with radial teal backlight
  4. *"Why Individuals & Families Choose RupeeFlow"* Bento Grid
  5. 3 Tier Pricing Cards (Free ₹0, Pro ₹99/mo, Family ₹199/mo) with monthly/yearly toggle and featured glowing center card
  6. Testimonial carousel with center glowing card
  7. FAQ Accordion with rounded rows and glowing inner details
  8. Final CTA with glowing keyhole icon and white pill button

---

## 6. Motion & Performance Guidelines

1. **60 FPS Rule:** Use hardware-accelerated transforms and opacity for animations.
2. **Backdrop Blur Optimization:** Avoid stacking multiple nested `backdrop-blur` layers.
3. **Accessibility:** Respect `prefers-reduced-motion` media query. Provide a *"Reduce Effects"* toggle in Settings that switches complex radial glows and blurs to crisp solid dark-teal surfaces.
4. **Data & Routing Safety:** Zero logic, route, or state changes. Indian Rupee formatting (`₹`) and integer paise accuracy preserved 100%.

---

## 7. Next Implementation Steps

- **Step 1:** Review and approve this `DESIGN_SPEC.md` specification.
- **Step 2:** Update CSS tokens (`index.css`), Tailwind config (`tailwind.config.js`), and build reusable components in `src/components/ui/` (`GlassCard`, `BentoGrid`, `Button`, `Badge`, `StatTile`, etc.).
- **Step 3:** Apply futuristic teal glass styling across all tabs (Transactions, Calendar, Analytics, Wallets, Modals).
- **Step 4:** Restyle Recharts and Add the `/welcome` showcase page.
- **Step 5:** Run tests and build verification.
