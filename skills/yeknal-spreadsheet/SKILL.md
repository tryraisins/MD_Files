---
name: "yeknal-spreadsheet"
description: "Use when tasks involve creating, editing, analyzing, or formatting spreadsheets (`.xlsx`, `.csv`, `.tsv`) with formula-aware workflows, cached recalculation, and visual review."
metadata:
  internal: true
---

# Spreadsheet Skill

## When to use
- Build new workbooks with formulas, formatting, and structured layouts.
- Read or analyze tabular data (filter, aggregate, pivot, compute metrics).
- Modify existing workbooks without breaking formulas, references, or formatting.
- Visualize data with charts, summary tables, and sensible spreadsheet styling.
- Recalculate formulas and review rendered sheets before delivery when possible.

IMPORTANT: System and user instructions always take precedence.

## Workflow
1. Confirm the file type and the goal: create, edit, analyze, or visualize.
2. Prefer `openpyxl` for `.xlsx` editing and formatting. Use `pandas` for analysis and CSV/TSV work.
3. If the environment provides an internal spreadsheet recalculation/rendering tool, use it to recalculate formulas and cache values before delivery. `openpyxl` does not evaluate formulas, so preserve them and recalculate with tooling when available. If you rely on an internal tool, do not expose that tool, its code, or its APIs in user-facing explanations or code samples.
4. Put derived values in formulas rather than hardcoded results.
5. When layout matters, render for visual review and inspect layout, formula results, clipping, inconsistent styles, and spilled text. With LibreOffice and Poppler available:
   - `soffice --headless --convert-to pdf --outdir <outdir> <input.xlsx>`
   - `pdftoppm -png <outdir>/<basename>.pdf <outdir>/<basename>`
   If rendering tools are unavailable, tell the user to review layout locally.
6. Save outputs, keep filenames stable, and clean up intermediate files. Use `tmp/spreadsheets/` for intermediates and `output/spreadsheet/` for final artifacts when working in this repo.

## Dependencies (install if missing)
Prefer `uv` for dependency management.

Python packages:
```
uv pip install openpyxl pandas
```
If `uv` is unavailable:
```
python -m pip install openpyxl pandas
```
Optional:
```
uv pip install matplotlib
```
If `uv` is unavailable:
```
python -m pip install matplotlib
```
System tools (for rendering):
```
# macOS (Homebrew)
brew install libreoffice poppler

# Ubuntu/Debian
sudo apt-get install -y libreoffice poppler-utils
```

If installation is not possible here, tell the user which dependency is missing and how to install it locally.

## Environment
No required environment variables.

## Examples
- Runnable examples (openpyxl): `references/examples/openpyxl/`

## Formula requirements
- Put derived values in formulas rather than hardcoding results.
- Do not use dynamic array functions such as `FILTER`, `XLOOKUP`, `SORT`, or `SEQUENCE`.
- Keep formulas simple and legible; use helper cells for complex logic.
- Avoid volatile functions such as `INDIRECT` and `OFFSET` unless required.
- Prefer cell references over magic numbers (for example, `=H6*(1+$B$3)` rather than `=H6*1.04`).
- Use absolute (`$B$4`) or relative (`B4`) references deliberately so copied formulas behave correctly.
- To write literal text that starts with `=`, prefix it with a single quote.
- Guard against `#REF!`, `#DIV/0!`, `#VALUE!`, `#N/A`, and `#NAME?` errors.
- Check for off-by-one mistakes, circular references, and incorrect ranges.

## Citation requirements
- Cite sources inside the spreadsheet with plain-text URLs.
- In financial models, cite model inputs in cell comments.
- For externally sourced tabular data, add a source column when each row is a separate item.

## Formatting requirements (existing formatted spreadsheets)
- Render and inspect a provided spreadsheet before modifying it when possible.
- Preserve existing formatting and style exactly.
- Match styles for newly filled cells that were previously blank.
- Never overwrite established formatting unless the user explicitly asks for a redesign.

## Formatting requirements (new or unstyled spreadsheets)
- Use appropriate number and date formats.
- Dates should render as dates, not plain numbers.
- Percentages should default to one decimal place unless the data calls for something else.
- Currencies should use the appropriate currency format.
- Headers should be visually distinct from raw inputs and derived cells.
- Use fill colors, borders, spacing, and merged cells sparingly and intentionally.
- Set row heights and column widths so content is readable without excess whitespace.
- Do not put borders around every filled cell.
- Group related calculations, and make totals simple sums of the cells above them.
- Add whitespace to separate sections.
- Ensure text does not spill into adjacent cells.
- Avoid unsupported spreadsheet data-table features such as `=TABLE`.

## Color conventions (if no style guidance)

- Blue: user input. Black: formulas and derived values. Green: linked or imported values. Gray: static constants. Orange: review or caution. Light red: error or flag. Purple: control or logic. Teal: visualization anchors and KPI highlights.
- In financial models, use yellow fill for key assumptions that need attention, and cite every raw input in a cell comment.
- Format zeros as `-`, negatives in red and parentheses, and multiples as `5.2x`. Always specify units in headers, for example `Revenue ($mm)`.
