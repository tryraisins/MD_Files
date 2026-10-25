---
name: yeknal-doc
description: Read, create, or edit `.docx` documents where formatting and layout fidelity matter; prefer `python-docx` plus the bundled `scripts/render_docx.py` for visual checks.
metadata:
  internal: true
---


# DOCX Skill

## When to use
- Read or review DOCX content where layout matters (tables, diagrams, pagination).
- Create or edit DOCX files with professional formatting.
- Validate visual layout before delivery.

Not for PDF review or generation (`yeknal-pdf`) or for Markdown documentation and merges (`yeknal-markdown-management`).

## Workflow
1. Prefer visual review (layout, tables, diagrams). Convert DOCX -> PDF -> PNGs, then look at the pages:
   ```
   soffice -env:UserInstallation=file:///tmp/lo_profile --headless --convert-to pdf --outdir <outdir> <input.docx>
   pdftoppm -png <outdir>/<basename>.pdf <outdir>/<basename>
   ```
   Or use the bundled helper (requires `pdf2image` and Poppler): `python scripts/render_docx.py /path/to/file.docx --output_dir <outdir>`. If these tools are missing, install them or ask the user to review rendered pages locally.
2. Use `python-docx` for edits and structured creation (headings, styles, tables, lists).
3. Re-render and inspect the pages after each meaningful change.
4. If visual review is not possible, extract text with `python-docx` as a fallback and call out the layout risk.
5. Keep intermediate outputs tidy and clean them up after final approval.

## Temp and output conventions
- Keep filenames stable and descriptive.

## Dependencies (install if missing)
Prefer `uv` for dependency management.

Requires `python-docx` and `pdf2image` (Python), plus LibreOffice (`soffice`) and Poppler (`pdftoppm`) for rendering. Install with the project's package manager, or on a bare machine: `uv pip install python-docx pdf2image`, `brew install libreoffice poppler` on macOS, `sudo apt-get install -y libreoffice poppler-utils` on Ubuntu/Debian.

If installation isn't possible in this environment, tell the user which dependency is missing and how to install it locally.

## Quality expectations
- Deliver a client-ready document: consistent typography, spacing, margins, and a clear hierarchy.
- Avoid formatting defects: clipped or overlapping text, broken tables, unreadable characters, or default-template styling.
- Charts, tables, and visuals must be legible in the rendered pages with correct alignment.
- Use ASCII hyphens only. Avoid U+2011 (non-breaking hyphen) and other Unicode dashes.
- Citations and references must be human-readable; never leave tool tokens or placeholder strings.
- Re-render and inspect every page at 100% zoom before final delivery; fix spacing, alignment, and pagination issues and repeat until clean.
- Confirm there are no leftovers (temp files, duplicate renders) unless the user asks to keep them.
