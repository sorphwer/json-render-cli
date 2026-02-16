# Liquid Glass Effect (CSS + SVG)

Implementation spec for the frosted liquid glass effect used on the landing page header bar.

## Browser Support

| Browser | Effect |
|---------|--------|
| Chrome 76+ | Full: SVG displacement + blur + saturate |
| Safari 14+ | Fallback: blur + saturate only (SVG filter in `backdrop-filter` not supported) |
| Firefox | Fallback: blur + saturate only |

## Architecture

The effect is built from three layers:

1. **SVG displacement filter** — distorts the backdrop pixels to simulate refraction through uneven glass
2. **CSS `backdrop-filter`** — applies blur, saturation boost, and brightness on top of the distortion
3. **CSS styling** — background gradient, border, and box-shadow create the glass surface appearance

## SVG Filter

A hidden inline SVG defines the displacement filter. It must be in the DOM (not in CSS) so `url(#id)` can reference it.

```xml
<svg width="0" height="0" style="position:absolute;left:-9999px;top:-9999px" aria-hidden="true">
  <defs>
    <filter id="liquid-glass">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.003"
        numOctaves="2"
        seed="7"
        result="noise"
      />
      <feGaussianBlur in="noise" stdDeviation="1.5" result="map" />
      <feDisplacementMap
        in="SourceGraphic"
        in2="map"
        scale="80"
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  </defs>
</svg>
```

### Filter pipeline

```
feTurbulence → feGaussianBlur → feDisplacementMap
   noise          smooth map       distort backdrop
```

### Tunable parameters

| Parameter | Element | Effect | Current |
|-----------|---------|--------|---------|
| `baseFrequency` | `feTurbulence` | Noise texture density. Higher = finer/more chaotic patterns | `0.003` |
| `numOctaves` | `feTurbulence` | Noise detail layers. Higher = more complex texture | `2` |
| `seed` | `feTurbulence` | Random seed. Change to get a different distortion pattern | `7` |
| `stdDeviation` | `feGaussianBlur` | Smoothness of the noise map. Higher = rounder, more fluid distortion | `1.5` |
| `scale` | `feDisplacementMap` | Displacement magnitude in pixels. Higher = stronger refraction | `80` |

## CSS: backdrop-filter

The SVG filter is applied via inline `style` to avoid CSS Modules mangling the `url(#id)` reference.

```jsx
<header
  style={{
    backdropFilter: "url(#liquid-glass) blur(2px) saturate(1.8) brightness(1.1)",
    WebkitBackdropFilter: "blur(14px) saturate(1.8) brightness(1.1)"
  }}
>
```

### Why inline style?

Next.js CSS Modules process `url()` values and may attempt to resolve `url(#liquid-glass)` as a file path, breaking the fragment reference. Inline `style` bypasses this.

### Filter order matters

`url(#liquid-glass)` must come **before** `blur()`. The pipeline is:

1. SVG filter distorts the backdrop pixels (refraction)
2. `blur()` softens the distorted result (frosted look)
3. `saturate()` / `brightness()` boost vibrancy

If blur comes first, the distortion operates on already-blurred pixels and becomes invisible.

### Safari fallback

`-webkit-backdrop-filter` omits the SVG filter URL (Safari ignores it anyway) and uses a higher blur value to compensate for the missing distortion.

## CSS: Glass surface

```css
.header {
  border-radius: 999px;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.04) 50%,
      rgba(255, 255, 255, 0.06) 100%
    ),
    rgba(18, 18, 18, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 10px 28px rgba(0, 0, 0, 0.35),           /* drop shadow for depth */
    inset 0 1px 0 rgba(255, 255, 255, 0.45),    /* top edge highlight */
    inset 0 -1px 0 rgba(255, 255, 255, 0.18),   /* bottom edge highlight */
    inset 6px 6px 16px rgba(255, 255, 255, 0.08); /* diffuse inner glow */
  overflow: hidden;
}
```

### Key details

- **`overflow: hidden`** — clips any displacement artifacts at the element boundary
- **Semi-transparent background** — required for `backdrop-filter` to sample through
- **Top/bottom inset shadows** — simulate glass thickness with edge highlights, mimicking light refraction at the glass border
- **Gradient background** — subtle top-bright-to-middle-dark gradient adds the curved glass surface illusion

## Common pitfalls

| Problem | Cause | Fix |
|---------|-------|-----|
| No distortion visible | Blur too high, obscures displacement | Reduce `blur()` to 2-6px |
| White/distorted edges | Displacement pushes edge pixels out of bounds | Add `overflow: hidden` on the element |
| Effect not working at all | CSS Modules mangled `url(#id)` | Use inline `style` for `backdrop-filter` |
| Entire backdrop-filter fails | Browser doesn't support SVG filter in backdrop-filter | Provide `-webkit-backdrop-filter` fallback without SVG URL |
| `contain: paint` breaks blur | Creates isolated paint boundary, blocks backdrop sampling | Do not use `contain: paint` on elements with `backdrop-filter` |

## References

- [CSS + SVG iOS 26 Liquid Glass](https://im1010ioio.hashnode.dev/css-svg-ios26-liquid-glass) — original technique article
- [Liquid Glass in the Browser: Refraction with CSS and SVG](https://kube.io/blog/liquid-glass-css-svg/) — SVG displacement map approach
- [MDN: feDisplacementMap](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap)
- [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
