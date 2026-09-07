# yeknal

Sync reusable AI-agent skills and run a lightweight static security audit from the command line.

## Requirements

You do not need a global install. A new device needs:

- Node.js with npm;
- internet access;
- at least one supported agent folder: Codex (`~/.codex`), Claude (`~/.claude`), Gemini Antigravity (`~/.gemini/antigravity`), or Antigravity (`~/.antigravity`).

Git is optional and is used only as a fallback when the GitHub API is rate-limited.

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
- excludes `SEO`, which is reference material without a `SKILL.md`.

### `npx yeknal security`

This command:

1. downloads `application-security/Security-Master.md` temporarily;
2. syncs `application-security`, `security-best-practices`, `security-ownership-map`, and `security-threat-model`;
3. scans the current project;
4. writes `yeknal-security.log` and removes the temporary master file.

The scanner checks static signals for exposed secrets and credential files, dependency risk, authentication and session handling, input validation, CORS, security headers, database access, unsafe frontend sinks, and framework configuration. Findings require human review; a static scan cannot prove runtime authorization, exploitability, deployment posture, or the absence of vulnerabilities.

## Notes

- If no supported agent folder exists, the skills command exits without installing anything.
- If GitHub API limits are reached, set `YEKNAL_GITHUB_TOKEN` or `GITHUB_TOKEN`, or install Git for the fallback clone.
- `yeknal-security.log` is local evidence and should not be committed.

## License

ISC
