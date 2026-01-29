// src/hooks/useInstana.ts
import { useEffect } from 'react';

// Declare global ineum function
declare global {
  interface Window {
    ineum?: (...args: any[]) => void;
  }
}

interface InstanaUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string | null;
}

/**
 * Hook to integrate Instana EUM with user tracking and console log capture
 */
export function useInstana(user: InstanaUser | null) {
  useEffect(() => {
    if (!window.ineum) {
      console.warn('Instana EUM not loaded yet');
      return;
    }

    // Set user information when user is available
    if (user?.id) {
      const userId = user.id;
      const userName = user.name || user.email || 'Unknown User';
      const userEmail = user.email || '';

      // Set user data in Instana
      window.ineum('user', userId, userName, userEmail);

      // Set custom metadata for role
      if (user.role) {
        window.ineum('meta', 'userRole', user.role);
      }

      console.log('[Instana] User tracking enabled:', {
        userId,
        userName,
        userEmail,
        role: user.role,
      });
    }
  }, [user]);

  useEffect(() => {
    if (!window.ineum) return;

    // Capture console errors and send to Instana
    const originalConsoleError = console.error;
    console.error = function (...args: any[]) {
      // Call original console.error
      originalConsoleError.apply(console, args);

      // Report to Instana as custom event
      try {
        const errorMessage = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');

        window.ineum?.('reportEvent', 'console_error', {
          message: errorMessage,
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        // Silently fail if reporting fails
      }
    };

    // Capture console warnings (optional)
    const originalConsoleWarn = console.warn;
    console.warn = function (...args: any[]) {
      originalConsoleWarn.apply(console, args);

      try {
        const warnMessage = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');

        window.ineum?.('reportEvent', 'console_warn', {
          message: warnMessage,
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        // Silently fail
      }
    };

    // Track unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      window.ineum?.('reportEvent', 'unhandled_rejection', {
        reason: String(event.reason),
        timestamp: new Date().toISOString(),
      });
    };

    // Track global errors
    const handleError = (event: ErrorEvent) => {
      window.ineum?.('reportEvent', 'global_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString(),
      });
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup on unmount
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);
}

/**
 * Helper function to report custom events to Instana
 */
export function reportInstanaEvent(eventName: string, data?: Record<string, any>) {
  if (window.ineum) {
    window.ineum('reportEvent', eventName, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Helper function to set custom metadata in Instana
 */
export function setInstanaMeta(key: string, value: string) {
  if (window.ineum) {
    window.ineum('meta', key, value);
  }
}

/**
 * Helper function to track API calls
 */
export function trackApiCall(endpoint: string, method: string, status: number, duration: number) {
  reportInstanaEvent('api_call', {
    endpoint,
    method,
    status,
    duration,
    success: status >= 200 && status < 300,
  });
}

/**
 * Helper function to track user actions
 */
export function trackUserAction(action: string, details?: Record<string, any>) {
  reportInstanaEvent('user_action', {
    action,
    ...details,
  });
}

/**
 * Helper function to track business metrics
 */
export function trackBusinessMetric(metric: string, value: number, unit?: string) {
  reportInstanaEvent('business_metric', {
    metric,
    value,
    unit,
  });
}

// Made with Bob
