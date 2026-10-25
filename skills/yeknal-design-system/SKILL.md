---
name: yeknal-design-system
description: "Build, audit, document, or migrate a product's design system: token layers, mapping hardcoded values onto tokens, component specs, drift detection, and adoption plans. Use when the request names a design system, tokens, component documentation, or inconsistency across an app."
---

# Design System

Five different jobs hide behind "design system". Name the one in front of you before doing anything, because their outputs differ and their scope collides.

| Job | Question being answered | Output |
| --- | --- | --- |
| **Build** | We have no system. What should it be? | Token set, `DESIGN.md`, primitive components |
| **Extract** | We have a look but no rules. What are the rules? | Reverse-engineered tokens from real usage |
| **Map** | Which hardcoded values should be tokens? | Read-only report: value → role |
| **Document** | What does this component actually do? | One component spec per component |
| **Migrate** | How do we get the app onto the system? | Ordered adoption plan with a ratchet |

If the request is one screen, this skill is the wrong tool: use `yeknal-ui-quality-baseline`. If it is one component's visual quality, use `yeknal-review-animations` or the baseline. Do not run a system-wide job because the word "inconsistent" was used.

## The three layers

Most broken design systems are one layer wearing three names. Keep them separate and never let a component consume a layer it should not.

1. **Primitive tokens** — raw values with no meaning: `--blue-600`, `--space-4`, `--radius-2`. These exist so nothing is hardcoded, and they are the only place a literal value appears.
2. **Semantic tokens** — meaning, mapped to primitives: `--surface`, `--surface-raised`, `--text-muted`, `--border-strong`, `--accent`, `--danger-surface`. Components consume these.
3. **Component tokens** — a component's own contract when it genuinely differs: `--button-height`, `--card-padding`. Only where the component needs a decision the semantic layer cannot express.

Rules:

- Components read semantic or component tokens, never primitives. A component that uses `--blue-600` has hardcoded the palette by another name.
- Semantic names describe role, not appearance. `--text-muted` survives a rebrand; `--gray-light` does not.
- Every token that changes per theme has a value in every theme. A token defined only in light mode is a bug that appears in the dark.
- If a component needs a value that no token expresses, add the token deliberately, once, in the right layer. Do not add a one-off in the component.

Read [color systems](../../yeknal-ui-quality-baseline/references/color-systems.md) before defining the palette, and [typography](../../yeknal-ui-quality-baseline/references/typography.md) before defining type roles.

## The contract file

`DESIGN.md` at the repository root is the source of truth, not a summary written after the fact. Where the project already has an authoritative design document, extend it instead of adding a competitor.

Keep it in the published DESIGN.md shape, which is portable across tools:

1. **Colors** — role, value, and when to use it, for every theme.
2. **Typography** — family, size, weight, line height, and role.
3. **Spacing** — base unit and the scale actually used.
4. **Components** — variants with their real values.
5. **Elevation** — levels and their use.
6. **Guidelines** — the handful of principles that decide ambiguous cases.

Write it for an agent: concrete values, roles, and explicit never-do rules. Prose about brand feeling belongs in one short paragraph, not in the token list. The file must be short enough that a person reads it and current enough that an agent can obey it.

## Mapping hardcoded values onto tokens

This is the highest-value job and the most commonly done badly. It is **read-only** by default: report, never edit, unless the user asks for the migration.

1. **Inventory.** Collect every hardcoded color, spacing value, radius, font size, and shadow in the scope. Group identical values rather than listing occurrences.
2. **Cluster.** Near-duplicates (`#0f766e`, `#0e756d`, `#10746c`) are one intention with drift. Report them as one cluster; they are the strongest evidence of a missing token.
3. **Map by purpose, then by value.** For each cluster, find *what it is doing* in the code (a page background, a muted label, a hover edge) and propose the role. A value that maps to two different roles is a signal that one of the usages is wrong.
4. **Report** a table of: value, occurrences, where, current role, proposed token, confidence. Mark anything you cannot classify as unverified rather than guessing.
5. **Rank** by blast radius: define the tokens first, then the handful of clusters that appear in most files, then the long tail.

Never propose a token for a value used once and likely to disappear. Never propose renaming an existing token as part of a mapping pass.

## Component specs

Write one spec per component, from the code and its real call sites, not from memory of what it should be:

- **Anatomy** — the parts, in order, and which are optional.
- **Tokens** — which semantic and component tokens it consumes.
- **States** — default, hover, focus, active, disabled, loading, invalid, and any domain state, with what visibly changes in each.
- **Variants** — the real ones that exist, not the ones the design file claims.
- **Do / do not** — two or three each, drawn from actual misuse in the codebase.
- **Composition** — what it may contain, and what must never be nested inside it.

Skip foundations, overview pages, and multi-component patterns in a per-component spec; those are separate documents.

## Drift and migration

Drift is when the app and the system disagree, and it always happens in the same places: one-off overrides, local wrappers, and values copied from a screenshot.

- **Measure before planning.** Count components that consume tokens versus components with local values, and which surfaces are furthest from the system. A migration planned from intuition hits the wrong files first.
- **Order by blast radius, not by tidiness.** The few changes that touch the most screens go first; the long tail can wait indefinitely.
- **Ratchet, do not sweep.** Add a check that prevents new hardcoded values (lint rule, review convention, or a test over the token file) before doing a large sweep, or the sweep will be undone within a month.
- **Never combine a migration with a redesign.** Two changes in one diff make both unreviewable and the regression impossible to attribute.
- **Keep the old path working until the new one is proven.** A migration that breaks a surface to make the system consistent is a regression with a tidy justification.

## Guard rails

- Do not invent a second system alongside the existing one "for the new surface".
- Do not rename tokens as a side effect of another task; renames are their own migration with their own review.
- Do not create a token for a single usage.
- Do not document a component from its design file; document it from the code that ships.
- Do not claim a migration is complete while any surface still reads raw values. Say what remains.

## Output

Match the output to the job, in this order:

1. **The job** — one line naming which of the five you ran and its scope.
2. **The evidence** — counts, files, clusters. Numbers, not impressions.
3. **The artifact** — the token set, the `DESIGN.md` diff, the spec, or the mapping table.
4. **What was not touched** — the surfaces outside scope, and what remains before the system is actually adopted.

## Completion criteria

- Every token has a layer, a role, and a value in every supported theme.
- No component in the documented set reads a primitive token directly.
- `DESIGN.md` matches the code it claims to describe.
- A mapping report names a role for every cluster it proposes, and marks the ones it could not classify.
- A migration plan states its order, its ratchet, and what it deliberately leaves undone.
