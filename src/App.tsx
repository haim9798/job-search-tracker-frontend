
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './providers';
import { LoginPage, RegisterPage, DashboardPage, PositionsPage, CreatePositionPage, EditPositionPage, PositionDetailsPage, StatisticsPage } from './pages';
import { ErrorBoundary } from './components/error';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryProvider } from './providers/QueryProvider';
import { AuthProvider } from './providers/AuthProvider';

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

  // STEP 6: Add Router and routes (skip CacheProvider - it's causing the hang)
  console.log('🧪 STEP 6: Adding Router and routes (skipping CacheProvider)');
  
  return (
    <ErrorBoundary onError={handleGlobalError}>
      <ThemeProvider>
        <QueryProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Protected routes */}
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/positions" element={<PositionsPage />} />
                <Route path="/positions/create" element={<CreatePositionPage />} />
                <Route path="/positions/:id" element={<PositionDetailsPage />} />
                <Route path="/positions/:id/edit" element={<EditPositionPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Router>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
