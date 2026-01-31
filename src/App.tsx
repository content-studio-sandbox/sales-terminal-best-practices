import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import NotFound from "./pages/NotFound";
import LandingPage from '@/pages/LandingPage';
import TerminalBasicsPage from './pages/TerminalBasicsPage';
import GitWorkflowsPage from './pages/GitWorkflowsPage';
import SSHBestPracticesPage from './pages/SSHBestPracticesPage';
import VimBestPracticesPage from './pages/VimBestPracticesPage';
import OpenShiftBestPracticesPage from './pages/OpenShiftBestPracticesPage';
import InteractiveTerminalPage from './pages/InteractiveTerminalPage';
import SurveyResultsPage from './pages/SurveyResultsPage';
import ApiAuthenticationPage from './pages/ApiAuthenticationPage';
import CpdCliPage from './pages/CpdCliPage';
import AgenticToolsPage from './pages/AgenticToolsPage';
import TrainingResourcesPage from './pages/TrainingResourcesPage';
import {AppThemeProvider} from "@/theme/ThemeProvider.tsx";
import { useInstana } from "./hooks/useInstana";
import RouteTracking from './RouteTracking';

const queryClient = new QueryClient();

// Wrapper component
const AppContent: React.FC = () => {
  // Generate a unique session ID for anonymous user tracking
  const [sessionUser, setSessionUser] = useState<{id: string; name: string; role: string} | null>(null);
  
  useEffect(() => {
    // Get or create a session ID for tracking
    let sessionId = sessionStorage.getItem('instana_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('instana_session_id', sessionId);
    }
    
    setSessionUser({
      id: sessionId,
      name: 'Anonymous User',
      role: 'visitor'
    });
  }, []);
  
  // Initialize Instana with session tracking
  useInstana(sessionUser);

  return (
    <BrowserRouter>
      <RouteTracking />
      <Routes>
        <Route path="/auth" element={<Navigate to="/" replace />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="terminal-basics" element={<TerminalBasicsPage />} />
          <Route path="git-workflows" element={<GitWorkflowsPage />} />
          <Route path="ssh-best-practices" element={<SSHBestPracticesPage />} />
          <Route path="vim-best-practices" element={<VimBestPracticesPage />} />
          <Route path="openshift-best-practices" element={<OpenShiftBestPracticesPage />} />
          <Route path="interactive-terminal" element={<InteractiveTerminalPage />} />
          <Route path="api-authentication" element={<ApiAuthenticationPage />} />
          <Route path="cpd-cli" element={<CpdCliPage />} />
          <Route path="agentic-tools" element={<AgenticToolsPage />} />
          <Route path="survey-results" element={<SurveyResultsPage />} />
          <Route path="training-resources" element={<TrainingResourcesPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Main App component
const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppThemeProvider>
      <AppContent />
    </AppThemeProvider>
  </QueryClientProvider>
);

export default App;
