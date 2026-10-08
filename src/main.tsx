import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import './styles-extra.css';
import './styles-positioning.css';
import './styles-landscape.css';

// Preserve links shared while the GitHub Pages build used hash routing.
if (window.location.hash.startsWith('#/')) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  window.history.replaceState(window.history.state, '', `${basePath}${window.location.hash.slice(1)}`);
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><BrowserRouter basename={import.meta.env.BASE_URL}><App /></BrowserRouter></React.StrictMode>);
