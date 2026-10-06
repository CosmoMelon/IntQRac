# IntQRac

**A proposed interoperable QR layer for Interac e-Transfer.** This is an independent, frontend-only product concept. It generates and decodes real QR images, parses an experimental `ietqr://pay` URI, resolves the recipient through a local mock Autodeposit service, then simulates the sender's e-Transfer flow. It does not connect to Interac or move money.

## Why this exists

First-time e-Transfer often requires manually entering and saving a recipient. The product hypothesis is that the recipient's existing email address or mobile number could be made machine-readable, while a banking app continues to resolve the verified recipient name and run its familiar review/send experience. The QR carries an **address, not identity**.

The biggest shortcut is for first-time payees and one-time business payments. V1 includes only Autodeposit recipients: without Autodeposit, the recipient may choose among their accounts after receiving an e-Transfer, while an Autodeposit alias is registered to a selected account. IntQRac adds an e-Transfer option without changing Visa or Mastercard acceptance or card checkout. It does not direct customers away from credit cards; real payment-method mix would depend on business rollout and customer choice.

## Current Canadian landscape

IntQRac is a concept alongside existing Canadian payment experiences, not a replacement for them. Ordinary e-Transfer begins with a sender in their banking app. [Interac Business Request Money](https://www.interac.ca/en/payments/business/interac-e-transfer-business-request-money/) is an existing business payment-collection capability that can be offered through websites, apps, invoices, and merchant QR codes after setup through a participating financial institution. Its business request workflow can support payment collection and reconciliation; it is not just an ordinary recipient alias in a QR.

The app's **Current Canadian Landscape** page compares a conceptual Business Request Money QR journey with the proposed payer-initiated IntQRac journey. It labels current-service research separately from the fictional bank demo, identifies the participating institutions Interac currently lists, and marks broader everyday QR use as a hypothesis to validate. The diagrams are illustrative; customer screens vary by institution and implementation.

## GitHub Pages deployment

This repository is the IntQRac organization site at [intqrac.github.io](https://intqrac.github.io/). In **Settings → Pages**, set the build source to **GitHub Actions**. Deploy from **Actions → Deploy IntQRac to GitHub Pages → Run workflow**. The workflow runs only when manually triggered; pushing a commit does not publish the site.

The Pages build serves assets from `/` and uses hash routes such as `https://intqrac.github.io/#/bank`, so linked pages work when refreshed. Local development continues to use normal browser routes.

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


## Security assumptions

- QR replacement: prominently display the independently resolved recipient name before sending.
- Fake recipient name: ignore any identity claim in QR data.
- Malformed or future QR: strict validation and fail closed on unsupported required fields or protocol versions.
- Changed amount: treat QR amount as editable pre-filled information, never as an authenticated request.
- No Autodeposit: v1 QR flow stops; there is no security-question path.
- QR contains only an alias and optional amount, note, or reference. It contains no bank account, transit, institution, card, credential, password, or authentication token data.

## Limits and roadmap

The app simulates the **sender-side** flow in one browser. It has no backend, authentication, cross-device state sync, settlement, recipient notification, or real financial connection. NorthBank and all recipients, accounts, balances, transfers, and confirmation IDs are fictional.

- **V1:** scan an email/phone QR, Autodeposit only, payer-entered amount.
- **V1.1:** pre-filled amount, note, and reference in the shared v1 schema. Amount and note can be edited in the demo; the reference is displayed for review.
- **V2 concept only:** possible request IDs, expiry, authenticated business identity, and real financial institution integration. This is not a Business Request Money replacement.

## Disclaimer

IntQRac is an independent concept prototype demonstrating a proposed QR-based interaction for Interac e-Transfer. It is not affiliated with, endorsed by, or connected to Interac, TD, CIBC, Scotiabank, Wealthsimple, or any Canadian financial institution.
