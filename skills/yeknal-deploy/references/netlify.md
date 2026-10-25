# Netlify

Deploy through the Netlify CLI. This is also the default procedure when the repository shows no provider signal and the user has no preference.

Adapted from the Netlify deploy skill, Apache-2.0. Licence: [licenses/netlify.txt](licenses/netlify.txt).

## 1. Authenticate

```bash
npx netlify status
```

Authenticated output shows the logged-in email and the linked site, if any. Otherwise run `npx netlify login`, which opens a browser OAuth window, then check again. For a headless machine, set `NETLIFY_AUTH_TOKEN` from `https://app.netlify.com/user/applications#personal-access-tokens` instead.

## 2. Link the project by git remote

Skip this step when `netlify status` already reports a linked site.

```bash
git remote show origin
npx netlify link --git-remote-url <REMOTE_URL>
```

Use the remote in `https://github.com/<owner>/<repo>` or `git@github.com:<owner>/<repo>.git` form. If the link fails because no Netlify site exists for that remote, `npx netlify init` creates one: choose the team, set the site name, and confirm the build settings.

## 3. Detect the build

`netlify.toml` is used automatically when present. Without it, the CLI prompts for a build command and publish directory; infer both from the project rather than asking:

| Project | Build command | Publish directory |
| --- | --- | --- |
| Next.js | `npm run build` | `.next` |
| React with Vite | `npm run build` | `dist` |
| Static HTML | none | the current directory |

Install dependencies before the first deploy (`npm install`, or the lockfile's own package manager).

## 4. Deploy a preview, then production

```bash
npx netlify deploy          # preview with a unique URL
npx netlify deploy --prod   # production, only when asked
```

Both build locally, upload the assets, and print the URL. Report the preview URL plus the dashboard link, and suggest opening the site with `npx netlify open`.

## 5. When it fails

| Message | Fix |
| --- | --- |
| "Not logged in" | `npx netlify login` |
| "No site linked" | `npx netlify link` or `npx netlify init` |
| "Build failed" | Check the build command and publish directory, then read the build log |
| "Publish directory not found" | Confirm the build ran, then confirm the path |

Environment variables belong in Site Settings → Environment Variables, never in `netlify.toml` committed to the repository.
