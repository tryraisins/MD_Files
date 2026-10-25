---
name: yeknal-figma-implement-design
description: "Turn Figma nodes into production code with the project's own components and tokens: design context, screenshot, assets, and project-convention translation. Use when given a Figma URL or node ID to implement."
---


# Figma MCP: Design Context to Production Code

Apply `yeknal-ui-quality-baseline` to every visible UI output this produces.

## Overview

This skill lays out a structured path for turning Figma designs into production-ready code, keeping the Figma MCP server integration consistent, using design tokens correctly, and matching the design within the project's system.

## Prerequisites

- A connected, reachable Figma MCP server. **Precheck it before starting:** call `get_design_context` on the target node (or `get_node` for the file) and confirm it answers. If the tool is missing or fails, stop and tell the user to connect their harness's Figma MCP server and restart, then resume at Step 1. Do not try to configure their harness for them.
- A Figma URL from the user in this shape: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
  - `:fileKey` is the file key
  - `1-2` is the node ID (the component or frame to implement)
- **OR**, with `figma-desktop` MCP, a node selected directly in the Figma desktop app (no URL needed).
- Ideally, an established design system or component library in the project.

Read [references/figma-mcp-config.md](references/figma-mcp-config.md) for setup verification and troubleshooting, and [references/figma-tools-and-prompts.md](references/figma-tools-and-prompts.md) for the tool catalog and prompt patterns.

## Required Workflow

**Follow these steps in order. Do not skip steps.**

### Step 1: Get Node ID

#### Option A: Parse from Figma URL

When the user hands you a Figma URL, extract the file key and node ID to pass into the MCP tools.

**URL format:** `https://figma.com/design/:fileKey/:fileName?node-id=1-2`

**Extract:**

- **File key:** `:fileKey` (the segment after `/design/`)
- **Node ID:** `1-2` (the value of the `node-id` query parameter)

**Note:** With the local desktop MCP (`figma-desktop`), `fileKey` is not passed to tool calls. The server uses whichever file is open, so you only need `nodeId`.

**Example:**

- URL: `https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15`
- File key: `kL9xQn2VwM8pYrTb4ZcHjF`
- Node ID: `42-15`

#### Option B: Use Current Selection from Figma Desktop App (figma-desktop MCP only)

When you're on the `figma-desktop` MCP and the user gave no URL, the tools use the node currently selected in the open Figma desktop file.

**Note:** Selection-based prompting works only with the `figma-desktop` MCP server. The remote server needs a link to a frame or layer before it can extract context. The Figma desktop app must be open with a node selected.

### Step 2: Fetch Design Context

Run `get_design_context` with the extracted file key and node ID.

```
get_design_context(fileKey=":fileKey", nodeId="1-2")
```

This returns structured data including:

- Layout properties (Auto Layout, constraints, sizing)
- Typography specifications
- Color values and design tokens
- Component structure and variants
- Spacing and padding values

**If the response is too large or truncated:**

1. Run `get_metadata(fileKey=":fileKey", nodeId="1-2")` to get the high-level node map
2. Identify the specific child nodes needed from the metadata
3. Fetch individual child nodes with `get_design_context(fileKey=":fileKey", nodeId=":childNodeId")`

### Step 3: Capture Visual Reference

Run `get_screenshot` with the same file key and node ID for a visual reference.

```
get_screenshot(fileKey=":fileKey", nodeId="1-2")
```

This screenshot becomes the source of truth for visual validation. Keep it accessible throughout implementation.

### Step 4: Download Required Assets

Download any assets (images, icons, SVGs) the Figma MCP server returns.

**IMPORTANT:** Follow these asset rules:

- If the Figma MCP server returns a `localhost` source for an image or SVG, use it as-is
- DO NOT import or add new icon packages - all assets should come from the Figma payload
- DO NOT use or create placeholders if a `localhost` source is provided
- Assets are served through the Figma MCP server's built-in assets endpoint

### Step 5: Translate to Project Conventions

Translate the Figma output into this project's framework, styles, and conventions.

**Key principles:**

- Treat the Figma MCP output (typically React + Tailwind) as a description of design and behavior, not as final code style
- Replace Tailwind utility classes with the project's preferred utilities or design system tokens
- Reuse existing components (buttons, inputs, typography, icon wrappers) instead of duplicating functionality
- Use the project's color system, typography scale, and spacing tokens consistently
- Respect existing routing, state management, and data-fetch patterns

### Step 6: Match the design

Aim for visual parity on layout, spacing, type, and color. Where the project's tokens or components differ from Figma, use the project's version and record the deviation; do not hand-tune pixels to imitate the file.

**Guidelines:**

- Avoid hardcoded values: map Figma tokens to the project's tokens.
- When tokens and Figma specs disagree, prefer the design system and keep the geometry within a defensible step of the design.
- Follow WCAG requirements. If the design is inaccessible, fix it and document why.
- Document any component you add.

### Step 7: Validate Against Figma

Before calling the work complete, validate the final UI against the Figma screenshot.

**Validation checklist:**

- [ ] Layout matches (spacing, alignment, sizing)
- [ ] Typography matches (font, size, weight, line height)
- [ ] Colors match the mapped project tokens
- [ ] Interactive states work as designed (hover, active, disabled)
- [ ] Responsive behavior follows Figma constraints
- [ ] Assets render correctly
- [ ] Accessibility standards met

## Implementation Rules

### Component Organization

- Place UI components in the project's designated design system directory
- Follow the project's component naming conventions
- Avoid inline styles unless truly necessary for dynamic values

### Design System Integration

- ALWAYS use components from the project's design system when possible
- Map Figma design tokens to project design tokens
- When a matching component exists, extend it rather than creating a new one
- Look for an existing component before creating one: consistency across the codebase matters more than exact Figma replication

### Always Start with Context

Never implement from assumptions. Fetch `get_design_context` and `get_screenshot` first.

### Incremental Validation

Validate often during implementation, not only at the end. It catches issues early.

### Document Deviations

If you must depart from the Figma design (say, for accessibility or technical limits), record why in code comments.

## Examples

### Example 1: Implementing a Button Component

User says: "Implement this Figma button component: https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15"

**Actions:**

1. Parse URL to extract fileKey=`kL9xQn2VwM8pYrTb4ZcHjF` and nodeId=`42-15`
2. Run `get_design_context(fileKey="kL9xQn2VwM8pYrTb4ZcHjF", nodeId="42-15")`
3. Run `get_screenshot(fileKey="kL9xQn2VwM8pYrTb4ZcHjF", nodeId="42-15")` for visual reference
4. Download any button icons from the assets endpoint
5. Check whether the project already has a button component
6. If yes, extend it with the new variant; if no, create a component using project conventions
7. Map Figma colors to project design tokens (e.g., `primary-500`, `primary-hover`)
8. Validate against the screenshot for padding, border radius, typography

**Result:** Button component matching the Figma design, integrated with the project design system.

### Example 2: Building a Dashboard Layout

User says: "Build this dashboard: https://figma.com/design/pR8mNv5KqXzGwY2JtCfL4D/Dashboard?node-id=10-5"

**Actions:**

1. Parse URL to extract fileKey=`pR8mNv5KqXzGwY2JtCfL4D` and nodeId=`10-5`
2. Run `get_metadata(fileKey="pR8mNv5KqXzGwY2JtCfL4D", nodeId="10-5")` to understand the page structure
3. Identify main sections from metadata (header, sidebar, content area, cards) and their child node IDs
4. Run `get_design_context(fileKey="pR8mNv5KqXzGwY2JtCfL4D", nodeId=":childNodeId")` for each major section
5. Run `get_screenshot(fileKey="pR8mNv5KqXzGwY2JtCfL4D", nodeId="10-5")` for the full page
6. Download all assets (logos, icons, charts)
7. Build the layout with the project's layout primitives
8. Implement each section using existing components where possible
9. Validate responsive behavior against Figma constraints

**Result:** Complete dashboard matching the Figma design with a responsive layout.

## Additional Resources

- [Figma MCP Server Documentation](https://developers.figma.com/docs/figma-mcp-server/)
- [Figma MCP Server Tools and Prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Figma Variables and Design Tokens](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
