# Worked examples

Five briefs. Three earn a rewrite, two do not, and the two that do not are the point: most requests are already at the right standard.

## Depth: a slow page

**Brief:** "The settings page takes six seconds to load. Make it faster."

**Bottleneck:** depth. The request names a symptom and no measurement.

| Question | Answer |
| --- | --- |
| Unasked expert moves | Measure the production build on the target device before editing code; split server time from render time; find the commit that introduced the regression |
| Rawest material | Production traces, the network waterfall, the commit history for that route |
| Methods | The repository's bench harness at 4x CPU throttle, a long-task breakdown, LCP and INP percentiles |
| Outside check | p75 interactive under 2.5s on the agreed device profile, with no other route regressing; a change inside the noise floor fails |

**Rewrite:**

```
Profile the settings page in a production build on a 4x throttled mid-tier
device and find what actually costs the six seconds. Start from the production
trace, the network waterfall and the commit that introduced the regression,
not from the dev server. Use the existing bench harness to record LCP, INP and
long tasks before and after. Fix the dominant cost, then re-run the same
profile. Pass: p75 interactive under 2.5s on that device profile with no other
route regressing. Fail: the improvement sits inside the measured noise floor.
```

## Range: a churn question

**Brief:** "Find out why churn went up last quarter."

**Bottleneck:** range. The obvious answer is a marketing explanation, and the instrument that settles it comes from statistics.

| Question | Answer |
| --- | --- |
| Unasked expert moves | Separate who left from when their behaviour changed, and test the explanation against a holdout rather than the same quarter |
| Rawest material | Event logs and billing records, not the dashboard, the exit survey or the retention slide |
| Methods | Cohort retention curves, a churn survival model, a holdout comparison against the previous quarter |
| Outside check | The model predicts churn on the next quarter's data, which it has not seen, above a stated threshold; below it, the explanation fails |

**Rewrite:**

```
Explain the churn increase from event logs and billing records, not from the
dashboard or the exit survey. Build cohort retention curves and a churn
survival model, then name the behaviour that changed and when. Test the
explanation on a holdout: predict churn for the following quarter, which you
have not used to build the model. Pass: the model clears the stated threshold
on that holdout and the driver precedes the churn. Fail: it only fits the
quarter you built it from.
```

## Altitude: a crash, when the outcome was handed over

**Brief:** "Fix the crash on launch in the Windows build."

**Bottleneck:** altitude, and only because the user asked for the outcome rather than this instance.

| Question | Answer |
| --- | --- |
| Recurring job | Keeping the app crash-free, not fixing one crash |
| Standing change | Triage by crash signature and release version, with a fix and a regression check per signature |
| Access it requires | Crash reports, a version-to-commit map, reachable machines for each supported OS |
| Boundary | The agent has the code and the reports but no Windows machine, so the loop cannot run end to end today |

**Rewrite, offered rather than executed:**

```
This is one instance of keeping the app crash-free. Propose a standing loop:
group crashes by signature and release version, map each version to its commit,
reproduce on a real machine, fix, and keep a regression check per signature.
Name the access it needs. I have crash reports and the repository, but no
Windows machine, so say what is blocked and fix this crash while the loop is
being decided.
```

## No pass: a scoped fix

**Brief:** "Fix the null check that crashes settings when the profile has no avatar."

**Bottleneck:** none. There is a reproduction, the change is one condition, and the proof is obvious. Implement it, add the regression check, and do not rewrite the brief.

## No pass: an approved design change

**Brief:** "Move the hero heading up 8px, as marked in the Figma file."

**Bottleneck:** none. The design is approved and the scope is one value. Execute it and verify it in the browser. An ambition pass here would only relitigate a decision the user already made.
