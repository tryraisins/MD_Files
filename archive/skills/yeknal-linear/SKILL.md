---
name: yeknal-linear
description: Manage issues, projects, and team workflows in Linear. Use when the user wants to read, create, or update tickets, cycles, projects, or documents in a Linear workspace.
metadata:
  internal: true
  short-description: Manage Linear issues
---

# Linear

## Overview

This skill gives you a repeatable way to run issue, project, and team workflows in Linear. It pairs with the Linear MCP server, which exposes natural-language project management for issues, projects, documentation, and team collaboration.

## Prerequisites
- The Linear MCP server is connected and reachable over OAuth.
- You have confirmed access to the right Linear workspace, teams, and projects.

If a call fails because Linear MCP is not connected, stop and tell the user: adding the server and completing its OAuth login is their step, using the MCP setup their harness documents. Do not invent a command.

## Required Workflow

**Work through these steps in order. Do not skip any.**

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
