# Render

Render deploys Git-backed services and prebuilt Docker image services. The Git-backed path has two methods, and the repository's shape chooses between them.

Adapted from the Render deploy skill, Apache-2.0. Licence: [licenses/render.txt](licenses/render.txt).

## 1. Choose the method

Apply this by default; analyze the codebase first and ask only when the intent is unclear.

**Direct creation through MCP, when all are true:**

- one web service or one static site;
- no separate worker or cron service;
- no attached database or Key Value store;
- only simple environment variables, no shared env groups.

**Blueprint, when any is true:**

- multiple services (web plus worker, API plus frontend);
- a database, Key Value, or another datastore;
- cron jobs, background workers, or private services;
- a committed `render.yaml` is wanted for repeatability;
- a monorepo or multi-environment setup needs one configuration.

If unsure, use a Blueprint. A single service that fits the MCP conditions is faster as direct creation.

## 2. What every method requires

A Git remote on GitHub, GitLab, or Bitbucket. Check with `git remote -v`; with none, stop and ask the user to create and push one. A Blueprint that references a prebuilt image still needs a repository holding `render.yaml`.

MCP cannot create image-backed services. When the user has only a prebuilt Docker image, send them to the Render Dashboard or API, or have them add a minimal repository so a Blueprint can declare `runtime: image`. The image is then pulled from its registry, with the registry credentials supplied at deploy time.

## 3. Blueprint flow

1. Analyze the framework, build and start commands, environment variables, datastores, and port binding.
2. Write `render.yaml`: `plan: free` unless the user says otherwise, every required environment variable listed, secrets marked `sync: false`, and the correct service `type` (`web`, `worker`, `cron`, `static`, `pserv`) with its `runtime`.
3. Validate with `render blueprints validate`, after `render whoami -o json` confirms the CLI is authenticated.
4. Commit and push `render.yaml`. The dashboard reads it from the remote, so an unpushed file is an invisible deploy.
5. Build the dashboard deeplink from the HTTPS form of the remote:

   ```
   https://dashboard.render.com/blueprint/new?repo=<REPOSITORY_URL>
   ```

   Convert SSH to HTTPS first: `git@<host>:<owner>/<repo>.git` becomes `https://<host>/<owner>/<repo>`. Strip the `git@` prefix, add `https://`, drop the `.git` suffix.
6. Tell the user to open the deeplink, complete Git OAuth, fill the `sync: false` secrets, then click Apply.

## 4. Direct creation flow

Create the service and any datastore through MCP, set environment variables, then verify. If MCP reports a Git credential or repository-access error, the user must connect the provider in the Render dashboard before retrying.

## 5. Verify the deploy

The deploy is only done when the latest deploy reports `live`, the health endpoint or root returns 200, recent error logs are clean, and the process binds `0.0.0.0:$PORT`. Any failure is fixed before the next deploy, not after.
