import { autodepositService } from '../autodeposit/autodepositService';
import { accountService } from '../banking/accountService';
import { flowLogger } from '../developer/flowLogger';
import { parseAmount } from '../qr/qrValidator';
import type { TransferRequest, TransferResponse } from './transferTypes';

export const transferService = {
  async sendTransfer(request: TransferRequest): Promise<TransferResponse> {
    const start = performance.now();
    flowLogger.add('TRANSFER_SUBMITTED', { endpoint: 'POST /mock-bank/transfers', request, detail: 'Local simulation: re-check recipient, amount, and balance' });
    try {
      const amount = parseAmount(String(request.amount));
      const recipient = await autodepositService.resolveRecipient(request.recipientType, request.recipientAlias);
      if (!recipient.autodeposit || !recipient.verifiedName) throw new Error('Recipient is no longer eligible for QR e-Transfer.');
      const state = accountService.getState();
      const account = state.accounts.find(a => a.id === request.senderAccount);
      if (!account) throw new Error('The sender account was not found.');
      const cents = Math.round(amount * 100);
      if (cents > account.balanceCents) throw new Error('Insufficient demo balance for this transfer.');
      const confirmation = `S2T-${Math.floor(100000 + Math.random() * 900000)}`;
      account.balanceCents -= cents;
      state.transactions.unshift({ id: confirmation, recipient: recipient.verifiedName, alias: recipient.alias, amountCents: cents, accountId: account.id, message: request.message, reference: request.reference, createdAt: new Date().toISOString(), status: 'Completed' });
      accountService.saveState(state);
      const response: TransferResponse = { status: 'completed', confirmation, recipient: recipient.verifiedName, amount };
      flowLogger.add('TRANSFER_COMPLETED', { endpoint: 'POST /mock-bank/transfers', request, response, latencyMs: Math.round(performance.now() - start), detail: 'Balance and history updated in this browser' });
      return response;
    } catch (error) {
      flowLogger.add('TRANSFER_REJECTED', { endpoint: 'POST /mock-bank/transfers', request, response: { error: error instanceof Error ? error.message : 'Unknown error' }, latencyMs: Math.round(performance.now() - start) });
      throw error;
    }
  },
};
