# Scene composition

Load this when placing, cropping, or building the frame of a product scene. The main skill decides what the scene claims; this file decides where things sit.

## Ratio and export

| Placement | Ratio | Design width | Export |
|---|---|---|---|
| Landing hero | 16:9 or 21:9 | 1600 or 1920 | 2x of displayed size, PNG or WebP |
| Social card, changelog | 1:1, 4:5, 4:3 | 1080 or 1200 | The platform's native pixel size |
| Link preview | 1.91:1 | 1200 by 630 | Exactly 1200 by 630, never 2x |
| Vertical story or reel | 9:16 | 1080 by 1920 | 1080 by 1920, or that size as video |
| README banner | 2:1 or 3:1 | 1280 | 2x of displayed size, under 400KB |
| Loop clip | 16:9 or 1:1 | its output size | MP4 H.264 at native resolution, plus a separate poster file |

Design at the size and ratio the artifact will be displayed at. Scale up only for images whose placement is a page you control; a platform with a fixed pixel spec takes its own size, and doubling a 1200 by 630 preview makes it unusable. Never design wide and scale down: type set for 1440 does not survive a 1:1 crop, and border radii visibly thin.

Every scene ships a still even when it also ships a loop. The still is the poster frame, the social fallback, and the reduced-motion case.

## Cropping is choosing

A crop states what matters to the claim. Crop to exclude, not to fit.

- Crop on a real boundary in the product: the window edge, a panel seam, the end of a row group. Crops through the middle of text or a button look like mistakes.
- Keep one anchor demonstrating that this is software: a title bar, a sidebar item in its active state, a row of tabs, a caret. Without an anchor, a cropped surface reads as a generic card.
- If the product is dense, show two or three rows at readable size and let the crop imply the rest. Do not shrink to fit.
- Leave asymmetric margins. Equal margins on all sides around a small window is the stock mockup tell; a window bleeding off one edge reads as a real screenshot.
- Never mirror UI left to right for a left-to-right product. Sidebar position, scrollbar position, and control order are product facts. The exception is a real right-to-left build: mirror there because the product itself mirrors, and mirror the whole surface, not one panel.

## The window frame

When a frame is drawn, derive it rather than inventing it.

- Match the target platform: macOS keeps traffic lights left with the menu bar implied; Windows keeps controls right. Do not mix them.
- Use the real proportions: measure the title bar on an actual window of that platform, since a macOS traffic-light bar is around 28px and a window with a toolbar is taller, and match the product's window radius instead of a generic 12.
- Keep chrome quieter than content. A chromed frame at full contrast competes with the claim; reduce it to a low-contrast surface with muted labels.
- Do not draw a fake URL, fake tab titles, or a fake account avatar. If a URL is needed, use the real product domain.
- Skip the frame entirely when the claim is inside one panel. A frame around a single card is decoration.

## Bento construct

Bento works when the tiles carry different content, and fails when a grid is imposed on equal content.

- Choose the grid from the number of distinct claims, and count the cells: a 2 by 2 grid holds three claims when the main tile spans two cells, five claims when a 2 by 2 tile takes the corner and four singles fill the rest.
- Let importance set size. The tile carrying the main claim gets at least twice the area of a supporting tile.
- Keep one gutter value and one radius value across the whole grid. Two radii read as two systems.
- Give each tile one element: a cropped surface, a number with a unit, a chart, a short label. Two competing elements per tile is what makes bento look generated.
- Keep label placement identical across tiles. Mixed label positions destroy the grid rhythm that justified the layout.
- Do not fill a leftover cell with a gradient, a logo, or a sparkle. Reduce the tile count or span a neighbour into the space.
- A bento grid of four equal squares is not a bento grid. If the content is equal, use a row or a list.

## Type inside a scene

The scene inherits the product's type system, at a size that survives export.

- Size text by the smallest placement, not the canvas. Measure the rendered height of a lowercase x at the export's destination: if it falls below 14 CSS pixels on a phone, the scene holds too much. A separate mobile crop is the answer, not one image shrunk.
- Keep the product's real hierarchy: one title weight, one control weight, one body weight. Do not introduce a display face the product does not use.
- Shorten copy before shrinking type. A scene label of four words at 16px beats a full sentence at 10px.
- Real product copy beats invented copy. If copy must be written for the scene, keep it concrete and free of marketing adjectives.
- Truncate on the product's own rule, with its own ellipsis, not a hard cut.

## Color, depth, and contrast

- Take surfaces, borders, and accents from the product. A scene in the product's palette needs no additional treatment to look designed.
- One depth technique only: either a soft shadow, or a border, or a background separation. Three stacked treatments look plastic.
- If the surrounding canvas is a gradient or mesh, keep it low enough in contrast that the window stays the clear focal point. On a dark product, separation comes from a slightly lighter or darker canvas and a defined edge, not from brightness.
- Never give the background more contrast or saturation than the product surface. The product is the focal point on light and dark products alike.
- Check the scene in both themes if the product ships both. A light-only scene in a dark product is a mismatch the viewer feels immediately.
- Shipping both means two files, not a CSS filter: a `<picture>` with `media="(prefers-color-scheme: dark)"`, or GitHub's `#gh-dark-mode-only` and `#gh-light-mode-only` fragment suffixes in a README. Inverting a light scene produces grey product surfaces and the wrong brand color.

## Safe zones

- Keep the claim out of the outer 8% on every edge; social crops and message previews eat margins.
- For 9:16, keep the claim inside the middle 60% vertically. Platform UI covers the top and bottom.
- For 1:1 and 4:3, remember that some placements center-crop to a square. Compose so a square crop still holds.
- Leave room for the label, and place it where it cannot be cropped away.

## Checklist before export

- Claim readable without the caption in under two seconds.
- One focal point, and it is the product surface.
- Type still at or above 14 CSS pixels at the smallest placement.
- One gutter, one radius, one depth technique.
- Chrome quieter than content, and platform-correct.
- Sample data plainly sample data; no invented names or metrics; currency, dates, and names localised to the audience.
- Label present, inside the safe zone, readable, and at 4.5:1 against what is behind it.
- Exported at the size the placement actually requires, then inspected at that size.
- Alt text written alongside the file: the claim, then the word illustration.
