---
name: yeknal-vercel-deploy
description: Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment".
metadata:
  internal: true
---

# Vercel Deploy

Publish any project to Vercel. **Always ship a preview** rather than production unless the user explicitly asks for production.

## Prerequisites

- Find out whether the Vercel CLI exists **without** escalated permissions (for example, `command -v vercel`).
- Escalate only the deploy command itself, and only when sandboxing blocks its network calls (`sandbox_permissions=require_escalated`).
- A deployment can run for several minutes; choose a timeout long enough to cover the build.

## Quick Start

1. Check for the Vercel CLI without escalation:

```bash
command -v vercel
```

2. If `vercel` is installed, deploy (allow a 10 minute timeout):

```bash
vercel deploy [path] -y
```

**Important:** Give the deploy command a 10 minute (600000ms) timeout, because builds can take a while.

3. If `vercel` is not installed, or the CLI fails with "No existing credentials found", use the fallback method below.

## Fallback (No Auth)

When the CLI fails on an auth error, use the deploy script:

```bash
skill_dir="<path-to-skill>"

# Deploy current directory
bash "$skill_dir/scripts/deploy.sh"

# Deploy specific project
bash "$skill_dir/scripts/deploy.sh" /path/to/project

# Deploy existing tarball
bash "$skill_dir/scripts/deploy.sh" /path/to/project.tgz
```

The script detects the framework, packages the project, deploys it, waits for the build, and returns JSON containing `previewUrl` and `claimUrl`.

**Tell the user:** "Your deployment is ready at [previewUrl]. Claim it at [claimUrl] to manage your deployment."

## Production Deploys

Only when the user explicitly asks:

```bash
vercel deploy [path] --prod -y
```

## Output

Return the deployment URL to the user. For fallback deployments, include the claim URL as well.

**Do not** curl or fetch the deployed URL to verify it works. Return the link.

## Troubleshooting

### Escalated Network Access

If a deployment fails on network trouble (timeouts, DNS errors, connection resets), rerun the deploy command with escalated permissions (`sandbox_permissions=require_escalated`). Never escalate the `command -v vercel` installation check. When sandbox networking blocks outbound requests, the deploy needs escalated network access.

Example guidance to the user:

```
The deploy needs escalated network access to deploy to Vercel. I can rerun the command with escalated permissions—want me to proceed?
```
