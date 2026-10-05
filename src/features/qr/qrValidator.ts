import { QRValidationError, type RecipientType, type ValidationCheck } from './types';

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const CANADIAN_PHONE_RE = /^\+1[2-9]\d{2}[2-9]\d{6}$/;

export function normalizeRecipient(type: RecipientType, value: string): string {
  const trimmed = value.trim();
  if (type === 'email') {
    const at = trimmed.lastIndexOf('@');
    const normalized = at < 0 ? trimmed : `${trimmed.slice(0, at)}@${trimmed.slice(at + 1).toLowerCase()}`;
    if (!EMAIL_RE.test(normalized)) throw new QRValidationError('INVALID_EMAIL', 'The recipient email address is invalid.');
    return normalized;
  }
  if (!/^\+[1-9]\d{7,14}$/.test(trimmed)) throw new QRValidationError('INVALID_PHONE', 'The recipient mobile number is invalid. Use E.164 format, such as +14165551234.');
  if (!CANADIAN_PHONE_RE.test(trimmed)) throw new QRValidationError('NON_CANADIAN_PHONE', 'IntQRac v1 currently supports Canadian mobile recipients only.');
  return trimmed;
}

export function parseAmount(value: string): number {
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,2})?$/.test(value) || Number(value) <= 0 || !Number.isSafeInteger(Math.round(Number(value) * 100)) || Number(value) > 1000000) {
    throw new QRValidationError('INVALID_AMOUNT', 'Enter a positive amount with no more than two decimal places (up to $1,000,000).');
  }
  return Number(value);
}

export function validationChecks(raw: string): ValidationCheck[] {
  const checks: ValidationCheck[] = [
    { label: 'Supported protocol', valid: false, detail: 'ietqr://pay' },
    { label: 'Supported version', valid: false, detail: 'Version 1' },
    { label: 'Valid recipient type', valid: false, detail: 'Email or phone' },
    { label: 'Valid recipient syntax', valid: false, detail: 'Normalized alias' },
    { label: 'Supported currency', valid: false, detail: 'CAD only' },
    { label: 'Valid amount', valid: false, detail: 'Positive, up to 2 decimals' },
    { label: 'No unsupported required fields', valid: false, detail: 'Unknown optional fields ignored' },
  ];
  try {
    const url = new URL(raw);
    checks[0].valid = url.protocol === 'ietqr:' && url.hostname === 'pay' && !url.pathname.replace(/\//g, '');
    const p = url.searchParams;
    checks[1].valid = p.get('v') === '1';
    checks[2].valid = p.get('type') === 'email' || p.get('type') === 'phone';
    try { if (checks[2].valid) { normalizeRecipient(p.get('type') as RecipientType, p.get('to') || ''); checks[3].valid = true; } } catch { /* validity is reflected below */ }
    checks[4].valid = !p.has('cu') || p.get('cu') === 'CAD';
    try { if (p.has('am')) parseAmount(p.get('am') || ''); checks[5].valid = true; } catch { /* validity is reflected below */ }
    checks[6].valid = ![...p.keys()].some(k => k.startsWith('req_')) && ![...p.keys()].some(k => p.getAll(k).length !== 1);
  } catch { /* all checks remain failed */ }
  return checks;
}
