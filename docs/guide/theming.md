# Theming

All components read CSS custom properties from `tokens.css`. Override them after importing the stylesheet:

```css
:root {
  --nu-primary: #0d9488;
  --nu-radius: 6px;
  --nu-sidebar-width: 240px;
  --nu-font: 'Plus Jakarta Sans', system-ui, sans-serif;
}
:root[data-theme='dark'] {
  --nu-primary: #2dd4bf;
}
```

Hover states and soft tints are derived with `color-mix()`, so one variable per color is enough.

- **Dark mode** uses neutral blacks (`#0a0a0a` background, `#171717` cards), never blue-tinted. `useTheme().setMode('light' | 'dark' | 'auto')`.
- **Brand color at runtime:** `useTheme().setPrimary('#e11d48')`.
- **Density:** the kit is compact by default — 6px/4px radii, 14px card padding, 16px grid gap, 32–34px controls. Tune with `--nu-radius`, `--nu-radius-sm`, `--nu-content-padding`, `--nu-navbar-height`, `--nu-sidebar-width`.
- **Charts** use their own categorical tokens `--nu-chart-1` … `--nu-chart-8` (kept apart from status colors), and maps use the sequential ramp `--nu-seq-1` … `--nu-seq-5`.
- **Status colors:** `primary`, `secondary`, `success`, `warning`, `danger`, `info` — every component with a `color` prop accepts these.

Component classes are unscoped and prefixed `nu-` (BEM-style), so they are easy to override in your own CSS.
