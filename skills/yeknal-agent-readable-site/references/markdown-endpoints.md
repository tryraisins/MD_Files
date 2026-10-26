# Markdown Endpoints

One handler, three ways in. Do not create a separate route file per page, and do not convert the rendered page: render the same data the page renders.

## Pick the tier before writing code

| Capability | Static host (GitHub Pages, S3, plain CDN) | Server or edge host |
| --- | --- | --- |
| `.md` URL per page | yes, generated at build | yes |
| `Accept` negotiation | no middleware | yes |
| Custom response headers | no | yes |
| Backend catalog URL | as a generated file only | yes |
| `X-Markdown-Tokens`, `Vary`, CORS | no | yes |
| Head signals in the HTML | yes | yes |
| `llms.txt`, `llms-full.txt`, `ai.txt` | yes | yes |

A static host still gets a real, useful surface. It cannot honour a header contract, and saying so is part of the deliverable. Never write a plan that assumes negotiation on a host that cannot run middleware.

## Access path 1: the `.md` suffix

- `GET /pricing.md` returns the markdown of `/pricing`.
- `GET /index.md` returns the homepage.
- `GET /blog/my-post.md` returns that post.

On a static build, generate these with the router's static endpoint support and a catch-all that enumerates the same routes the pages enumerate. On a server, rewrite `.md` to the handler rather than shipping a second route table.

## Access path 2: content negotiation

`GET /pricing` with `Accept: text/markdown` returns markdown. This needs middleware, so it is Tier B only.

Parsing rules, in order:

1. No `Accept` header, `*/*`, or `text/*` returns HTML. Browsers, `curl`, link previews and uptime probes must keep working.
2. Parse the media ranges with their `q` values, defaulting to `1`.
3. Return markdown only when `text/markdown` has a strictly higher `q` than `text/html`.
4. A tie, or an explicit `text/html` at the same weight, returns HTML.
5. Send `Vary: Accept` on every negotiated response. A framework may append its own tokens (`rsc`, router state). `Accept` must survive in the list; extra tokens are noise, a replaced one is a bug.

Probe this on the real host before reporting it. Two behaviours turn up in practice and neither is negotiation: a static host ignores `Accept` and returns HTML, which is correct and needs no `Vary`; and some framework preview servers answer `Accept: text/markdown` with `404` because the router matches the header. The second one is worth fixing, since an agent that asks for markdown gets an error where it should have received the HTML fallback.

## Access path 3: the backend URL

`GET /api/md/<path>` always returns markdown regardless of `Accept`. It exists to debug the registry and to let an integration fetch a page without guessing the negotiation rules. Also expose `GET /api/md/_catalog` returning every addressable markdown route, which feeds `llms.txt` and the coverage check.

## Header contract

| Header | Value | Why |
| --- | --- | --- |
| `Content-Type` | `text/markdown; charset=utf-8` | the actual type; `text/plain` only where the host cannot set it |
| `X-Markdown-Tokens` | approximate, `characters / 4`, labelled as an estimate | lets a client budget before reading |
| `X-Robots-Tag` | `noindex, follow` | the HTML page stays canonical, so the alternate must not compete |
| `Content-Location` | the canonical HTML URL | names the page this copy represents |
| `Vary` | `Accept` on negotiated responses | correct cache behaviour |
| `Cache-Control` | `public, s-maxage=3600, stale-while-revalidate=86400` | longer for static pages |
| `Last-Modified` | real material change date | not the build time |
| `Access-Control-Allow-Origin` | `*` for `GET`, `HEAD`, `OPTIONS` | agents fetch from other origins |

`HEAD` returns the same headers with no body. `OPTIONS` answers preflight. If the framework owns the `Link` header at route level, add `<https://example.com/pricing>; rel="canonical"` only where it survives; a framework that overwrites `Link` turns a correct header into a silent lie, so verify the final response.

## Exclusions

Apply the `.md` rewrite and the negotiation to an explicit allowlist of content routes. Never to `/llms.txt`, `/llms-full.txt`, `/ai.txt`, `/robots.txt`, `/sitemap.xml`, `/api/*`, static assets, framework internals, `/.well-known/*`, or a real route that already ends in `.md` such as a `SKILL.md` viewer.

## The handler

- **Registry.** A single module maps route patterns to renderers. Static pages get one renderer each; dynamic families get a pattern renderer that calls the existing loader and returns `null` when the entity does not exist.
- **Route list.** `listMarkdownRoutes()` returns every addressable route with its canonical URL and data source. It powers the catalog, `llms.txt` and the coverage check, so none of the three can drift from the registry.
- **Missing entity.** Return a markdown body with status `404` and a one-line `# Not found`. Never return HTML from the markdown path, and never return `200` with an error page.
- **One step to add a page.** Registering a renderer must be the only edit required for `llms.txt`, the full dump and the catalog to include it.

## Content rules

Follow the contract in [the skill](../SKILL.md): absolute links to HTML URLs, main content only, no navigation or repeated calls to action, real tables and lists, the same facts as the page.

Two safety rules matter more than formatting:

- If the HTML needs a session, the markdown needs one too.
- Agent responses mirror visible text. Content injected for agents only is cloaking, and unsanitised user content becomes a prompt-injection channel.

## Coverage check

Write the test that fails when a public route has no markdown version, and write it before the set looks complete, because the pages most likely to be missing are the ones nobody links. It belongs to the surface rather than a unit-test suite:

1. Read the sitemap. Follow `sitemap-index.xml` into its child sitemaps, because a split sitemap has no `/sitemap.xml`.
2. Remove excluded paths.
3. Request each remaining URL plus `.md` and assert a `200` with a markdown content type.

[The checker](../scripts/check-ai-surface.mjs) does this in `--coverage` mode. It asserts both the status and the content type on every route in the sitemap, and fails the run rather than sampling. `--max-coverage` bounds a very large sitemap, and a truncated run reports `partial` instead of a pass, because absence of evidence is not coverage. `--max` limits how many `llms.txt` links are verified and does not shorten coverage. `--exclude` adds path prefixes to the built-in private list. The target is treated as an origin, so a site deployed under a path prefix is not resolved correctly, and an origin that serves the right headers without negotiating `Accept` is classified as tier A and its header contract is reported as unsupported.

## Framework notes

- **Next.js App Router:** implement one route handler for the markdown path and rewrite in `middleware.ts`. `headers()` in `next.config` can overwrite route-level `Link` headers, so verify the deployed response rather than the config.
- **Astro:** static endpoints with `getStaticPaths` are the natural fit and work on a static host. Middleware negotiation needs an adapter with a server output, for example Node, Cloudflare or Vercel.
- **Remix and React Router:** a resource route plus a loader that reuses the page loader.
- **SvelteKit:** a `+server.ts` next to each page, or a catch-all with `resolve` in `handle`.
- **Static hosts:** ship `.md` files, head signals and the three site files. State that negotiation and response headers are unavailable. Do not fake them with an HTML meta tag that cannot apply to a markdown file.

## Verification boundary

The build output, the route list and the generated files describe intent. Only the deployed response is evidence. Check the status code, the content type, the robots header, the canonical target and the body of one static page, one dynamic page and one listing page, plus one missing entity.
