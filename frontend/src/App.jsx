import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Common/Navbar';
import WaterRipple from './components/Common/WaterRipple';
import CustomCursor from './components/Common/CustomCursor';
import HeroSection from './components/Hero/HeroSection';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import AnalyticsPage from './components/Analytics/AnalyticsPage';
import LandingPage from './components/Landing/LandingPage';
import './styles/shortlq-theme.css';
import './styles/App.css';
import './styles/hero.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-modern" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner-modern" style={{ width: '40px', height: '40px' }}></div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<HeroSection />}
        />
        <Route
          path="/landing"
          element={<LandingPage />}
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics/:urlId"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <WaterRipple />
      <CustomCursor />
      <AppContent />
    </AuthProvider>
  );
}

export default App;
