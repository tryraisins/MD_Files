# Cloudflare

Deploy a Worker or a Pages project. Authenticate first, then decide which of the two runtimes the project actually is.

Adapted from the Cloudflare deploy skill, Apache-2.0. Licence: [licenses/cloudflare.txt](licenses/cloudflare.txt).

## 1. Authenticate before any deploy

Run this before `wrangler deploy`, `wrangler pages deploy`, or `npm run deploy`:

```bash
npx wrangler whoami
```

A non-zero exit, or no account in the output, means not authenticated. Then either:

- **Interactive or local:** `npx wrangler login` opens the browser for a one-time OAuth flow. Verify with `npx wrangler whoami` before retrying the deploy.
- **CI or headless:** set `CLOUDFLARE_API_TOKEN`. Create it at `https://dash.cloudflare.com/profile/api-tokens` from the "Edit Cloudflare Workers" template, which covers Workers, Pages, KV, D1, and R2.

Do not run a deploy command first and authenticate after it fails; the deploy prints an auth error that hides any real build failure.

## 2. Choose Workers or Pages

Read the runtime from the wrangler config before choosing: `pages_build_output_dir` means Pages, `main` means Workers. A Pages project using direct upload may have no wrangler file at all, so also check for an existing `--project-name` in scripts or CI.

| Project shape | Deploy to | Preview command |
| --- | --- | --- |
| Static site or framework build with file-based routing and no server entry | Pages | `npx wrangler pages deploy ./dist --project-name=<name> --branch=<non-production-branch>` |
| API, complex routing, WebSockets, scheduled tasks, cron, or email handlers | Workers | `npx wrangler versions upload` |
| Site plus API | Both | Pages for the site; Workers for the API |

Pages Functions run on the Workers runtime and can bind to Workers, so "both" is one project, not two providers.

## 3. Deploy

Pages offers three routes; pick the one the repository already reflects:

1. **Git integration:** connect the repository in the dashboard under Workers & Pages, then let pushes build. Nothing to run locally. This creates the project, so use it only when the user asks for that.
2. **Direct upload:** `npx wrangler pages deploy ./dist --project-name=<name> --branch=<non-production-branch>`. Without `--branch` on the production branch this is a production deploy, so always pass a non-production branch for a preview.
3. **C3 scaffold:** `npm create cloudflare@latest <name>` only when the project has not been created yet and the user asked to create it.

Workers previews upload a version with `npx wrangler versions upload`. Production is `npx wrangler deploy`, and only on an explicit production request.

Do not run `npm run deploy` or any project script whose contents you have not read; it may target production. Do not run a deploy command before authenticating, because the auth error hides the real build failure.

## 4. Report

Give the deployed URL wrangler printed, plus the dashboard link for the project. Preview URLs are per-deployment and per-branch; do not present one as the production address.
