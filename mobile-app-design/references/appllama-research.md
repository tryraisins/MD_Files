# Appllama reference research

Load this reference only when the Appllama MCP is connected or the user supplies an Appllama screen reference. Appllama provides screens and flows from shipping mobile apps; it is a research source, not permission to copy a competitor’s design.

## Start safely

1. Call `get_credits` before paid calls so the available balance and reset date are known.
2. Define the actual product, screen type, flow, platform, audience, and decision before searching.
3. Study the smallest representative set that reveals the category grammar. Do not sweep the catalog or harvest the dataset.
4. Treat the watermark in the top-left as provenance, not part of the reference design.
5. Save durable app and screen identifiers with notes. Media URLs expire, so view or download permitted research assets promptly and re-fetch by identifier when needed.

## Tool routing

| Need | Tool |
| --- | --- |
| Check balance and limits | `get_credits` |
| Find relevant apps using natural-language and commercial filters | `search_apps` |
| Inspect one app’s metadata and flows | `get_app` |
| Walk an app’s screens in journey order | `list_app_screens` |
| Find one screen type or visual pattern across apps | `search_screens` |
| Open a supplied `app_id/screen_id` and related references | `get_screen` |
| Discover flow categories | `list_flows` |
| Find leading apps that contain one flow | `get_flow_apps` |
| Discover or inspect a UI-element family | `list_ui_elements`, then `get_element_screens` |
| Use the member’s curated references | `list_my_boards`, then `get_board` |

Use each `next_cursor` with the exact query that created it. Pagination is sequential. If a cursor expires or becomes invalid, restart that query from its first page. On rate limits, wait for the stated interval instead of retrying aggressively.

## Research patterns

### Build a flow

1. Search for apps in the target category and shortlist only those relevant to the brief.
2. Inspect the complete target flow for the strongest candidates rather than sampling unrelated hero screens.
3. Record what each step is: push, tab root, modal, sheet, overlay, or system controller.
4. Compare hierarchy, primary action position, information density, progress, copy, trust signals, and state handling.
5. Synthesize a product-specific pattern before implementing. Cite which reference behavior influenced each important choice.

### Improve one screen

1. Classify the current screen type and its job in the journey.
2. Search comparable screens across multiple apps.
3. Inspect the closest references in detail, including adjacent screens so navigation context is not lost.
4. Separate repeated conventions from one app’s branding.
5. Keep the current product’s identity and functional behavior while applying only patterns that improve the task.

### User-supplied screen reference

An identifier such as `1393061654/spl_9i075` can be passed directly to `get_screen(screen_ref=...)`. Inspect the named screen and its closest related screens, then state what was learned without reproducing the watermark or copying the design one for one.

## Working notes

For substantial reference work, keep task-local notes:

```text
research/<category>/
|-- apps.md
|-- patterns.md
`-- <app-name>/
    `-- screens.md
```

Record stable identifiers, flow order, observed controls, colors, navigation semantics, and the decision each reference informed. Do not commit downloaded media unless licensing and repository policy allow it.

## Failure boundaries

- No connection: continue with repository evidence and other permitted references; state that Appllama research was not performed.
- No credits: report the reset information returned by the tool and continue without paid calls.
- Expired media: re-request the specific page or screen by durable identifier.
- Rate limit: wait for the server-provided interval.
- Missing category coverage: use the nearest relevant interaction pattern and label the inference.

Research quality is proven by relevant screen and flow evidence, not by the number of API calls.
