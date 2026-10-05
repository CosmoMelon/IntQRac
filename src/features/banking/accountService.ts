import { initialBankState, type BankState } from './demoData';
const KEY = 'intqrac-bank-v1';
let memoryState: BankState = structuredClone(initialBankState);
function getState(): BankState {
  try { const value = localStorage.getItem(KEY); return value ? JSON.parse(value) as BankState : structuredClone(initialBankState); } catch { return memoryState; }
}
function saveState(state: BankState) { memoryState = state; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode fallback */ } window.dispatchEvent(new Event('intqrac-bank-update')); }
export const accountService = {
  getAccounts: async () => getState().accounts,
  getState,
  saveState,
  reset() { saveState(structuredClone(initialBankState)); },
};
