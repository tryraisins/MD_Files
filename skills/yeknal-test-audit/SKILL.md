---
name: yeknal-test-audit
description: Audit test suites for meaningful behavioral coverage, redundant or implementation-coupled assertions, and test-only production seams. Use when reviewing, consolidating, pruning, or making decisions about existing tests; also apply its value gate before adding or changing tests.
metadata:
  internal: true
---

# Test Audit

Evaluate tests by the independent contract and credible failure they protect, not by their name, size, or coverage percentage. This skill focuses on the quality and ownership of tests. Use `yeknal-testing-strategy` to plan verification for implementation work, and follow the repository's own testing and change policies.

## Before adding or changing a test

Answer these questions before writing the test:

1. What observable behavior, invariant, or independent contract does it protect?
2. What plausible regression would make the assertion fail?
3. Why does existing coverage not already catch that regression?
4. Which boundary is responsible for the contract, and can the test exercise that boundary directly?
5. Does the test require a production-only export, flag, wrapper, or injection seam that no real caller needs?

If these answers are unclear, inspect the owning behavior and existing coverage before adding a test. Prefer extending a meaningful case or testing a distinct risk over replaying the same scenario at another layer. For a regression, show that the check detects the intended pre-fix behavior and passes after the repair. Respect repository-specific policies about test timing and test types.

## Audit existing coverage

Keep discovery read-only. First inspect the repository instructions and scope, then read each candidate test and its assertions in full. Trace the production owner, entry points, non-test callers, fixtures, sibling implementations, overlapping coverage, CI routing, and relevant history. When a test relies on dependency behavior, inspect the dependency's actual contract when practical.

Judge what the assertions prove, not what the test name or comments promise. Treat the following as signals to investigate, not automatic deletion rules:

- assertions that do not constrain an outcome, self-comparisons, or expected values produced by the code under test;
- exact source/import/string checks that duplicate stronger behavioral proof;
- repeated tests of one contract at multiple layers without distinct boundary risk;
- mocks or fixtures that supply the behavior or ordering the production owner should produce;
- assertions that pass for an unrelated reason or never reach the behavior they claim to cover;
- production exports, wrappers, globals, or branches that appear to exist only for tests.

Keep static checks and implementation-shaped tests when they independently protect a public API, configuration, protocol, security rule, migration, generated artifact, package, release, or other explicit repository contract. A retained test is not redundant merely because it overlaps in topic with another test. Establish that the surviving test catches the same credible failure at an appropriate boundary before consolidating coverage.

## Record evidence before proposing removal

For each candidate, record:

- test name and location;
- the assertion's actual coverage and a credible failure it detects;
- non-test callers of any production or test-support seam involved;
- the stronger remaining proof, or why the assertion protects no independent contract;
- relevant history or ownership context;
- code or test-only seams that removal could safely simplify;
- risk and the focused validation command.

Classify the proposed outcome as **retain**, **repair assertion**, **consolidate**, or **remove**. A missing evidence item means the candidate is not ready for deletion. Report findings and proof that remains separately from edits; make destructive changes only when the user has requested cleanup or approved the proposed batch.

## Large subsystem campaigns

For a user-authorized audit of an entire subsystem, work in coherent lanes based on production ownership rather than filename prefixes. Inventory every in-scope test file and relevant live or QA scenario, record a baseline, and assign every test or materially distinct table row an evidence-backed outcome. Build a keeper map per contract before editing. Apply changes one lane at a time, serialize edits to shared test support, and remove test-only production seams only after confirming they have no production callers.

Before calling a campaign complete, review deleted coverage against the keeper map and check for contracts that lost their only proof. Use a deliberate mutation only when it is a safe, focused way to demonstrate that a retained keeper detects the intended behavior; restore the original production code and verify the final diff. Treat baseline failures that survive at a real behavior boundary as possible product defects, and report them separately from test cleanup unless the user asked to fix them.

## Validation and report

Use the smallest relevant owner and sibling checks first, then run the broader gates required by the repository. Exercise the executable behavior when replacing a source grep or plan-only assertion. Run formatting and `git diff --check`, inspect the final diff, and report failed, skipped, or blocked checks without implying they passed. Never remove a test solely to reduce test counts or line counts.

Summarize:

- the scope and confirmed redundant or defective test patterns;
- tests retained, repaired, consolidated, or removed and the contracts that remain protected;
- any production/test-support seams changed and their verified callers;
- focused and broader validation actually run;
- unresolved candidates and follow-up work.

For the adapted audit approach, see the [OpenClaw test-audit skill](https://github.com/openclaw/openclaw/blob/main/.agents/skills/test-audit/SKILL.md). Repository-specific commands and campaign rules always take precedence over that reference.
