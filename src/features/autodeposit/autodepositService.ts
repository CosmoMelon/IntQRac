import { normalizeRecipient } from '../qr/qrValidator';
import type { RecipientType } from '../qr/types';
import { flowLogger } from '../developer/flowLogger';
import { mockDirectory } from './mockDirectory';
import type { ResolvedRecipient } from './types';

export const autodepositService = {
  async resolveRecipient(type: RecipientType, value: string): Promise<ResolvedRecipient> {
    const alias = normalizeRecipient(type, value);
    const request = { type, value: alias };
    flowLogger.add('RECIPIENT_LOOKUP_STARTED', { detail: 'Checking recipient in the local mock directory', endpoint: 'POST /mock-interac/resolve-recipient', request });
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 400));
    const match = Object.prototype.hasOwnProperty.call(mockDirectory, alias) ? mockDirectory[alias] : null;
    const response: ResolvedRecipient = { eligible: !!match, autodeposit: !!match, verifiedName: match?.name ?? null, institution: match?.institution ?? null, alias, type };
    flowLogger.add('RECIPIENT_LOOKUP_COMPLETED', { endpoint: 'POST /mock-interac/resolve-recipient', request, response, latencyMs: Math.round(performance.now() - start), detail: match ? 'Autodeposit recipient found' : 'Recipient is unknown or not registered for Autodeposit' });
    if (match) flowLogger.add('RECIPIENT_VERIFIED', { detail: `${match.name} resolved from mock service, not QR data` });
    return response;
  },
};
