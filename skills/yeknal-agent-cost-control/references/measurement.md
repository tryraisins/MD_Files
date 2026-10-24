# Measuring agent cost

Cost tooling is harness-specific; the shape of the data is not. You need, per assistant call: input tokens, cached-read tokens, cache-write tokens, output tokens, and cost. Aggregate by session, then by agent or model.

## What to record

Per call:

| Field | Note |
| --- | --- |
| input tokens | Tokens billed at the full input price |
| cache read tokens | Tokens served from a cached prefix |
| cache write tokens | Where the provider prices cache writes explicitly |
| output tokens | Including reasoning tokens where billed as output |
| cost | The provider's own figure when it is exposed |
| timestamp | Needed for first-call and compaction analysis |
| session id, agent, model, working directory | Needed for attribution |

Per session, derive: call count, total cost, uncached share of input, first-call cache hit rate, and share of the window's total spend.

## OpenCode

OpenCode stores this in a local SQLite database. Path: `~/.local/share/opencode/opencode.db` (`%USERPROFILE%\.local\share\opencode\opencode.db` on Windows), or `$XDG_DATA_HOME/opencode/opencode.db`.

Assistant messages live in `message.data` as JSON with `tokens.input`, `tokens.cache.read`, `tokens.cache.write`, `tokens.output`, `tokens.reasoning`, and `cost`. Session rows carry `agent`, `model`, `directory`, `title`, and `time_created`.

Read it read-only. Node 22 and newer ships `node:sqlite`; `sqlite3` is often not installed on Windows.

```js
import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync(dbPath, { readOnly: true });
```

Per-session aggregate:

```sql
select s.id, s.agent, s.directory,
       count(*) calls,
       sum(coalesce(json_extract(m.data,'$.tokens.input'),0)) uncached,
       sum(coalesce(json_extract(m.data,'$.tokens.cache.read'),0)) cache_read,
       sum(coalesce(json_extract(m.data,'$.tokens.output'),0)) output,
       sum(coalesce(json_extract(m.data,'$.cost'),0)) cost
from message m
join session s on s.id = m.session_id
where json_extract(m.data,'$.role') = 'assistant'
  and s.time_created > :since
group by s.id
order by cost desc;
```

First call of each session, which is the hit-rate check that matters:

```sql
with ranked as (
  select s.id sid,
         coalesce(json_extract(m.data,'$.tokens.input'),0) uncached,
         coalesce(json_extract(m.data,'$.tokens.cache.read'),0) cache_read,
         row_number() over (partition by s.id
                            order by json_extract(m.data,'$.time.created')) rn
  from message m
  join session s on s.id = m.session_id
  where json_extract(m.data,'$.role') = 'assistant'
    and s.time_created > :since
)
select sid, uncached, cache_read from ranked where rn = 1;
```

A helper that runs both and prints agent totals, the top sessions, and the tail is available as `cost-report.mjs` in an OpenCode config directory; run it as `node cost-report.mjs --days 30 [--project TEXT] [--json]`.

## Other harnesses

- Providers with automatic prefix caching (many inference APIs) do not expose cache writes; treat any billed token that is not a cache read as uncached.
- Coding agents that keep their own transcript directory can usually be read as JSONL: sum per-message usage fields and group by session file.
- If the harness exposes only a dashboard total, use it as the baseline, then measure the change with a fixed, repeated task instead of an A/B.

## Caveats that change the answer

- **Window size.** A week with one large migration is not the steady state. Use at least a month, and say which window you used.
- **Small samples.** Three sessions cannot distinguish a real improvement from noise. Report the count.
- **Cache-write pricing.** Some providers charge a premium to write the cache and a discount to read it. A high hit rate with heavy writes can still cost more than no cache at all.
- **Compaction.** When a harness compacts context, the following call re-sends a rewritten prefix at full price. A session that compacts repeatedly looks like a cache failure; it is usually a session-shape failure.
- **Subagent attribution.** Subagent spend may appear under the parent session or under its own agent name. Check before concluding that a lane is cheap.

## Reporting template

```
window: 30 days, all projects
sessions 36   calls 2736   spend $10.66
top session: 644 calls, 57% of spend, 1% first-call cache hit
tail: 6 sessions at or above 150 calls
recommendation: split long runs at a boundary; cache is already at 95% read share
outcome check required before any model change: findings that led to a change
```

The numbers above are illustrative of the shape, not a benchmark.
