import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import './styles.css';
import './styles-extra.css';
import './styles-positioning.css';
import './styles-landscape.css';

const Router = import.meta.env.VITE_GITHUB_PAGES === 'true' ? HashRouter : BrowserRouter;
createRoot(document.getElementById('root')!).render(<React.StrictMode><Router><App /></Router></React.StrictMode>);
