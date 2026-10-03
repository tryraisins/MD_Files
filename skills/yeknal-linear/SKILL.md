---
name: yeknal-linear
description: Manage issues, projects & team workflows in Linear. Use when the user wants to read, create or updates tickets in Linear.
metadata:
  internal: true
  short-description: Manage Linear issues in Codex
---

# Linear

## Overview

This skill gives you a repeatable way to run issue, project, and team workflows in Linear. It pairs with the Linear MCP server, which exposes natural-language project management for issues, projects, documentation, and team collaboration.

## Prerequisites
- The Linear MCP server is connected and reachable over OAuth.
- You have confirmed access to the right Linear workspace, teams, and projects.

## Required Workflow

**Work through these steps in order. Do not skip any.**

### Step 0: Set up Linear MCP (if not already configured)

If a call fails because Linear MCP is not connected, stop and set it up:

1. Add the Linear MCP:
   - `codex mcp add linear --url https://mcp.linear.app/mcp`
2. Enable remote MCP client:
   - Set `[features] rmcp_client = true` in `config.toml` **or** run `codex --enable rmcp_client`
3. Log in with OAuth:
   - `codex mcp login linear`

Once login succeeds the user must restart codex. Wrap up your answer and tell them that, so their next attempt can continue from Step 1.

**Windows/WSL note:** If connection errors appear on Windows, try running the Linear MCP through WSL:
```json
{"mcpServers": {"linear": {"command": "wsl", "args": ["npx", "-y", "mcp-remote", "https://mcp.linear.app/sse", "--transport", "sse-only"]}}}
```

### Step 1
Pin down the user's goal and scope (issue triage, sprint planning, documentation audit, workload balance). Confirm team/project, priority, labels, cycle, and due dates where they matter.

### Step 2
Pick the workflow that fits (see Practical Workflows below) and list the Linear MCP tools it needs. Confirm required identifiers (issue ID, project ID, team key) before calling tools.

### Step 3
Run Linear MCP tool calls in logical batches:
- Read first (`list`/`get`/`search`) to build context.
- Create or update next (issues, projects, labels, comments) with every required field.
- For bulk work, explain the grouping logic before applying changes.

### Step 4
Summarize results, surface remaining gaps or blockers, and propose next actions (more issues, label changes, assignments, follow-up comments).

## Available Tools

Issue Management: `list_issues`, `get_issue`, `create_issue`, `update_issue`, `list_my_issues`, `list_issue_statuses`, `list_issue_labels`, `create_issue_label`

Project & Team: `list_projects`, `get_project`, `create_project`, `update_project`, `list_teams`, `get_team`, `list_users`

Documentation & Collaboration: `list_documents`, `get_document`, `search_documentation`, `list_comments`, `create_comment`, `list_cycles`

## Practical Workflows

- Sprint Planning: Review open issues for a target team, pick the top items by priority, and create a new cycle (for example, "Q1 Performance Sprint") with assignments.
- Bug Triage: List critical/high-priority bugs, rank them by user impact, and move the top items to "In Progress."
- Documentation Audit: Search documentation (for example, API auth), then file labeled "documentation" issues for gaps or outdated sections with detailed fixes.
- Team Workload Balance: Group active issues by assignee, flag anyone carrying a high load, and suggest or apply redistributions.
- Release Planning: Create a project (for example, "v2.0 Release") with milestones (feature freeze, beta, docs, launch) and generate issues with estimates.
- Cross-Project Dependencies: Find all "blocked" issues, identify the blockers, and create linked issues where missing.
- Automated Status Updates: Find your issues with stale updates and add status comments based on current state/blockers.
- Smart Labeling: Analyze unlabeled issues, suggest or apply labels, and create missing label categories.
- Sprint Retrospectives: Generate a report for the last completed cycle, note completed versus pushed work, and open discussion issues for patterns.

## Tips for Maximum Productivity

- Batch related changes together; consider smart templates for recurring issue structures.
- Use natural queries when you can ("Show me what John is working on this week").
- Lean on context: reference prior issues in new requests.
- Break large updates into smaller batches to stay under rate limits; cache or reuse filters when listing often.

## Troubleshooting

- Authentication: Clear browser cookies, re-run OAuth, verify workspace permissions, and confirm API access is enabled.
- Tool Calling Errors: Confirm the model supports multiple tool calls, provide all required fields, and split complex requests.
- Missing Data: Refresh the token, verify workspace access, check for archived projects, and confirm the correct team is selected.
- Performance: Respect Linear API rate limits; batch bulk operations, use specific filters, or cache frequent queries.
