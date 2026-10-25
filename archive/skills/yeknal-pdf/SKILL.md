---
name: yeknal-pdf
description: Read, create, or review PDF files where layout and rendering matter. Use Python tools (reportlab, pdfplumber, pypdf) for generation and extraction, and rendered page images for visual checks.
metadata:
  internal: true
---

# PDF Skill

## When to use
- Read or review PDF content where layout and visuals matter.
- Create PDFs programmatically with reliable formatting.
- Validate the final rendering before delivery.

Use `yeknal-doc` for DOCX documents. This skill owns PDF.

## Workflow
1. Prefer visual review: render PDF pages to PNGs and inspect them.
   - Use `pdftoppm` if it is available.
   - If it is not, install Poppler or ask the user to review the output locally.
2. Use `reportlab` to generate PDFs when you create new documents.
3. Use `pdfplumber` (or `pypdf`) for text extraction and quick checks; do not rely on it for layout fidelity.
4. After each meaningful update, re-render the pages and verify alignment, spacing, and legibility. If a defect survives two fix attempts, report it instead of iterating further.

## Dependencies (install if missing)
Prefer `uv` for dependency management.

Python packages:
```
uv pip install reportlab pdfplumber pypdf
```
If `uv` is unavailable:
```
python -m pip install reportlab pdfplumber pypdf
```
System tools (for rendering):
- macOS: `brew install poppler`
- Ubuntu/Debian: `sudo apt-get install -y poppler-utils`
- Windows: install Poppler for Windows and add its `bin` directory to `PATH`.

If installation is not possible in this environment, tell the user which dependency is missing and how to install it locally.

## Quality expectations
- Maintain polished visual design: consistent typography, spacing, margins, and section hierarchy.
- Avoid rendering issues: clipped text, overlapping elements, broken tables, black squares, or unreadable glyphs.
- Charts, tables, and images must be sharp, aligned, and clearly labeled.
- Use ASCII hyphens only. Avoid U+2011 (non-breaking hyphen) and other Unicode dashes.
- Citations and references must be human-readable; never leave tool tokens or placeholder strings.

## Final checks
- Inspect the latest PNG rendering before delivery and state what you checked.
- Confirm headers/footers, page numbering, and section transitions look polished.
- Keep intermediate files organized, or remove them after final approval.
