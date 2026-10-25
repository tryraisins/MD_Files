---
name: "yeknal-security-best-practices"
description: "Load per-language and per-framework secure-coding references for Python, JavaScript/TypeScript, or Go. Use as the stack reference library behind yeknal-application-security, not as a full codebase audit."
metadata:
  baseline: OWASP Top 10:2025 and OWASP ASVS 5.0
  openai-plugins-reviewed-commit: 1e285826e604f66f7208f7ac4dba0fe8341d1f57
  last-reviewed: "2026-09-07"
---

# Security Best Practices

This is the stack-reference library that `yeknal-application-security` loads. It holds per-language and per-framework secure-coding guidance; the cross-stack baseline, the review method, and the report contract live in `yeknal-application-security`.

Use it to write secure-by-default code, passively detect major issues in code you are already working in, or answer a focused question about a supported stack. For a full codebase audit, an end-to-end pen test, or machine-readable findings, use `yeknal-security-audit`.

## Workflow

1. Identify every language and primary framework in scope. Include both frontend and backend when the application contains both.
2. Start from the cross-stack baseline owned by `yeknal-application-security`. Read [the stack-extension notes](references/modern-security-baseline.md) only where a language or framework needs more than that baseline.
3. Find the matching files in `references/` and read only those that relate to the frameworks in scope. Filenames follow `<language>-<framework>-<stack>-security.md`, plus a framework-agnostic `<language>-general-<stack>-security.md`.
4. For a web application with both sides, load references for both. If the frontend framework is unspecified, include `javascript-general-web-frontend-security.md`.
5. If no relevant framework file exists, use the cross-stack baseline and current primary documentation. Mark the missing specialized guidance rather than presenting remembered framework details as confirmed current.

## Modes

1. **Write secure code.** Apply the loaded guidance to new code. This is the primary mode.
2. **Passive detection.** While working in the project, flag critical or high-impact vulnerabilities that contradict the loaded guidance, and say so. Stay with the highest-impact issues and secure defaults.
3. **Focused stack review.** When the user asks for a security report or an improvement pass, produce the report below, prioritized with clear severity and urgency, then offer to fix.

## Report format

Write the report to `security_best_practices_report.md` or another location the user provides, and tell the user where it went.

- Open with a short executive summary, then group findings by severity.
- Give every finding a numeric ID and repository-relative code references with line numbers.
- For critical findings, include a one-sentence impact statement.
- Finish by summarizing the findings to the user directly and offering to explain any finding or its guidance.

A full audit instead produces `findings.json` plus derived reports under `yeknal-security-audit`.

## Fixes

If the request was review-only, stop after the report. Implement fixes only when the user requested remediation or the active workflow already authorizes it, and fix one finding at a time.

Give each fix a concise comment naming the security practice it follows. Consider whether the change alters functionality or regresses behavior: insecure code is often relied on for other reasons, and breaking the project discourages future fixes. Follow the project's normal change, commit, and test flows, and do not bunch unrelated findings into one commit. Consider second-order impacts and warn the user before making them.

## General security advice

### Public identifiers do not provide authorization

Opaque identifiers can reduce enumeration and information leakage, but every object and action still requires server-side authorization. Do not describe UUIDs as preventing IDOR/BOLA.

### A note on TLS

Local HTTP development does not prove a production TLS issue when a trusted proxy terminates HTTPS. Verify the deployed boundary before reporting. Production session cookies should still be `Secure`; keep any local exception explicit and impossible to enable accidentally in production. Recommend HSTS only after HTTPS is verified for the intended host scope. Add `includeSubDomains` or preload only with deliberate operational approval, because those choices can affect unrelated hosts and are difficult to reverse quickly.
