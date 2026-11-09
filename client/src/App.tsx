import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { AppLayout } from './layouts/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { AssistantPage } from './pages/AssistantPage';
import { ConversationHistoryPage } from './pages/ConversationHistoryPage';
import { LearnDashboardPage } from './pages/LearnDashboardPage';
import { LearnLanguagesPage } from './pages/LearnLanguagesPage';
import { LearnPracticePage } from './pages/LearnPracticePage';
import { LearnProgressPage } from './pages/LearnProgressPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Protected Routes */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/assistant/history" element={<ConversationHistoryPage />} />
              <Route path="/learn" element={<LearnDashboardPage />} />
              <Route path="/learn/languages" element={<LearnLanguagesPage />} />
              <Route path="/learn/practice" element={<LearnPracticePage />} />
              <Route path="/learn/progress" element={<LearnProgressPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

