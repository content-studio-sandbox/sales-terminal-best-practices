import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Define allowed paths for restricted users
const ALLOWED_PATHS = [
  '/training-resources',
  '/interactive-terminal',
  '/survey-results',
  '/terminal-basics',
  '/git-workflows',
  '/', // Allow landing page
];

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * RouteGuard component that restricts user access to specific paths
 * 
 * This component checks if the current path is in the allowed list.
 * If not, it redirects to the training-resources page.
 * 
 * To enable/disable restrictions, set the ENABLE_PATH_RESTRICTIONS flag.
 */
export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const location = useLocation();
  
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
  
  // If path is not allowed, redirect to training-resources
  if (!isAllowed) {
    console.warn(`Access denied to path: ${currentPath}. Redirecting to /training-resources`);
    return <Navigate to="/training-resources" replace />;
  }
  
  // Path is allowed, render children
  return <>{children}</>;
};

export default RouteGuard;

// Made with Bob
