import QRCode from 'qrcode';
import { parseQR } from './qrParser';
import type { RecipientType } from './types';

export interface QRForm { type: RecipientType; to: string; amount: string; message: string; reference: string }
export function generatePayload(form: QRForm): string {
  const p = new URLSearchParams({ v: '1', type: form.type, to: form.to.trim() });
  if (form.amount.trim()) { p.set('am', form.amount.trim()); p.set('cu', 'CAD'); }
  if (form.message.trim()) p.set('msg', form.message.trim());
  if (form.reference.trim()) p.set('ref', form.reference.trim());
  const raw = `ietqr://pay?${p.toString()}`;
  const parsed = parseQR(raw);
  p.set('to', parsed.to);
  return `ietqr://pay?${p.toString()}`;
}
export async function qrImageData(raw: string): Promise<string> { return QRCode.toDataURL(raw, { width: 960, margin: 4, errorCorrectionLevel: 'H', color: { dark: '#11251c', light: '#ffffff' } }); }
