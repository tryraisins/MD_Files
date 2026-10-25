# Mobile web platform layer

For a web app that will be used on a phone, ship these before the first component. They are CSS-and-meta fixes, not animation work, and they are the tells that separate a website from something installed.

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
```

- **Gate every `:hover` behind capability.** Touch has no hover, so the first tap applies `:hover` and leaves it stuck. Wrap hover styles in `@media (hover: hover) and (pointer: fine)`, and give touch users an `:active` state instead.
- **Kill the tap flash.** Set `-webkit-tap-highlight-color: transparent` once globally, then ensure every tappable element has its own `.active` feedback.
- **Use dynamic viewport units.** App shells, drawers, and bottom-pinned UI use `100dvh`; heroes and first screens use `100svh` so nothing is cut off. Avoid `100vh` for anything that must track the visible area.
- **Never let inputs zoom the page.** Keep input `font-size` at 16px (or scale up under `@media (pointer: coarse)`). Never use `user-scalable=no` or `maximum-scale=1`; fix the font size instead.
- **Make taps immediate.** Apply `touch-action: manipulation` to buttons, links, and `[role="button"]`, and give press feedback on `:active` or `pointerdown`, not on `click`.
- **Stop the browser hijacking scroll.** `overscroll-behavior: none` on `html, body` for an app shell; `overscroll-behavior: contain` on inner scroll containers. Prefer these over a `touchmove` + `preventDefault()` listener.
- **Pad safe areas.** With `viewport-fit=cover`, pad fixed headers, bottom bars, toasts, and sheets with `env(safe-area-inset-*)` (with a `0px` fallback inside `calc()`).
- **Keep text that is a control unselectable.** `user-select: none` on buttons, tabs, chips, and drag handles; never on `body`, because content text must stay selectable.
- **Tell the browser which axes a gesture owns.** `touch-action: pan-y` on a horizontal carousel, `pan-x` on a vertical drag handle, `none` only on a surface that truly handles every axis. Prefer native `scroll-snap` over a hand-rolled spring.
- **Verify on real hardware.** None of this reproduces in desktop device emulation. Connect a real phone (older than the one on your desk), test with the keyboard open, in landscape, and as an installed PWA if that is a target. State which fixes were verified from code and which need a device.
