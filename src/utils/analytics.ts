// Terminal analytics tracking utility
// Sends usage data to backend for Instana monitoring

interface AnalyticsEvent {
  event: string;
  data?: Record<string, any>;
}

/**
 * Send analytics event to backend
 * Events are logged and captured by Instana for monitoring
 */
export async function trackTerminalEvent(event: string, data?: Record<string, any>) {
  try {
    await fetch('/api/terminal-analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event, data }),
    });
  } catch (error) {
    // Silently fail - don't disrupt user experience
    console.debug('Analytics tracking failed:', error);
  }
}

/**
 * Track terminal session start
 */
export function trackSessionStart() {
  trackTerminalEvent('terminal_session_start', {
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track terminal session end
 */
export function trackSessionEnd(duration: number, commandCount: number) {
  trackTerminalEvent('terminal_session_end', {
    duration_seconds: Math.round(duration / 1000),
    command_count: commandCount,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track command execution
 */
export function trackCommand(command: string, success: boolean = true) {
  // Extract base command (first word)
  const baseCommand = command.trim().split(' ')[0];
  
  trackTerminalEvent('terminal_command_executed', {
    command: baseCommand,
    full_command: command,
    success,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track editor usage
 */
export function trackEditorUsage(editor: 'vim' | 'nano', action: 'open' | 'save' | 'close', filename?: string) {
  trackTerminalEvent('terminal_editor_usage', {
    editor,
    action,
    filename,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(feature: string, details?: Record<string, any>) {
  trackTerminalEvent('terminal_feature_used', {
    feature,
    ...details,
    timestamp: new Date().toISOString(),
  });
}

// Made with Bob
