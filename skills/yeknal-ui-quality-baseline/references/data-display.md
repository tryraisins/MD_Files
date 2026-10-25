# Data display

Load this when building a chart, a stat block, a dashboard, or a data table. Charts are the surface where agents most often produce something attractive and wrong, and wrong is worse than ugly.

## Choose the chart from the question, not from the data

The data does not decide the chart. The question does.

| Question | Chart | Do not use |
| --- | --- | --- |
| How does this compare across categories? | Horizontal bar, sorted by value | Pie for more than three slices |
| How did it change over time? | Line, or area for a single series | Bars for dense long series |
| What is the distribution? | Histogram or box plot | Averages alone |
| Do these two measures relate? | Scatter | Dual-axis line |
| What is the composition? | Stacked bar, or a single stacked column | Nested pies |
| How did each part contribute to a change? | Waterfall | A stacked bar with mixed signs |
| Where does this sit against a target? | Bar with a target rule, or a deviation chart | A gauge |

Rules that come out of this:

- **No dual axes.** Two y-scales can be made to show any relationship you want. If two measures must be compared, index them to a common base or use two aligned charts.
- **Never 3D, never exploded slices, never a shadow under a bar.** They add ink and remove accuracy.
- **Bars start at zero.** Truncating a bar axis distorts the ratio, which is the entire point of a bar. A line chart may use a non-zero baseline when the variation is the story, but say so on the axis.
- **Pie charts are only for two or three parts of a whole** where the difference is obvious. Beyond that, use a sorted bar.
- **Aggregate before you plot.** A chart of 500 individual points is a texture, not a chart.

## Axes, labels, and annotation

- Label the axis with its unit and scale ("Revenue, $k"). An unlabeled axis is not interpretable.
- Prefer direct labels over legends. If a series can carry its name at its end, do that instead of a key.
- Titles state the finding, not the subject: "Checkout failures rose after the 14:00 deploy", not "Failures". Subtitles can carry the subject and the timeframe.
- Put the timeframe on the chart itself, not only in the page header. A screenshot of the chart must still be honest.
- Annotate the one event that explains the shape (a deploy, a price change, a holiday). That annotation is usually the whole value of the chart.
- Gridlines are structural, not decorative: light, horizontal usually, removed when the labels carry the position.

## Color in charts

- Use a sequential ramp for magnitude, a categorical set for distinct series, and a diverging ramp for values around a meaningful midpoint.
- Cap categorical colors at about seven. Beyond that, either group the tail into "Other" or use position instead of color.
- One accent that highlights the series you are talking about, with the rest in muted neutral, often reads better than seven saturated colors.
- Never rely on color alone to distinguish series: vary the dash pattern, the marker, or the position.
- Check the palette in both themes and in greyscale. A chart that collapses in greyscale is not accessible.

## Numbers and stat blocks

- Right-align numeric columns and use tabular figures so digits line up.
- Show the same number of decimals within a column. Mixing `4.2` with `4.25` in one column looks accidental.
- A big number needs three companions: what it measures, the timeframe, and the comparison (previous period, target, or both).
- Never display a computed value without its denominator when the denominator can change. "42 failures" means nothing without "of 1.2M requests".
- Do not invent, round up, or imply a metric you do not have. If the data is a sample or an estimate, say so next to the number.

## Tables

- Alignment follows type: text left, numbers right, dates consistent, booleans as a word or an icon with a label.
- Row height serves scanning. Dense operational tables can go to 32px; tables with two-line cells need more, and mixed heights in one column look broken.
- Sticky headers on long tables, with the header visually distinct from rows.
- Sort state is visible and announced. Default sort must be the one a user would choose.
- Column width comes from content class, not from even distribution. A name column and a status column do not deserve equal width.
- Truncation in a cell must have a path to the full value.
- Virtualize past roughly a hundred rows, and never virtualize a table that must print or be found by browser search without an alternative.

## States

Every data surface needs all five, and they are different surfaces, not a single spinner:

1. **Loading**: a skeleton shaped like the final chart or table, not a spinner in a box.
2. **Empty**: no data exists yet. Explain why and what would create data.
3. **Partial**: some series or regions failed. Render what succeeded, label what did not.
4. **Stale**: the data is old. Show the age and a refresh path.
5. **Error**: the query failed. Say so, offer retry, and do not render a zero line that reads as real data.

The zeros default is the most dangerous failure in the list. A chart that fails to load and renders an empty axis with a flat line at zero is lying.

## Accessibility and honesty

- Provide a text or table equivalent for every chart. A visually hidden data table satisfies this and costs little.
- Write a one-sentence summary of the finding in text. Screen reader users and anyone scanning benefit equally.
- Interactive points need keyboard access and a focusable element per point, or a table alternative.
- Do not encode meaning in hover only. On touch there is no hover.
- Axis labels and annotations must meet contrast requirements; they are content, not decoration.

## Typical generated failures

- A dashboard of six cards with invented metrics and up arrows.
- Every chart in a different palette, none of them matching the product tokens.
- Donut charts for eight categories.
- A line chart with two y-axes whose curves conveniently cross.
- Tables with centered numbers and inconsistent decimals.
- Sparklines with no label, no timeframe, and no scale.
- Empty states that say "No data" with no explanation or action.
