/**
 * Instana Real User Monitoring (RUM) Utilities
 * 
 * Tracks client-side Watson Orchestrate interactions for observability.
 * These events appear in Instana's RUM dashboard under Custom Events.
 */

declare global {
  interface Window {
    ineum?: (...args: any[]) => void;
  }
}

/**
 * Track Watson Orchestrate chat initialization
 */
export const trackOrchestrateInit = (agentId: string, userEmail?: string) => {
  if (window.ineum) {
    window.ineum('reportEvent', 'watson_orchestrate_init', {
      provider: 'watson-orchestrate',
      agent_id: agentId,
      user_email: userEmail || 'anonymous',
      timestamp: Date.now(),
    });
    console.log('[Instana RUM] Tracked Orchestrate initialization');
  }
};

/**
 * Track Watson Orchestrate chat opened
 */
export const trackOrchestrateOpen = (userEmail?: string) => {
  if (window.ineum) {
    window.ineum('reportEvent', 'watson_orchestrate_open', {
      provider: 'watson-orchestrate',
      action: 'chat_opened',
      user_email: userEmail || 'anonymous',
      timestamp: Date.now(),
    });
    console.log('[Instana RUM] Tracked Orchestrate chat opened');
  }
};

/**
 * Track Watson Orchestrate message sent
 */
export const trackOrchestrateMessage = (messageLength: number, userEmail?: string) => {
  if (window.ineum) {
    window.ineum('reportEvent', 'watson_orchestrate_message', {
      provider: 'watson-orchestrate',
      action: 'message_sent',
      message_length: messageLength,
      user_email: userEmail || 'anonymous',
      timestamp: Date.now(),
    });
    console.log('[Instana RUM] Tracked Orchestrate message sent');
  }
};

/**
 * Track Watson Orchestrate error
 */
export const trackOrchestrateError = (error: string, userEmail?: string) => {
  if (window.ineum) {
    window.ineum('reportEvent', 'watson_orchestrate_error', {
      provider: 'watson-orchestrate',
      action: 'error',
      error_message: error,
      user_email: userEmail || 'anonymous',
      timestamp: Date.now(),
    });
    console.error('[Instana RUM] Tracked Orchestrate error:', error);
  }
};

/**
 * Check if Instana RUM is available
 */
export const isInstanaRUMAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ineum === 'function';
};

/**
 * Initialize Instana RUM tracking
 * Call this once when your app starts
 */
export const initInstanaRUM = () => {
  if (isInstanaRUMAvailable()) {
    console.log('[Instana RUM] Available and ready for tracking');
    return true;
  } else {
    console.warn('[Instana RUM] Not available - events will not be tracked');
    return false;
  }
};

// Made with Bob
