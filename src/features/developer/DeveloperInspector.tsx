import { useSyncExternalStore } from 'react';
import { X, TerminalSquare, Trash2 } from 'lucide-react';
import { flowLogger } from './flowLogger';

export default function DeveloperInspector({ onClose }: { onClose: () => void }) {
  const events = useSyncExternalStore(flowLogger.subscribe, flowLogger.getEvents);
  return <div className="inspector-backdrop" onClick={onClose}><aside className="inspector" onClick={e => e.stopPropagation()} aria-label="Developer flow inspector">
    <div className="inspector-head"><div><span className="eyebrow">DEVELOPER VIEW</span><h2>Flow Inspector</h2></div><button className="icon-button" onClick={onClose} aria-label="Close inspector"><X size={20}/></button></div>
    <p className="inspector-note">Logical API representation for prototype purposes. No real Interac APIs are being called.</p>
    <div className="inspector-tools"><span>{events.length} events · newest first</span><button className="text-button" onClick={flowLogger.clear}><Trash2 size={14}/> Clear log</button></div>
    <div className="event-list">{events.length ? events.map(event => <details className="event" key={event.id}><summary><span className="event-dot"/><span><strong>{event.name.replaceAll('_', ' ')}</strong><small>{new Date(event.timestamp).toLocaleTimeString()} {event.latencyMs !== undefined && ` · ${event.latencyMs} ms`}</small></span></summary><div className="event-detail">{event.detail && <p>{event.detail}</p>}{event.endpoint && <code>{event.endpoint}</code>}{event.request !== undefined && <><span>Request</span><pre>{JSON.stringify(event.request, null, 2)}</pre></>}{event.response !== undefined && <><span>Response</span><pre>{JSON.stringify(event.response, null, 2)}</pre></>}</div></details>) : <div className="empty-log"><TerminalSquare size={28}/><p>Scan a QR to see the interaction sequence.</p></div>}</div>
  </aside></div>;
}
