export type FlowEventName = 'QR_SCAN_STARTED' | 'QR_DECODED' | 'QR_SCHEMA_VALID' | 'QR_SCHEMA_REJECTED' | 'RECIPIENT_LOOKUP_STARTED' | 'RECIPIENT_LOOKUP_COMPLETED' | 'RECIPIENT_VERIFIED' | 'TRANSFER_REVIEWED' | 'TRANSFER_SUBMITTED' | 'TRANSFER_COMPLETED' | 'TRANSFER_REJECTED';
export interface FlowEvent { id: string; name: FlowEventName; timestamp: string; detail?: string; endpoint?: string; request?: unknown; response?: unknown; latencyMs?: number }
type Listener = () => void;
let events: FlowEvent[] = [];
const listeners = new Set<Listener>();
export const flowLogger = {
  add(name: FlowEventName, data: Omit<FlowEvent, 'id' | 'name' | 'timestamp'> = {}) { events = [{ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name, timestamp: new Date().toISOString(), ...data }, ...events].slice(0, 60); listeners.forEach(l => l()); },
  getEvents: () => events,
  clear() { events = []; listeners.forEach(l => l()); },
  subscribe(listener: Listener) { listeners.add(listener); return () => { listeners.delete(listener); }; },
};
