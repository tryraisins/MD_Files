---
name: yeknal-add-changelog
description: Add or update a Keep a Changelog entry from verified changes and history when preparing release notes or recording shipped work.
---

# Add changelog

Turn verified, shipped changes into a Keep a Changelog entry. Work from real history, not from memory.

## Gather evidence

- Read the existing changelog (`CHANGELOG.md`) if one is present.
- Review recent commits: `git log --oneline -10`.
- Find the last released version: `git describe --tags --abbrev=0 2>/dev/null || echo "No tags found"`.
- Read the package version (`package.json` or the project's manifest).

## Write the entry

Use Keep a Changelog sections, and include only the sections that actually changed:

- Added - new features.
- Changed - changes to existing functionality.
- Deprecated - soon-to-be-removed features.
- Removed - removed features.
- Fixed - bug fixes.

Group related changes, keep each line user-facing and specific, and never list a change that the history or diff does not support.
