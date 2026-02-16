# Dual-Layer Glow System

The landing page uses two identical animated glow layers at different z-depths to create a color wash effect that tints both the background and the foreground content.

## Layer stack

```
z-index

  50   .page::after  ← overlay glow (50% opacity, above content)
  40   .header       ← navigation bar
   2   .page         ← all page content (slides, text, cards)
   1   body::after   ← base glow (full opacity, below content)
   1   body::before  ← grain texture
   0   body          ← solid dark background
```

## Layer 1: Base glow (`body::after`)

**File:** `landingpage/app/globals.css`

Full-strength glow layer that sits **behind** all page content. This is the primary ambient light source.

```css
body::after {
  position: fixed;
  inset: -20%;
  z-index: 1;
  background-image:
    radial-gradient(circle at var(--glow-blue-x) var(--glow-blue-y),
      rgba(0, 112, 201, var(--glow-blue-a)), ...),
    radial-gradient(circle at var(--glow-pink-x) var(--glow-pink-y),
      rgba(232, 62, 140, var(--glow-pink-a)), ...),
    radial-gradient(circle at center, transparent 58%, rgba(0, 0, 0, 0.48));
  animation: glowOrbit 16s ease-in-out infinite;
}
```

- **Opacity:** 100% (full strength)
- **Vignette:** Third radial gradient darkens edges
- **Purpose:** Visible through gaps, provides depth behind cards/text

## Layer 2: Overlay glow (`.page::after`)

**File:** `landingpage/app/page.module.css`

Half-strength glow layer that sits **above** all page content. This adds subtle color tinting to text and UI elements.

```css
.page::after {
  position: fixed;
  inset: -20%;
  z-index: 50;
  opacity: 0.5;
  background-image:
    radial-gradient(circle at var(--glow-blue-x) var(--glow-blue-y),
      rgba(0, 112, 201, var(--glow-blue-a)), ...),
    radial-gradient(circle at var(--glow-pink-x) var(--glow-pink-y),
      rgba(232, 62, 140, var(--glow-pink-a)), ...);
  animation: glowOverlay 16s ease-in-out infinite;
}
```

- **Opacity:** 50% (half strength)
- **No vignette:** Omits the edge-darkening gradient (would dim content)
- **Purpose:** Tints white text with subtle color wash as orbs pass over

## Why two layers?

A single glow layer can only be **behind** or **in front of** content:

| Approach | Problem |
|----------|---------|
| Glow behind only | Text is pure white, feels disconnected from the ambient light |
| Glow in front only | Glow is consistent but background loses depth and color |
| **Dual layer** | Background has full color, text gets subtle tinting, feels immersive |

The 50% overlay opacity is the sweet spot — enough to see color influence on text without hurting legibility.

## Animation

Both layers animate using CSS `@property` registered custom properties. Each layer has its own `@keyframes` definition (scoped separately in globals.css vs CSS module) but with **identical keyframe values**, so they move in perfect sync.

### Animated properties

| Property | Type | Range | Effect |
|----------|------|-------|--------|
| `--glow-blue-x` | `<percentage>` | 22% – 82% | Blue orb horizontal position |
| `--glow-blue-y` | `<percentage>` | 12% – 54% | Blue orb vertical position |
| `--glow-blue-a` | `<number>` | 0.32 – 0.50 | Blue orb peak opacity |
| `--glow-pink-x` | `<percentage>` | 18% – 80% | Pink orb horizontal position |
| `--glow-pink-y` | `<percentage>` | 42% – 88% | Pink orb vertical position |
| `--glow-pink-a` | `<number>` | 0.30 – 0.50 | Pink orb peak opacity |

### Movement pattern

The two orbs move in roughly opposite paths — when blue drifts top-right, pink drifts bottom-left, and vice versa. Their opacity peaks alternate so the scene pulses between blue-dominant and pink-dominant phases.

```
  0%  blue top-right, bright   ←→  pink bottom-left, dim
 50%  blue bottom-left, bright ←→  pink top-right, dim
100%  (loop)
```

### Timing

- **Duration:** 16 seconds per cycle
- **Easing:** `ease-in-out` — smooth acceleration/deceleration at direction changes
- **`@property` registration:** Required with `inherits: false` so each element animates its own independent copy of the custom properties

## `inset: -20%`

Both layers extend 20% beyond the viewport on all sides. This prevents the glow orbs from being visually clipped when they drift near the edges — the radial gradient fades to transparent naturally instead of hitting a hard boundary.

## `pointer-events: none`

Both layers pass through all mouse/touch events to the content below.

## Grain texture (`body::before`)

A separate noise texture layer sits at the same z-index as the base glow:

- SVG `feTurbulence` noise tiled at 140x140px
- Dot grid pattern at 3x3px spacing
- `opacity: 0.1` — barely visible, adds film-like texture
- `animation: grainShift 8s steps(8) infinite` — jitters position in 8 discrete steps to simulate analog grain

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  body::before,
  body::after {
    animation: none;
  }
}
```

Both background layers freeze in place when the user has reduced motion enabled. The `.page::after` overlay should also respect this — consider adding a matching media query in the page module.
