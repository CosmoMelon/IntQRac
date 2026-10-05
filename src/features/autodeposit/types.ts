import type { RecipientType } from '../qr/types';
export interface ResolvedRecipient { eligible: boolean; autodeposit: boolean; verifiedName: string | null; institution: string | null; alias: string; type: RecipientType }
