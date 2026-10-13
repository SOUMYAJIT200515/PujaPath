// Global Google Maps quota defense tap per Google Maps Platform specifications
(window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
};

const origError = console.error;
console.error = (...args: unknown[]) => {
  origError.apply(console, args);
  const msg = args.map((a) => String(a)).join(' ');
  if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
};

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './services/offlineCache';

// Initialize Service Worker with Cache API for offline pandal hopping
if (typeof window !== 'undefined') {
  registerServiceWorker();
}

createRoot(document.getElementById('root')!).render(<App />);
