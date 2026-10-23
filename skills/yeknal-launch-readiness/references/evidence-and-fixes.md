# Evidence and fixes

Where the evidence lives in a repository, grouped by how certain the finding is.

This file has two purposes. It tells an agent what to look at, and it records the measurable subset so a future scanner has a specification instead of a guess.

## Assessment vocabulary

- **Measured:** the source proves the claim. A font stylesheet requested from a third-party host is measured.
- **Heuristic:** the pattern is present but the consequence is not certain. An analytics snippet may sit behind a consent gate that the source does not show.
- **Unassessed:** the check needs a running product, a document, or a filing. Never guess these.

## Register A signals

### Third-party requests

| Pattern | Meaning | Fix |
| --- | --- | --- |
| `fonts.googleapis.com`, `fonts.gstatic.com`, `use.typekit.net` | Visitor IP sent to a third party for typography | Self-host, or use a system font stack |
| `googletagmanager.com`, `gtag(`, `dataLayer.push` | Analytics or tag management | Load after consent |
| `connect.facebook.net`, `fbq(`, `snap.licdn.com`, `ttq.load` | Advertising pixels | Load after consent, and confirm the purpose is stated |
| `static.hotjar.com`, `fullstory.com`, `logrocket`, `clarity.ms`, `smartlook`, `mouseflow`, `contentsquare` | Session replay | Mask inputs and exclude sensitive routes, or remove |
| `widget.intercom.io`, `client.crisp.chat`, `js.driftt.com`, `cdn.livechatinc.com`, `tawk.to` | Chat widget | Load after consent, and check what it stores |
| `maps.googleapis.com`, `youtube.com/embed`, `player.vimeo.com`, `recaptcha` | Embedded third party with its own transfer | Consent, or a privacy-preserving replacement |

A third-party request is both a transfer question and a consent question, which is why one finding usually opens two rows.

### Environment and client exposure

| Pattern | Meaning | Fix |
| --- | --- | --- |
| `NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`, `EXPO_PUBLIC_`, `PUBLIC_` | Inlined into the client bundle and public | Confirm no secret carries the prefix |
| `.env` present in `git ls-files` | Credentials in history | Rotate, then purge and document |
| `service_role`, `SUPABASE_SERVICE`, `sb_secret` in a client file | Full database access in the browser | Move server-side, rotate immediately |
| Provider key assembled in client code for a model call | Key exposure and unbounded spend | Proxy through the server |

### Access rules

| Pattern | Meaning | Fix |
| --- | --- | --- |
| `allow read, write: if true`, `match /{document=**}` | Open rules | Deny by default, scope to the owner |
| A migration creating a table with no policy | A table added after the rules were written | Enable row-level security and write policies |
| A public storage bucket beside a private table | The same data, reachable another way | Private bucket and its own policy |
| A database function marked elevated with no ownership check | Policy bypass | Scope the function, or remove it |

### Notices, forms, and routes

| Pattern | Meaning | Fix |
| --- | --- | --- |
| No privacy route while a form or analytics exists | Missing notice | Publish one that matches the data map |
| No terms route while money moves | Missing contract | Terms with pricing, renewal, and cancellation |
| Upload or comment surface with no takedown route | No copyright process | Publish a route and wire an inbox |
| Signup with no age field in a child-directed product | No age assurance | Neutral age screen, enforced server-side |
| Subscribe button with no renewal wording near it | Missing pre-charge disclosure | Price, interval, and cancellation beside the CTA |
| Marketing template with no postal address or unsubscribe token | Non-compliant commercial email | Add both, and test the link |
| `List-Unsubscribe` absent on bulk mail | Weaker deliverability and a missing convenience | Add the header |
| Raw card fields (`name="card"`, `name="cvc"`) | Card data reaches the server | Hosted fields or a redirect checkout |
| `console.log` around auth, payment, or user objects | Personal data in logs | Remove the field, or log an identifier |

## Register B signals

| Pattern | Meaning | Fix |
| --- | --- | --- |
| Public client key with no rules file found | Rules may be permissive or absent | Open the provider console and confirm |
| No scheduled backup or export configuration | No restore path | Enable backups, then restore once |
| `@font-face` pointing at a third party, large unsized images | Performance risk | Self-host, size, and defer |
| No `Content-Security-Policy` meta or header where tags are injected | Tags can be added unnoticed | Add a policy that names allowed origins |
| No unsubscribe handler route in a product that sends mail | Opt-out cannot work | Add the route and the suppression |

## What source cannot establish

Never mark these green from code alone. Each one needs a run, a document, or a filing.

- Whether an analytics tag actually waits for consent in the browser.
- Whether a privacy notice is truthful against the real flow.
- Whether an age gate is enforced on the server rather than hidden in the UI.
- Whether a backup has ever been restored, and whether the restore matched.
- Field performance at p75 on a real device.
- Inbox placement, as opposed to header authentication.
- Whether a provider-side spending cap is set.
- Whether a DMCA designation, an NDPC registration, a DPCO-mediated audit return, or a NITDA report was actually filed.
- Whether a processor agreement was signed.
- Whether a payment mandate was captured with consent.

## False-positive guards

Before reporting, confirm the pattern is live code and not:

- a test fixture, a snapshot, or a comparison page;
- a documentation example;
- a dependency in the lockfile that the app never loads;
- a script behind a consent gate that the source shows but does not execute;
- a template that is shipped to a different provider than the one in use.

## If a scanner is built later

The measured subset is: third-party request origins, public environment prefixes, exposed service keys, open access rules, missing privacy and terms routes, missing takedown routes beside uploads, missing unsubscribe tokens and postal addresses in templates, raw card fields, and client-side model calls.

The rule would follow the slop scan precedent: no score, exit zero by default, a `--fail-on` gate, and `measured` / `heuristic` / `unassessed` on every finding. Do not build it until the register above is stable, because a scanner codifies whatever the register says.
