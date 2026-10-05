export type RecipientType = 'email' | 'phone';
export interface QRPayload { v: 1; type: RecipientType; to: string; am?: number; cu: 'CAD'; msg?: string; ref?: string }
export type ValidationCode = 'UNSUPPORTED_PROTOCOL' | 'UNSUPPORTED_VERSION' | 'INVALID_TYPE' | 'INVALID_EMAIL' | 'INVALID_PHONE' | 'NON_CANADIAN_PHONE' | 'INVALID_AMOUNT' | 'UNSUPPORTED_CURRENCY' | 'MISSING_RECIPIENT' | 'MALFORMED_QR' | 'DUPLICATE_FIELD';
export class QRValidationError extends Error { constructor(public code: ValidationCode, message: string) { super(message); this.name = 'QRValidationError'; } }
export interface ValidationCheck { label: string; valid: boolean; detail: string }
