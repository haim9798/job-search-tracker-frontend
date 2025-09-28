
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './providers';
import { LoginPage, RegisterPage, DashboardPage, PositionsPage, CreatePositionPage, EditPositionPage, PositionDetailsPage, StatisticsPage } from './pages';
import { ErrorBoundary } from './components/error';

function App() {
  // Debug logging for app initialization
  console.log('🚀 App Component Initializing...');
  console.log('  Current URL:', window.location.href);
  console.log('  User Agent:', navigator.userAgent);
  console.log('  All process.env keys:', Object.keys(process.env));
  console.log('  REACT_APP_* env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));
  
  const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to console in development
    console.error('Global error caught:', error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } });
  };

  return (
    <ErrorBoundary onError={handleGlobalError}>
      <AppProvider>
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
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
