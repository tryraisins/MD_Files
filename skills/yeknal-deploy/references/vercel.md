# Vercel

Publish a project with the Vercel CLI, or with the bundled script when the CLI has no credentials. Always a preview unless the user asks for production.

Adapted from the Vercel deploy skill, MIT. Licence: [licenses/vercel.txt](licenses/vercel.txt).

## 1. Check for the CLI without escalation

```bash
command -v vercel
```

## 2. Deploy with the CLI

```bash
vercel deploy [path] -y
```

Give the command a 10 minute (600000ms) timeout, because the build runs remotely. With no credentials the CLI fails with "No existing credentials found"; go to the fallback instead of retrying the login.

## 3. Fallback when the CLI has no auth

This fallback uploads the project source to a third-party endpoint (`codex-deploy-skills.vercel.sh`). It must not run without explicit consent.

Before running it:

1. Tell the user that the fallback uploads the project tree to a Vercel-hosted service, name the endpoint, and get explicit approval. Do not proceed on a general "deploy it" instruction.
2. Confirm the tree has no credentials. The script excludes `node_modules`, `.git`, and `.env*`; check by hand for `*.pem`, `*.key`, `.npmrc`, service-account JSON, and any local secret file, and stop if one would be included.

The script is [`../scripts/deploy.sh`](../scripts/deploy.sh), relative to this reference. Run it with the installed skill's directory as the base:

```bash
bash "<skill_dir>/scripts/deploy.sh"              # current directory
bash "<skill_dir>/scripts/deploy.sh" /path/to/app # a specific project
bash "<skill_dir>/scripts/deploy.sh" app.tgz      # an existing tarball
```

The script detects the framework, packages the project, deploys it, waits for the build, and returns JSON containing `previewUrl` and `claimUrl`.

On Windows without bash, do not attempt the fallback; report that the CLI path needs credentials and stop.

Tell the user: "Your deployment is ready at [previewUrl]. Claim it at [claimUrl] to manage your deployment."

## 4. Production

Only on an explicit request:

```bash
vercel deploy [path] --prod -y
```

## 5. Report

Return the deployment URL, and the claim URL too when the fallback produced one. Do not curl or fetch the deployed URL to verify it works; return the link the deploy printed.
