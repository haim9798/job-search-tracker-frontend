import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import serviceWorkerManager from './utils/serviceWorker';
import { isProduction } from './config/environment';

console.log('🎯 React app starting...');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('  REACT_APP_ENVIRONMENT:', process.env.REACT_APP_ENVIRONMENT);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

console.log('🎯 Root element found, rendering App...');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('🎯 App rendered successfully');

// Register service worker in production
if (isProduction()) {
  serviceWorkerManager.register();
}
