# yeknal

Sync reusable AI-agent skills and run a lightweight static security audit from the command line.

## Requirements

You do not need a global install. A new device needs:

- Node.js with npm;
- internet access;
- at least one supported agent folder: Codex (`~/.codex`), Claude (`~/.claude`), Gemini Antigravity (`~/.gemini/antigravity`), or Antigravity (`~/.antigravity`).

Git is optional and is used as a fallback when GitHub API or raw-file downloads remain unavailable after automatic retries.

## Commands

```bash
npx yeknal skills
npx yeknal security
```

### `npx yeknal skills`

Downloads top-level folders from `tryraisins/MD_Files` on `main` when they contain a `SKILL.md`, then installs them with the managed `yeknal-` prefix. For example, `frontend-design` becomes `yeknal-frontend-design`.

The command:

- creates missing `skills` directories in supported agent folders;
- updates and removes only managed `yeknal-*` folders;
- preserves personal skill folders without that prefix;
- on Codex, skips repository skills already supplied by `~/.codex/skills/.system`;
- excludes `SEO`, which is reference material without a `SKILL.md`.

### `npx yeknal security`

This command:

1. downloads `application-security/Security-Master.md` temporarily;
2. syncs `application-security`, `security-best-practices`, `security-ownership-map`, and `security-threat-model`;
3. scans the current project;
4. writes `yeknal-security.log`, `yeknal-security.json`, and `yeknal-security.sarif`, then removes the temporary master file.

The scanner checks static signals for exposed secrets and credential files, dependency risk, authentication and session handling, input validation, CORS, security headers, database access, unsafe frontend sinks, and framework configuration. Checks use stable rule IDs and current `Security-Master.md` anchors. JSON supports custom processing, while SARIF 2.1.0 supports compatible code-scanning tools. Findings require human review; a static scan cannot prove runtime authorization, exploitability, deployment posture, or the absence of vulnerabilities.

## Development and release

```bash
npm ci
npm test
npm pack --dry-run
```

`.github/workflows/publish.yml` is ready for npm trusted publishing but is gated by the repository variable `NPM_TRUSTED_PUBLISHING_ENABLED`. Set that variable to `true` only after npm has a matching OIDC connection for `tryraisins/MD_Files` and `publish.yml`. Until then, publish manually from an authenticated local npm client; do not store a long-lived npm publish token in repository secrets.

## Notes

- If no supported agent folder exists, the skills command exits without installing anything.
- Downloads use bounded retries for temporary network failures and GitHub `408`, `425`, `429`, and `5xx` responses. `Retry-After` is honored up to 10 seconds. After retry exhaustion, the command uses a shallow Git clone when Git is installed.
- If GitHub API limits are reached, set `YEKNAL_GITHUB_TOKEN` or `GITHUB_TOKEN`. Install Git to enable the fallback clone for API limits or interrupted raw-file downloads.
- Generated `yeknal-security.log`, `yeknal-security.json`, and `yeknal-security.sarif` files are local evidence and should not be committed.

## License

ISC
