import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RouteGuard, GuestGuard } from './components/RouteGuard';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { Prediction } from './pages/Prediction';
import { PatientHistory } from './pages/PatientHistory';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { Profile } from './pages/Profile';
import { NotFoundPage } from './pages/NotFoundPage';
import { About } from './pages/About';
import { Features } from './pages/Features';

// Layout wrapper for dashboard views
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Guest Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          
          <Route path="/login" element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          } />
          
          <Route path="/register" element={
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          } />

          {/* Protected Dashboard Pages */}
          <Route path="/dashboard" element={
            <RouteGuard>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </RouteGuard>
          } />

          <Route path="/prediction" element={
            <RouteGuard>
              <DashboardLayout>
                <Prediction />
              </DashboardLayout>
            </RouteGuard>
          } />

          <Route path="/history" element={
            <RouteGuard>
              <DashboardLayout>
                <PatientHistory />
              </DashboardLayout>
            </RouteGuard>
          } />

          <Route path="/reports" element={
            <RouteGuard>
              <DashboardLayout>
                <Reports />
              </DashboardLayout>
            </RouteGuard>
          } />

          <Route path="/analytics" element={
            <RouteGuard>
              <DashboardLayout>
                <Analytics />
              </DashboardLayout>
            </RouteGuard>
          } />

          <Route path="/profile" element={
            <RouteGuard>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </RouteGuard>
          } />

          {/* 404 Routing */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
