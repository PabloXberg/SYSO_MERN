import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i18n';   // ← initialise translations BEFORE rendering the app
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA: register the service worker so the app works offline and can be
// installed as a standalone app.
serviceWorkerRegistration.register();

reportWebVitals();
