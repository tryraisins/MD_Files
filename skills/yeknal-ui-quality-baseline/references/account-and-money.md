# Account and money flows

Load this for sign-in, sign-up, verification, settings, billing, checkout, and cancellation. These are the flows where a visual defect becomes a trust or money defect, and where generated UI is most likely to invent behavior that does not exist.

The universal floor applies: labels, focus, errors, keyboard operation, and preserved input. This file adds the rules specific to identity and payment.

## Authentication

**Job:** let the right person in with the least friction, and never lose their work.

- One screen, one decision. Do not combine sign-in and sign-up into an ambiguous form unless the product intentionally merges them, and then say which one happens.
- Ask for the email or identifier first and reveal the rest after, rather than presenting every field at once. Fewer visible fields, fewer abandoned attempts.
- Provide the methods the product actually supports, and nothing else. An OAuth button that is not wired up is worse than no button.
- Errors are specific and non-revealing: "That email and password do not match" rather than "No account with that email", which leaks registration status.
- Never clear the password field on a failed attempt unless the failure was the password; never clear the identifier.
- Keep the submit button available and the form submittable by Enter.
- Show the password-visibility toggle, and keep it keyboard operable.
- Announce success before navigating, and never navigate before the session is confirmed.

### One-time codes and links

- OTP inputs accept paste, accept the whole code in one field, and do not require six separate keystrokes.
- Set `autocomplete="one-time-code"` and `inputmode="numeric"` so the OS can offer the code.
- Show where the code was sent, and offer resend with a cooldown that states the wait.
- Never expire a session silently mid-task. Warn, and preserve unsent work.
- Magic-link screens say which address was used and what to do if it did not arrive.

### Session and recovery

- Session expiry preserves the draft and returns the person to where they were, not to a generic home page.
- Sign-out is immediate and complete; a partial sign-out that leaves cached personal data is a privacy defect.
- Password reset does not confirm whether an account exists. Its success message is neutral.
- Account deletion states exactly what is removed, what is retained, and how long it takes. Provide a confirmation that names the account.

## Money

**Job:** show an amount the person can trust, and take payment exactly once.

- Never invent a price, a discount, a savings percentage, or a tax figure. If the number is not in the data, it does not appear.
- Show the total that will be charged, including tax and fees, before the payment step. A surprise line item after payment is a refund and a complaint.
- Show the currency, and format it for the locale. Do not assume a symbol implies a currency.
- Display the billing period and the renewal behavior next to the price, not in fine print elsewhere.
- Disable double submission at the point of submission, and make the retry safe. An uncertain payment outcome must be presented as uncertain, never as success.

### Plan and pricing surfaces

- Comparison tables compare like with like: same rows, same units, in every column.
- Highlight one recommended plan at most. Highlighting three plans highlights none.
- The primary action on each plan column is reachable without scrolling past the feature list on a laptop screen.
- Annual and monthly pricing are both visible, with the saving stated as an amount or a percentage, not as a vague "save more".
- Feature lists say what is included. A plan that lists only what it lacks is a dark pattern.

### Checkout

- One column, with an order summary that stays visible or is one tap away.
- Guest checkout where the product allows it. Forced account creation at payment loses real revenue.
- One primary action. Every other control on the screen is secondary and visibly so.
- Show the payment method's state: default, processing, succeeded, failed, and failed-because-declined are different messages.
- A declined card returns to the form with the entered details intact and a specific reason.
- The confirmation is its own page with an order reference, not a toast. People need something to return to.

### Billing, invoices, and cancellation

- Invoices are downloadable and named by date or number, not "invoice-final-2".
- Usage-based billing shows the meter, the current period, and the projected total, with the method stated.
- Cancellation is as easy to find as upgrade. A cancellation flow that requires a support call or a hidden link is a dark pattern and, in several jurisdictions, unlawful.
- The cancellation screen states what happens and when: access until the period end, data retention, reactivation path. Offer a pause or a downgrade where the product supports it, and never as a trick to hide cancel.
- Retention offers appear once, are declinable in one action, and do not re-appear in the same flow.
- Refund policy is a link on the billing page, not buried in a help center.

## Failure and recovery

- Every networked step has four visible states: idle, in flight, failed with a reason, and succeeded with a reference.
- Never show success before the server confirms it. This is the single most damaging shortcut in these flows.
- Preserve entered data across validation errors, network errors, timeouts, and re-renders.
- Provide a support path on any failure that could have moved money: an order reference, a link, and what to do next.
- Test the real flow with the network disabled mid-submission and with a declined payment method. Record which of the two you ran.
