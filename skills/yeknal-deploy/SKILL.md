---
name: yeknal-deploy
description: Deploy, host, publish, or push a site live when the user names no provider. Detects Cloudflare, Netlify, Render, or Vercel from repository config, then follows that provider's reference with a preview-first deploy.
metadata:
  internal: true
---

# Deploy

Ship a project to a hosting provider. The repository says which provider; the deploy is a preview until the user asks for production.

## Entry gate

Use this skill when the user asks to deploy, host, publish, or push a site live and does not name a provider. If the user names Cloudflare, Netlify, Render, or Vercel, read that provider's reference directly and skip the detection below.

It does not cover provisioning infrastructure, writing the build pipeline, or debugging a failing app. Fix those first.

## 1. Detect the provider, cheapest signal first

| Signal in the repository | Provider | Read |
| --- | --- | --- |
| `wrangler.toml` or `wrangler.jsonc` | Cloudflare | [cloudflare.md](references/cloudflare.md) |
| `netlify.toml` | Netlify | [netlify.md](references/netlify.md) |
| `render.yaml` | Render | [render.md](references/render.md) |
| `vercel.json` or `.vercel/` | Vercel | [vercel.md](references/vercel.md) |

Check the four signals in that order and stop at the first match. If two or more match, ask once which target is intended before running anything. If none match, ask once which host the project is meant to reach. Never guess a provider, and never deploy the same tree to a second provider to compare results.

When the user names the provider, skip detection and read the reference in the Read column directly.

## 2. Default procedure

This is the Netlify path, and the shape every provider reference follows. Full commands and failure handling: [netlify.md](references/netlify.md).

1. **Authenticate** before deploying. `npx netlify status` names the account and any linked site; when it reports neither, run `npx netlify login`.
2. **Link the project by its git remote**, not by a new name. A site that already exists for the remote is linked; one that does not is created once.
3. **Detect the build** from `netlify.toml` when present, otherwise from the framework in `package.json`. Never invent a publish directory the build does not produce.
4. **Deploy a preview** with `npx netlify deploy`. Production is the same command with `--prod`, and only on an explicit request.
5. **Report the URL the command printed**, plus the dashboard link for logs.

## 3. Rules that hold for every provider

- **Preview by default.** Production, custom domains, and DNS changes happen only when the user asks for them.
- **One provider per deploy.** Do not deploy the same tree to a second provider to compare results.
- **Report what the command returned.** Do not claim a deploy succeeded from an exit code alone; quote the URL it printed.
- **Secrets stay out of the repository.** Set them in the provider's dashboard or environment store, never in a committed config file.

## Source and licence

The provider references adapt the vendored Cloudflare, Netlify, Render, and Vercel deploy skills previously shipped in this catalog. Licence texts travel with the content in [`references/licenses/`](references/licenses/): Cloudflare, Netlify, and Render under Apache-2.0, Vercel under MIT.
