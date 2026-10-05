import { describe, expect, it, vi } from 'vitest';
import { autodepositService } from '../autodeposit/autodepositService';
import { transferService } from './transferService';

describe('Autodeposit gate and transfer revalidation', () => {
  it('marks a non-Autodeposit recipient ineligible', async () => expect((await autodepositService.resolveRecipient('email', 'sarah@example.com')).autodeposit).toBe(false));
  it('marks an unknown recipient ineligible', async () => expect((await autodepositService.resolveRecipient('email', 'unknown@example.com')).eligible).toBe(false));
  it('revalidates recipient at send time and rejects an unknown alias', async () => {
    const spy = vi.spyOn(autodepositService, 'resolveRecipient');
    await expect(transferService.sendTransfer({ senderAccount: 'ACC-1001', recipientType: 'email', recipientAlias: 'unknown@example.com', amount: 25, message: '', reference: null })).rejects.toThrow('no longer eligible');
    expect(spy).toHaveBeenCalledWith('email', 'unknown@example.com');
    spy.mockRestore();
  });
});
