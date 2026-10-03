---
name: yeknal-slides
description: Create and edit presentation slide decks (`.pptx`) with PptxGenJS, bundled layout helpers, and render/validation utilities. Use when tasks involve building a new PowerPoint deck, recreating slides from screenshots/PDFs/reference decks, modifying slide content while preserving editable output, adding charts/diagrams/visuals, or diagnosing layout issues such as overflow, overlaps, and font substitution.
metadata:
  internal: true
---

# Slides

## Overview

Author slides with PptxGenJS. Reach for `python-pptx` only for inspection, never for generating a deck: keep the editable source in JavaScript and hand back both the `.pptx` and its `.js` source.

Do all work in a task-local directory. Copy only the final artifacts to the requested destination once rendering and validation are clean.

## Bundled Resources

- `assets/pptxgenjs_helpers/`: copy this folder into the deck workspace and import it locally rather than reimplementing the helpers.
- `scripts/render_slides.py`: rasterize a `.pptx` or `.pdf` into one PNG per slide.
- `scripts/slides_test.py`: flag content that spills past the slide canvas.
- `scripts/create_montage.py`: assemble rendered slides into a contact-sheet montage.
- `scripts/detect_font.py`: report fonts that LibreOffice resolves as missing or substituted.
- `scripts/ensure_raster_image.py`: turn SVG/EMF/HEIC/PDF-like assets into PNGs for quick review.
- `references/pptxgenjs-helpers.md`: load this only when you need API details or dependency notes.

## Workflow

1. Read the request and decide whether you are creating a deck, recreating one, or editing one.
2. Fix the slide size first. Use 16:9 (`LAYOUT_WIDE`) unless the source clearly uses a different aspect ratio.
3. Copy `assets/pptxgenjs_helpers/` into the working directory and import the helpers from there.
4. Build the deck in JavaScript with an explicit theme font, steady spacing, and PowerPoint-native elements that stay editable where practical.
5. Run the bundled scripts from this skill directory, or copy the ones you need into the task workspace. Render with `render_slides.py`, inspect the PNGs, and resolve layout problems before delivery.
6. Run `slides_test.py` to check for overflow when slide edges are tight or the deck is dense.
7. Deliver the `.pptx`, the authoring `.js`, and any generated assets needed to rebuild the deck.

## Authoring Rules

- Set theme fonts explicitly; do not fall back on PowerPoint defaults when typography matters.
- Size text boxes with `autoFontSize`, `calcTextBox`, and related helpers; avoid PptxGenJS `fit` and `autoFit`.
- Use bullet options rather than literal `•` characters.
- Use `imageSizingCrop` or `imageSizingContain` in place of PptxGenJS image sizing.
- Use `latexToSvgDataUri()` for equations and `codeToRuns()` for syntax-highlighted code.
- Prefer native PowerPoint charts for simple bar, line, pie, or histogram visuals so reviewers can still edit them.
- For charts or diagrams PptxGenJS cannot express well, render SVG externally and place it on the slide.
- Whenever you generate or substantially edit slides, include both `warnIfSlideHasOverlaps(slide, pptx)` and `warnIfSlideElementsOutOfBounds(slide, pptx)` in the submitted JavaScript.
- Clear every unintentional overlap and out-of-bounds warning before delivery. When an overlap is intentional, leave a brief code comment beside the element.

## Recreate Or Edit Existing Slides

- Render the source deck or reference PDF first so you can compare geometry visually.
- Match the original aspect ratio before rebuilding the layout.
- Preserve editability where you can: text stays text, and simple charts stay native charts.
- When a reference slide uses raster artwork, run `ensure_raster_image.py` to produce debug PNGs from vector or unusual image formats before placing them.

## Validation Commands

The examples assume you copied the needed scripts into the working directory. If you did not, invoke the same script paths relative to this skill folder.

```bash
# Render slides to PNGs for review
python3 scripts/render_slides.py deck.pptx --output_dir rendered

# Build a montage for quick scanning
python3 scripts/create_montage.py --input_dir rendered --output_file montage.png

# Check for overflow beyond the original slide canvas
python3 scripts/slides_test.py deck.pptx

# Detect missing or substituted fonts
python3 scripts/detect_font.py deck.pptx --json
```

Load `references/pptxgenjs-helpers.md` when you need the helper API summary or dependency details.
