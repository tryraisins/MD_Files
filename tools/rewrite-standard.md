# Skill Rewrite Standard

Applies to the effort to re-author every skill under `skills/yeknal-*` as original, more efficient works without losing any capability or reference, while retaining upstream credit.

## Non-negotiables

- **No capability loss.** Every heading, backticked tool/command/path, relative link, numeric threshold, frontmatter field, and bundled resource in the pre-rewrite skill must survive or be deliberately superseded with a documented equivalent. The `tools/parity.js` report is the gate.
- **No reference loss.** `references/`, `assets/`, `scripts/`, and any other bundled files are carried over unchanged. Prefer moving detail from `SKILL.md` into those files over deleting it.
- **Spec compliance.** `name` stays `yeknal-<base>` and equals the folder; keep `description` discriminating; keep valid YAML frontmatter.
- **License compliance.** Preserve any bundled `LICENSE`/`NOTICE`; add the missing MIT notices for derivatives (see `PROVENANCE.md`). Never strip a copyright notice.
- **Behavioral contract.** A skill must still trigger on the same tasks and produce the same artifacts.

## Voice and format

- Second person, imperative, concrete. No marketing filler, no "as an AI", no emoji.
- Prefer short declarative sentences and scannable structure (headings, numbered steps, tables) over prose walls.
- Keep the product's own terminology consistent (the same action keeps the same name).
- Keep examples real and minimal; remove decorative or duplicate examples.

## Efficiency targets

- Progressive disclosure: keep `SKILL.md` focused; push deep reference material into `references/` and load it only when needed. Aim for shorter `SKILL.md` where content is currently padded, but never at the cost of a capability.
- Remove duplication, redundant restatements, and generic advice the model already knows.
- Prefer one strong, specific instruction over a list of hedged alternatives.

## Frontmatter

- `name`: unchanged (`yeknal-<base>`).
- `description`: keep it a single discriminating sentence that states what it does and when it triggers.
- Preserve `license`, `metadata.*` (including `source`, `source-commit`, `internal`), and add source/commit for derivatives.
- Do not add unknown top-level fields (the audit script rejects them).

## Attribution

- Record upstream in `metadata.source` (+ `source-commit`) and keep the bundled notice.
- Summarize credits in the README and npm README; the detailed ledger is `PROVENANCE.md`.

## Process per skill

1. Inspect the current `SKILL.md` and every bundled resource.
2. Rewrite the body for clarity and efficiency; carry resources over untouched.
3. Run `node tools/parity.js check <skill>` and resolve every MISSING item (or record a documented, allowlisted supersession in `rewrite-parity/<skill>.allow.json`).
4. Run `skills-ref validate skills/<skill>`.
5. Only then mark the skill rewritten in `HANDOFF.md`.

## Acceptance

- `node tools/parity.js check-all` passes for every rewritten skill.
- `skills-ref validate` passes for every skill.
- `audit-skills.ps1`, `audit-markdown-links.ps1`, and `validate-routing-evals.ps1` stay clean.
- The `skills` CLI still discovers the same published set.
