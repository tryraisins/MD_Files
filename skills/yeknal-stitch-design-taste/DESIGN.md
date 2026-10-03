# Design specification: [product name]

> Replace every bracketed field. This document guides screen generation; approved designs, repository tokens, working behavior, platform conventions, and accessibility requirements remain authoritative.

## 0. Metadata and authority

- **Version:** [version]
- **Reviewed:** [date]
- **Owner:** [person or team]
- **Generator/consumer:** [tool and downstream implementation context]
- **Screens/flows in scope:** [scope]
- **Authoritative sources:** [design files, repository paths, brand rules, platform guidance]
- **Reference evidence:** [URLs or evidence-ledger path]
- **Unresolved conflicts:** [items or none]

## 1. Product and user jobs

- **Product:** [what it is]
- **Audience:** [primary users and context]
- **Primary job:** [what users must understand or complete]
- **Trust/accessibility/localization constraints:** [constraints]
- **Real content and data available:** [inventory]

## 2. Direction

- **Visual thesis:** [one product-specific sentence]
- **Intended feeling:** [terms grounded in the product]
- **Signature device:** [one memorable treatment and its purpose]
- **Density / variance / motion intent:** [levels plus rationale]
- **Explicit rejections:** [three plausible patterns intentionally not used and why]

## 3. Semantic tokens

For each token list name, value/scale, functional role, theme behavior, contrast requirement, and source.

### Color

[Canvas, surface, text, border, focus, accent, feedback, and data roles]

### Typography

[Families, fallbacks, scripts, weights, scale, line height, tracking, measure, loading]

### Space, shape, depth, layers, and motion

[Spacing/grid/gutters, widths, radius, borders, elevation, z-index, duration/easing]

## 4. Layout and responsive transformation

| Region | Wide desktop | Standard/compact desktop | Tablet | Common/small phone | Zoom/input notes |
| --- | --- | --- | --- | --- | --- |
| Navigation | [behavior] | [behavior] | [behavior] | [behavior] | [notes] |
| Opening/primary task | [behavior] | [behavior] | [behavior] | [behavior] | [notes] |
| Main content/evidence | [behavior] | [behavior] | [behavior] | [behavior] | [notes] |
| Commitment/CTA | [behavior] | [behavior] | [behavior] | [behavior] | [notes] |
| Continuation/footer/recovery | [behavior] | [behavior] | [behavior] | [behavior] | [notes] |

Document intentional overflow, reordering, progressive disclosure, safe areas, virtual keyboard, orientation, pointer/no-hover, and reduced-motion behavior where relevant.

## 5. Components and states

| Component | Purpose/anatomy | Visual rules | States | Keyboard/touch/a11y | Content/localization |
| --- | --- | --- | --- | --- | --- |
| [name] | [details] | [details] | [idle through failure states] | [details] | [details] |

## 6. Content and assets

- **Voice and terminology:** [rules]
- **Image/illustration/icon language:** [rules and approved sources]
- **Placeholder/fixture policy:** [clear labeling; no fabricated proof]
- **Legal, privacy, attribution, and disclosure:** [requirements]
- **Open Graph/share representation:** [requirements]

## 7. Motion intent

| Interaction | Trigger and purpose | Intermediate/settled/exit | Interruption | Reduced-motion path | Evidence status |
| --- | --- | --- | --- | --- | --- |
| [name] | [details] | [details] | [details] | [details] | [proposed or verified] |

## 8. Accessibility and performance constraints

[Contrast, focus, semantics, target sizes, status announcements, input modes, budgets, image/font strategy]

## 9. Verification and change log

- **Rendered/verified:** [viewports, modes, browsers, flows]
- **Static-only assumptions:** [items]
- **Unresolved:** [items]
- **Changes from prior version:** [diff summary and rationale]
