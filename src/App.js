// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout components
import Layout from './components/layout/Layout';

// Pages
import HomePage from './pages/HomePage';
import ControlsPage from './pages/ControlsPage';
import DocumentsPage from './pages/DocumentsPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import ManageLocationsPage from './pages/ManageLocationsPage';
import LocationControlsPage from './pages/LocationControlsPage'; // Add this import

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Config Panel
import ConfigPanel from './components/common/ConfigPanel';

// Styles
import './styles/global.css';

// Initialize global app configuration
if (!window.appConfig) {
  window.appConfig = {
    useMockData: localStorage.getItem('useMockData') === 'true' || process.env.REACT_APP_USE_MOCK_DATA === 'true',
    apiUrl: localStorage.getItem('apiUrl') || process.env.REACT_APP_API_URL || 'http://localhost:8080/api'
  };
}

function App() {
  useEffect(() => {
    console.log('App initialized with config:', window.appConfig);
  }, []);

  return (
      <AuthProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="controls/*" element={<ControlsPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="manage-locations" element={<ManageLocationsPage />} />
              <Route path="manage-locations/:locationId/controls" element={<LocationControlsPage />} />
            </Route>
          </Routes>
          <ConfigPanel />
        </Router>
      </AuthProvider>
  );
}

export default App;