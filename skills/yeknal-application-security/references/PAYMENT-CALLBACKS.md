# Payment callbacks and money paths

Detail companion to the "Payments and money paths" section of [SKILL.md](../SKILL.md). Load it whenever work touches payment notification handlers, checkout fulfilment, wallet credits, subscription activation, licence issuance, or refund and reversal handling.

Provider documentation is authoritative and changes. Verify the current signature scheme, IP ranges, and response contract before relying on any statement here.

## The invariant

A callback URL is public. The request body is attacker-controlled. Unless the provider signs the raw body, nothing in the request proves origin or content. The existence of a callback is therefore a hint that something may have happened, and never evidence that value should be released.

Value is released only when proof obtained through a channel the attacker does not control is bound to a specific intent:

```text
provider identity + merchant/account + environment
  + order or intent reference + amount + currency
  + payer (where the flow requires it) + successful payment state
```

Any missing term means pending, review, or rejection. It never means success.

## Flow model

1. Create the intent server-side before contacting the provider: order ID, amount, currency, merchant, environment, payer, and status `pending`.
2. Initiate the charge and store the provider's own correlation identifier on that intent, server-side.
3. Receive the notification. Authenticate the transport, then stage the raw payload durably with its receipt time and delivery identifier.
4. Resolve the intent from trusted fields only, never from a client-supplied reference.
5. Verify out of band, or verify the signature over the raw body, then compare every term of the invariant.
6. Apply the financial effect and the entitlement inside one atomic operation, with deduplication.
7. Reconcile later, independently of notification delivery.

## Provider mechanics

### M-Pesa (Safaricom Daraja)

As of this writing, Daraja does not document a Stripe-style signature for STK and C2B callbacks; confirm against current Safaricom documentation rather than assuming. Treat the callback as unauthenticated even when an IP allowlist is configured.

- **STK Push.** The callback carries `CheckoutRequestID`, `MerchantRequestID`, `ResultCode`, and, on success, receipt details. `ResultCode` describes the charge attempt, not your order. Confirm the outcome with STK Query using `CheckoutRequestID` and treat that response as the evidence, then still compare amount and reference against the intent.
- **C2B validation.** A decision endpoint, not a notification. It must accept or reject according to the provider's contract, synchronously and quickly, before the confirmation arrives.
- **C2B confirmation.** The notification that a payment landed. It can be genuine and still be unsuitable: wrong amount, wrong account reference, or a duplicate `TransID`.
- **Duplicates.** Retries and replayed confirmations repeat the same `TransID`. Deduplicate on provider plus shortcode plus `TransID`, and apply the financial effect only once.
- **Identifiers.** `MerchantRequestID` and `CheckoutRequestID` are lookup keys. Keep them server-side. A client that can drive verification with a known reference can drive fulfilment with it.
- **Direction.** STK and C2B are money in. B2C, reversal, and refund are money out and carry a different callback shape and a different failure model. Do not reuse the inbound handler.

### Stripe

`Stripe-Signature` carries a timestamp and one or more `v1` HMAC-SHA256 signatures computed over `timestamp + "." + raw body` using the endpoint secret. Verify with the SDK, enforce the timestamp tolerance, and read the raw bytes rather than re-serialising parsed JSON. Retries carry a fresh timestamp, so signature validity does not imply first delivery: deduplicate on the event ID and on business effect.

### Paystack

`x-paystack-signature` is HMAC-SHA512 of the raw body using the API secret key. Compare in constant time, then deduplicate on the event reference. This scheme has no signed delivery timestamp, so replay resistance depends on persistent deduplication rather than freshness.

### Flutterwave and similar

Some providers use a static secret compared against a header (for example `verif-hash` in v3). That authenticates the sender only, carries no freshness, and leaks if the secret reaches an environment you do not control. Treat it as the weakest accepted form and pair it with deduplication and an outbound verification query.

### Anything with no authentication at all

If the provider offers no signature and no authenticated query, treat every notification as an unverified claim. Reconcile against the provider's statement, settlement file, or dashboard export before releasing value, and keep the order pending until reconciliation resolves it.

## Failure catalogue

| Failure | What it looks like | Control |
| --- | --- | --- |
| Forged body | `{ "ResultCode": 0 }` posted to a public URL marks the order paid | Authenticate the transport, verify out of band, bind to intent |
| Replay | The same genuine payload is resent to repeat fulfilment | Durable deduplication keyed on provider event or transaction |
| Amount mismatch | A real 1-unit payment fulfils a 1000-unit order | Compare amount and currency against the stored intent |
| Reference reuse | A payer reuses another customer's account reference | Bind intent to the paying party where the flow requires it, reject reuse |
| Client-supplied proof | The client sends the provider reference or a "paid" flag | Entitlement derives only from server-side evidence |
| Backwards transition | A late failed notification clears a completed order | Explicit transition table; terminal states stay terminal |
| Timeout as failure | Missing callback marks the order failed, then the money arrives | Timeout is unknown; reconcile |
| Double fulfilment | Two concurrent deliveries both pass the check | Uniqueness constraint plus atomic state and ledger update |
| Silent loss | Nothing stored because the handler threw after responding | Stage first, acknowledge after durable write |
| Quota exhaustion | The callback triggers a provider query with no authentication | Bind triggers to the intent and bound request rate |
| Ignored reversal | Refund arrives, entitlement stays | Handle money-out direction and compensating entries |

## Acknowledgement rules

- Respond after the payload is durably staged, not before.
- Return `400` when a signature or shared secret fails. Do not act, and do not echo internal identifiers.
- For unauthenticated providers, return the constant response the provider expects and keep the request off the fulfilment path entirely.
- Follow the provider's documented contract for validation endpoints; a generic `200` is not always correct.
- Never let an exception after acknowledgement lose the only copy of payment evidence.

## Lifecycle and reconciliation

- Model the states you actually need: `pending`, `authorised`, `paid`, `partially_paid`, `failed`, `reversed`, `refunded`, `disputed`, and an explicit `unknown` for missing outcomes.
- A timeout is `unknown`. Late success is normal in mobile money and must still be able to complete a pending intent.
- Accept partial and overpayment if the product does, and route them deliberately rather than coercing them into success.
- Keep an append-only record of financial effects with immutable compensating entries for refunds and reversals. Use double-entry accounting where balances are maintained; a simple checkout decision table is enough where they are not.
- Run reconciliation on a schedule that does not depend on notification delivery, with bounded retries and an exception queue a human actually reviews.
- Decide the reversal policy explicitly: revoke entitlement immediately, revoke at period end, or never. Do not leave it to whichever handler runs first.
- Keep provider secrets, tokens, and full payloads out of logs; redact payer identifiers.

## Proof

An integration is not proven by rejecting a forged payload, because a handler that fulfils nothing also passes that test. Prove four behaviours end to end through the real entry point:

1. **Legitimate payment** fulfils exactly once, with the correct entitlement and ledger entry.
2. **Fake success payload** changes nothing and creates no entitlement.
3. **Replay and concurrent duplicate delivery** produce no additional effect.
4. **Mismatched amount, unknown reference, late success, and reversal** each follow the documented policy.

Record the reproduction as a runnable script or log so the result is repeatable. A database assertion that bypasses the HTTP handler is not this proof.
