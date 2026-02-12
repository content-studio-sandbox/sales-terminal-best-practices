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
import ApiAuthenticationPage from './pages/ApiAuthenticationPage';
import CpdCliPage from './pages/CpdCliPage';
import AgenticToolsPage from './pages/AgenticToolsPage';
import TrainingResourcesPage from './pages/TrainingResourcesPage';
import GitConceptsPage from './pages/training/GitConceptsPage';
import {AppThemeProvider} from "@/theme/ThemeProvider.tsx";
import { useInstana } from "./hooks/useInstana";
import RouteTracking from './RouteTracking';
import RouteGuard from './components/RouteGuard';

const queryClient = new QueryClient();

// Wrapper component
const AppContent: React.FC = () => {
  const [sessionUser, setSessionUser] = useState<{id: string; name: string; email?: string; role: string} | null>(null);
  
  useEffect(() => {
    // Fetch user info from OAuth2 headers via a backend endpoint
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('/api/user-info', {
          credentials: 'include', // Include cookies for OAuth2
        });
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.email) {
            // User is authenticated via OAuth2
            setSessionUser({
              id: data.email,
              name: data.name || data.email,
              email: data.email,
              role: 'authenticated_user'
            });
            
            console.log('[OAuth2] User authenticated:', {
              email: data.email,
              name: data.name,
            });
            return;
          }
        }
      } catch (error) {
        console.warn('[OAuth2] Failed to fetch user info:', error);
      }
      
      // Fallback: Generate anonymous session ID
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
    };
    
    fetchUserInfo();
  }, []);
  
  // Initialize Instana with session tracking
  useInstana(sessionUser);

  return (
    <BrowserRouter>
      <RouteTracking />
      <RouteGuard>
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
            <Route path="training-resources" element={<TrainingResourcesPage />} />
            <Route path="training/git-concepts" element={<GitConceptsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteGuard>
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
