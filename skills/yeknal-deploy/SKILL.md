---
name: yeknal-deploy
description: "Deploy, host, publish, or push a site live to Cloudflare, Netlify, Render, or Vercel, named by the user or detected from repository config. Use when a deploy is requested; keep the first deploy a preview unless production is explicitly asked for."
---

# Deploy

Ship a project to a hosting provider. The repository says which provider; the deploy is a preview until the user asks for production.

## Entry gate

Use this skill when the user asks to deploy, host, publish, or push a site live, whether or not they name a provider. If they name Cloudflare, Netlify, Render, or Vercel, read that provider's reference directly and skip detection.

It does not cover provisioning new infrastructure, writing the build pipeline, or debugging a failing app. Fix those first, and create a hosting project only when the user asks for that.

## 1. Detect the provider

| Signal in the repository | Provider | Read |
| --- | --- | --- |
| `wrangler.toml`, `wrangler.json`, or `wrangler.jsonc` | Cloudflare | [cloudflare.md](references/cloudflare.md) |
| `netlify.toml` | Netlify | [netlify.md](references/netlify.md) |
| `render.yaml` | Render | [render.md](references/render.md) |
| `vercel.json` | Vercel | [vercel.md](references/vercel.md) |
| `.vercel/` (local link state, weaker evidence) | Vercel | [vercel.md](references/vercel.md) |

Check all five signals before acting, never just the first.

- Exactly one match: name the file that matched and the provider in one line, then read that reference.
- Two or more matches: ask once which target is intended. Do not pick one.
- None: ask once which host the project is meant to reach. Never guess.

A stale link directory or a leftover config file is common, which is why a single match still gets named before anything runs.

## 2. Procedure shape

Every provider reference follows the same order. The commands below are the Netlify ones; use only the commands in the matched provider's reference.

1. **Authenticate** before deploying, and confirm which account it resolves to.
2. **Link the project by its git remote** when the provider needs a link, and ask before creating a site that does not exist yet.
3. **Detect the build** from the provider config when present, otherwise from the framework in `package.json`. Never invent a publish directory the build does not produce.
4. **Deploy a preview** using the preview command in the provider reference. Production is a separate command, and only on an explicit request.
5. **Report the URL the command printed**, plus the dashboard link for logs.

## 3. Rules that hold for every provider

- **Preview by default.** Production, custom domains, and DNS changes happen only when the user asks for them.
- **Report what the command returned.** Do not claim a deploy succeeded from an exit code alone; quote the URL it printed.
- **Secrets stay out.** Set them in the provider's dashboard or environment store, never in a committed config file, and never upload a tree that contains credentials.
- **Ask before installing or uploading.** Do not install a package or send the source tree to a third-party service without the user approving that exact action.

## Source and licence

The provider references adapt the vendored Cloudflare, Netlify, Render, and Vercel deploy skills previously shipped in this catalog. Licence texts travel with the content in [`references/licenses/`](references/licenses/): Cloudflare, Netlify, and Render under Apache-2.0, Vercel under MIT.
