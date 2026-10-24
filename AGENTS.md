# Repository Agent Instructions

These instructions apply to work in this Agent Skills catalog. Preserve the catalog's existing conventions and validate Markdown and skills with the repository checks before publishing.

## Testing and verification policy

- Do not write, scaffold, or generate unit tests. Verify with end-to-end (E2E) tests or by running the feature through its real entry point.
- Running an existing unit suite is allowed and often required; report its failures, but do not add cases to it, repair it by writing another test, or create a new suite. Fix production code instead, and report a test that itself looks wrong.
- Use E2E flows to prove complex behavior, including important error and recovery paths.
- At the end of each E2E run, produce a verifiable, repeatable artifact, such as a runnable command or script, report, trace, screenshot, or log.
- When E2E cannot reach a boundary, name the unreachable boundary, gather the strongest real evidence available, and ask before writing any isolated test or harness code.
- For this documentation/catalog repository, run the existing Markdown, skill, and CLI validation commands. Do not create unit tests to validate documentation edits.

For the full reusable workflow, see [`skills/yeknal-testing-strategy/SKILL.md`](skills/yeknal-testing-strategy/SKILL.md).

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
(`yeknal-frontend-design`, `yeknal-redesign-existing-projects`, `yeknal-ui-quality-baseline`) so that
installs via `npx yeknal skills` inherit it across agents and harnesses.

## Interface standard

Every design and implementation decision must lift the user experience (UX), the
developer experience (DX), and the agent experience (AX) together, without breaking
existing behavior. When they conflict, keep the product correct first, then protect
UX, then weigh DX and AX equally.

Cut taglines, helper text, and secondary labels. Keep them only when the layout
cannot carry the meaning: required field labels, error messages, consequence
warnings, and accessibility text. Never cut a label a user needs to identify a
field, understand a failure, or tell a destructive action from a safe one. In
data-dense UI, a secondary label that distinguishes rows, states, or metrics is
content. If a screen needs explanation to make sense, fix the layout instead of
adding copy.

This standard reaches every install because `yeknal-ui-quality-baseline` carries it.

## Portfolio skills library

When you add, edit, rename or remove a skill, keep `site/presentation.json` in step and, after the change is pushed and CI passes, sync the portfolio library with `node tools/sync-portfolio.js --portfolio <portfolio checkout>`. Follow the publication sequence in the README's "Portfolio skills library" section. Do not add scheduled synchronization or cross-repository credentials.
