---
name: add-changelog
description: Add or update a Keep a Changelog-compatible release entry from verified changes, versions, and repository history. Use when preparing release notes or recording shipped changes.
---

# Add Changelog

**Key Responsibilities:**
* Existing changelog: @CHANGELOG.md (if exists)
* Recent commits: !`git log --oneline -10`
* Current version: !`git describe --tags --abbrev=0 2>/dev/null || echo "No tags found"`
* Package version: @package.json (if exists)
**Changelog Format (Keep a Changelog)**
* New features
* Changes in existing functionality
* Soon-to-be removed features
* Removed features
* Bug fixes
