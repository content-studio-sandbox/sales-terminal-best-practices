import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import NotFound from "./pages/NotFound";
import LandingPage from '@/pages/LandingPage';
import TerminalBasicsPage from './pages/TerminalBasicsPage';
import GitWorkflowsPage from './pages/GitWorkflowsPage';
import SSHBestPracticesPage from './pages/SSHBestPracticesPage';
import InteractiveTerminalPage from './pages/InteractiveTerminalPage';
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
          <Route path="interactive-terminal" element={<InteractiveTerminalPage />} />
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
