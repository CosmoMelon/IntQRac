import type { RecipientType } from '../qr/types';
export interface TransferRequest { senderAccount: string; recipientType: RecipientType; recipientAlias: string; amount: number; message: string; reference: string | null }
export interface TransferResponse { status: 'completed'; confirmation: string; recipient: string; amount: number }
