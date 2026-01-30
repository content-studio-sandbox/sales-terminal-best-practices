# Instana Real User Monitoring (RUM) Integration

This document describes the Instana RUM integration for tracking user behavior, page views, and custom events in the FSM Technical Best Practices application.

## Overview

The application uses Instana's End User Monitoring (EUM) to track:
- **User Sessions**: Anonymous session tracking with unique session IDs
- **Page Views**: Automatic tracking of route changes and page navigation
- **User Actions**: Custom event tracking for button clicks and interactions
- **Performance Metrics**: Page load times, DOM ready times, and network performance
- **Error Tracking**: Console errors, warnings, and unhandled exceptions

## Architecture

### Core Components

1. **`src/hooks/useInstana.ts`** - Main hook for Instana integration
   - User tracking and session management
   - Console error/warning capture
   - Global error and promise rejection handling
   - Helper functions for custom events

2. **`src/RouteTracking.tsx`** - Route change tracking component
   - Automatic page view tracking
   - Page type categorization
   - Performance metrics collection
   - Route metadata tracking

3. **`src/App.tsx`** - Integration point
   - Session ID generation and management
   - Hook initialization with user data
   - RouteTracking component integration

## Configuration

### Instana Script (index.html)

The Instana EUM script is loaded in `index.html`:

```html
<script>
  (function(s,t,a,n){s[t]||(s[t]=a,n=s[a]=function(){n.q.push(arguments)},
  n.q=[],n.v=2,n.l=1*new Date)})(window,"InstanaEumObject","ineum");
  ineum('reportingUrl', 'https://eum-blue-saas.instana.io');
  ineum('key', 'YOUR_INSTANA_KEY');
  ineum('trackSessions');
</script>
<script async crossorigin="anonymous" src="https://eum.instana.io/eum.min.js"></script>
```

### Session Management

Anonymous users are tracked with unique session IDs stored in `sessionStorage`:

```typescript
// Generated format: session_1234567890_abc123xyz
const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
sessionStorage.setItem('instana_session_id', sessionId);
```

## Usage Examples

### 1. Tracking User Actions

Import and use the `trackUserAction` helper in any component:

```typescript
import { trackUserAction } from '../hooks/useInstana';

const handleButtonClick = () => {
  trackUserAction('button_click', {
    button: 'Start Learning',
    destination: '/terminal-basics',
    page: 'landing'
  });
  navigate('/terminal-basics');
};
```

### 2. Tracking API Calls

```typescript
import { trackApiCall } from '../hooks/useInstana';

const fetchData = async () => {
  const startTime = Date.now();
  try {
    const response = await fetch('/api/data');
    const duration = Date.now() - startTime;
    trackApiCall('/api/data', 'GET', response.status, duration);
    return response.json();
  } catch (error) {
    const duration = Date.now() - startTime;
    trackApiCall('/api/data', 'GET', 0, duration);
    throw error;
  }
};
```

### 3. Tracking Business Metrics

```typescript
import { trackBusinessMetric } from '../hooks/useInstana';

// Track survey completion
trackBusinessMetric('survey_completed', 1, 'count');

// Track time spent on page
trackBusinessMetric('time_on_page', 45, 'seconds');
```

### 4. Setting Custom Metadata

```typescript
import { setInstanaMeta } from '../hooks/useInstana';

// Set user preferences
setInstanaMeta('theme', 'dark');
setInstanaMeta('language', 'en');
```

### 5. Reporting Custom Events

```typescript
import { reportInstanaEvent } from '../hooks/useInstana';

// Track feature usage
reportInstanaEvent('feature_used', {
  feature: 'interactive_terminal',
  command: 'ls -la',
  success: true
});
```

## Tracked Events

### Automatic Events

1. **Page Views** (`route_change`)
   - Path, search params, full URL
   - Page type categorization
   - User role (visitor)
   - Authentication status

2. **Performance Metrics** (`page_performance`)
   - Total load time
   - DOM ready time
   - DNS lookup time
   - TCP connection time
   - Request/response time

3. **Console Errors** (`console_error`)
   - Error message
   - Timestamp
   - Stack trace (if available)

4. **Console Warnings** (`console_warn`)
   - Warning message
   - Timestamp

5. **Unhandled Rejections** (`unhandled_rejection`)
   - Rejection reason
   - Timestamp

6. **Global Errors** (`global_error`)
   - Error message
   - Filename
   - Line and column numbers
   - Timestamp

### Custom Events (Example)

1. **User Actions** (`user_action`)
   - Button clicks
   - Form submissions
   - Navigation events

2. **API Calls** (`api_call`)
   - Endpoint
   - HTTP method
   - Status code
   - Duration
   - Success/failure

3. **Business Metrics** (`business_metric`)
   - Metric name
   - Value
   - Unit

## Page Type Categorization

Routes are automatically categorized for better analytics:

| Route | Page Type |
|-------|-----------|
| `/` | landing |
| `/terminal-basics` | terminal-basics |
| `/git-workflows` | git-workflows |
| `/ssh-best-practices` | ssh-best-practices |
| `/vim-best-practices` | vim-best-practices |
| `/openshift-best-practices` | openshift-best-practices |
| `/interactive-terminal` | interactive-terminal |
| `/api-authentication` | api-authentication |
| `/cpd-cli` | cpd-cli |
| `/agentic-tools` | agentic-tools |
| `/survey-results` | survey-results |

## Viewing Data in Instana

### 1. Access Instana Dashboard
Navigate to your Instana instance and select "Websites & Mobile Apps"

### 2. View User Sessions
- Filter by session ID to see individual user journeys
- View page views, actions, and errors per session

### 3. Analyze Custom Events
- Go to "Events" tab
- Filter by event type (e.g., `user_action`, `route_change`)
- View event details and metadata

### 4. Monitor Performance
- Check page load times by route
- Identify slow pages and bottlenecks
- Monitor error rates

### 5. Create Dashboards
- Create custom dashboards for key metrics
- Set up alerts for error thresholds
- Track business KPIs

## Best Practices

1. **Event Naming**: Use consistent, descriptive event names
   - Good: `button_click`, `form_submit`, `api_call`
   - Bad: `click`, `submit`, `call`

2. **Metadata**: Include relevant context in event data
   ```typescript
   trackUserAction('button_click', {
     button: 'Start Learning',
     destination: '/terminal-basics',
     page: 'landing',
     timestamp: new Date().toISOString()
   });
   ```

3. **Performance**: Avoid tracking too frequently
   - Debounce scroll events
   - Throttle mouse movements
   - Batch similar events

4. **Privacy**: Don't track sensitive information
   - No passwords or tokens
   - No personal identifiable information (PII)
   - Use session IDs instead of user emails

5. **Error Handling**: Always wrap tracking in try-catch
   ```typescript
   try {
     trackUserAction('action', data);
   } catch (error) {
     // Silently fail - don't break user experience
   }
   ```

## Troubleshooting

### Events Not Appearing

1. Check browser console for Instana warnings
2. Verify Instana script is loaded: `window.ineum`
3. Check network tab for EUM requests
4. Verify reporting URL and key are correct

### Session Not Tracked

1. Check sessionStorage for `instana_session_id`
2. Verify `ineum('trackSessions')` is called
3. Check browser console for user tracking logs

### Performance Issues

1. Reduce event frequency
2. Use event batching
3. Implement sampling for high-traffic events

## Testing

### Browser Console

Test Instana integration in browser console:

```javascript
// Check if Instana is loaded
console.log(window.ineum);

// Manually trigger event
window.ineum('reportEvent', 'test_event', { test: true });

// Check session ID
console.log(sessionStorage.getItem('instana_session_id'));
```

### Network Tab

1. Open browser DevTools → Network tab
2. Filter by "eum.instana.io"
3. Verify beacon requests are being sent
4. Check request payload for event data

## Additional Resources

- [Instana EUM Documentation](https://www.ibm.com/docs/en/instana-observability/current?topic=instana-end-user-monitoring)
- [Instana JavaScript API](https://www.ibm.com/docs/en/instana-observability/current?topic=monitoring-javascript-api)
- [Best Practices Guide](https://www.ibm.com/docs/en/instana-observability/current?topic=monitoring-best-practices)

## Support

For issues or questions:
1. Check Instana documentation
2. Review browser console for errors
3. Contact Instana support team
4. Review this documentation

---

**Last Updated**: January 30, 2026  
**Version**: 1.0.0  
**Maintained By**: FSM Technical Team