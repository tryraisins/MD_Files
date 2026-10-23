# Launch gates

Register B. Seven gates that no other skill in this catalog owns.

These are verifiable, so a claim is not evidence. Each gate states what to check, how to prove it, and the condition that fails. Record what you observed, with a date.

| Gate | Passes when | Fails when |
| --- | --- | --- |
| Database access rules | A cross-tenant read attempt is refused | Any public client can read another user's row |
| Backup and restore | A restore was performed and compared | No restore, or a failed one, or an old one |
| Performance budget | p75 meets the budget on a mid-tier phone | Desktop-only, or a single lab run |
| Email deliverability | Authentication passes and streams are split | Fonts of mail authenticate but land in spam |
| Cost containment | Cap plus a per-user quota both exist | Only a global cap |
| Rollback plan | Deploy, migration, and data paths all named | A destructive migration with no way back |
| Analytics | Events load after consent, without personal data | Tags fire first, or events carry email |

## 1. Database access rules

The classic failure in an app built quickly is a public client key beside permissive rules. The key is designed to be public; the rules are the only thing standing between users.

**Check:**

- Row-level security enabled on every table in an exposed schema, not just the obvious ones. A table added last week is the usual gap.
- Policies are per operation (`select`, `insert`, `update`, `delete`) and scoped to the authenticated user, not to a role that every user holds.
- The service or admin key appears only in server environment, never in a client bundle, never in a public variable prefix.
- Storage buckets are private unless intentionally public, with their own policies. A private table beside a public bucket leaks the same data.
- Any database function marked as executing with elevated privileges is reviewed, because it bypasses the policies it runs under.

**Prove it:** create two accounts. With a real client, authenticated as account A, query the table holding account B's row by its identifier. Then repeat unauthenticated. Record the response bodies. A refusal is the pass.

**Fail:** any read that returns another user's data, or a policy that allows `true` for an authenticated role.

## 2. Backup and restore

A backup nobody has restored is a hope, and provider dashboards are optimistic.

**Check:**

- Automated backups on, with a stated retention window.
- Point-in-time recovery where the provider offers it.
- Encryption at rest, and who can read the backup.
- The backup covers the data that matters, not only the primary database. Object storage and auth users are commonly missed.

**Prove it:** restore into a scratch project or branch. Compare row counts for the tables that matter, and a checksum or spot sample for one column. Record the date, the duration, and who did it.

**Fail:** no restore attempted, a restore that errors, or a restore that predates the latest schema migration.

## 3. Performance budget

"Under three seconds" is not a budget. It does not say what was measured, on what device, or at which percentile.

**Check, at p75 on a production build with a cold cache:**

| Metric | Budget |
| --- | --- |
| Largest Contentful Paint | 2.5s or less |
| Interaction to Next Paint | 200ms or less |
| Cumulative Layout Shift | 0.1 or less |

Measured on a mid-tier Android device over throttled 4G, not a desktop and not localhost.

**Also check:** the first screen does not wait on a third-party script, images are sized and lazy where appropriate, and the bundle does not ship a library for one function.

**Prove it:** field data if available, otherwise a throttled lab run on the target device profile, with the device and network profile written down.

**Fail:** desktop-only measurement, localhost, or a single lab run presented as a percentile.

## 4. Email deliverability

Looking right in the composer proves nothing about the inbox.

**Check:**

- **SPF:** one record, ten DNS lookups or fewer, and it includes the service that actually sends.
- **DKIM:** a selector published and signing enabled for each sending stream.
- **DMARC:** a policy record, starting at monitoring with a reporting address, moving to quarantine once reports are clean.
- **Streams:** transactional mail on one subdomain, marketing on another, with separate suppression.
- **Unsubscribe:** works end to end, and is honoured.
- **Lists:** no purchased or scraped addresses.

**Prove it:** send a real message to a Gmail address, an Outlook address, and one more provider. Read the `Authentication-Results` headers and confirm all three checks pass. Confirm placement, not just delivery. Click the unsubscribe link and confirm the next send does not arrive.

**Fail:** authentication failing or absent, marketing and transactional sharing one stream, or an unsubscribe that does not suppress.

## 5. Cost containment

One user can empty an account when nothing limits them.

**Check:**

- A provider-side spending cap is set, not just an alert.
- A per-user quota exists, so the cap protects the business rather than one attacker spending it all.
- Per-request limits on tokens, input length, upload size, and output length.
- Storage and egress thresholds have alerts.
- Billing alerts at a level the business can absorb.

**Prove it:** trigger the limit deliberately in a test project, and confirm both the per-user rejection and the provider cap behaviour are what you expect.

**Fail:** a global cap alone, no per-user limit, or limits that exist only in the UI.

## 6. Rollback plan

Deploys roll back easily. Data does not, which is why launches fail here.

**Check:**

- A named rollback command or console action, and the previous known-good version identified.
- Every migration classified: additive, reversible, or destructive.
- For a destructive migration: a backup taken immediately before, and either a down migration or a written forward fix.
- A data restore path and the window it can reach back to.
- Feature flags, so a risky surface can be switched off without a deploy.
- A named owner, a channel, and the conditions that trigger a rollback, written down before launch day.

**Fail:** a destructive migration with no way back, or a rollback plan that exists only in someone's head.

## 7. Analytics instrumentation

You cannot fix a funnel you cannot see, and you cannot ship analytics that break the other six gates.

**Check:**

- Events exist for the whole funnel: visit, signup started, signup completed, activation, payment started, payment completed, cancellation.
- Every non-essential tag loads after consent, which is also the requirement in Register A.
- Event properties carry no personal data: no email, phone, name, address, or free-text input.
- Client-side and server-side events are known and do not double count.
- The dashboard or query that answers "where do people drop off" already exists.

**Prove it:** walk the funnel in a clean session with the network panel open, in both consent states, and confirm what fires and what does not.

**Fail:** any tag before consent, or any event carrying personal data.
