# Language-Specific Dead Code Rules

## Python

### Unused Imports (ruff F401 equivalent)

Patterns to detect:
```
import os
import sys
from pathlib import Path
from typing import Optional, List   # flag individually unused members
from . import utils
from module import (
    FooClass,
    bar_function,    # flag each unused member
)
```

Search strategy:
1. Extract every imported name (handling aliases: `import numpy as np` → name is `np`).
2. Grep the rest of the file for each name (as a word boundary match: `\bname\b`).
3. Names that appear exactly 0 times after the import line → unused.

Special cases:
- `TYPE_CHECKING` guard imports: `if TYPE_CHECKING: import X` → skip, these are type-only.
- `__future__` imports: always keep.
- `import X; __all__ = ['X']` in `__init__.py` → not dead (it's a re-export).
- `noqa: F401` comments → honor, skip flagging.

### Unused Variables (ruff F841 equivalent)

Pattern: variable assigned inside a function body, but never read after the first assignment in any branch.

```python
def foo():
    result = compute()   # F841 if result is never read
    return "done"
```

False positive guards:
- Augmented assignment chains (`x = 0; x += 1; return x`) are NOT unused.
- Underscore convention (`_ = something()` or `_result = ...`) means intentionally discarded — skip.
- Variables used in list comprehensions, generators, or `del` → not unused.
- Variables used in `except X as e:` blocks even if `e` appears only in `raise e` → live.

### Unreachable Code (ruff F702 equivalent)

After a `return`, `raise`, `break`, `continue`, or `sys.exit()` in a function/loop body, any statements before the next dedent are unreachable.

```python
def bar():
    return x
    y = 1   # unreachable
```

Flag the unreachable statement with 🔴 High confidence.

### Dead Functions / Classes (vulture equivalent)

Cross-file analysis:
1. Collect all `def`, `async def`, and `class` definitions at module level and class level.
2. For each, record: file, line number, name, scope (module/class).
3. Grep all project files for the name as a word boundary: `\bname\b`.
4. Subtract the definition line itself from the count.
5. If count == 0 across all files → candidate for 🔴 High or 🟡 Medium depending on visibility.

Visibility rules:
- `_name` (single underscore) → module-private → 🔴 High if no usages.
- `name` (public, not in `__init__.py` exports) → 🟡 Medium (could be imported by external code).
- `name` (public, appears in `__all__`) → 🟠 Low (public API).
- `__name__` (dunder) → 🟠 Low (framework magic).

---

## TypeScript / JavaScript

### Unused Imports

Named imports:
```ts
import { useState, useEffect } from 'react';   // flag unused members individually
import type { Foo } from './types';             // type imports — flag if type unused
import * as utils from './utils';               // flag if `utils.` never appears
```

Default imports:
```ts
import React from 'react';   // flag if React never referenced (JSX transforms vary)
```

Search strategy:
- For `import { A, B, C }`, check each member independently.
- For `import * as X`, check for `X.` anywhere in the file.
- For `import type { T }`, check for `T` in type positions.
- Side-effect imports (`import './styles.css'`) → NEVER flag.

False positive guards:
- `React` import in files with JSX before React 17 transform — check `tsconfig.jsx` setting.
- Re-exports: `export { A } from './module'` — A is live, don't flag.
- `// eslint-disable-next-line @typescript-eslint/no-unused-vars` → skip.

### Unused Variables / Constants

```ts
const LEGACY_URL = 'http://old.example.com';   // never referenced → F841 analogue
let tempResult = fetchData();                   // never read
```

Skip:
- Variables prefixed with `_` (e.g., `_unused`).
- `const` at module level in `.d.ts` files.
- Variables used only in type annotations.

### Dead Functions

Same cross-file approach as Python. Additional TypeScript nuances:
- `export function foo()` → 🟡 Medium (could be used by importers outside the scanned scope).
- `function foo()` (unexported) → 🔴 High if no internal usages.
- Arrow functions assigned to exported `const` → same as above.
- React component functions: if not rendered anywhere in `.tsx`/`.jsx` files → 🟡 Medium.

### Barrel File (index.ts) Check

Before flagging any symbol as dead, check if it's re-exported from an `index.ts` or `index.js` in the same or parent directory. If so, downgrade to 🟠 Low.

---

## Go

### Unused Imports

Go's compiler already enforces this, but for code that isn't compiled yet:
- Flag any `import "pkg"` where the package's identifier never appears in the file.
- Blank imports (`import _ "pkg"`) → keep, they're for side effects.

### Dead Functions

- Unexported functions (`func camelCase()`) with no cross-file usages → 🔴 High.
- Exported functions (`func PascalCase()`) → 🟠 Low (public API).
- `func init()` → always live, skip.
- `func main()` → always live, skip.
- `func TestXxx()`, `func BenchmarkXxx()`, `func ExampleXxx()` → always live (test framework).

### Dead Constants / Variables

- Package-level `const`/`var` that are unexported with zero usages → 🔴 High.
- Exported ones → 🟠 Low.

---

## CSS / SCSS

### Unused Selectors

Strategy:
1. Extract all class names from CSS/SCSS (`.my-class`, `.btn-primary`, etc.).
2. Grep for each class name (without the `.`) in all HTML, JSX, TSX, template files.
3. Classes that appear in 0 template files → candidate.

False positives:
- Dynamically constructed class names: `className={`btn-${variant}`}` → the base string `btn-` won't be a direct hit.
- Framework utility classes (Tailwind, Bootstrap) → skip by pattern if a config file is detected.
- `:hover`, `::before` pseudo-selectors are derived from the base selector — don't flag the base if the pseudo usage exists.

Confidence: This analysis is inherently harder to get right, so default to 🟡 Medium for CSS findings.

---

## Ruby

### Unused Methods

- Private methods (`private def foo`) with no calls within the class → 🔴 High.
- Public methods (`def foo`) with no calls in any file → 🟡 Medium.
- Methods defined with `alias_method` → keep (dynamic dispatch).

### Unused Requires

- `require 'lib'` at the top, no usage of lib's constants/methods → 🔴 High flag.

---

## Rust

### Dead Code

Rust's compiler emits `#[allow(dead_code)]` suppressions. Respect these.

- Functions/structs not `pub` and with no usages → 🔴 High.
- `pub` items → 🟠 Low.
- Trait implementations (`impl Foo for Bar`) → always 🟠 (could be used via trait dispatch).

---

## General Heuristics (all languages)

1. **Confidence degradation**: Any symbol whose name matches a common serialization key (e.g., `id`, `name`, `type`, `data`, `value`) → bump down one confidence tier (dynamic access likely).
2. **Reflection risk**: Any file that uses `eval`, `exec`, `reflect`, `importlib`, `__import__`, `Object.keys`, `JSON.parse` → treat all symbols in that file as 🟠.
3. **Config-like files**: `settings.py`, `config.ts`, `constants.ts` — symbols here are often loaded externally. Treat as 🟠 by default.
