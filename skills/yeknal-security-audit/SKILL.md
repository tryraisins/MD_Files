---
name: "yeknal-security-audit"
description: "Run a multi-phase security audit of a repository, directory, or diff with a coverage ledger, adversarial verification, and schema-validated findings. Use only for explicit audit or pen-test requests, not general security questions."
license: MIT
metadata:
  source: https://github.com/cloudflare/security-audit-skill
  source-commit: c1c8a8c1471069fb0e188eeaff69b8e8db6564a8
  baseline: Cloudflare security-audit skill; OWASP Top 10:2025 and OWASP ASVS 5.0
  last-reviewed: "2026-10-24"
---

# Security Audit

Find vulnerabilities that cross a real trust boundary, then give the owner source evidence, a safe reproduction, a priority, and the smallest effective fix.

This is an audit execution engine, not a checklist. It plans coverage, hunts in isolated units, gives every candidate to a fresh verifier that tries to disprove it, writes machine-readable records, and derives the report from those records. A candidate with no concrete affected principal, resource, or security outcome is not a finding.

Load the security policy baseline from `yeknal-application-security`, per-framework guidance from `yeknal-security-best-practices`, and design-time modeling from `yeknal-security-threat-model`. This skill owns the empirical audit and its report artifacts.

## Operating modes

Loading this skill does not authorize the full workflow or any file creation.

- **Guidance mode.** For security questions, focused review of a specific finding, methodology questions, or triage, answer from `yeknal-application-security` plus this skill's core principles. Launch focused agents when useful, but they return to the current task. Do not run all six phases and do not create a run directory.
- **Full audit mode.** Use the complete workflow when the user asks to audit or pen-test a codebase, asks for a full or end-to-end security review, or asks for report artifacts. Run all six phases and write the files defined below.

If the request could mean either mode, ask one focused question before creating files.

## Audit roles

The workflow needs three independent roles. Bind them to real subagents; never simulate the roles inside one context.

| Role | Lane | Responsibility |
| --- | --- | --- |
| Reconnaissance and hunting | A read-only explorer agent | Read-only source inspection, one coverage unit per assignment, structured candidate output |
| Repository-wide tracing and coverage critique | A repository-wide tracing agent | Follow a path across subsystems, find ledger gaps, never hunt and never write |
| Candidate and record verification | A fresh agent per candidate, a stronger reasoning agent when the candidate turns on subtle logic | Try to disprove the claim from source, with no access to the hunter's reasoning |

Rules that hold in every profile:

- Only the parent spawns agents. Delegated agents cannot delegate.
- Independence comes from fresh context. A verifier receives the candidate fingerprint, the claimed boundary, and the claimed evidence paths. It never receives the hunter's narrative, and it never verifies its own find.
- The parent is the only writer of shared run files.
- Hunting and tracing roles are read-only. Never send them code edits, and never ask a hunting role to fix what it found. Remediation is separate work that the user requests.

Budget the run in agent invocations. A `deep` profile on a large repository is a deliberate spend, not a default.

## Execution safety

Source inspection is read-only and always allowed. Executing target code is a separate authorization.

**Default on this machine: no OS-enforced sandbox exists, so target code does not execute.** Compiling, running tests, launching the app, driving a browser, fuzzing, and processing fixtures all require an OS-enforced sandbox that provides no external network, an empty environment populated from an allowlist, a read-only target, writes confined to an assigned `scratch/` directory, and explicit CPU, memory, process, disk, and wall-clock limits. Without every one of those controls, keep the lead as `needs_validation`, state the missing capability, and give a safe owner-facing validation plan.

If a real sandbox becomes available (WSL2 or a container with those controls), execute only the minimum local check that establishes the defect.

Both modes:

- Use dummy principals, fixtures, and secrets.
- Never probe deployed endpoints, external services, shared infrastructure, production identities, other users' data, or live control planes.
- Never test availability against a live or shared process.
- Never publish artifacts, alter releases, spend paid API quota, or pursue persistence, post-exploitation, or concealment.
- Stop at the first minimum effect that proves the boundary failure: a wrong return value, an unauthorized dummy record, a sanitizer finding, or a policy difference.
- If the decisive fact lives outside source or the sandbox, report `needs_validation` rather than guessing.

For a reproduced check, record the command, the exact test input, the sandbox limits, and only the allowlisted environment variable names with safe non-secret values. Never capture the ambient environment.

## Setup

Resolve these before reconnaissance:

- **Skill directory.** The absolute directory containing this `SKILL.md`. References and validators resolve relative to it.
- **Target.** The absolute repository root or directory under review.
- **Repo name.** A stable identifier from the directory name or local Git remote.
- **Output directory.** A new writable directory outside the target, defaulting to `~/security-audit-skill/<repo-name>/run-<N>` with the next unused integer. Use a directory inside the target only when the user explicitly selects it and version control ignores the whole directory. Otherwise stop and ask for an external path.
- **Source ref.** The reviewed commit and whether the worktree is dirty. Do not treat unreviewed generated or modified files as part of the revision.

Write `run-metadata.json` before delegating, with `run_id`, `repo`, `target`, `source_ref`, `profile`, `scope_paths`, `budget` (null when unset), `execution_policy: "source-only-no-sandbox"` or `"sandboxed-source-and-local-only"`, the selected companion files, prior-run paths, shared-file owners, and `run_status: "in_progress"`.

Each delegated agent gets its own root under `<output-dir>/agents/<agent-id>/` with separate `scratch/` and `artifacts/`. Agent IDs match `^[a-z0-9][a-z0-9_-]{0,63}$`, stay lowercase, and must not be a Windows device name (`con`, `prn`, `aux`, `nul`, `com1`-`com9`, `lpt1`-`lpt9`). Agents write only inside their own `scratch/`, never to shared files, target source, or another agent's directory. Do not fall back to `/tmp` or the home directory as scratch.

## Planning

### Coverage ledger

No single pass is complete, and coverage is a claim that must be countably supported. Build a deterministic ledger before hunting and update it after every agent result. The parent alone writes it. `references/RECONNAISSANCE.md` defines the stable coverage units.

### Prior runs

If earlier runs exist, read every compatible `coverage-ledger.json` and `findings.json` before planning:

1. Compare current source against each prior record and unit. A prior source ref alone does not prove the path is unchanged.
2. Carry a prior `confirmed` record forward only when its source and conditions are unchanged and its evidence still meets the current contract. Link it to a `planned` unit, keep its fingerprint, exclude only that root cause from hunters, and still send it through final verification.
3. When the source behind a prior `confirmed` record changed, create a planned revalidation unit and keep it huntable.
4. Prior `needs_validation`, `deferred`, `blocked`, `out_of_scope`, and changed-source units are current work. They never suppress a unit.
5. A prior covered unit informs priority but stays visible. A prior `rejected` record suppresses only that unchanged failed claim.
6. Read the prior profile and scope. A prior `quick` or scoped ledger contributes its recorded gaps, never an implied "the rest is fine."

If no prior ledger exists, say so in the coverage statement. Never imply one run exhausts the target.

### Profiles

The default is `standard`. Record the profile and state it in the report.

- **`quick`.** Bounded first pass, small target, or re-run. Coarsen units to surface × boundary × attack class, run exactly one hunter wave and one final coverage critique, and use one fresh verifier per candidate for both validation and record verification. Record accepted discoveries from the critique as `deferred`.
- **`standard`.** The workflow as written.
- **`deep`.** High-stakes or large targets. Split units per subsystem and lifecycle mode, run critic waves to a clean pass, keep candidate validation and record verification as separate fresh agents, and give carried `prior_covered_same_source` units an independent second pass.

A **scoped** run covers named paths, one subsystem, one companion domain, or a diff between two refs. Seed units only for in-scope surfaces and mark everything else `out_of_scope`, never `covered`. A scoped or `quick` run presents itself as partial coverage.

Profiles change breadth and redundancy. They never relax the candidate gate, the execution boundary, `needs_validation` discipline, schema validation, or independent verification of `confirmed` records.

### Budget

One ledger unit is roughly one hunter assignment. One surviving candidate costs one or two verifier assignments. When the user sets a budget, record it as a maximum number of agent invocations across all phases.

Apply the gate before launching any reconnaissance agent. Reserve the four baseline reconnaissance calls, the mandatory critic calls for the profile, and at least one verifier. If the budget cannot fund that minimum, launch no agent. Ask for a larger budget, a narrower scope, or a different profile. If the request stands unchanged, set `run_status: "incomplete"` with `incomplete_reason: "budget_cannot_fund_reconnaissance_and_reserves"` and report that no audit pass ran.

Spend in this order:

1. Reserve critics and validation before hunting. `quick` reserves one final critic. `standard` and `deep` reserve one immediate post-wave critic plus one distinct final-clean critic per wave. Reserve verifier cost at roughly one or two agents per expected candidate, or 30% of the post-critic balance when unsure.
2. Assign hunters in unit priority order until the hunting allowance is spent.
3. Spend each reserved post-wave critic immediately after its wave and keep the final-clean reserve intact.
4. If a later wave cannot cover its critic and validation reserve, launch no hunters from that wave, mark its units `deferred` with reason `budget_cannot_reserve_critics_and_validation`, and let the retained critic record the gap.

If an unexpectedly large candidate set exhausts the validation budget, stop hunting, validate in fingerprint order while the budget permits, and set `run_status: "incomplete"` with `incomplete_reason: "validation_budget_exhausted"`. Keep unvalidated fingerprints linked to `candidate` units. Never place an unvalidated candidate in `findings.json`, never relabel it `needs_validation`, and never report the run as complete. Never exceed a user-set budget silently.

## Core principles

### Require a boundary and a result

Name the lower-trust principal, the accepted input or action, the intended control, the crossed boundary, the affected principal or resource, and a concrete observed or owner-observable result. A missing best practice, a guessed deployment behavior, a generic parser crash, or self-impact is not a finding.

### Separate priority from certainty

Only `confirmed` records carry severity, and severity cannot exceed demonstrated impact.

- **critical.** An unauthenticated actor gains code execution, full data-store access, or takeover of arbitrary accounts.
- **high.** An actor fully defeats an explicit control with real consequences: authentication bypass, cross-tenant read or write, stored script execution against other users, authenticated code execution, or an unauthenticated remote stop of a shared service.
- **medium.** A real boundary violation with limited blast radius, uncommon preconditions, or a narrow resource set.
- **low.** Disclosure of non-secret internals, or minimal gain for sustained effort.
- **informational.** A confirmed observation useful mainly as a prerequisite inside a larger finding.

The high/medium discriminator: does the result fully defeat an explicit control for an action with real consequences, or only weaken it? If the concrete damage cannot be stated, the severity is lower than it feels.

Severity requires impact. Defects in defense in depth are hardening notes: if layer A stops the attack, the absence of layer B is not a vulnerability.

`needs_validation` means a source-grounded boundary hypothesis is blocked by an exact unresolved fact. It carries no severity and is never a low-confidence confirmed finding.

### Respect source visibility

Deployment controls, proxy behavior, provider settings, browser headers, identity policy, broker ACLs, packaging, and topology are real controls. When they are required and absent from the repository, assume neither presence nor absence. Use `needs_validation` with the exact missing fact and a safe validation plan.

### Recommend the smallest effective fix

For each confirmed finding, name the invariant the code must enforce and the narrowest change that enforces it at the last trusted decision point. Prefer repository-relative changes and a regression test over generic hardening advice. The audit describes fixes. It does not modify target source.

## Workflow

Run all six phases in order.

1. **Reconnaissance.** Map architecture, trust boundaries, input surfaces, build paths, companion selections, and prior evidence. Write `architecture.md` and the initial `coverage-ledger.json` per `references/RECONNAISSANCE.md`, then run the ledger validator.
2. **Coverage-led hunting.** Assign isolated hunters from ledger units, record every check, and use coverage critics to find gaps. Methodology, candidate format, and per-domain attack classes live in `references/HUNTING.md`, `references/ATTACK-CLASSES.md`, and the domain companions below.
3. **Candidate validation.** Consolidate fingerprints and give every unique candidate to a fresh verifier that tries to disprove it. Rules are in `references/VALIDATION-AND-REPORTING.md`.
4. **Structured output.** Write every final `confirmed`, `needs_validation`, and `rejected` record to `findings.json`, then validate against `scripts/report-schema.json` with `scripts/validate-findings.cjs` and re-validate the ledger.
5. **Independent record verification.** Use fresh agents to verify the source claims behind final records. A materially replaced record gets another independent verifier, and the ledger is re-validated after each replacement.
6. **Target-neutral report.** Derive `REPORT.md`, `FINDINGS-DETAIL.md`, and `NEEDS-VALIDATION.md` from verified records and the ledger. No live-probe instructions.

Do not end mid-phase. The run has exactly two terminal states: every Phase 6 artifact is written and both validators pass, or `run_status: "incomplete"` records the exact reason and the report discloses the gap.

Multiple runs against one repository are additive. Use prior ledgers to target gaps, revalidate changed source, and carry forward current-source evidence without treating stale or unresolved work as covered.

## Output files

The parent owns every file in the run directory.

| File | Written in | Purpose |
| --- | --- | --- |
| `run-metadata.json` | Phase 1 | Run identity, scope, profile, budget, status |
| `architecture.md` | Phase 1 | Source-grounded system and boundary map |
| `coverage-ledger.json` | Phase 1, updated each wave | Deterministic coverage units and their state |
| `findings.json` | Phase 4 | All three verdicts, schema-validated |
| `REPORT.md` | Phase 6 | Coverage statement, counts, and priority order |
| `FINDINGS-DETAIL.md` | Phase 6 | One entry per confirmed finding |
| `NEEDS-VALIDATION.md` | Phase 6 | Blocked leads with their exact unresolved fact |

## Validators

Both validators are zero-dependency Node scripts. `report-schema.json` must stay beside `validate-findings.cjs` because the validator resolves it from its own directory.

```bash
node <skill-dir>/scripts/validate-coverage-ledger.cjs <run-dir>/coverage-ledger.json
node <skill-dir>/scripts/validate-findings.cjs <run-dir>/findings.json
```

Run the ledger validator after creating the ledger and after every later ledger update. Run the findings validator in Phase 4 and again after every Phase 5 replacement. A validator failure is a blocking defect in the records, not a warning.

Keep run directories outside shared or target-controlled locations. Platform-specific validator behavior is documented in `references/VALIDATION-AND-REPORTING.md`.

## Anti-patterns

1. Testing a live or shared environment because bounded local evidence was unavailable.
2. Treating intended same-principal authority or self-impact as a cross-boundary result.
3. Reporting a parser or runtime effect stronger than the observed one.
4. Emitting prose-only hunter output that cannot be deduplicated or verified.
5. Using carried prior findings as exemplars that anchor the current hunt.
6. Writing the report before independent verification, or letting prose and JSON disagree.

## References

Read only the companions the target needs.

| File | Use for |
| --- | --- |
| `references/RECONNAISSANCE.md` | Coverage units, recon prompts, Phase 1 synthesis |
| `references/HUNTING.md` | Hunter orchestration, candidate format, critic waves |
| `references/VALIDATION-AND-REPORTING.md` | Phases 3 to 6, verification, artifact contracts |
| `references/ATTACK-CLASSES.md` | Core, wildcard, and obvious-things attack prompts |
| `references/WEB-PROTOCOL-AND-AUTH.md` | HTTP framing, caching, authentication protocols |
| `references/CLIENT-SIDE.md` | DOM injection, messaging trust, UI redress, prototype pollution |
| `references/AI-AND-LLM.md` | Prompt injection, agent and tool use, output handling |
| `references/DATA-ISOLATION-AND-LIFECYCLE.md` | Tenant isolation, cache, search, export, backup, deletion |
| `references/CLOUD-AND-DEPLOYMENT.md` | IAM, infrastructure as code, containers, serverless, ingress |
| `references/SUPPLY-CHAIN-AND-RELEASE.md` | Dependencies, CI, release, signing, updates, plugins |
| `references/PROTOCOLS-RPC-AND-MESSAGING.md` | RPC, serialization, queues, brokers, webhooks, streaming |
| `references/RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` | Shared resources, quotas, queues, workers, operator spend |
| `references/MEMORY-SAFETY-AND-BINARY.md` | Memory safety, binary, and kernel classes for native targets |
| `references/DESKTOP-MOBILE-AND-LOCAL-IPC.md` | Native apps, deep links, webviews, daemons, local IPC |
| `scripts/report-schema.json` | Findings schema, the contract all three verdicts obey |
