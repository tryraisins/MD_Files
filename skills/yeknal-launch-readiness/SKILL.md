---
name: yeknal-launch-readiness
description: Audit a product for launch readiness before it becomes publicly reachable, covering the legal obligations that attach to the data, payments, email and user content it handles, plus the engineering gates no other workflow owns, then produce one register and a go or no-go. Use when someone asks whether an app is ready to launch or to ship to real users, or before public availability.
metadata:
  last-reviewed: "2026-10-23"
  jurisdictions: "NG, EU/EEA, UK, US federal, US California"
  boundary: "Not legal advice. Read-only by default."
---

# Launch readiness

Audit a product against the obligations that begin the moment a stranger can reach it, then say plainly whether it can ship.

This is a one-time external exposure audit. It is not a code review, and it is not the per-change gate before a commit.

## Where this fits

| Trigger | Use |
| --- | --- |
| "Am I ready to launch?", "before we ship", "before public availability" | this skill |
| A diff, branch, or pull request needs judging | `yeknal-review` |
| A piece of work is finished and needs gates, then a commit | `yeknal-finalize` |
| Controls, auth, injection, secrets, abuse paths | `yeknal-application-security` |

Say the difference out loud when the request is ambiguous. Running launch readiness for every change wastes the session; skipping it before a launch is how a fixable problem reaches the press.

## Boundaries

- Read-only by default. Report and hand off. Do not edit the product unless the user asks for fixes after reading the register.
- This is not legal advice. It is an evidence-based gap register with named instruments. High-risk, regulated, or money-handling cases get a recommendation to consult counsel, not a confident legal opinion.
- Never invent a citation, a section number, a penalty figure, or a filing fee. If a source cannot be confirmed, the row is marked `verify` and says what to confirm.
- Never present a statutory maximum as the likely outcome. Maximums exist to answer "how bad could this get", not "what will happen".
- Never say "you are compliant". The honest verdict is "no gaps found against the checks in the register".

## Workflow

1. **Scope before scanning.** Establish five things: target jurisdictions, audience age, what personal data is collected, whether money moves, and whether users publish content. If the user cannot answer, default to the strictest common denominator (Nigeria, EU/EEA, US California, US federal), state that default, and continue.
2. **Build the real map, then compare it with the claims.** Read the code, configuration, and infrastructure: analytics, pixels, session replay, payment provider, model provider, storage region, email provider. A privacy policy is a hypothesis to test, never evidence. A policy that does not match the map is itself a misrepresentation.
3. **Walk [Register A](references/obligations.md)** and mark each obligation `measured`, `heuristic`, or `unassessed`. Most legal rows will be `unassessed` from source alone, and that is the honest answer, not a failure.
4. **Walk [Register B](references/launch-gates.md)**, the seven engineering gates no other skill owns. These are mostly measurable, so do not accept a claim in place of a check.
5. **Rank by realistic exposure, then by fix cost.** Not by headline penalty.
6. **Hand off.** Controls to `yeknal-application-security`, policy wording to `yeknal-markdown-management`, browser proof to `yeknal-playwright`, gates and publication to `yeknal-finalize`.
7. **Deliver one register and one verdict** using [the report template](references/report-template.md). Blockers first. Then fixable now, then needs counsel, then needs a filing.

## Register A: legal and regulatory

Grouped by surface in [obligations.md](references/obligations.md), with the instruments and exposure in [jurisdictions.md](references/jurisdictions.md). Nigeria leads the matrix because the NDPA reaches any product processing Nigerian residents' data from anywhere, and its filing duties apply to small teams.

The surfaces are: data collected, third-party embeds and transfers, minors, marketing email, subscriptions and payments, user content, accessibility, AI features, breach response, and vendor processors.

Read the matrix for what binds. Read the obligations file for what to check in this repository.

## Register B: launch gates

Detailed in [launch-gates.md](references/launch-gates.md).

1. Database access rules (row-level security, storage policies, no service key in a client).
2. Backup and a restore that was actually performed.
3. Performance budget measured on a mid-tier phone, not a desktop.
4. Email deliverability: sender authentication and separated streams.
5. Cost containment: provider cap plus a per-user quota.
6. Rollback plan, including migration reversibility.
7. Analytics that load after consent and do not carry personal data.

## Handoff table: already owned elsewhere

Do not restate these checks. Confirm the owning skill ran, note its result, and move on.

| Check | Owner |
| --- | --- |
| Secrets absent from the client bundle and git history | `yeknal-application-security`, `yeknal-security-best-practices` |
| Rotation of any key ever committed | `yeknal-application-security`, `yeknal-git` |
| Rate limiting and abuse quotas | `yeknal-application-security` |
| Auth enforced on routes and objects | `yeknal-application-security` |
| Server-side input validation | `yeknal-application-security` |
| Errors do not leak stack traces | `yeknal-security-best-practices` |
| Error tracking wired up | `yeknal-sentry` |
| 404, empty, error, offline states | `yeknal-ui-quality-baseline` |
| Mobile layout and touch behaviour | `yeknal-ui-quality-baseline`, `yeknal-mobile-app-design` |
| Meta tags and Open Graph image | `yeknal-content-seo` |
| Signup, payment, and reset proven end to end | `yeknal-testing-strategy`, `yeknal-playwright` |
| Platform rollback commands | the relevant `*-deploy` skill |
| Dependency and supply-chain audit | `yeknal-application-security` |

## Hard rules

- A statutory maximum is a ceiling, not a forecast. State it that way or leave it in the matrix.
- Keep "must", "should", and "market practice" as three visibly different labels.
- An obligation with no verifiable source is `verify`, with the exact thing to confirm.
- Analytics, pixels, chat widgets, and session replay count as non-compliant until shown to load behind consent.
- A backup that has never been restored is `unassessed`, whatever the provider dashboard says.
- A restore claim needs a date and a method, or it did not happen.
- Never mark a row green because a policy page exists. Mark it green when the behaviour matches the page.

## Acting on the register

Order the work by certainty and consequence:

1. **Blockers.** Exposed data, a charge nobody consented to, a child's data collected without a guardian, a secret in a bundle. Stop the launch.
2. **Fields that break the law quietly.** Missing unsubscribe, missing renewal terms, unmasked replay, an age field that does nothing. Fix before launch; each is cheap.
3. **Filings and paperwork.** DMCA agent, NITDA liaison and reporting, NDPC registration, DPCO-mediated audit return. These take days, so they start before launch day rather than during it.
4. **Unverified claims.** Policy statements the code does not support. Either make the code true or change the sentence.
5. **Advisory.** Accessibility depth, UX of consent, deliverability polish.

Re-run the register after fixes. Report what changed, and keep every `unassessed` row visible rather than quietly dropping it.

## References

- [Obligations](references/obligations.md), Register A by surface.
- [Jurisdictions](references/jurisdictions.md), instruments, exposure, and sources.
- [Launch gates](references/launch-gates.md), Register B with pass conditions.
- [Evidence and fixes](references/evidence-and-fixes.md), where the evidence lives in a repository and what cannot be proven from source.
- [Report template](references/report-template.md), the deliverable.
