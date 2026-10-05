export interface Account { id: string; name: string; suffix: string; balanceCents: number }
export interface Transaction { id: string; recipient: string; alias: string; amountCents: number; accountId: string; message: string; reference: string | null; createdAt: string; status: 'Completed' }
export interface BankState { accounts: Account[]; transactions: Transaction[] }
export const initialBankState: BankState = { accounts: [
  { id: 'ACC-1001', name: 'Everyday Chequing', suffix: '3821', balanceCents: 482560 },
  { id: 'ACC-1002', name: 'High Interest Savings', suffix: '7294', balanceCents: 941025 },
], transactions: [] };
