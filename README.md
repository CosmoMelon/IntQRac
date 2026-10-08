# IntQRac

**A proposed interoperable QR layer for Interac e-Transfer.** This is an independent, frontend-only product concept. It generates and decodes real QR images, parses an experimental `ietqr://pay` URI, resolves the recipient through a local mock Autodeposit service, then simulates the sender's e-Transfer flow. It does not connect to Interac or move money.

## Why this exists

First-time e-Transfers often require adding a recipient by hand. IntQRac proposes a QR carrying the recipient’s email or mobile alias; the banking app still resolves the name and handles review and sending. The QR carries an **address, not identity**.

The clearest uses are first-time payees and one-time business payments. V1 accepts only Autodeposit aliases tied to a selected account. It adds an e-Transfer option without changing card acceptance or steering customers away from credit cards.

## Current Canadian landscape

Canada already has ordinary e-Transfer and [Interac Business Request Money](https://www.interac.ca/en/payments/business/interac-e-transfer-business-request-money/). The latter lets enabled businesses collect payments through websites, apps, invoices, or QR codes, with business-focused collection and reconciliation features.

The app's **Current Canadian Landscape** page compares that business-led request flow with IntQRac's proposed payer-led QR flow. Current-service research is separate from the simulation; broader everyday QR use remains a hypothesis.

## QR protocol

The experimental namespace is `ietqr://pay`, deliberately separate from any official Interac URI namespace.

| Field | Required | Meaning |
| --- | --- | --- |
| `v` | Yes | Version; only `1` |
| `type` | Yes | `email` or `phone` |
| `to` | Yes | Recipient alias |
| `am` | No | Positive decimal amount, at most two places, up to $1,000,000 |
| `cu` | No | Currency; defaults to CAD; v1 supports CAD only |
| `msg` | No | Editable message, up to 140 characters |
| `ref` | No | Reference, up to 64 characters |

Static: `ietqr://pay?v=1&type=email&to=john@example.com`

Pre-filled: `ietqr://pay?v=1&type=email&to=payments@coffee.ca&am=18.75&cu=CAD&msg=Order%201284&ref=ORD1284`

One schema serves both cases. Unknown optional fields are ignored; `req_` fields, duplicate fields, malformed recipient syntax, unsupported version/currency, and invalid amounts fail validation. Email whitespace is trimmed and the domain is lowercased. Phones must be Canadian `+1` E.164 values. Recipient name is never accepted from QR data.

## Limits and roadmap

The app simulates the **sender-side** flow in one browser. It has no backend, authentication, cross-device state sync, settlement, recipient notification, or real financial connection. NorthBank and all recipients, accounts, balances, transfers, and confirmation IDs are fictional.

- **V1:** scan an email/phone QR, Autodeposit only, payer-entered amount.
- **V1.1:** pre-filled amount, note, and reference in the shared v1 schema. Amount and note can be edited in the demo; the reference is displayed for review.
- **V2 concept only:** possible request IDs, expiry, authenticated business identity, and real financial institution integration. This is not a Business Request Money replacement.

## Disclaimer

IntQRac is an independent concept prototype demonstrating a proposed QR-based interaction for Interac e-Transfer. It is not affiliated with, endorsed by, or connected to Interac, TD, CIBC, Scotiabank, Wealthsimple, or any Canadian financial institution.
