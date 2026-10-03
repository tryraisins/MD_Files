---
name: yeknal-netlify-deploy
description: Deploy web projects to Netlify using the Netlify CLI (`npx netlify`). Use when the user asks to deploy, host, publish, or link a site/repo on Netlify, including preview and production deploys.
metadata:
  internal: true
---

# Netlify Deployment Skill

Deploy web projects to Netlify through the Netlify CLI, detecting project configuration and deployment context automatically.

## Overview

This skill drives Netlify deployments by:
- Verifying Netlify CLI authentication
- Detecting project configuration and framework
- Linking to an existing site or creating a new one
- Deploying to production or preview environments

## Prerequisites

- **Netlify CLI**: Installed via npx (no global install required)
- **Authentication**: A Netlify account with an active login session
- **Project**: A valid web project in the current directory
- When sandboxing blocks the deployment network calls, rerun with `sandbox_permissions=require_escalated`.
- The deployment might take a few minutes. Use appropriate timeout values.

## Authentication Pattern

Use the **pre-authenticated Netlify CLI** approach:

1. Check authentication status with `npx netlify status`
2. If not authenticated, walk the user through `npx netlify login`
3. Fail gracefully when authentication cannot be established

Authentication uses either:
- **Browser-based OAuth** (primary): `netlify login` opens the browser for authentication
- **API Key** (alternative): Set the `NETLIFY_AUTH_TOKEN` environment variable

## Workflow

### 1. Verify Netlify CLI Authentication

Check whether the user is logged into Netlify:

```bash
npx netlify status
```

**Expected output patterns**:
- Authenticated: Shows the logged-in user email and site link status
- Not authenticated: "Not logged into any site" or an authentication error

**If not authenticated**, guide the user:

```bash
npx netlify login
```

This opens a browser window for OAuth. Wait for the user to finish, then verify with `netlify status` again.

**Alternative: API Key authentication**

If browser authentication is not available, the user can set:

```bash
export NETLIFY_AUTH_TOKEN=your_token_here
```

Tokens can be generated at: https://app.netlify.com/user/applications#personal-access-tokens

### 2. Detect Site Link Status

From the `netlify status` output, determine:
- **Linked**: The site is already connected to Netlify (shows site name/URL)
- **Not linked**: Link or create a site

### 3. Link to Existing Site or Create New

**If already linked** → Skip to step 4

**If not linked**, try linking by Git remote:

```bash
# Check if project is Git-based
git remote show origin

# If Git-based, extract remote URL
# Format: https://github.com/username/repo or git@github.com:username/repo.git

# Try to link by Git remote
npx netlify link --git-remote-url <REMOTE_URL>
```

**If the link fails** (the site does not exist on Netlify):

```bash
# Create new site interactively
npx netlify init
```

This guides the user through:
1. Choosing a team/account
2. Setting the site name
3. Configuring build settings
4. Creating netlify.toml if needed

### 4. Verify Dependencies

Before deploying, make sure project dependencies are installed:

```bash
# For npm projects
npm install

# For other package managers, detect and use appropriate command
# yarn install, pnpm install, etc.
```

### 5. Deploy to Netlify

Choose the deployment type based on context:

**Preview/Draft Deploy** (default for existing sites):

```bash
npx netlify deploy
```

This creates a deploy preview with a unique URL for testing.

**Production Deploy** (for new sites or explicit production deployments):

```bash
npx netlify deploy --prod
```

This deploys to the live production URL.

**Deployment process**:
1. The CLI detects build settings (from netlify.toml or prompts the user)
2. Builds the project locally
3. Uploads the built assets to Netlify
4. Returns the deployment URL

### 6. Report Results

After deployment, report to the user:
- **Deploy URL**: Unique URL for this deployment
- **Site URL**: Production URL (on production deploys)
- **Deploy logs**: Link to the Netlify dashboard for logs
- **Next steps**: Suggest `netlify open` to view the site or dashboard

## Handling netlify.toml

If a `netlify.toml` file exists, the CLI uses it automatically. If not, the CLI prompts for:
- **Build command**: e.g., `npm run build`, `next build`
- **Publish directory**: e.g., `dist`, `build`, `.next`

Common framework defaults:
- **Next.js**: build command `npm run build`, publish `.next`
- **React (Vite)**: build command `npm run build`, publish `dist`
- **Static HTML**: no build command, publish the current directory

Detect the framework from `package.json` where possible and suggest appropriate settings.

## Example Full Workflow

```bash
# 1. Check authentication
npx netlify status

# If not authenticated:
npx netlify login

# 2. Link site (if needed)
# Try Git-based linking first
git remote show origin
npx netlify link --git-remote-url https://github.com/user/repo

# If no site exists, create new one:
npx netlify init

# 3. Install dependencies
npm install

# 4. Deploy (preview for testing)
npx netlify deploy

# 5. Deploy to production (when ready)
npx netlify deploy --prod
```

## Error Handling

Common issues and solutions:

**"Not logged in"**
→ Run `npx netlify login`

**"No site linked"**
→ Run `npx netlify link` or `npx netlify init`

**"Build failed"**
→ Check the build command and publish directory in netlify.toml or the CLI prompts
→ Verify dependencies are installed
→ Review the build logs for specific errors

**"Publish directory not found"**
→ Verify the build command ran successfully
→ Check that the publish directory path is correct

## Troubleshooting

### Escalated Network Access

If a deployment fails on network issues (timeouts, DNS errors, connection resets), rerun the deploy with escalated permissions (use `sandbox_permissions=require_escalated`). The deploy needs escalated network access when sandbox networking blocks outbound requests.

Example guidance to the user:

```
The deploy needs escalated network access to deploy to Netlify. I can rerun the command with escalated permissions—want me to proceed?
```

## Environment Variables

For secrets and configuration:

1. Never commit secrets to Git
2. Set them in the Netlify dashboard: Site Settings → Environment Variables
3. Access them in builds via `process.env.VARIABLE_NAME`

## Tips

- Use `netlify deploy` (no `--prod`) first to test before production
- Run `netlify open` to view the site in the Netlify dashboard
- Run `netlify logs` to view function logs (if using Netlify Functions)
- Use `netlify dev` for local development with Netlify Functions

## Reference

- Netlify CLI Docs: https://docs.netlify.com/cli/get-started/
- netlify.toml Reference: https://docs.netlify.com/configure-builds/file-based-configuration/

## Bundled References (Load As Needed)

- [CLI commands](references/cli-commands.md)
- [Deployment patterns](references/deployment-patterns.md)
- [netlify.toml guide](references/netlify-toml.md)
