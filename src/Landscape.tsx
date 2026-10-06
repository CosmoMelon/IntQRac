import { ArrowRight, ArrowUpRight, CheckCircle2, QrCode, ScanLine } from 'lucide-react';
import { Link } from 'react-router-dom';

const businessRequestMoneyUrl = 'https://www.interac.ca/en/payments/business/interac-e-transfer-business-request-money/';
const ordinaryTransferUrl = 'https://www.interac.ca/en/how-to-use/interac-e-transfer/how-to-send-money-with-interac-e-transfer/';
const businessFeaturesUrl = 'https://www.interac.ca/en/payments/business/send-receive-money-with-interac-e-transfer-for-business/';
const businessApiUrl = 'https://innovation.interac.ca/solution/business-request-money/';
const interacYearInReviewUrl = 'https://www.interac.ca/en/company/about/corporate-year-in-review/';

const requestFlow = [
  'Business or merchant',
  'Creates a Business Request Money experience',
  'Displays a QR',
  'Customer scans with a phone camera or QR scanner',
  'Payment-request experience opens',
  'Customer may select a financial institution',
  'Bank authentication and authorization',
  'Business Request Money is fulfilled',
  'Business receives payment confirmation',
];

const intqracFlow = [
  'Individual or business',
  'Displays a reusable e-Transfer QR',
  'Customer opens their banking app',
  'Enters Interac e-Transfer and selects Scan QR',
  'Email or mobile alias is extracted',
  'Proposed Autodeposit lookup',
  'Resolved recipient name is displayed',
  'Customer enters or checks the amount',
  'Reviews and sends an ordinary e-Transfer',
];

const comparisonRows = [
  {
    label: 'Entry point',
    request: 'A customer can begin from a merchant QR outside the banking app.',
    intqrac: 'The payer enters e-Transfer inside their banking app and chooses Scan QR.',
  },
  {
    label: 'What the QR represents',
    request: 'A business payment or request experience.',
    intqrac: 'An ordinary e-Transfer alias with optional payment instructions.',
  },
  {
    label: 'Who starts the transaction',
    request: 'The business creates the request or payment experience.',
    intqrac: 'The payer starts an ordinary Send Money transaction.',
  },
  {
    label: 'Recipient type',
    request: 'Businesses or organizations enabled for Business Request Money.',
    intqrac: 'Potentially any eligible individual or business with an Autodeposit e-Transfer alias.',
  },
  {
    label: 'Business enablement',
    request: 'Set up through a participating financial institution.',
    intqrac: 'Conceptually no special merchant setup beyond e-Transfer and Autodeposit; bank support for scanning would be needed.',
  },
  {
    label: 'Reusable personal QR',
    request: 'Not the primary purpose of the business request capability.',
    intqrac: 'A core use case: one alias can be shown to many payers.',
  },
  {
    label: 'Merchant reconciliation',
    request: 'Business payment features and richer data can support reconciliation.',
    intqrac: 'Limited to ordinary e-Transfer information and an optional QR message or reference.',
  },
  {
    label: 'Payment confirmation integration',
    request: 'Purpose-built business payment and collection functionality.',
    intqrac: 'Not inherently part of the proposed V1 QR layer.',
  },
  {
    label: 'Infrastructure',
    request: 'A purpose-built payment-request capability and integration.',
    intqrac: 'A proposed machine-readable layer over existing e-Transfer addressing.',
  },
];

function Flow({ title, eyebrow, steps, variant }: { title: string; eyebrow: string; steps: string[]; variant: 'existing' | 'proposed' }) {
  return <div className={`landscape-flow landscape-flow-${variant}`}>
    <div className="landscape-flow-head"><span className="landscape-flow-icon">{variant === 'existing' ? <QrCode size={20} /> : <ScanLine size={20} />}</span><div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3></div></div>
    <ol>{steps.map((step, index) => <li key={step}><span className="landscape-flow-number">{String(index + 1).padStart(2, '0')}</span><span>{step}</span></li>)}</ol>
  </div>;
}

export default function Landscape() {
  return <>
    <div className="page-head"><div className="container"><span className="eyebrow">RESEARCH CONTEXT · OCTOBER 2026</span><h1>Current Canadian Landscape</h1><p>IntQRac is not proposed in isolation. Ordinary Interac e-Transfer and Interac Business Request Money already serve different payment needs in Canada.</p></div></div>

    <section className="section compact"><div className="container">
      <div className="landscape-context-banner"><span className="eyebrow">EXISTING SERVICES</span><p>The information below describes current Canadian payment options. It is research context, not part of the simulated IntQRac bank or a claim of Interac integration.</p></div>
      <div className="landscape-intro-grid">
        <article className="panel landscape-intro-card"><span className="eyebrow">01 / ORDINARY E-TRANSFER</span><h2>A payer starts Send Money</h2><p>The familiar conceptual flow starts in a banking app: choose or add a recipient, enter their email or mobile number, provide an amount, review, and send. Recipient resolution and exact screens vary by financial institution.</p><div className="landscape-inline-flow" aria-label="Conceptual ordinary e-Transfer flow">{['Banking app', 'Recipient', 'Email or mobile', 'Resolve', 'Amount', 'Review', 'Send'].map((step, index) => <span key={step}>{index > 0 && <ArrowRight size={14} aria-hidden="true" />}{step}</span>)}</div></article>
        <article className="panel landscape-intro-card landscape-intro-business"><span className="eyebrow">02 / BUSINESS REQUEST MONEY</span><h2>A business collects payment</h2><p>Interac Business Request Money is an existing business payment-collection capability. A business sets it up through a participating financial institution and can integrate payment collection into a website, mobile app, invoice, or QR experience. A merchant QR can start a Business Request Money transaction. This is a business request workflow, not merely an encoded recipient alias.</p><p>Business-focused functionality can support payment confirmation and reconciliation. Customer screens and handoffs vary by institution and implementation.</p><a href={businessRequestMoneyUrl} target="_blank" rel="noreferrer">Interac Business Request Money <ArrowUpRight size={15} /></a></article>
      </div>
      <div className="landscape-participants"><div><span className="eyebrow">PARTICIPATING INSTITUTIONS</span><h3>Currently listed by Interac</h3><p>BMO · CIBC · DC Bank · Peoples Trust · Scotiabank</p></div><a href={businessRequestMoneyUrl} target="_blank" rel="noreferrer">Check the current list <ArrowUpRight size={15} /></a></div>
    </div></section>

    <section className="section surface"><div className="container"><div className="section-intro"><span className="eyebrow">TWO DISTINCT QR JOURNEYS</span><h2>Where the payment begins changes the experience.</h2><p>These diagrams show conceptual paths, not a universal set of screens. In particular, Business Request Money handoffs can vary by institution and merchant integration.</p></div><div className="landscape-flows"><Flow title="Existing Business Request Money QR" eyebrow="BUSINESS-LED REQUEST" steps={requestFlow} variant="existing" /><Flow title="Proposed IntQRac" eyebrow="PAYER-LED SEND MONEY" steps={intqracFlow} variant="proposed" /></div></div></section>

    <section className="section"><div className="container"><div className="section-intro"><span className="eyebrow">SIDE BY SIDE</span><h2>Same QR gesture. Different job.</h2><p>Business Request Money supports merchant payment collection. IntQRac proposes a scan option for ordinary e-Transfer sending.</p></div><div className="landscape-comparison" role="table" aria-label="Business Request Money QR compared with IntQRac"><div className="landscape-comparison-head" role="row"><span role="columnheader">Dimension</span><span role="columnheader">Interac Business Request Money QR</span><span role="columnheader">IntQRac concept</span></div>{comparisonRows.map(row => <div className="landscape-comparison-row" role="row" key={row.label}><strong role="rowheader">{row.label}</strong><p role="cell" data-column="Business Request Money">{row.request}</p><p role="cell" data-column="IntQRac concept">{row.intqrac}</p></div>)}</div><div className="landscape-conclusion"><CheckCircle2 size={22} /><strong>IntQRac is not intended to replace Business Request Money. The two concepts optimize different levels of the payment experience.</strong></div></div></section>

    <section className="section surface"><div className="container landscape-bottom-grid"><div><span className="eyebrow">ADOPTION HYPOTHESIS</span><h2>Could everyday e-Transfer make QR useful to more people?</h2><p>Business Request Money already demonstrates that QR-triggered Interac payments are technically and commercially viable. However, QR payment has not become a ubiquitous everyday interaction inside Canadian banking apps comparable to Scan &amp; Pay experiences in some other markets. This is a qualitative product observation, not a measured usage claim.</p><p><strong>Hypothesis to validate:</strong> Could QR scanning inside ordinary e-Transfer be useful to a broader population, including individuals and businesses that do not need full Business Request Money capabilities?</p><p className="landscape-evidence-note">Interac reports Business Request Money transaction growth, but that figure does not isolate QR use or establish how often people scan from within banking apps. No claim of poor Business Request Money adoption is made here.</p><a className="landscape-source-link" href={interacYearInReviewUrl} target="_blank" rel="noreferrer">Interac corporate year in review <ArrowUpRight size={15} /></a></div><aside className="panel landscape-boundary"><span className="eyebrow">OUT OF SCOPE</span><h3>What IntQRac does not attempt to solve</h3><ul>{['Merchant acquiring', 'Card payments or Visa/Mastercard acceptance', 'Business Request Money replacement', 'A merchant reconciliation platform', 'A new payment rail'].map(item => <li key={item}><span aria-hidden="true" />{item}</li>)}</ul><Link to="/comparison">Compare other QR concepts <ArrowRight size={16} /></Link></aside></div></section>

    <section className="landscape-sources"><div className="container"><span className="eyebrow">RESEARCH SOURCES</span><p>Current-service statements are based on Interac’s <a href={ordinaryTransferUrl} target="_blank" rel="noreferrer">ordinary e-Transfer guide</a>, <a href={businessRequestMoneyUrl} target="_blank" rel="noreferrer">Business Request Money overview</a>, <a href={businessFeaturesUrl} target="_blank" rel="noreferrer">e-Transfer for Business features</a>, and <a href={businessApiUrl} target="_blank" rel="noreferrer">Business Request Money API description</a>. The flows and IntQRac comparison are conceptual interpretations for this independent prototype.</p></div></section>
  </>;
}
