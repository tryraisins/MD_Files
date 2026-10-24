---
name: yeknal-agent-cost-control
description: Cut agent inference spend without quietly losing quality. Use when an LLM bill, token spend, or per-task cost is too high, when sessions feel slow or expensive, when choosing models or effort levels for a task, or when someone asks whether prompt caching, model routing, or a cheaper tier is worth it.
metadata:
  last-reviewed: "2026-10-24"
  boundary: "Measures and changes cost. Does not decide who does the work."
---

# Agent cost control

An inference bill is the product of how many calls you make and how much context each call carries. Both are design decisions, not provider pricing. Measure the bill first, then change only the lever the measurement points at.

## Where this fits

| Trigger | Use |
| --- | --- |
| The bill rose, or one task cost more than expected | this skill |
| Splitting work between agents, or deciding who does what | `yeknal-orchestration-specialists` |
| Judging whether a diff or system is correct | `yeknal-review` |
| Proving behavior through the real entry point | `yeknal-testing-strategy` |

This skill answers whether the spend is justified and how to prove a change helped. It does not decide who does the work, and it does not review code.

## Boundaries

- Measure before changing anything. A cache or model change made without a baseline cannot be shown to have helped, and often is not the problem.
- Cheaper is not automatically fine. Every cost change needs an outcome check, or it is a silent quality cut.
- Do not optimize a workload you have not looked at. An expensive month is usually one long session, not a pricing problem.
- Another team's numbers are evidence, not a forecast. Recheck on your workload.

## Step 1: Measure what you actually spent

Per session, collect from the harness usage log. [measurement.md](references/measurement.md) has a queryable schema and query examples.

| Metric | Why it matters |
| --- | --- |
| Calls per session | Cost grows with calls, because each call resends the conversation |
| Uncached input tokens | The part paid at full input price |
| Cache read tokens | Cheap per token, but large volumes still add up |
| Output tokens | Priced highest, usually the smallest volume |
| First-call cache hit rate | Whether each new session starts warm |
| Cost per session and share of total | Where the money actually is |

Report totals, then the distribution. An average hides the tail that owns the bill.

## Step 2: Find the concentration

Rank sessions by cost and look at the shape before choosing a fix.

| Shape | Read it as | First move |
| --- | --- | --- |
| A few sessions far above the rest | Session shape, not pricing | Split the work and hand off at a boundary |
| Cost spread evenly and high everywhere | Per-call context is too large | Cut what each call carries |
| Low first-call hit rate, large uncached share | Prefix discipline | Stabilise the start of the prompt |
| High cache-read share already | Caching works | Stop looking at cache; work on calls |

A single session running until the task was done is the normal cause. Say so plainly when the data shows it, rather than proposing an infrastructure change.

## Step 3: Change the lever the evidence points at

In order of usual payoff:

1. **Calls per session.** Split long runs at a natural boundary and hand off state. Delegate exploration so the main session never reads whole files, and keep integration with one owner.
2. **Content per call.** Read known files in one parallel batch instead of one per turn. Put the reference material an agent needs at the start of its prompt rather than letting it spend the first turns finding it.
3. **Tool surface.** Remove tools an agent cannot use and integrations nobody calls. Unused definitions ride on every request, and a tool the agent tries and is rejected for costs an extra round trip.
4. **Model and effort.** Change this last, and only against an A/B on the same work.

Removal usually beats discount. Dropping a lane, a server, or a redundant pass is more reliable than paying less per token for the same volume.

## Step 4: Prove it on outcomes, not on cost alone

Before keeping a cheaper configuration, check what it stopped finding:

- Count findings that led to a change, not findings. Compare flagged lines against the author's next commit, and use a baseline for edits that happen anyway.
- Judge a blinded sample of findings (important, minor, duplicate, wrong, unverifiable) and of severity (fair, too high, too low).
- Split traffic 50/50 on the same kind of work before switching, then compare cost per run and outcome per run.

A fall in reported problems is ambiguous: either noise removed or findings lost. Without one of these checks, assume findings were lost.

Effort is not a cost dial to turn down by default. In the published case below, high effort on one reviewer cost 61% more per run and posted more real findings, so it was kept, while medium effort on the same reviewer lost real findings.

## Published reference point

One team cut cost per code review from $2.43 to $0.77 and median time from 4m09s to 1m32s. Code changes accounted for $0.65 of the saving and model and effort changes for $1.06. Their caching work paid off because the first request of a session found a cached prefix only 14-26% of the time; on a setup already above 90%, that work returns almost nothing. Read the full account at [Cloudflare, cutting inference cost by 68%](https://blog.cloudflare.com/obsessive-inference-optimization/).

Use it as a shape, not a target. The transferable part is the method: measure per session, find the concentration, change one lever, and gate model changes on outcomes.

## Failure modes

| Symptom | Likely cause | Check |
| --- | --- | --- |
| Bill rose with no workload change | Longer sessions, bigger diffs | Calls per session over time |
| Most spend in one session | Work never split | That session's call count and share |
| Cheap model, worse reviews | Silent finding loss | Findings that led to a change |
| Prefix work gave no saving | Cache already warm | Cache-read share before the change |
| Cost fell, latency rose | Fewer, larger calls | p50 and p95 per run, not just spend |

## Reporting

When you report, state:

1. what you measured and over what window
2. the concentration: top session, its calls, its share of spend
3. the one change you recommend, and the evidence that points at it
4. the outcome check required before a model or effort change is kept

Do not present a saving without the check that shows nothing important was dropped.
