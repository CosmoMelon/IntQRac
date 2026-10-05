import { accountService } from './accountService';
export const transactionService = { getHistory: async () => accountService.getState().transactions };
