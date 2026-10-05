import { describe, expect, it } from 'vitest';
import { parseQR } from './qrParser';
import { generatePayload } from './qrGenerator';

const errorCode = (raw: string) => { try { parseQR(raw); return 'OK'; } catch (error) { return (error as { code?: string }).code; } };
describe('IETQR v1 parser', () => {
  it('accepts a static email QR and normalizes its domain', () => expect(parseQR('ietqr://pay?v=1&type=email&to=%20John%40EXAMPLE.COM%20')).toMatchObject({ type: 'email', to: 'John@example.com', cu: 'CAD' }));
  it('accepts a static Canadian mobile QR', () => expect(parseQR('ietqr://pay?v=1&type=phone&to=%2B14165551234').to).toBe('+14165551234'));
  it('accepts a pre-filled payment QR', () => expect(parseQR('ietqr://pay?v=1&type=email&to=payments@coffee.ca&am=18.75&cu=CAD&msg=Order%201284&ref=ORD1284')).toMatchObject({ am: 18.75, msg: 'Order 1284', ref: 'ORD1284' }));
  it('round trips URL encoded messages through the generator', () => expect(parseQR(generatePayload({ type: 'email', to: 'john@example.com', amount: '', message: 'Coffee & tea + tip', reference: '' })).msg).toBe('Coffee & tea + tip'));
  it('rejects unsupported protocol', () => expect(errorCode('https://example.com/pay?v=1&type=email&to=john@example.com')).toBe('UNSUPPORTED_PROTOCOL'));
  it('rejects unsupported version', () => expect(errorCode('ietqr://pay?v=3&type=email&to=john@example.com')).toBe('UNSUPPORTED_VERSION'));
  it('rejects malformed email', () => expect(errorCode('ietqr://pay?v=1&type=email&to=not-an-email')).toBe('INVALID_EMAIL'));
  it('rejects malformed phone', () => expect(errorCode('ietqr://pay?v=1&type=phone&to=4165551234')).toBe('INVALID_PHONE'));
  it('rejects non-Canadian phone', () => expect(errorCode('ietqr://pay?v=1&type=phone&to=%2B442071234567')).toBe('NON_CANADIAN_PHONE'));
  it('rejects unsupported currency', () => expect(errorCode('ietqr://pay?v=1&type=email&to=john@example.com&cu=USD')).toBe('UNSUPPORTED_CURRENCY'));
  for (const value of ['0', '-5', '1.234', 'abc']) it(`rejects invalid amount ${value}`, () => expect(errorCode(`ietqr://pay?v=1&type=email&to=john@example.com&am=${value}`)).toBe('INVALID_AMOUNT'));
  it('ignores unknown optional fields', () => expect(parseQR('ietqr://pay?v=1&type=email&to=john@example.com&campaign=fall').to).toBe('john@example.com'));
  it('rejects unknown required extensions', () => expect(errorCode('ietqr://pay?v=1&type=email&to=john@example.com&req_signature=x')).toBe('MALFORMED_QR'));
  it('rejects repeated fields', () => expect(errorCode('ietqr://pay?v=1&v=1&type=email&to=john@example.com')).toBe('DUPLICATE_FIELD'));
});
