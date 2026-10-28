# Jurisdictions

What each regime requires at launch, who it binds, and where the number came from.

Read this file for what applies. Read [obligations.md](obligations.md) for what to check in the repository.

## How to read this

Each row carries four things: the instrument, the launch-time requirement, the exposure in realistic terms, and the source.

Labels used throughout:

- **Must** is a legal requirement.
- **Should** is a requirement with conditions, or a strong regulatory expectation.
- **Practice** is how the market handles it. Not law.
- **`verify`** means the figure or section could not be confirmed from the primary text at the review date. Confirm it before quoting it to a user.

Penalties are stated as the maximum the instrument allows. They are not predictions, and enforcement is usually a fraction of the ceiling.

## Jurisdiction selection

Ask, do not assume. Four questions:

1. Where are the users?
2. Where is the business registered?
3. Where is the data stored and processed?
4. Does money move, and from where?

Default when unanswered: Nigeria, EU/EEA, US California, and US federal. That is the strictest common denominator for a small product, and saying so is better than silently covering nothing.

One rule that catches people: the NDPA follows the data subject, so a product with no Nigerian entity still owes Nigerian users the full set of duties. The GDPR does the same thing with EU residents.

---

## Nigeria

The primary law, the NDPA 2023, applies where an organisation is domiciled, resident, or operating in Nigeria, where processing happens in Nigeria, or where a foreign organisation processes the data of a data subject in Nigeria (s.2).

| Requirement | What it means at launch | Exposure | Instrument |
| --- | --- | --- | --- |
| Lawful basis for every processing purpose | A named basis per purpose. Consent must be affirmative, must not be pre-selected, and silence is not consent. The controller carries the burden of proving consent | Remedial order, compensation, accounting for profits, or a remedial fee. `must` | NDPA ss.25-26 |
| Withdrawal as easy as consent | The right to withdraw is disclosed before consent is given | Same | NDPA s.25 |
| Working data subject rights | Access, rectification, erasure, objection, portability. A policy page that describes a route nobody answers fails | Same | NDPA ss.34-38 |
| Objection to direct marketing | An actual opt-out path, honoured | Same | NDPA rights provisions `verify section numbering` |
| Children's data | Parent or guardian consent, plus mechanisms to verify age and consent | Same, and reputational | NDPA s.31 |
| Cross-border transfer | Adequacy decision, or an approved transfer instrument, or another listed basis. This covers fonts, analytics, hosting, and every model provider abroad | Same. The NDPC fined Multichoice Nigeria in 2024 over unlawful transfers | NDPA ss.41-43 |
| Breach notification | Notify the Commission within 72 hours of awareness `verify against NDPA s.40 and GAID` | Same | NDPA, GAID |
| Registration and annual audit | Data controllers and processors of major importance (DCPMI) register with the NDPC, audit within 15 months of commencement, and file a Compliance Audit Return annually by 31 March through a licensed DPCO. Late filing carries a surcharge of half the filing fee | Administrative penalty, filing refusal, enforcement | NDPC GAID 2025, Arts 10.7-10.8 and Sch. 2, 10 |
| Small-volume DCPMI | An Ordinary High Level DCPMI processing fewer than 200 data subjects does not file a CAR, but still renews registration annually | Registration lapse | NDPC FAQ, GAID 2025 |
| Penalty ceiling | DCPMI: greater of N10,000,000 or 2% of prior-year gross revenue. Everyone else: greater of N2,000,000 or 2% of prior-year gross revenue | Ceiling only | NDPA s.48 |
| Intermediary duties | Anything with a feed, comments, or uploads: takedown within 24 hours of notice, a designated liaison officer, and an annual compliance report for large platforms. Large Service Platforms (100,000+ users) must also be incorporated in Nigeria with a Nigerian contact address on the site | Breach of the NITDA Act 2007 | NITDA Code of Practice for ICSP/II, in force 26 Sep 2022 |
| Copyright takedown | Notice from a rights holder, prompt notice to the uploader, expeditious removal, counter-notice restoration, and suspension of repeat infringers. This is not a DMCA clone; a copied US template does not satisfy it | Breach of statutory duty | Copyright Act 2022 ss.54-55 |
| Commercial email | Consent, a right to object at any time, clear sender identity, and no concealed commercial nature | NDPC enforcement, FCCPC action | NDPA, NCC commercial communication rules |
| Advertising claims | Vetted and substantiated claims for anything presented as advertising, including online | ARCON enforcement `verify scope for app copy` | ARCON Act 2022 |
| Recurring charges | Written mandate, notification of each debit, and a refund path for unauthorised debits. Payment transaction data is subject to localisation duties | Chargeback, CBN supervisory action | CBN Consumer Protection Regulations 2019, Direct Debit Scheme guidelines, CBN circular 15 Jun 2026 `verify the specific recurring-card e-mandate instrument` |
| Consumer fairness | No misleading pricing or claims, and a complaints route | FCCPC action | FCCPA 2018 |
| Traffic data retention | Service providers retain traffic data for a defined period | Regulatory sanction `verify` | Cybercrimes Act 2015 as amended 2024 |

**Timeline that matters.** The GAID 2025 was issued on 20 March 2025 and took effect on 19 September 2025. It replaced NDPR 2019 and the 2020 Implementation Framework entirely. Any guidance, template, or checklist still citing NDPR compliance is out of date.

**DCPMI classification.** The GAID classifies controllers into tiers including Ordinary High Level, Ultra High Level, and Extra High Level, with registration and filing obligations that follow the tier. Confirm the thresholds against the GAID schedules before telling a user which tier they are in. `verify`

---

## EU/EEA

Applies to anyone offering goods or services to people in the EU, or monitoring their behaviour, regardless of where the business sits (GDPR Art 3(2)).

| Requirement | What it means at launch | Exposure | Instrument |
| --- | --- | --- | --- |
| Lawful basis and transparency | A basis per purpose, and a notice that names it | Fines up to 4% of global turnover or EUR 20m, whichever is higher | GDPR Arts 5, 6, 12-14 |
| Consent quality | Freely given, specific, informed, unambiguous, granular, and as easy to withdraw as to give | Same | GDPR Art 7 |
| Cookie and tag consent | No non-essential storage or access before consent. Analytics, pixels, replay, and embeds all count | National supervisory action, and private claims in some states | ePrivacy Directive Art 5(3) |
| Children | Parental consent below the national age of consent, which Member States set between 13 and 16 | Same as GDPR | GDPR Art 8 |
| Processor contracts | A data processing agreement with every vendor touching personal data | Same | GDPR Art 28 |
| Breach notification | 72 hours to the supervisory authority where there is risk | Same | GDPR Art 33 |
| High-risk processing | A DPIA before launch for profiling, large-scale sensitive data, or systematic monitoring | Same | GDPR Art 35 |
| Transfers outside the EEA | An adequacy decision or transfer mechanism. Post-Schrems II this is the font, analytics, and model-provider problem | Same | GDPR Arts 44-49 |
| Consumer pre-contract information | Price, duration, renewal, and cancellation terms before the user commits. Digital services carry a withdrawal right with defined exceptions | Consumer enforcement | Consumer Rights Directive, Omnibus Directive (EU) 2019/2161 |
| Accessibility | Consumer-facing e-commerce and services in scope from 28 June 2025 | National enforcement | European Accessibility Act |
| Platform duties | Notice-and-action, statement of reasons, and transparency reporting for hosting services | DSA enforcement | Digital Services Act |

---

## United Kingdom

| Requirement | What it means at launch | Exposure | Instrument |
| --- | --- | --- | --- |
| Data protection | Same shape as GDPR, with UK-specific derogations | ICO fines up to GBP 17.5m or 4% of global turnover | UK GDPR, Data Protection Act 2018 |
| Registration fee | Most controllers pay the ICO data protection fee | ICO enforcement | DPA 2018 |
| Cookies and e-marketing | Consent before non-essential storage, and consent for marketing email to individuals | ICO fines, PECR enforcement | PECR |
| Children | Age-appropriate design code applies to services likely to be accessed by children | ICO enforcement | Age Appropriate Design Code |
| Subscription contracts | Reminder notices, easy exit, and cooling-off for auto-renewing contracts. Commencement is staged, so confirm which provisions are live | CMA enforcement `verify commencement` | Digital Markets, Competition and Consumers Act 2024 |
| User-to-user services | Illegal content risk assessment and age assurance for services in scope | Ofcom enforcement `verify thresholds` | Online Safety Act 2023 |

---

## US federal

| Requirement | What it means at launch | Exposure | Instrument |
| --- | --- | --- | --- |
| Children's data | Applies to services directed to under-13s, or with actual knowledge of a child's data. Requires notice, verifiable parental consent, and, after the 2025 rule amendments, separate consent for third-party disclosure and targeted advertising, written retention limits, and a written information security program | Civil penalty up to USD 53,088 per violation | COPPA, 16 CFR Part 312 |
| Marketing email | Accurate headers, no deceptive subject, ad identification, a physical postal address, a working opt-out honoured within 10 business days, and liability for vendors sending on your behalf | Up to USD 53,088 per email in violation | CAN-SPAM, 15 U.S.C. 7701 |
| Deceptive practices | A privacy policy or pricing claim you do not honour is an unfair or deceptive practice. This is the most commonly used lever against small products | Civil penalties and consent orders | FTC Act s.5 |
| Copyright safe harbour | Registered agent, a takedown process, a repeat-infringer policy, and agent details on the site. Registration alone grants nothing | Loss of safe harbour, direct liability | DMCA 17 U.S.C. 512, 37 CFR 201.38 |
| Accessibility | No web-specific regulation, but Title III litigation and state law create real exposure | Injunctive relief, damages under state law | ADA Title III |
| Third-party content | Moderation immunity for user content, which Nigeria does not provide | Baseline protection only | 47 U.S.C. 230 |

**Fee and cycle:** the DMCA agent designation costs USD 6 and is renewed every three years.

**Penalty level for 2026:** the FTC announced on 15 September 2026 that it would make no inflation adjustment for 2026 and continue applying the 2025 levels. USD 53,088 is therefore current, not stale.

---

## US California

| Requirement | What it means at launch | Exposure | Instrument |
| --- | --- | --- | --- |
| Privacy notice | An online privacy policy is required for commercial sites collecting personal data from California residents | Statutory damages in some claims | Cal. Bus. and Prof. Code 22575 |
| Consumer privacy | Applies above thresholds (annual revenue over USD 25m, 100,000+ consumers, or 50%+ revenue from selling data). A pre-revenue launch often falls outside, and saying that plainly is more useful than a checklist | Administrative fines, private right of action after a breach | CCPA as amended by CPRA |
| Automatic renewal | Clear disclosure before the charge, affirmative consent, cancellation as easy as signup, and annual reminders. Tightened from 1 January 2026 | Restitution and civil penalties; an unauthorised charge is the real risk | Cal. Bus. and Prof. Code 17600-17606, AB 2863 |
| Recording and interception | Session replay, chat widgets, and some analytics have been treated as eavesdropping. Statutory damages are USD 5,000 per violation, with a private right of action and an active class-action practice | USD 5,000 per violation | CIPA, Penal Code 631, 632, 637.2 |

**On CIPA:** consent is a weaker defence than it looks under section 631, because the theory is third-party eavesdropping rather than notice. Masking form inputs and excluding sensitive fields is the reliable control. Treat consent as the second layer, not the first.

**On the renewal remedy:** California's automatic-renewal statute is reported to treat goods or services supplied after a non-compliant renewal as an unconditional gift that the consumer need not pay for or return. `verify` the subsection (likely 17603) at the source before quoting it, and never present it as the likely outcome.

**On the FTC click-to-cancel rule:** the Eighth Circuit vacated it in July 2025. State automatic-renewal laws are the live obligation, so do not cite the federal rule as current.

---

## Other US states

Thirteen-plus states have comprehensive privacy laws with their own thresholds, notice contents, and universal opt-out signal requirements. Do not enumerate them from memory. If the product targets US consumers generally, list the states in scope, then check each for: a right to opt out of targeted advertising, recognition of Global Privacy Control, and a sensitive-data consent rule.

---

## Other jurisdictions

Do not improvise. Add a row only from a primary source, and record the review date. If a jurisdiction is untested here, say so and scope the answer to the regimes in this file.

Two useful defaults: children's data is regulated almost everywhere, and nearly every regime requires a lawful basis plus a working rights channel.

---

## Shape of enforcement

Use these to calibrate, not to frighten:

- A single unlawful cross-border transfer produced a N766m penalty in Nigeria in 2024.
- A single embedded font produced a EUR 100 damages award in Munich in 2022, and the same theory reaches every third-party embed.
- Session replay and chat widgets have generated serial CIPA class actions in California, which is why masking beats consent.
- Children's data draws the largest per-violation figures, which is why an age gate is cheaper than a lawyer.

## Sources

Verified against primary or regulator-published material on 2026-10-23 unless a row says `verify`.

- NDPA 2023 gazetted text, and the NDPC FAQ at ndpc.gov.ng/faqs.
- NDPC General Application and Implementation Directive 2025, NDPC/NDP ACT-GAID/01/2025.
- NITDA Code of Practice for Interactive Computer Service Platforms and Internet Intermediaries, 2022.
- Nigeria Copyright Act 2022, ss.54-55.
- CBN Consumer Protection Regulations 2019; Nigeria Direct Debit Scheme guidelines.
- FTC civil penalty notice, Federal Register, 15 September 2026 (no 2026 adjustment).
- FTC CAN-SPAM compliance guide; 16 CFR 1.98.
- GDPR, ePrivacy Directive, Consumer Rights Directive, Omnibus Directive, European Accessibility Act, Digital Services Act.
- UK GDPR and DPA 2018, PECR, DMCC Act 2024, Online Safety Act 2023.
- COPPA and 16 CFR Part 312; DMCA 17 U.S.C. 512 and 37 CFR 201.38.
- Cal. Bus. and Prof. Code 22575 and 17600-17606; CIPA Penal Code 631, 632, 637.2; CCPA/CPRA.
