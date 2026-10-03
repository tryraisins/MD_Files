# IndexNow Change Notification

Use IndexNow to notify participating search engines about URLs that were added, materially updated, redirected, or deleted. Keep XML sitemaps as the complete long-term inventory; IndexNow is the fast change channel.

## Choose the path

1. Check whether the CMS, host, CDN, or existing SEO plugin already supports IndexNow. Prefer the maintained native integration when it exposes logs and change filtering.
2. For a one-off sitemap submission or key-verification diagnosis, the [LaunchIgniter IndexNow Submitter](https://launchigniter.com/tools/indexnow-submitter) is an optional browser tool. Its extension can track changed URLs locally; the web tool does not retain history. Do not make a third-party browser tool a required production dependency.
3. For repeatable publishing workflows, call the [official IndexNow endpoint](https://www.indexnow.org/documentation) from a trusted backend, CMS hook, or deployment job after the publish result is known.

## Ownership key

- Generate 8-128 characters using letters, numbers, or hyphens.
- Prefer the root key file: `https://example.com/<key>.txt` containing only the key as UTF-8 text.
- If the key file is below the root, include `keyLocation`; it can authorize only URLs under that path.
- Verify the exact HTTPS response, final URL, body, host, and absence of an unintended redirect before submitting.
- The public key is an ownership proof, not an application secret. Still avoid placing it in logs or unrelated metadata, and rotate it when ownership or deployment control changes.

## Submit changed URLs

Single URL:

```text
GET https://api.indexnow.org/indexnow?url=<encoded-url>&key=<key>
```

Batch of up to 10,000 URLs:

```json
{
  "host": "www.example.com",
  "key": "<key>",
  "keyLocation": "https://www.example.com/<key>.txt",
  "urlList": [
    "https://www.example.com/changed-page"
  ]
}
```

POST the JSON to `https://api.indexnow.org/indexnow` with `Content-Type: application/json; charset=utf-8`.

## Change ledger

Submit only canonical URLs owned by the verified host. Track at least:

| Field | Purpose |
| --- | --- |
| URL | Exact canonical URL submitted |
| Change kind | added, updated, redirected, deleted |
| Content revision/hash | Prevent cosmetic or duplicate resubmission |
| Published at | Proves the change was live before notification |
| Submitted at | Supports debounce and retry decisions |
| Endpoint/status | Transport evidence |
| Retry-after/next attempt | Bounded rate-limit handling |

Debounce repeat submissions for the same URL and submit meaningful changes, not every build or CSS update. Submit 404/410 and redirected URLs when those states are intentional and live.

## Response handling

| Status | Meaning | Action |
| --- | --- | --- |
| `200` | URL set received | Record receipt; do not claim crawl or indexing |
| `202` | Received; key validation pending | Verify the key file and recheck later |
| `400` | Invalid request format | Validate encoding, JSON, key, and URL syntax |
| `403` | Key validation failed | Check exact key file contents, host, path, status, and redirects |
| `422` | Host, URL, key, or schema mismatch | Confirm every URL belongs to the submitted host and key scope |
| `429` | Rate limited | Honor `Retry-After` when present and retry with bounded backoff |

Keep the final state explicit: `SUBMITTED`, `ACCEPTED_KEY_PENDING`, `FAILED`, or `UNRESOLVED`. A successful transport response only confirms receipt. Search engines still decide whether and when to crawl or index.

## Verification boundary

After submission, separately verify:

1. the intended production content or deletion is live;
2. the canonical, robots, sitemap, and status-code behavior are correct;
3. IndexNow received the notification;
4. crawl or index status only through an appropriate search-engine surface when available.

Do not present a sitemap fetch, browser-tool success message, or IndexNow receipt as proof of search visibility.
