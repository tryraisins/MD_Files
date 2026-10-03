# False Positive Filters

This file documents the common false positive patterns the dead-code-hunter must account for before flagging a symbol as dead. Apply these filters in Phase 2 (Detection).

---

## Universal False Positive Filters

These apply across all languages.

### 1. Public API Surface

If a project has an `__init__.py` (Python), `index.ts` (TypeScript), or `lib.rs` / `mod.rs` (Rust) that re-exports symbols, those symbols are part of the public API and should not be flagged as dead even if they have no internal usages.

**How to detect**: Scan barrel/export files for `export { X }`, `from X import Y`, `pub use`, etc. Build a set of "explicitly exported" symbols and treat them as 🟠 Low or skip.

### 2. Entry Points

Never flag entry point symbols:
- `main()` in any language
- `handler` and `lambda_handler` (AWS Lambda)
- `app`, `application`, `wsgi_app`, `asgi_app` (WSGI/ASGI servers)
- CLI command functions decorated with `@click.command`, `@app.command`, `@typer.command`
- Celery tasks decorated with `@celery.task`, `@app.task`, `@shared_task`
- Django signals receivers: `@receiver`
- FastAPI/Flask route handlers: `@app.get`, `@app.route`, `@router.post`, etc.
- Express routes: `router.get(...)`, `app.use(...)`
- Next.js page exports: `export default function Page`, `export async function getServerSideProps`

**How to detect**: grep for decorator patterns and route registration patterns. Any function touched by these → remove from candidates.

### 3. Framework Magic / Convention Names

These names are used by frameworks via convention, not direct call:
- Python: `setUp`, `tearDown`, `setUpClass`, `tearDownClass` (unittest), `conftest.py` fixtures, `__str__`, `__repr__`, `__eq__`, `__hash__`, `__len__`, `__iter__`, `__getitem__`, `__enter__`, `__exit__`, `__call__`, `__init_subclass__`, `__class_getitem__`, `save`, `delete` (Django model methods), `validate_*` (serializer validators), `clean_*` (form validators)
- TypeScript/React: `getStaticProps`, `getServerSideProps`, `getStaticPaths`, `middleware`, `loader`, `action` (Remix), `Component` (Next.js `error.tsx`/`loading.tsx`), lifecycle methods (`componentDidMount`, etc.)
- Express/Koa: functions with `(req, res, next)` signature at route registration sites

**How to detect**: Match against known lists above, plus check if the function is passed as a callback argument to a framework-known registration function.

---

## Python-Specific False Positives

### pytest Fixtures

Pytest injects fixtures by parameter name — a fixture defined in `conftest.py` that matches a test function's parameter name is live, even though it's never called directly.

**How to detect**: Any function defined in `conftest.py` or decorated with `@pytest.fixture` → treat as 🟠.

### Django Model Fields

Class-level attributes in Django models are accessed via the ORM and string lookups:
```python
class User(Model):
    email = EmailField()   # not referenced directly in Python code
```
Any class that inherits from `django.db.models.Model` (directly or transitively) → treat all field attributes as 🟠.

### Pydantic / SQLModel / attrs / dataclasses Fields

Similar to Django: field declarations are accessed via serialization, not direct attribute reads.
- Any class decorated with `@dataclass`, `@attrs.define`, or inheriting from `BaseModel` (Pydantic) → treat all class-level field assignments as 🟠.

### SQLAlchemy Models

Column and relationship definitions are used by the ORM:
```python
class Order(Base):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    items = relationship('Item', back_populates='order')
```
Any class inheriting from SQLAlchemy `Base` or `DeclarativeBase` → treat all column/relationship attrs as 🟠.

### Abstract Base Classes

Any method decorated with `@abstractmethod` → 🟠 (must be implemented by subclasses, never called directly on the abstract class).

### Type Annotations Only (Python 3.10+)

If a name is only used in a string annotation (`"MyClass"`) or inside `TYPE_CHECKING`, it is live as a type reference. Don't flag it as dead.

### `__all__` Declaration

If a symbol is listed in `__all__`, it is explicitly part of the module's public API. Do NOT flag it as dead regardless of internal usage count.

### Protocol / TypedDict / NamedTuple

Classes inheriting from `Protocol`, `typing.TypedDict`, `typing.NamedTuple`, or `typing_extensions` variants → 🟠. These are structural types and may be used only in annotations.

---

## TypeScript / JavaScript-Specific False Positives

### React Component Props Interfaces / Types

Interfaces or types used as React component props:
```ts
interface ButtonProps { label: string; onClick: () => void; }
```
These may not appear in non-JSX code but are used via the component. If an interface/type is named `*Props`, `*State`, `*Config`, `*Options` → downgrade to 🟠.

### Context / Store Types

Redux store types, React Context value types, Zustand slice types — these are used by the framework's typing system and may not have direct code references. Flag 🟠 only.

### Module Augmentations / Declaration Merging

```ts
declare module 'express' {
  interface Request { user?: User; }
}
```
Never flag module augmentation blocks or declaration merging constructs.

### Jest / Vitest Mocks and Fixtures

Test setup files that export `beforeAll`, `afterAll`, `beforeEach`, `afterEach` — these are used by the test runner, not called directly.

### Next.js / Nuxt.js Page Conventions

Files in `pages/`, `app/` (Next.js) or `pages/` (Nuxt) that export default components are live even if not directly imported anywhere → 🟠.

### `index.ts` Re-exports

If a symbol is re-exported from any `index.ts` or `index.js` in the project → 🟠. The consuming code might be entirely outside the scanned scope.

---

## Config-File Symbols

Symbols defined in these file types are often loaded dynamically — downgrade all findings in them to 🟠:
- `settings.py`, `config.py`, `constants.py`
- `*.config.ts`, `*.config.js`, `vite.config.*`, `webpack.config.*`, `jest.config.*`
- `tailwind.config.*`, `postcss.config.*`
- `.env` files (not really code, but sometimes parsed)
- `next.config.*`, `nuxt.config.*`

---

## Reflection / Dynamic Dispatch Tainting

If a file contains any of the following, its symbols should default to 🟠:

**Python:**
- `getattr(...)`, `setattr(...)`, `hasattr(...)`
- `importlib.import_module(...)`, `__import__(...)`
- `eval(...)`, `exec(...)`

**TypeScript / JavaScript:**
- `window[varName]`, `obj[dynamicKey]`
- `require(variable)` (not a string literal)
- `Object.keys(...)` iterated to call methods

---

## Whitelisting via Comments

Respect suppression comments and don't flag lines that have them:

| Language | Comment format |
|---|---|
| Python | `# noqa: F401`, `# noqa`, `# type: ignore`, `# dead: ignore` |
| TypeScript | `// eslint-disable-next-line @typescript-eslint/no-unused-vars`, `// dead: ignore` |
| General | Any `# dead: ignore` or `// dead: ignore` comment on or above the definition |

The `dead: ignore` comment is a convention introduced by this skill for cases where the user wants to permanently whitelist a symbol without suppressing other linters.
