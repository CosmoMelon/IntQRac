type GoatCounter = { count?: (options: { path: string; event: boolean }) => void };
type GoatCounterCall = { path: string; event: boolean };
type SimpleAnalyticsCall = { eventName: string; metadata?: Record<string, unknown> };

const pendingGoatCounter: GoatCounterCall[] = [];
const pendingSimpleAnalytics: SimpleAnalyticsCall[] = [];
let goatCounterLoadListenerAdded = false;
let simpleAnalyticsLoadListenerAdded = false;

declare global {
  interface Window {
    goatcounter?: GoatCounter;
    sa_event?: (eventName: string, metadata?: Record<string, unknown>) => void;
  }
}

const flushGoatCounter = () => {
  if (typeof window.goatcounter?.count !== 'function') return;
  for (const options of pendingGoatCounter.splice(0)) {
    try {
      window.goatcounter.count(options);
    } catch (error) {
      console.error('GoatCounter Error:', error);
    }
  }
};

const flushSimpleAnalytics = () => {
  if (typeof window.sa_event !== 'function') return;
  for (const { eventName, metadata } of pendingSimpleAnalytics.splice(0)) {
    try {
      window.sa_event(eventName, metadata);
    } catch (error) {
      console.error('SimpleAnalytics Error:', error);
    }
  }
};

export const goatCounterEvent = (path: string, event: boolean = false) => {
  if (!goatCounterLoadListenerAdded) {
    const script = document.querySelector<HTMLScriptElement>('script[data-goatcounter]');
    if (script) {
      script.addEventListener('load', flushGoatCounter, { once: true });
      script.addEventListener('error', () => console.warn('GoatCounter script failed to load.'), { once: true });
      goatCounterLoadListenerAdded = true;
    }
  }
  pendingGoatCounter.push({ path, event });
  flushGoatCounter();
};

export const simpleAnalyticsEvent = (eventName: string, metadata?: Record<string, unknown>) => {
  if (!simpleAnalyticsLoadListenerAdded) {
    const script = document.querySelector<HTMLScriptElement>('script[src*="simpleScript.js"]');
    if (script) {
      script.addEventListener('load', flushSimpleAnalytics, { once: true });
      script.addEventListener('error', () => console.warn('Simple Analytics script failed to load.'), { once: true });
      simpleAnalyticsLoadListenerAdded = true;
    }
  }
  pendingSimpleAnalytics.push({ eventName, metadata });
  flushSimpleAnalytics();
};
