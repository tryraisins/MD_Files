# Portfolio skills sync: failure modes

`tools/sync-portfolio.js` publishes a validated snapshot of this catalog into the
portfolio at `src/data/skills-catalog.json`. The portfolio's `/skills/` pages,
source links and install prompts are generated only from that snapshot, so every
failure below must be rejected before the snapshot is written, or surface as a
failed portfolio build.

| # | Failure | Consequence if missed | Required behavior |
| --- | --- | --- | --- |
| 1 | `skills/` at HEAD differs from the catalog `sourceRevision` | Portfolio describes content the CLI does not serve | Refuse; regenerate the catalog first |
| 2 | `catalog.json` does not match its own `sourceRevision` | Hashes and file lists are wrong | Refuse (`buildCatalog` comparison) |
| 3 | `sourceRevision` or the presentation commit is not on `origin/main` | Source links and install prompts 404 | Refuse until pushed |
| 4 | Uncommitted edits to `skills/`, `site/` or the catalog | Snapshot comes from an unpublished tree | Refuse; data is read from committed objects |
| 5 | Presentation entry for a skill that no longer exists | Stale page or broken related link | Refuse and name the entry |
| 6 | New skill without presentation metadata | Skill silently missing from the site | Publish with defaults and print a warning |
| 7 | Unknown task, related, featured or starting-point reference | Broken filters or links | Refuse |
| 8 | Skill bundles a LICENSE/NOTICE but has no attribution | License credit missing from the page | Refuse |
| 9 | Slug collision, or a previous name that is still a current skill | Two pages fight over one URL | Refuse |
| 10 | Deleted skill | Obsolete page and sitemap entry remain | Drop it from the snapshot; Astro stops generating the page |
| 11 | Renamed skill | Shared links break | `previousNames` produces a noindex redirect page outside the sitemap |
| 12 | Interrupted write | Truncated JSON breaks the portfolio | Write to a temporary file, then rename |
| 13 | Malformed or hand-edited snapshot | Broken pages deploy | Portfolio build validates the schema and fails |
| 14 | Install prompt omits supporting files or licenses | Partial skill installs | Prompt fetches the whole pinned folder; E2E compares hashes |

Rollback: revert the snapshot commit in the portfolio, or rerun the sync from an
older published catalog commit with `--ref <commit>`.
