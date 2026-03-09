---
name: update-docs
description: Claude Code agent: update-docs
---

# Update Docs

**Key Responsibilities:**
* Documentation structure: !`find . -name "*.md" | head -10`
* Specs directory: @specs/ (if exists)
* Implementation status: !`grep -r "✅\|❌\|⚠️" docs/ specs/ 2>/dev/null | wc -l` status indicators
* Recent changes: !`git log --oneline --since="1 week ago" -- "*.md" | head -5`
* Project progress: @CLAUDE.md or @README.md (if exists)
* Review current documentation status:
* Check `specs/implementation_status.md` for overall project status
* Review implemented phase document (`specs/phase{N}_implementation_plan.md`)
* Review `specs/flutter_structurizr_implementation_spec.md` and `specs/flutter_structurizr_implementation_spec_updated.md`
* Review `specs/testing_plan.md` to ensure it is current given recent test passes, failures, and changes
