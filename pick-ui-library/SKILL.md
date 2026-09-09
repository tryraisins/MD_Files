---
name: pick-ui-library
description: Pick the right library or inspectable source registry for a frontend task from a curated list covering accessible primitives, distinctive React components, motion, numbers, OTP inputs, charts, command menus, virtualization, drag and drop, toasts, state, and styling. Only runs when explicitly invoked; it does not trigger on its own.
metadata:
  rare-ui-reviewed-commit: b3efd6c290884a852b7af39d34df99a762dbbf3f
  spell-ui-reviewed-commit: fffe96db7b67b44243bf35815916fdfc58fe5014
  oil-motion-reviewed-commit: eafd4a45dc9c996489df3c54ac4ebdcde2bd030b
  last-reviewed: "2026-09-09"
---

# Picking The Right Library

## Automatic UI Quality Contract

For every visible UI output, also apply the `ui-quality-baseline` skill. This is automatic for a full product, a redesign, design-to-code work, or one small element such as a button, badge, input, icon, skeleton, loader, or animation. Preserve approved design files, established brands, platform conventions, and existing functional behavior; then enforce shared tokens, uniform padding and radii, coherent typography and iconography, optical centering, responsive containment, truthful loading states, purposeful motion, reduced-motion support, and rendered QA. This contract takes precedence over generic instructions later in this skill that mandate a fixed animation count, Lucide/Feather as a default, a loader package everywhere, or one-off spacing and radius values.


A lookup skill. When invoked with a task ("I need toasts", "what should I use for drag and drop?"), match the task to the curated list below and recommend the library. These are deliberate, taste-driven picks — don't substitute alternatives outside this list unless the user asks for one or the task genuinely isn't covered.

## How to use this

1. **Identify the task**, not the library the user named. "I need to show a dropdown" is a UI-primitives task (base-ui), even if they asked about something else.
2. **Check what's already installed.** Look at `package.json` first. If the project already uses a listed library, use it. If it uses a competitor (e.g. react-window instead of Virtuoso), flag the recommendation but don't churn the dependency without being asked.
3. **Recommend one library**, state what it's for in one sentence, and install/wire it up if that's part of the request. Don't present a menu of options when the list has a clear answer.
4. If the task isn't covered by the list, say so explicitly and recommend from your own knowledge — but be clear you've left the curated list.

For source registries such as shadcn or Rare UI, inspect `components.json`, the package manager, React/Tailwind versions, and existing primitives first. Search the current registry rather than relying on a memorized component list. Install one selected component, review the source and dependency diff, then adapt it to the product's tokens and accessibility contract. A registry component is owned application code after installation, not an opaque dependency.

## The list

### UI components & primitives

| Task | Library |
| --- | --- |
| Unstyled, accessible UI components (dialogs, popovers, menus, selects…) | [base-ui](https://base-ui.com) |
| Distinctive animated React source components in a shadcn-compatible project | Start with [Rare UI](https://www.rareui.com/components); also inspect [beUI](https://beui.dev/), [Spectrum UI](https://ui.spectrumhq.in/), or [Spell UI](https://github.com/xxtomm/spell-ui) when their exact component better fits the interaction. |
| Command menus (⌘K palettes) | [cmdk](https://cmdk.paco.me) |
| Toasts / notifications | [Sonner](https://sonner.emilkowal.ski) |
| One-time password / verification code inputs | [input-otp](https://input-otp.rodz.dev) |
| Customizable GUIs / control panels | [Leva](https://github.com/pmndrs/leva) — [dialkit](https://joshpuckett.me/dialkit) is an alternative |

### Motion & visuals

| Task | Library |
| --- | --- |
| General-purpose animation (springs, layout animations, enter/exit) | [motion](https://motion.dev) (Framer Motion) |
| Complex scroll choreography and timelines | [GSAP](https://gsap.com) — only when CSS or Motion is not sufficient |
| Generated/captured frame timelines controlled by scroll, pointer, drag, touch, orientation, audio, data, or state | `oil-motion` skill |
| Animating numbers (counters, prices, stats) | [NumberFlow](https://number-flow.barvian.me) |
| Animated text components | [torph](https://torph.lochie.me/) |
| 3D globes | [Cobe](https://cobe.vercel.app) |
| Dynamic OG images (HTML/CSS → SVG/PNG) | [Satori](https://github.com/vercel/satori) |
| Syntax highlighting | [shiki](https://shiki.style) |

Reach for motion when you need springs, layout animations, exit animations, or gesture-driven values. A simple hover or fade doesn't need it — plain CSS transitions are the right tool there.

Rare UI is a source registry, not a visual system. Its current components use React, TypeScript, Tailwind, Motion, and component-specific dependencies. Verify the exact item before installation. A typical install is:

```bash
npx shadcn@latest add swamimalode07/rare-ui/<component-name>
```

Use the project's package runner in place of `npx` when appropriate. Do not paste a demo wholesale, assume every component has the same dependency set, or retain demo colors, spacing, icons, and motion when they conflict with the product brief. Check reduced motion, focus/keyboard behavior, pointer gating, server/client boundaries, bundle cost, and narrow-width behavior after installation.

The same source-ownership rule applies to the other reviewed registries:

- [beUI](https://beui.dev/) currently targets React 19 and Tailwind 4, uses Motion, and distributes through shadcn. Confirm project-version compatibility before copying a component.
- [Spectrum UI](https://ui.spectrumhq.in/) exposes shadcn/Tailwind/Motion components and blocks, including AI-oriented activity and approval patterns. Verify license, installation path, semantics, and whether motion adds real value.
- [Spell UI](https://github.com/xxtomm/spell-ui) is an MIT source repository reviewed at `fffe96db7b67b44243bf35815916fdfc58fe5014`. Review the exact component: some primitives use client-only state, Motion, SVG filters, timers, or narrowly styled markup that require adaptation.

Registry selection is not a beauty contest. Compare the precise interaction, license, maintenance, peer dependencies, React and Tailwind versions, accessibility, reduced-motion behavior, server/client boundary, bundle cost, and touch/responsive behavior. If two sources solve the same need, prefer the one already compatible with the project and requiring the least corrective work.

### Icons and loading feedback

| Task | Library or primitive |
| --- | --- |
| Coherent React icon system when the project has none | [Phosphor Icons](https://phosphoricons.com) |
| Layout-shaped React skeletons when no design-system primitive exists | [react-loading-skeleton](https://www.npmjs.com/package/react-loading-skeleton) |
| Next.js route-transition progress | [nextjs-toploader](https://www.npmjs.com/package/nextjs-toploader) — navigation only |
| Visible assistant/process activity when the product tone supports it | [thinking-orbs](https://www.npmjs.com/package/thinking-orbs) — conditional, not a universal spinner replacement |

Prefer the product's existing icon, skeleton, progress, and overlay primitives when they are coherent. Do not mix icon families, add a loader package for a single trivial state, use route progress for data fetching, or install `thinking-orbs` in an ordinary non-agent product merely because it is animated. Full-screen blocking overlays are usually a local accessible composition, not a reason to add another library.

### Charts

| Task | Library |
| --- | --- |
| Real-time / streaming charts | [Liveline](https://github.com/benjitaylor/liveline) |
| General charts (static or interactive dashboards) | [recharts](https://recharts.org) |

The split: if data points arrive live and the chart scrolls with time, use Liveline. Everything else is recharts.

### Interaction & performance

| Task | Library |
| --- | --- |
| Drag and drop | [dnd kit](https://dndkit.com) |
| Virtualization (long lists, large tables) | [Virtuoso](https://virtuoso.dev) |

### State & styling

| Task | Library |
| --- | --- |
| State management | [zustand](https://zustand.docs.pmnd.rs) |
| Constructing `className` strings conditionally | [clsx](https://github.com/lukeed/clsx) |
| Type-safe, variant-driven styling for Tailwind | [cva](https://cva.style) |
| Theme switching / dark mode (no flash on load) | [next-themes](https://github.com/pacocoursey/next-themes) |

The styling split: clsx for ad-hoc conditional classes; cva when a component has real variants (size, intent, state) that deserve a typed API. They compose — cva uses clsx-style inputs internally.

## Common mismatches to catch

- **Toasts built by hand or with a modal library** → Sonner exists for exactly this.
- **A `<div>`-based dropdown/dialog with manual focus handling** → base-ui, which handles accessibility, focus trapping, and dismissal.
- **A bespoke animated React primitive whose interaction already exists in Rare UI** → inspect and install that source component, then adapt and verify it instead of recreating the demo from memory.
- **Choosing a registry by its homepage aesthetic** → inspect the exact component and dependency graph; homepage polish says nothing about the code's fit or accessibility.
- **A Rare UI demo selected only because it looks unusual** → reject it unless its interaction supports the page's job and subject-specific visual thesis.
- **Animating a number by re-rendering text** → NumberFlow handles digit transitions properly.
- **Starting a second icon library for one control** → use the product's existing family, or Phosphor consistently if no family exists.
- **Random gray skeleton bars** → shape the placeholder like the final content and reuse the design system before adding `react-loading-skeleton`.
- **A full-screen loader for a short button action** → keep feedback inside the stable button; reserve overlays for genuinely blocking work.
- **Rendering a 1,000+ row list directly** → Virtuoso before reaching for pagination hacks.
- **A `useState`-per-component web of props for shared state** → zustand.
- **Template-literal className ternaries three conditions deep** → clsx (or cva if it's variant-shaped).
- **Using a generated video for an ordinary component transition** → CSS or Motion; reserve `oil-motion` for continuous frame-based visual change.
