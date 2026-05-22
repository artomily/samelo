# Samelo Brand

## Identity
**Samelo** — _Watch content across the galaxy. Mine your rewards._

A space-entertainment micro-economy on Celo. Users explore video content, accumulate points, and claim real cUSD. The aesthetic is deep space HUD: neon lime on void black, all display text in Orbitron, all running copy in Space Grotesk.

---

## Colors

| Token | Value | Use |
|---|---|---|
| `--accent` | `#c8f135` | Primary lime green — CTAs, glow, active states |
| `--bg` | `#030303` | Void black background |
| `--surface` | `#080808` | Slightly raised surfaces |
| `--card` | `#0d0d0d` | Card backgrounds |
| `--text-primary` | `#f0f0f0` | Body text |
| `--text-muted` | `#555555` | De-emphasised text |
| `--border` | `rgba(200,241,53,0.12)` | Default borders |
| `--accent-glow` | `rgba(200,241,53,0.25)` | Glow halos |
| `--accent-glow-strong` | `rgba(200,241,53,0.45)` | Strong glows / active halos |

### CSS Custom Properties (full set)
```css
--accent: #c8f135;
--accent-dim: rgba(200,241,53,0.10);
--accent-glow: rgba(200,241,53,0.25);
--accent-glow-strong: rgba(200,241,53,0.45);
--bg: #030303;
--surface: #080808;
--card: #0d0d0d;
--border: rgba(200,241,53,0.12);
--text-primary: #f0f0f0;
--text-muted: #555555;
```

---

## Typography

| Role | Font | Weight | Class |
|---|---|---|---|
| Display / Headings | **Orbitron** | 400–900 | `font-display` or `font-orbitron` |
| Body / UI | **Space Grotesk** | 300–700 | default (`font-sans`) |

### Display usage rules
- All section labels: `font-display text-[10px] font-bold uppercase tracking-[0.2em]`
- All `<h1>` / `<h2>` hero: `font-display text-3xl+ font-black tracking-tight`
- Money amounts in HUD: `font-display font-black tabular-nums`
- Nav labels + badge text: `font-display uppercase tracking-widest`

---

## Component Patterns

### `.glass-card`
```css
background: rgba(200,241,53,0.03);
border: 1px solid rgba(200,241,53,0.12);
border-radius: 1rem;
backdrop-filter: blur(12px);
```

### `.btn-neon`
```css
display: inline-flex; align-items: center; gap: 0.5rem;
padding: 0.75rem 1.75rem;
border-radius: 9999px;
background: #c8f135; color: #030303;
font-family: Orbitron; font-weight: 900; font-size: 13px;
text-transform: uppercase; letter-spacing: 0.12em;
box-shadow: 0 0 16px rgba(200,241,53,0.35), 0 0 40px rgba(200,241,53,0.12);
transition: box-shadow 200ms, transform 150ms;
```

### Glow text shadow
```css
text-shadow: 0 0 12px rgba(200,241,53,0.4);
```

---

## Tone & Voice

- **Cosmic, terse, confident.** Copy reads like a mission briefing.
- Verbs: _Watch. Mine. Deploy. Claim. Explore._
- Avoid: "earn money", "passive income" — prefer "mine rewards", "deploy on-chain"
- Sections labelled as: _Why Samelo_, _Mission Modules_, _Transmissions_, _Initiate launch sequence_
- Numbers formatted with `font-display` monospace Orbitron with glow

---

## Keyframes (globals.css)
`float`, `float-slow`, `glow-pulse`, `glow-pulse-text`, `orbit`, `orbit-reverse`, `star-twinkle`, `particle-rise`, `scan-h`, `emerge`, `ticker`, `ticker-reverse`, `fadeInUp`

## Utility animation classes
`.animate-float`, `.animate-float-slow`, `.animate-glow-pulse`, `.animate-orbit`, `.animate-orbit-slow`, `.animate-orbit-rev`, `.animate-emerge`
