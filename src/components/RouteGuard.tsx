import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { InlineNotification } from '@carbon/react';

// Define allowed paths for restricted users
const ALLOWED_PATHS = [
  '/training-resources',
  '/training', // Allow all training subpages
  '/interactive-terminal',
  '/terminal-basics',
  '/git-workflows',
  '/local-setup', // Allow all local setup subpages
  '/tbd', // Allow TBD placeholder page
  '/', // Allow landing page
];

// Define upcoming session paths with friendly names
const UPCOMING_SESSIONS: Record<string, string> = {
  '/ssh-best-practices': 'SSH Best Practices',
  '/vim-best-practices': 'Vim Best Practices',
  '/openshift-best-practices': 'OpenShift Best Practices',
  '/api-authentication': 'API Authentication',
  '/cpd-cli': 'CPD CLI',
  '/agentic-tools': 'AI Agents',
};

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * RouteGuard component that restricts user access to specific paths
 *
 * This component checks if the current path is in the allowed list.
 * If not, it shows a notification and redirects to the training-resources page.
 *
 * To enable/disable restrictions, set the ENABLE_PATH_RESTRICTIONS flag.
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation();
  const [showNotification, setShowNotification] = useState(false);
  const [blockedSession, setBlockedSession] = useState<string>('');
  
  // Feature flag to enable/disable path restrictions
  // Set to true to enforce restrictions, false to allow all paths
  const ENABLE_PATH_RESTRICTIONS = true;
  
  // If restrictions are disabled, allow all paths
  if (!ENABLE_PATH_RESTRICTIONS) {
    return <>{children}</>;
  }
  
  // Check if current path is allowed
  const currentPath = location.pathname;
  const isAllowed = ALLOWED_PATHS.some(allowedPath =>
    currentPath === allowedPath || currentPath.startsWith(allowedPath + '/')
  );
  
  // Check if this is an upcoming session
  const isUpcomingSession = UPCOMING_SESSIONS[currentPath];
  
  // If path is not allowed, show notification and redirect
  useEffect(() => {
    if (!isAllowed && isUpcomingSession) {
      setBlockedSession(isUpcomingSession);
      setShowNotification(true);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAllowed, isUpcomingSession]);
  
  if (!isAllowed) {
    console.warn(`Access denied to path: ${currentPath}. Redirecting to /training-resources`);
    
    return (
      <>
        {showNotification && isUpcomingSession && (
          <div style={{
            position: 'fixed',
            top: '80px',
            right: '16px',
            zIndex: 9999,
            maxWidth: '400px',
          }}>
            <InlineNotification
              kind="info"
              title="Upcoming Session"
              subtitle={`"${blockedSession}" will be available in a future training session. Check back soon!`}
              onClose={() => setShowNotification(false)}
              hideCloseButton={false}
            />
          </div>
        )}
        <Navigate to="/training-resources" replace />
      </>
    );
  }
  
  // Path is allowed, render children
  return <>{children}</>;
};

export default RouteGuard;

// Made with Bob
