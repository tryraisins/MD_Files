---
name: "yeknal-jupyter-notebook"
description: "Use when the user asks to create, scaffold, or edit Jupyter notebooks (`.ipynb`) for experiments, explorations, or tutorials; prefer the bundled templates and run the helper script `new_notebook.py` to generate a clean starting notebook."
metadata:
  internal: true
---


# Jupyter Notebook Skill

Build clean, reproducible Jupyter notebooks for two modes: experiments and exploratory analysis, or tutorials and teaching walkthroughs. Reach for the bundled templates and the helper script whenever structure and valid JSON matter, so hand-editing raw notebook files stays the exception.

## When to use
- Start a new `.ipynb` notebook from scratch.
- Turn rough notes or scripts into a structured notebook.
- Refactor an existing notebook so it is reproducible and skimmable.
- Build an experiment or tutorial that other people will read or re-run.

## Decision tree
- Choose `experiment` when the request is exploratory, analytical, or hypothesis-driven.
- Choose `tutorial` when the request is instructional, step-by-step, or aimed at a specific audience.
- Treat edits to an existing notebook as a refactor: keep the intent and improve the structure.

## Skill path (set once)

```bash
export CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
export JUPYTER_NOTEBOOK_CLI="$CODEX_HOME/skills/jupyter-notebook/scripts/new_notebook.py"
```

User-scoped skills install under `$CODEX_HOME/skills` (default: `~/.codex/skills`).

## Workflow
1. Lock the intent.
Identify the notebook kind: `experiment` or `tutorial`.
Write down the objective, the audience, and what "done" means.

2. Scaffold from the template.
Run the helper script instead of authoring raw notebook JSON by hand.

```bash
uv run --python 3.12 python "$JUPYTER_NOTEBOOK_CLI" \
  --kind experiment \
  --title "Compare prompt variants" \
  --out output/jupyter-notebook/compare-prompt-variants.ipynb
```

```bash
uv run --python 3.12 python "$JUPYTER_NOTEBOOK_CLI" \
  --kind tutorial \
  --title "Intro to embeddings" \
  --out output/jupyter-notebook/intro-to-embeddings.ipynb
```

3. Fill the notebook with small, runnable steps.
Give each code cell one job.
Precede it with a short markdown cell that states the purpose and the expected result.
Keep outputs quiet: prefer a brief summary over a large dump.

4. Apply the right pattern.
For experiments, follow `references/experiment-patterns.md`.
For tutorials, follow `references/tutorial-patterns.md`.

5. Edit safely when working with existing notebooks.
Keep the notebook structure intact; reorder cells only when it sharpens the top-to-bottom story.
Make targeted edits rather than full rewrites.
If you must touch raw JSON, read `references/notebook-structure.md` first.

6. Validate the result.
Run the notebook top-to-bottom when the environment allows.
If you cannot execute it, say so plainly and explain how to validate locally.
Work through the final pass checklist in `references/quality-checklist.md`.

## Templates and helper script
- Templates live in `assets/experiment-template.ipynb` and `assets/tutorial-template.ipynb`.
- The helper script loads a template, updates the title cell, and writes a notebook.

Script path:
- `$JUPYTER_NOTEBOOK_CLI` (installed default: `$CODEX_HOME/skills/jupyter-notebook/scripts/new_notebook.py`)

## Temp and output conventions
- Use `tmp/jupyter-notebook/` for intermediate files; delete when done.
- Write final artifacts under `output/jupyter-notebook/` when working in this repo.
- Use stable, descriptive filenames (for example, `ablation-temperature.ipynb`).

## Dependencies (install only when needed)
Prefer `uv` for dependency management.

Optional Python packages for local notebook execution:

```bash
uv pip install jupyterlab ipykernel
```

The bundled scaffold script uses only the Python standard library and does not require extra dependencies.

## Environment
No required environment variables.

## Reference map
- `references/experiment-patterns.md`: experiment structure and heuristics.
- `references/tutorial-patterns.md`: tutorial structure and teaching flow.
- `references/notebook-structure.md`: notebook JSON shape and safe editing rules.
- `references/quality-checklist.md`: final validation checklist.
