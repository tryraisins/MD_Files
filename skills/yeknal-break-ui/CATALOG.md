# Worst-Case Catalog

Realistic values that break UI, grouped by the kind of value a component renders. Use the rows that apply to the fields in your Phase 1 map. Each value is something a real user could produce; the note says what it tends to break.

Use `example.com`, `example.org`, or `.test` domains so a fixture never points at a real inbox or site. Source: adapted from [emilkowalski/skills](https://github.com/emilkowalski/skills) `break-ui/CATALOG.md` (MIT).

## People and names

| Value | Breaks |
| --- | --- |
| `Aleksandra Wiśniewska-Kowalczyk` | Long, hyphenated, diacritics; wraps to two lines, hyphen is a break point |
| `Christopher Alexander Montgomery III` | Long suffix; naive first + last initials give `CI` |
| `Jo` | Two letters; mostly empty column, naive initials give `J` |
| `J` | One letter; single-character initials, tiny click target |
| `Ólafur Darri Ólafsson` | Leading accented capital; uppercase/sort logic, initials `ÓÓ` |
| `Đặng Thị Ngọc Hân` | Stacked Vietnamese diacritics; clipped by tight `line-height` + `overflow: hidden` |
| `王秀英` | CJK, no spaces; "first + last word" initials finds one word |
| `نور الهدى عبد الرحمن` | RTL; punctuation and icons land on the wrong side without `dir="auto"` |
| `Seán O'Brien-Ó Súilleabháin` | Apostrophe and accents; escaping, initials, search |
| `María José de la Cruz y Fernández` | Lowercase particles; initials `Md`/`MF`, last-name sorting |
| `dana` | All lowercase; initials should still be uppercase |
| `🦊 Fox` | Emoji first; `.charAt(0)` returns half a surrogate pair |
| `👩🏽‍💻 Priya` | ZWJ emoji sequence; `.length` is 7+, slicing breaks it |
| `  Sam   Lee ` | Leading/trailing/repeated spaces; initials from empty words |
| *(missing)* | No name, only an email; the UI must fall back |

## Emails, URLs, identifiers

Unbreakable strings with no spaces, so the browser has nowhere to wrap them.

| Value | Breaks |
| --- | --- |
| `bartholomew.fitzgerald@northwind-industries-holdings.example.com` | The classic; pushes siblings off the row without `overflow-wrap: anywhere` |
| `a@b.co` | Shortest realistic; layouts that assumed a long email look empty |
| `first.last+billing-notifications@example.com` | Plus-addressing; validation rejecting `+`, display truncating the meaning |
| `ops@sub.department.region.example.co.uk` | Many subdomains, two-part TLD; naive "domain" extraction |
| `https://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments` | Long URL; overflow, end-truncation hides the differing part |
| `9f8e7d6c-5b4a-4c3d-8e2f-1a0b9c8d7e6f` | UUID; monospace width, middle-truncation candidate |
| `Q3 Board Deck — FINAL (revised) v12 [approved by legal].pdf` | File name; end-truncation hides version and extension |
| `IMG_20250914_183022_HDR_portrait_edited_edited.HEIC` | Camera file name; unbreakable, uppercase extension |
| `@a` / `@thisisaverylongusernamethatisallowed` | Handle extremes |

## Labels, titles, and copy from data

| Value | Breaks |
| --- | --- |
| `Senior Product Design Engineer, Platform Infrastructure` | Long job title; three lines in a secondary slot |
| `Invitation expired 12 days ago` | Long status badge; wraps or squeezes the name column |
| `Benachrichtigungseinstellungen` | German compound (30 chars, no spaces); label overflow |
| `Paramètres de confidentialité et de sécurité` | French runs ~30% longer than English |
| Twelve tags on one item | Tag rows that wrap into a wall; needs a `+8` overflow |
| A tag named `customer-feedback-from-enterprise-onboarding` | One tag wider than its container |
| `Untitled` / empty string / `   ` | Collapsed heading, zero-height row |
| `<script>alert(1)</script>` / `&amp;` / `**bold**` | Escaping; must render as literal text |
| `Line one` + newline + `Line two` | Newline in a single-line field; doubles row height or is dropped |
| A 2,000-character pasted description | Clamps, "show more", textarea growth |

## Numbers and money

| Value | Breaks |
| --- | --- |
| `0` | Zero states: "0 members", empty bar, divide-by-zero percentages |
| `1` | Plurals: "1 members", "1 days ago" |
| `1284` | Needs a thousands separator |
| `1000000` | Count-badge width; consider compact `1M` |
| `12345678.9` as currency | Overflows totals columns |
| `-42.5` | Negative sign, red-color logic, accounting parentheses |
| `0.1 + 0.2` | `0.30000000000000004` rendered raw |
| `142%` / `-3%` | Progress bars past their bounds |
| `null` / `undefined` / `NaN` | Rendered literally |
| `1.284` in `de-DE` vs `1,284` in `en-US` | Locale formatting; hardcoded separators are wrong for half the world |
| A live value (`99` → `100`) | Width jump and jitter without `tabular-nums` |

## Collections

| Value | Breaks |
| --- | --- |
| 0 items | The empty state, and whether one exists |
| 1 item | Grids that look broken with one card; "1 of 1" |
| Exactly page size, and page size + 1 | Off-by-one in "Showing 40 of 40"; an empty page 2 |
| 1,000+ unpaginated items | Scroll performance, render time, memory |
| One item 10× the others | Masonry and grid rows stretching to the tallest item |
| Items with identical names | Lists where the name is the only distinguishing field |

## Time

| Value | Breaks |
| --- | --- |
| Now | "0 seconds ago" instead of "just now" |
| 12 days / 11 months / 3 years ago | Relative-time thresholds; switch to an absolute date after about a week |
| A future date | "in 3 days" vs "-3 days ago" |
| `1970-01-01` | A zero timestamp shown as a real date |
| `2025-12-31T23:30:00-08:00` | A different day in UTC than the user's timezone |
| `1,284 hours` | Duration formatting that never rolls up to days |

Use `Intl.RelativeTimeFormat` and `Intl.DateTimeFormat`, not hand-built strings.

## Images and media

| Value | Breaks |
| --- | --- |
| Avatar URL that 404s | Broken-image icon instead of the initials fallback |
| No avatar at all | The fallback itself: initials, color, size parity |
| 4000×200 panorama, or 200×4000 tall | Distortion without `object-fit: cover`; blown-out card height |
| Transparent PNG logo, dark logo on dark mode | Invisible on the background |
| Slow-loading image | Layout shift without fixed dimensions or `aspect-ratio` |

## States

| Value | Breaks |
| --- | --- |
| Loading | Skeletons that don't match final layout, spinners that shift content |
| API error | No error state, or a raw `TypeError: ...` surfaced |
| Partial data | Some optional fields filled, others not, in one list; misaligned rows |
| Every status at once | All enum values in a list; badge widths vary |
| No permission | Disabled actions; does the row still lay out the same? |
| The current user in the list | "You" labels, self-applied actions |

## Environment

Not data, but checked the same way: flip to the worst case, then change these.

| Condition | Breaks |
| --- | --- |
| Container at 320px | Every overflow above, at once |
| Narrow sidebar (280px) | Components designed full-width, reused in a column |
| 2560px wide | Lines too long to read, content stranded on one side |
| 200% zoom / large text | Fixed heights that clip growing text |
| Dark mode | Hardcoded colors, invisible borders and logos |
| `dir="rtl"` | Icons, chevrons, padding, trailing-action order |
| Touch device | Hover-only actions (the ••• that appears on hover) are unreachable |
