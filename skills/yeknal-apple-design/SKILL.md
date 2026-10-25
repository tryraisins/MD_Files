---
name: yeknal-apple-design
description: "Apple-style fluid UI for the web: press response, 1:1 tracking, interruptible springs, velocity handoff, momentum projection, rubber-banding, translucent materials, and optical type. Use for gesture-driven or spring-based interfaces."
---

# Apple Design

Apply `yeknal-ui-quality-baseline` to every visible interface this skill touches.

Apple's approach to interfaces that stop feeling like a computer, from the WWDC design talks (*Designing Fluid Interfaces* chief among them), translated to the web platform: CSS, Pointer Events, `requestAnimationFrame`, and springs in Motion / Framer Motion.

The through-line: **an interface feels alive when motion starts from the current on-screen value, inherits the user's velocity, projects momentum forward, and can be grabbed and reversed at any instant.** Springs are the tool that makes this natural, because they are inherently interruptible and velocity-aware.

## The Core Idea

> "When we align the interface to the way we think and move, something magical happens — it stops feeling like a computer and starts feeling like a seamless extension of us."

An interface is fluid when it behaves like the physical world: things respond instantly, move continuously, carry momentum, resist at boundaries, and can be redirected mid-motion. Everything in the references is a way to get closer to that.

Apple frames design as serving four human needs: **safety/predictability, understanding, achievement, and joy.** Every rule here serves one of them.

## Load the part you need

| The question | File |
| --- | --- |
| How should this respond, track, interrupt, spring, project, and settle? | [references/motion.md](references/motion.md) — response, 1:1 tracking, interruptibility, springs, velocity handoff, momentum projection, symmetric paths, rubber-banding, gesture detail, frame smoothness, materials, multimodal feedback, reduced motion, typography, plus a value table |
| Should this exist, and how should the product behave? | [references/design-foundations.md](references/design-foundations.md) — the eight principles and the process |

Load the file that answers the question. The motion reference carries the concrete values; do not invent spring or projection numbers without it.
