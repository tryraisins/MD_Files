---
name: dead-code-hunter
description: Detect and eliminate dead code, unused imports, unreachable branches, and zombie variables across Python, TypeScript, JavaScript, and other languages — mirroring the behavior of ruff (F401/F811/F841/etc.) and vulture (unused functions, classes, variables, decorators). Use this skill whenever the user asks to: clean up unused code, find dead code, remove unused imports/variables/functions/classes, audit for unreachable code, perform a code health scan, eliminate zombie code, or run something equivalent to ruff check --select=F or vulture on a project. Also trigger when the user says things like "find all the stuff we're not using", "clean up imports", "remove dead functions", or "audit the codebase for unused code".
---

# Dead Code Hunter

A skill that emulates ruff + vulture behavior to systematically detect and safely remove dead code — unused imports, variables, functions, classes, unreachable branches, and more — across Python, TypeScript, JavaScript, and related languages.

## Mental Model

Think of yourself as two tools working in tandem:

- **ruff mode** — fast, opinionated linting. Flags unused imports (F401), redefined-but-unused names (F811), local variables assigned but never used (F841), and unreachable code after return/raise/continue (F702, W291). Acts on well-scoped, clear-cut cases.
- **vulture mode** — deep dead code detection. Finds functions, classes, methods, and module-level variables that are defined but never called or referenced anywhere in the project. Requires cross-file analysis and whitelisting for false positives.

Your job is to combine both lenses: catch the obvious quick wins (ruff-style) and do the deeper cross-file analysis (vulture-style).

---

## Workflow

### Phase 1 — Scope & Inventory

1. Ask (or infer from context) the target: a single file, a directory, or the whole project.
2. Determine the primary language(s) in scope. Read `references/language-rules.md` for the language-specific detection patterns.
3. Build a file inventory with `glob` / directory listing. Exclude:
   - `node_modules/`, `vendor/`, `.venv/`, `__pycache__/`, `dist/`, `build/`, `.git/`
   - Test files (unless the user explicitly wants them included — test files share dead-code patterns but have higher false-positive risk)
   - Auto-generated files (migrations, `.pb.go`, `*.generated.ts`, etc.)
4. Report the scope to the user before scanning.

### Phase 2 — Detection (the scan)

Run both lenses across the inventory:

#### Ruff-style (intra-file, fast)

For each file, grep for:

| Category | What to look for | Rule analogue |
|---|---|---|
| Unused imports | `import X` or `from Y import X` where `X` never appears again in the file body | F401 |
| Redefined unused | Same name imported or assigned twice, first binding unused | F811 |
| Unused local vars | `x = expr` inside a function body, `x` never read after assignment | F841 |
| Unreachable code | Statements after `return`, `raise`, `break`, `continue`, `sys.exit()` | F702 |
| Unused `*` import | `from module import *` — flag always unless `__all__` is defined | F403 |
| Empty except | `except: pass` or `except Exception: pass` with no logging | E722 |

#### Vulture-style (cross-file, deeper)

1. **Build a definition map**: scan every file for top-level and class-level definitions — functions, classes, methods, module-level constants/variables.
2. **Build a usage map**: scan every file for references to those names (function calls, instantiations, attribute access, type annotations, decorator usage).
3. **Diff the two maps**: definitions with zero usages are candidates.
4. **Apply false-positive filters** (see `references/false-positives.md`):
   - Public API symbols (anything that could be imported by external consumers)
   - Symbols in `__all__`
   - Entry points (`main`, CLI commands, route handlers, event handlers, FastAPI/Flask routes)
   - Names used via `getattr`, dynamic dispatch, serialization (`__fields__`, Pydantic models, Django models)
   - Abstract methods, protocol definitions, dataclass fields
   - Names mentioned in config files (e.g., `settings.py`, `celery.py`)
   - Test fixtures and pytest conftest symbols

### Phase 3 — Report

Produce a structured Dead Code Report (see **Report Format** below). Always show the report to the user before making any changes.

Classify each finding into one of three confidence tiers:

| Tier | Meaning | Default action |
|---|---|---|
| 🔴 High | Definitively unused — safe to remove | Offer auto-fix |
| 🟡 Medium | Likely unused, but cross-module or dynamic dispatch could be a factor | Show for user decision |
| 🟠 Low | Possible dead code — needs human judgment (public API, magic method, reflection) | Flag only, don't touch |

### Phase 4 — Fix

Only proceed to fix after the user reviews the report and confirms.

Fix modes:

- **`--safe`** (default): Auto-remove only 🔴 High-confidence findings. Interactively prompt for 🟡 Medium.
- **`--aggressive`**: Auto-remove 🔴 and 🟡 findings. Still skip 🟠 Low.
- **`--dry-run`**: Show diffs, make no changes.

For each fix:
1. Show a unified diff before applying.
2. Apply the change.
3. Run a basic sanity check: re-grep for any remaining references to the removed symbol.
4. Log the fix.

After all fixes, produce a **Fix Summary** (see below).

---

## Report Format

```
# Dead Code Report — <project/file name>
Generated: <date>
Scope: <N files scanned, N lines>

## Summary
| Category | High 🔴 | Medium 🟡 | Low 🟠 |
|---|---|---|---|
| Unused imports | X | X | X |
| Unused variables | X | X | X |
| Dead functions | X | X | X |
| Dead classes | X | X | X |
| Unreachable code | X | X | X |
| **Total** | **X** | **X** | **X** |

---

## Findings

### 🔴 High Confidence

#### Unused Imports
- `src/utils.py:3` — `import os` — `os` is never referenced in this file.
  ```python
  # REMOVE:
  import os
  ```

#### Dead Functions
- `src/helpers.py:42` — `def format_legacy_date(d)` — defined but never called in any file.
  Defined at: src/helpers.py:42
  Searched N files, 0 references found.

### 🟡 Medium Confidence

#### Unused Variables
- `src/api.py:88` — `result = fetch_data()` — `result` assigned but only returned via a subsequent overwrite.
  > Note: may be intentional for side effects (e.g., caching call).

### 🟠 Low Confidence (Review Manually)

#### Potentially Unused Classes
- `src/models.py:12` — `class LegacyResponse` — no direct instantiation found.
  > Could be used via deserialization, config, or external consumers. Verify before removing.

---

## False Positives Skipped
- `__init__.py` re-exports: 3
- Public API symbols: 7
- Abstract methods: 2
```

---

## Fix Summary Format

```
# Fix Summary — <project/file name>

## Changes Made
| File | Line | Action | Symbol |
|---|---|---|---|
| src/utils.py | 3 | Removed import | `os` |
| src/helpers.py | 42–55 | Removed function | `format_legacy_date` |

## Stats
- Lines removed: N
- Files modified: N
- Findings remaining (skipped): N
```

---

## Safety Rules

These are non-negotiable — do not override even if the user asks for `--aggressive`:

1. **Never remove `__all__` entries** without explicit user confirmation per entry.
2. **Never remove type stubs** (`.pyi` files), protocol definitions, or abstract base class methods.
3. **Never remove `__init__`, `__repr__`, `__str__`, `__eq__` or other dunder methods** without flagging them 🟠.
4. **Never remove symbols exported from package `__init__.py`** without user confirmation.
5. **Always show a diff** before applying any change.
6. **Back up the file** (in memory, via a diff) before editing it. If something goes wrong, offer to restore.
7. **Stop and ask** if you encounter any file that is auto-generated, a migration, or a schema definition.

---

## Language Coverage

Read `references/language-rules.md` for the full per-language detection patterns.

Quick reference:
- **Python** — Full support (ruff + vulture analogues). Handles `__all__`, `@abstractmethod`, Pydantic, Django, FastAPI.
- **TypeScript / JavaScript** — Handles `import { X }`, `import X from`, `require()`, unused `const`/`let`, unexported functions.
- **Go** — Unused imports (compile error), unexported functions, dead constants.
- **CSS / SCSS** — Unused class selectors (cross-referenced against JS/HTML template files).
- **Other languages** — Best-effort grep-based analysis; flag with 🟠 Low confidence.

---

## Edge Cases & Gotchas

- **Re-exports via barrel files** (`index.ts`, `__init__.py`): a symbol defined in `utils.ts` but re-exported from `index.ts` is NOT dead — check barrel files before flagging.
- **Dynamic accesses** (`getattr(obj, name)`, `importlib.import_module`, `require(variable)`): these make static analysis unreliable — any symbol that could be accessed dynamically should be flagged 🟠 at most.
- **Test frameworks**: pytest fixtures referenced only by parameter name injection will show zero grep hits — never flag `conftest.py` fixtures as dead.
- **Decorators that register functions** (`@app.route`, `@celery.task`, `@click.command`, `@receiver`): the decorated function is live even if never called directly.
- **`__init_subclass__`, `__class_getitem__`**: framework hooks, always 🟠.
- **Single-underscore prefix** (`_name`): signals internal, but doesn't mean unused. Flag 🟡 at most.
- **Double-underscore prefix** (`__name`): name-mangled, very high false positive rate. Flag 🟠 only.
