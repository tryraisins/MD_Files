# Motion principles

Classical animation principles come from performance animation, where a captive audience watches a self-contained act. Interface motion is user-driven, repeated, and interruptible. Some principles transfer almost unchanged, some need reframing, some belong only to characterful moments, and some do not transfer at all.

The framing matters more than the list: these are observations of how the physical world behaves, not rules to apply mechanically. Use them to judge, not to check off.

## Transfer table

| Principle | Verdict | Interface mechanism |
| --- | --- | --- |
| Timing | **Transfers** | The single largest lever. Per-interaction duration and easing tokens, not one global 300ms |
| Slow in, slow out | **Transfers** | It *is* easing. Weight the curve to a fast ease-out on entrances |
| Staging | **Transfers** as attention direction | One clear change at a time; the changed element is the only thing moving, the rest holds still |
| Squash and stretch | **Adapt** | Pressure-scale on press (`scale(0.97)` with a spring). Never deform a container into a broken layout |
| Arcs | **Adapt** | Curved paths for objects travelling between screens; grid reflow and list sorting stay axis-locked and straight |
| Appeal | **Adapt** | Brand personality. The weakest justification: it still has to pass the frequency gate |
| Anticipation | **Moments only** | A wind-up inserts delay before the payoff. Acceptable before one large spatial move, never in a repeated flow |
| Follow through / overlapping | **Moments only** | A one-time entrance stagger with a settle. On repeated lists it is noise |
| Secondary action | **Moments only** | One constrained child reaction. A competing second motion breaks "one clear change" |
| Exaggeration | **Reject** | The medium is literal. Amplitude for legibility is exactly the noise the frequency gate exists to remove |
| Pose to pose / straight ahead | **Reject** | A production method, not an observable property of motion |
| Solid drawing | **Reject** | Draftsmanship. Its nearest proxy, consistent component anatomy, is static |

## The criterion the catalog was missing

Existing review asks whether timing, easing, consistency, and restraint are right. Classical animation adds a different question:

**Does the motion communicate weight, drag, and mass?**

A spring's `mass` parameter is physics; it does not by itself make something read as heavy. What reads as heavy is:

- slower departure and a settle that overshoots slightly before stopping;
- a trailing element that lags the thing pulling it;
- friction at a boundary instead of a hard stop;
- a small object that moves faster than a large one for the same distance.

If two elements of obviously different size move with identical timing and no overshoot, the motion says they weigh the same. That is a finding, not a preference.

## Applying it

Before building, answer three questions:

1. **What is the one thing changing?** If two unrelated elements move at once, staging has failed. Hold one still.
2. **How heavy is the thing that moved?** Large or consequential changes get slower departure and a settle. Small, frequent ones get speed.
3. **Would this look right if a person did it?** Any motion that no physical object could produce (instant acceleration from rest, reversing direction with no deceleration, arriving at full speed with no settle) reads as machine-made even when nobody can say why.

## Boundary with the frequency gate

The frequency gate in the skill wins every conflict. Anticipation, follow-through, and secondary action all cost delay or attention, and a repeated action cannot pay that cost. Apply them to onboarding, empty-to-populated transitions, celebratory confirmations, and one-off reveals; do not apply them to navigation, toggles, hovers, or anything a keyboard triggers.
