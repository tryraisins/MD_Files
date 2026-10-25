# Measured behaviour

Numbers from the repository this skill was built against: a production app with 339 source files and about 110k lines (React/TypeScript frontend, Flask backend, two Cloudflare workers, 49 test files).

Method: six questions, each run as one `query --task ... --budget 800 --tests` call. The comparison set is every file a case-sensitive `grep` pattern returns for the same concept. Recall counts how many of those files appeared in the graph answer. Token counts are output characters divided by four.

| Question | grep files | Graph tokens | Files shown | Recall |
| --- | --- | --- | --- | --- |
| rate limiting setup | 8 | 816 | 7 | 2/8 |
| CV upload text extraction | 7 | 759 | 6 | 2/7 |
| tests covering signup | 4 | 764 | 7 | 3/4 |
| request body validation | 1 | 824 | 6 | 1/1 |
| session cookie auth | 1 | 797 | 7 | 1/1 |
| job posting gate | 1 | 769 | 6 | 0/1 |

## What the numbers mean

- **A concept query costs about 800 tokens and usually names the main implementation file.** The CV case is the best result: one call returned `_extract_uploaded_text` and its three call sites with line numbers.
- **Recall is around half.** The missing files were mostly peripheral mentions (`notification_service.py`, `postgres_service.py`), not the implementation. That is acceptable for orienting and unacceptable for exhaustive work.
- **The tempting comparison is dishonest.** Reading the matched files in full would cost about 450k tokens across these six questions, but no competent agent reads whole files to answer "where is rate limiting". A realistic baseline is `grep -n` output plus two or three targeted reads, roughly 1k to 2k tokens. At that baseline the index is near parity on tokens.
- **So the win is turns, not bytes.** A question with unknown vocabulary ("how is an uploaded CV parsed") costs one call instead of three or four guessed greps. When the identifier is already known, grep wins or ties.

## What failed on the way here

The first version indexed only names and structure, with no file content. On the same six questions it reached 2 of 8, 3 of 7, and 0 of 4, and it ranked a 7,200-line monolith first because generic words like "api" matched hundreds of routes. Two fixes mattered: a term index over file content, and inverse document frequency so a word appearing in 200 files stops counting as evidence.

The remaining weakness has the same root cause. Term matching has no semantics, so a question phrased in different vocabulary from the code still misses.

## Reading the result honestly

Do not present this as a way to escape a usage limit. It will not. Session length and number of turns dominate cost far more than retrieval. What it does is shorten the orientation phase in a large repository, and answer call-site and importer questions that would otherwise take several searches.
