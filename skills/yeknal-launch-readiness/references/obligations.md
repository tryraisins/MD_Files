# Obligations

Register A, grouped by surface rather than by statute. Every row is something to check in a repository, not a legal summary.

Instruments and penalties live in [jurisdictions.md](jurisdictions.md). Read that file to decide what binds. Read this file to decide what to inspect.

Each surface follows the same shape: the trigger, what to check, where the evidence lives, and the smallest fix. The default assessment for legal rows is `unassessed` until behaviour is observed.

## 1. Personal data inventory

**Trigger:** any signup, form, cookie, log, or third-party script.

Build the map from the code first. Every purpose, every field, where it is stored, who else receives it, and how long it lives.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| A lawful basis is named for each purpose | The privacy notice, compared with the actual data flow | Name the basis per purpose, or delete the purpose |
| Consent is affirmative and unselected | The form markup and the consent record | Remove pre-ticked boxes, record the timestamp and version |
| Withdrawal is as easy as consent | The settings or account screen | One control that stops the processing and records it |
| Access, correction, deletion, and export work | A request path, and a code path that executes it | Wire the endpoint, then test it with a real account |
| Retention is decided | Scheduled jobs, TTLs, or a documented decision | A retention period per table, and a deletion job |
| Logs do not contain personal data | Log calls around auth, payments, and errors | Drop the field, or hash it |

**The test that matters:** create an account, request deletion, and confirm the rows are gone. A policy sentence is not a route.

## 2. Third-party embeds and transfers

**Trigger:** any request leaving the origin. Fonts, analytics, pixels, chat, replay, maps, captcha, video, CDN scripts, model providers.

This is the single most common launch defect, and it produces both transfer exposure and consent exposure at once.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| Fonts are served from the origin | `fonts.googleapis.com`, `fonts.gstatic.com` in markup or CSS | Self-host, or use a system stack |
| Analytics and pixels wait for consent | Script tags in the document head, tag manager containers | Move behind the consent gate |
| Session replay masks inputs | Replay configuration | Mask all form fields, exclude sensitive routes, or remove it |
| Chat widgets are reviewed | Widget bootstrap scripts | Load after consent, and check what it records |
| Transfers have a mechanism | Hosting region, provider DPAs, transfer instrument | Document the instrument, or move the data |
| Every vendor has a contract | A processor list | Sign the DPA, or remove the vendor |

A transfer question attaches to any provider outside the user's jurisdiction, and that includes the model provider behind an AI feature.

## 3. Minors

**Trigger:** a general-audience consumer product, or anything a child could plausibly use. Games, education, social, and creator tools are all in scope.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| An age gate exists where the product is child-directed | Signup flow | Neutral age screen, no leading prompt |
| Under-age accounts are actually blocked | The server route, not the UI | Server-side check, not a hidden button |
| Guardian consent for collected child data | Consent capture and record | Verifiable consent route, or stop collecting |
| Children's data is not used for ads or profiling | Ad and analytics configuration | Exclude the segment, or age-gate the feature |
| The notice explains children's handling | The privacy notice | Add the section, and match it to behaviour |

**Warning:** a date-of-birth field that is stored but never enforced is worse than no field, because it documents knowledge.

## 4. Marketing email

**Trigger:** any promotional message, newsletter, waitlist follow-up, or lifecycle sequence.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| Consent is separate from terms acceptance | The signup form | A distinct, unselected marketing checkbox |
| Every message carries a postal address | The email template | Add the sender's physical address |
| Unsubscribe works and is honoured within the deadline | The link target and the suppression list | One-click unsubscribe, wired to suppression |
| Transactional and marketing streams are separate | Sending domains and templates | Split subdomains, split suppression |
| Sender identity is clear | The From header and body | Real name, real reply address |
| No purchased or scraped list | The import path | Delete the list |

## 5. Subscriptions and payments

**Trigger:** any recurring charge, trial that converts, or stored payment method.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| Renewal terms appear before the button | The pricing or checkout component | Price, interval, and cancellation terms next to the CTA |
| Consent is affirmative for the recurring charge | Checkout flow and the stored mandate | Explicit consent, recorded with a timestamp |
| Cancellation is as easy as signup | The account screen | Self-serve cancel, no contact form, no retention maze |
| Reminders go out before renewal where required | Scheduled jobs | Pre-renewal notice email |
| Each debit is notified | The payment webhook and email | Receipt per charge, with amount and reference |
| Unauthorised debits have a refund path | Support route and provider dashboard | Documented refund process |
| Card data never touches the server | Checkout implementation | Hosted fields or a redirect flow |

## 6. User-generated content

**Trigger:** uploads, comments, profiles, feeds, marketplaces, or public messages. This is where Nigerian and US duties diverge most.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| A copyright takedown route exists | A published contact and a working inbox | A policy page plus a real routing address |
| A DMCA agent is registered where US users are served | copyright.gov record | Register, USD 6, renew every three years |
| The takedown process handles counter-notices | Internal runbook | Written steps, with a restore path |
| Repeat infringers are suspended | Moderation tooling | A strike counter and an enforced threshold |
| An intermediary contact is designated where required | Site footer, filings | Named contact, and a Nigerian address where the platform is large |
| Moderation rules are published | Community guidelines | Plain rules that match enforcement |
| Illegal content can be removed fast | Admin tooling | One action that removes and records |

## 7. Accessibility

**Trigger:** any consumer-facing interface, and certainly any e-commerce flow.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| Keyboard reaches everything, with visible focus | Tab through the flow | Fix order, restore the outline |
| Form fields have real labels | Markup | Label elements, not placeholders |
| Images carry meaningful alternative text | Markup | Alt text, or empty alt for decorative |
| Contrast meets the baseline | Computed styles | Adjust the token, not the instance |
| Error messages are announced | Live regions | Announce, and tie the message to the field |
| Checkout is completable without a pointer | Manual run | Fix the blockers first |

Depth belongs to `yeknal-ui-quality-baseline`. Here the question is whether the baseline was run at all.

## 8. AI features

**Trigger:** any model call, generation, summarisation, agent, or recommendation.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| The provider's data use is understood | Provider terms, and the account tier | Choose a tier that does not train on inputs |
| Prompts avoid unnecessary personal data | The call sites | Strip fields before the call |
| Users are told when output is generated | Product copy | A short, honest disclosure |
| Output is not presented as verified fact | Surfaces that show generated claims | Label, or constrain the claim |
| A human can intervene where consequences are real | The flow | Approval step, or an escalation path |
| Provider spending is bounded | Provider settings | See [launch-gates.md](launch-gates.md) |

## 9. Breach response

**Trigger:** all products. This is a written page, not code.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| Someone owns incident response | A named person and a contact route | Name them in the runbook |
| Notification window and recipients are known | The runbook | Write the 72-hour path and the regulator contact |
| Users can be told what happened | An email list and a status page | Prepare the template before it is needed |
| Access can be revoked quickly | Provider consoles, key inventory | Rotation steps and who can run them |

## 10. Vendors and processors

**Trigger:** every third-party service that touches user data.

| Check | Evidence | Smallest fix |
| --- | --- | --- |
| A processor list exists | Documentation | One table: vendor, purpose, data, region |
| Each vendor has terms covering the data | Signed DPAs or accepted terms | Accept, sign, or replace |
| Region and transfer basis are recorded | The same table | Fill the column honestly |
| Off-boarding is possible | Export and delete paths | Test one export |

## Cross-cutting rule

The notice, the settings screen, and the code must agree. Where they disagree, the code is the truth and the notice is the defect. Fix the sentence or fix the behaviour, and never fix only the sentence.
