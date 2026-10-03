# Repository Agent Instructions

These instructions apply to work in this Agent Skills catalog. Preserve the catalog's existing conventions and validate Markdown and skills with the repository checks before publishing.

## Testing and verification policy

- Never write unit tests after writing the code they would cover. If a unit test is genuinely necessary, write it before the corresponding implementation.
- Strongly prefer end-to-end (E2E) tests as the sole testing mechanism. Use E2E flows to prove complex behavior, including important error and recovery paths.
- At the end of each E2E run, produce a verifiable, repeatable artifact, such as a runnable command or script, report, trace, screenshot, or log.
- When isolated testing is necessary, first write down the concrete ways the system could fail; only then write the isolated test or harness code.
- For this documentation/catalog repository, run the existing Markdown, skill, and CLI validation commands. Do not create unit tests after implementation to validate documentation edits.

For the full reusable workflow, see [`testing-strategy/SKILL.md`](testing-strategy/SKILL.md).

## Frontend design stack defaults

When a design or redesign of a user interface is requested, default to
**Tailwind CSS + shadcn/ui** for the styling and component layer whenever the
current stack is React-compatible.

- The default applies at all times, not only when the project already uses
  Tailwind or shadcn. If the stack is React-based (Next.js, Vite/React, React
  Router, Astro with React islands, TanStack Start, or plain React), use or set
  up Tailwind CSS (v4) and shadcn/ui, even when neither is present yet.
- Apply the default only when it is compatible with the current stack. If the
  project is not React-compatible (for example Vue, Svelte, Angular, plain
  HTML/CSS, a native app, or a design-tool file such as Paper/Penpot/Pencil), do
  not force React or shadcn; use the stack-appropriate equivalent and note the
  deviation.
- Use shadcn/ui on the Radix base (`npx shadcn@latest init -d --base radix`) and
  add only the components the work needs. Prefer shadcn primitives over raw
  `button`/`input`/`select`/`div` markup. Free, source-copied components from the
  core registry, the `@v0` registry, and AI Elements are acceptable.
- Inspect the existing design system first (`components.json`, registry, tokens,
  `DESIGN.md`, brand assets). An explicit brief, approved design, established
  brand, or documented identity wins; reconcile with an existing system rather
  than replacing it wholesale.
- Libraries supply mechanics, not the visual thesis. Never let shadcn's default
  demo styling become the product identity; adapt components to the product's
  tokens, semantics, focus behavior, motion, and accessibility, and keep
  `prefers-reduced-motion` and responsive containment intact.

This default is carried by the distributed design skills
(`frontend-design`, `redesign-existing-projects`, `ui-quality-baseline`) so that
installs via `npx yeknal skills` inherit it across agents and harnesses.
