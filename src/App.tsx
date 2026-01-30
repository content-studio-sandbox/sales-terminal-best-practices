import React from "react";
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
import {AppThemeProvider} from "@/theme/ThemeProvider.tsx";

const queryClient = new QueryClient();

// Wrapper component
const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
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
