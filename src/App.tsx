
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './providers';
import { LoginPage, RegisterPage, DashboardPage, PositionsPage, CreatePositionPage, EditPositionPage, PositionDetailsPage, StatisticsPage } from './pages';
import { ErrorBoundary } from './components/error';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './providers/QueryProvider';
import { CacheProvider } from './providers/CacheProvider';

function App() {
  // Debug logging for app initialization
  console.log('🚀 App Component Initializing...');
  console.log('  Current URL:', window.location.href);
  console.log('  User Agent:', navigator.userAgent);
  console.log('  All process.env keys:', Object.keys(process.env));
  console.log('  REACT_APP_* env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
  
  // Test if console is working
  console.warn('⚠️ Console test - this should be visible');
  console.error('❌ Console error test - this should be visible');
  alert('App is loading - check console for debug logs');
  
  const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to console in development
    console.error('Global error caught:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  };

  // STEP 4: Add CacheProvider
  console.log('🧪 STEP 4: Adding CacheProvider');
  
  return (
    <ErrorBoundary onError={handleGlobalError}>
      <ThemeProvider>
        <QueryProvider>
          <CacheProvider>
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
              <h1>🧪 Step 4: CacheProvider Test</h1>
              <p>If you see this, CacheProvider is working.</p>
              <p>Current URL: {window.location.href}</p>
              <p>Environment: {process.env.NODE_ENV}</p>
              <p>API URL: https://job-search-tracker-api.onrender.com</p>
              <button onClick={() => {
                console.log('Button clicked!');
                alert('Button works!');
              }}>
                Test Button
              </button>
            </div>
          </CacheProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
