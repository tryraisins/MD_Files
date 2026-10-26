---
name: yeknal-ambition
description: Raise a task or brief to expert standard before work starts by naming the real bottleneck, the rawest material, the method and the outside check. Use for "be ambitious", "raise the bar", or "what would an expert do here".
metadata:
  source: https://github.com/DannyMac180/skills
  source-commit: a4e95dddae3015971397c61923175950a9fa2f76
---

# Ambition

Most work starts from the brief as given. Decide whether that brief is already at expert standard, and when it is not, raise the standard without widening the job.

## Decide whether a pass is warranted

Find the bottleneck. "None" is the normal answer, and three tests settle it before any axis is considered:

- **The request states its own proof.** A type check, the test suite, a link that returns 200, an approved design value, an existing benchmark. Run that proof and do the work.
- **The change is one mechanical edit with a searchable surface.** Rename it, search for the old name, run the checks.
- **One authoritative source settles it.** Read the source and answer.

If none of those hold, name the bottleneck:

- **Depth.** The acceptance criteria exist but the inputs, method or validation cannot meet them.
- **Range.** The brief names an artifact and not the effect it must have on someone.
- **Altitude.** The user asked for an outcome redesign or handed over the outcome itself.

Take the bottleneck the work actually has, not a favourite axis. Depth and range often arrive together; altitude arrives only when invited.

## Apply the pass

### Depth

Answer four questions about the field, then build the work from the answers.

1. **What would a top practitioner do here that the request does not ask for?** Name the two or three moves that separate expert work from competent work: stating the decision the work serves, checking base rates, reproducing before fixing, writing the counter-argument.
2. **What is the rawest material?** The dataset, not the chart; the logs and the code, not the bug report; the method section of the paper, not the abstract; the filing, not the article. Say where it lives.
3. **Which named methods and instruments fit, and why?** A specific library, test, statistical model, benchmark or command. "Act like a professional" changes vocabulary without changing method, so name the instrument.
4. **What, other than you or the model, decides that the result is right?** A held-out test set, a reproduction, ground truth, a benchmark, a measurement, a domain reviewer, real user behaviour. State what counts as a pass and what counts as a failure.

Keep a stretch target only when a measurement decides it, and prefer validation on material that was not used to produce the result. Ambition is not a claim that something is tractable: if the raw material or the access does not exist, say so and stop.

### Altitude

Ask what happens after this ships. Which recurring job is this one instance of, and what would stop it needing to be done by hand again? Propose the standing change, do not build it unasked, and do not describe a loop the agent cannot run.

An altitude proposal must name the access and tooling the loop depends on: which data it reads, how it maps to the current system, where it runs, and what it costs to keep running. Without those, it is a wish rather than a proposal.

### Range

Replace the nouns with verbs. "A quarterly review deck" becomes "get busy people to believe a story about cause and effect, then decide under uncertainty in thirty minutes". Then name the fields that verb needs, and the instrument from each field that would change the work: a simulation, an audit method, a forensic ledger, a type system, a measurement rig.

Use at most three fields, and only where the instrument is real. Do not ask the model to write like a short seller; ask it to do what a short seller does. Zero fields is a valid answer.

## Write the rewrite

When the user asks to raise the bar on a brief, the rewrite is the deliverable.

1. Name the field and the bottleneck in one line.
2. Answer the questions for the chosen axes, concretely.
3. Write the replacement prompt in one fenced block: same goal, expert standard, the named material and methods, and the outside check with its pass and fail condition.
4. Stop. Offer in one line to run it.

When the pass happens while work is already underway, do not stop and do not emit a rewrite block. Apply it to your own plan, state the upgraded standard and its check in one or two lines, and continue with the authorized task.

## Contract boundary

A pass may not change the authorized contract without explicit approval. That contract covers acceptance criteria, dependencies and access, who owns the outcome afterwards, and any materially higher effort or cost. Offer the bigger option in one line, then proceed with the original request if it is not taken.

## Guardrails

- Deeper, not bigger. No new deliverables, features or side quests.
- Never invent a source, tool, expert, benchmark or result.
- Never claim a check that was not run. For design work, user approval or usability evidence counts as an outside check; a screenshot is not proof of taste.

## Hand off

- Evidence depth and claim verification: `yeknal-research-analysis`.
- Execution and real-entry-point proof: `yeknal-implement`.
- Parallel specialists and their artifacts: `yeknal-orchestration-specialists`.
- Final gates, review and publication: `yeknal-finalize`, `yeknal-review`.

Worked rewrites for one code, one research and one product brief, plus two cases that should stay untouched, live in [references/worked-examples.md](references/worked-examples.md).
