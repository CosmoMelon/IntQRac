import { QRValidationError, type QRPayload, type RecipientType } from './types';
import { normalizeRecipient, parseAmount } from './qrValidator';

export function parseQR(raw: string): QRPayload {
  let url: URL;
  try { url = new URL(raw.trim()); } catch { throw new QRValidationError('MALFORMED_QR', 'This image does not contain a readable payment URI.'); }
  if (url.protocol !== 'ietqr:' || url.hostname !== 'pay' || url.pathname.replace(/\//g, '') || url.hash) throw new QRValidationError('UNSUPPORTED_PROTOCOL', 'This is not a supported IntQRac payment QR.');
  const p = url.searchParams;
  if ([...p.keys()].some(k => p.getAll(k).length !== 1)) throw new QRValidationError('DUPLICATE_FIELD', 'This QR repeats a field and cannot be trusted.');
  if ([...p.keys()].some(k => k.startsWith('req_'))) throw new QRValidationError('MALFORMED_QR', 'This QR contains an unsupported required field.');
  if (p.get('v') !== '1') throw new QRValidationError('UNSUPPORTED_VERSION', 'This QR uses an unsupported payment format version.');
  const type = p.get('type');
  if (type !== 'email' && type !== 'phone') throw new QRValidationError('INVALID_TYPE', 'This QR has an unsupported recipient type.');
  const to = p.get('to');
  if (!to) throw new QRValidationError('MISSING_RECIPIENT', 'This QR has no recipient address.');
  const recipient = normalizeRecipient(type as RecipientType, to);
  const currency = p.get('cu') || 'CAD';
  if (currency !== 'CAD') throw new QRValidationError('UNSUPPORTED_CURRENCY', 'IntQRac v1 currently supports CAD only.');
  const amount = p.has('am') ? parseAmount(p.get('am') || '') : undefined;
  const msg = p.get('msg') || undefined;
  const ref = p.get('ref') || undefined;
  if ((msg && msg.length > 140) || (ref && ref.length > 64)) throw new QRValidationError('MALFORMED_QR', 'A QR field exceeds the supported length.');
  return { v: 1, type, to: recipient, am: amount, cu: 'CAD', msg, ref };
}
