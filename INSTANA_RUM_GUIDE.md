# Instana Real User Monitoring (RUM) for Watson Orchestrate

## Overview

This guide explains how Instana Real User Monitoring (RUM) is configured to track Watson Orchestrate interactions in the Sales Terminal Best Practices application.

## Why RUM Instead of Backend Monitoring?

Watson Orchestrate is a **client-side chat widget** that makes API calls directly from the user's browser to Watson Orchestrate servers. These calls bypass our backend entirely, so traditional backend Instana instrumentation cannot capture them.

**Solution**: Use Instana RUM to track client-side events and user interactions with Watson Orchestrate.

## Architecture

```
┌─────────────────┐
│   User Browser  │
│                 │
│  ┌───────────┐  │
│  │  React    │  │
│  │  App      │  │
│  └─────┬─────┘  │
│        │        │
│        ├────────┼──────> Instana RUM (Custom Events)
│        │        │
│  ┌─────▼─────┐  │
│  │  Watson   │  │
│  │Orchestrate│  │
│  │  Widget   │  │
│  └─────┬─────┘  │
│        │        │
└────────┼────────┘
         │
         ▼
   Watson Orchestrate
   Cloud Service
```

## Implementation

### 1. RUM Utility Functions (`src/utils/instanaRUM.ts`)

```typescript
// Initialize Instana RUM
export const initInstanaRUM = () => {
  if (window.ineum) {
    console.log('✅ Instana RUM initialized');
  } else {
    console.warn('⚠️ Instana RUM not available');
  }
};

// Track Watson Orchestrate initialization
export const trackOrchestrateInit = (agentId: string, userEmail?: string) => {
  if (window.ineum) {
    window.ineum('reportEvent', 'watson_orchestrate_init', {
      provider: 'watson-orchestrate',
      agent_id: agentId,
      user_email: userEmail || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  }
};

// Track errors
export const trackOrchestrateError = (error: string, userEmail?: string) => {
  if (window.ineum) {
    window.ineum('reportEvent', 'watson_orchestrate_error', {
      provider: 'watson-orchestrate',
      error_message: error,
      user_email: userEmail || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  }
};
```

### 2. Integration in WatsonOrchestrate Component

```typescript
import { trackOrchestrateInit, trackOrchestrateError, initInstanaRUM } from '../utils/instanaRUM';

const WatsonOrchestrate = () => {
  useEffect(() => {
    const initializeWatson = async () => {
      try {
        // Initialize Instana RUM
        initInstanaRUM();
        
        // ... Watson Orchestrate setup ...
        
        // Track successful initialization
        trackOrchestrateInit(agentId, userEmail);
        
      } catch (error) {
        // Track errors
        trackOrchestrateError(`Error: ${error}`, userEmail);
      }
    };
    
    initializeWatson();
  }, []);
};
```

## Tracked Events

### 1. `watson_orchestrate_init`
Fired when Watson Orchestrate successfully initializes.

**Metadata:**
- `provider`: "watson-orchestrate"
- `agent_id`: Watson Orchestrate agent ID
- `user_email`: User's email from SSO
- `timestamp`: ISO 8601 timestamp

### 2. `watson_orchestrate_error`
Fired when an error occurs during initialization or operation.

**Metadata:**
- `provider`: "watson-orchestrate"
- `error_message`: Error description
- `user_email`: User's email from SSO
- `timestamp`: ISO 8601 timestamp

## Viewing RUM Data in Instana

### 1. Access RUM Dashboard

1. Log into Instana dashboard
2. Navigate to **Websites & Mobile Apps**
3. Select your application: `sales-terminal-best-practices`

### 2. View Custom Events

1. Go to **Events** tab
2. Filter by event name:
   - `watson_orchestrate_init`
   - `watson_orchestrate_error`

### 3. Create Custom Dashboard

```javascript
// Example dashboard query
{
  "eventType": "watson_orchestrate_init",
  "timeRange": "last_24_hours",
  "groupBy": "user_email"
}
```

### 4. Set Up Alerts

Create alerts for:
- High error rates: `watson_orchestrate_error` count > 10 in 5 minutes
- Initialization failures: No `watson_orchestrate_init` events in 1 hour

## Deployment Configuration

### Golden Path Deployment

The Instana RUM script is automatically injected by the Golden Path platform. No additional configuration needed in the deployment manifest.

### Environment Variables

No environment variables required for RUM tracking. The RUM script is loaded automatically in production.

### Verification

After deployment, verify RUM is working:

1. Open browser DevTools Console
2. Check for: `✅ Instana RUM initialized`
3. Interact with Watson Orchestrate
4. Check Instana dashboard for events within 1-2 minutes

## Troubleshooting

### RUM Not Tracking Events

**Symptom**: No events appearing in Instana dashboard

**Solutions**:
1. Check browser console for `window.ineum` availability
2. Verify Golden Path deployment includes RUM injection
3. Check network tab for Instana beacon requests
4. Ensure events are being fired (check console logs)

### Events Not Showing User Email

**Symptom**: Events show `user_email: "anonymous"`

**Solutions**:
1. Verify SSO authentication is working
2. Check `useAuth()` hook returns user email
3. Ensure user email is passed to tracking functions

### High Error Rate

**Symptom**: Many `watson_orchestrate_error` events

**Solutions**:
1. Check Watson Orchestrate configuration
2. Verify agent ID and environment ID are correct
3. Check network connectivity to Watson Orchestrate servers
4. Review error messages in event metadata

## Best Practices

### 1. Event Naming
- Use consistent naming: `watson_orchestrate_*`
- Include provider in metadata for filtering

### 2. Metadata
- Always include timestamp
- Include user context when available
- Add relevant IDs (agent_id, session_id, etc.)

### 3. Error Tracking
- Track all initialization errors
- Include error messages and stack traces
- Add user context for debugging

### 4. Performance
- RUM tracking is lightweight (< 1ms overhead)
- Events are batched and sent asynchronously
- No impact on user experience

## Metrics to Monitor

### Key Performance Indicators (KPIs)

1. **Initialization Success Rate**
   - Target: > 99%
   - Formula: `init_events / (init_events + error_events)`

2. **Time to Initialize**
   - Target: < 2 seconds
   - Measure: Time from page load to `watson_orchestrate_init`

3. **Error Rate**
   - Target: < 1%
   - Formula: `error_events / total_events`

4. **User Engagement**
   - Track: Number of unique users interacting with Watson Orchestrate
   - Measure: Distinct `user_email` values in events

## Future Enhancements

### Planned Features

1. **Message Tracking**
   - Track user messages sent to Watson Orchestrate
   - Track agent responses received
   - Measure response time

2. **Session Analytics**
   - Track session duration
   - Count messages per session
   - Identify popular queries

3. **User Journey Tracking**
   - Track navigation before/after Watson Orchestrate interaction
   - Identify common user flows
   - Measure conversion rates

### Implementation Example

```typescript
// Future: Track messages
export const trackOrchestrateMessage = (
  messageType: 'user' | 'agent',
  messageLength: number,
  userEmail?: string
) => {
  if (window.ineum) {
    window.ineum('reportEvent', 'watson_orchestrate_message', {
      provider: 'watson-orchestrate',
      message_type: messageType,
      message_length: messageLength,
      user_email: userEmail || 'anonymous',
      timestamp: new Date().toISOString(),
    });
  }
};
```

## Related Documentation

- [Instana RUM Documentation](https://www.ibm.com/docs/en/instana-observability/current?topic=instana-monitoring-websites)
- [Watson Orchestrate Documentation](https://www.ibm.com/docs/en/watson-orchestrate)
- [Golden Path Deployment Guide](https://pages.github.ibm.com/golden-path/docs/)

## Support

For issues or questions:
- **Instana**: Contact IBM Instana support team
- **Watson Orchestrate**: Contact Watson Orchestrate support
- **Application**: Create issue in GitHub repository

---

**Last Updated**: 2026-02-03  
**Version**: 1.0.0  
**Author**: Bob (AI Assistant)