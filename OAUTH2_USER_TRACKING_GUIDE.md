# OAuth2 User Tracking with Instana Integration

## Overview
This guide explains how the application extracts authenticated user information from OAuth2 headers and passes it to Instana for user tracking and analytics.

## Architecture

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OAuth2 Proxy   │ ← Authenticates user, sets headers
│  (Port 4180)    │
└────────┬────────┘
         │ x-auth-request-email: user@ibm.com
         │ x-auth-request-user: John Doe
         ▼
┌─────────────────┐
│  Frontend App   │ ← Calls /api/user-info
│  (Port 8080)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Express API    │ ← Extracts headers, returns user info
│  (Port 3000)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Instana EUM    │ ← Tracks user sessions
└─────────────────┘
```

## Implementation Details

### 1. OAuth2 Proxy Configuration
The deployment already has OAuth2-proxy configured with these critical flags:
```yaml
args:
  - '--set-authorization-header=true'  # Pass auth headers to upstream
  - '--pass-access-token=true'         # Pass access token
  - '--set-xauthrequest=true'          # Set x-auth-request-* headers
```

These flags ensure OAuth2-proxy sets headers like:
- `x-auth-request-email`: User's email address
- `x-auth-request-user`: User's display name
- `x-auth-request-preferred-username`: Username

### 2. Express API Server
Created [`api/server.js`](./api/server.js) that:
- Extracts user info from OAuth2 headers
- Provides `/api/user-info` endpoint
- Logs user activity for Instana capture

**Key Functions:**
```javascript
function getUserEmailFromHeaders(req) {
  return (
    req.get('x-auth-request-email') ||
    req.get('x-forwarded-email') ||
    req.get('x-auth-request-preferred-username') ||
    ''
  );
}
```

### 3. Frontend Integration
Updated [`src/App.tsx`](./src/App.tsx) to:
- Fetch user info from `/api/user-info` on app load
- Pass authenticated user data to Instana via `useInstana` hook
- Fall back to anonymous session if OAuth2 not available

**User Info Flow:**
```typescript
useEffect(() => {
  const fetchUserInfo = async () => {
    const response = await fetch('/api/user-info', {
      credentials: 'include', // Include OAuth2 cookies
    });
    
    const data = await response.json();
    
    if (data.email) {
      // User authenticated - pass to Instana
      setSessionUser({
        id: data.email,
        name: data.name || data.email,
        email: data.email,
        role: 'authenticated_user'
      });
    }
  };
  
  fetchUserInfo();
}, []);
```

### 4. Instana Integration
The existing [`useInstana`](./src/hooks/useInstana.ts) hook receives user info and:
- Sets user identity in Instana: `window.ineum('user', userId, userName, userEmail)`
- Tracks user role as metadata
- Captures console logs and errors with user context

## Deployment Configuration

### Current Deployment Structure
```yaml
spec:
  containers:
    - name: app
      image: sales-terminal-best-practices:latest
      ports:
        - containerPort: 3000  # Express API
        - containerPort: 8080  # Frontend (served by 'serve')
      
    - name: oauth2-proxy
      image: quay.io/oauth2-proxy/oauth2-proxy:v7.6.0
      ports:
        - containerPort: 4180
      args:
        - '--upstream=http://localhost:8080'  # Frontend
        - '--set-xauthrequest=true'           # Critical for headers
```

### Important Notes

1. **OAuth2-proxy upstream**: Points to `http://localhost:8080` (frontend)
2. **API calls**: Frontend makes requests to `/api/*` which are proxied through OAuth2-proxy
3. **Header propagation**: OAuth2-proxy forwards headers to both frontend and API requests

### Service Configuration
The Kubernetes Service should expose port 4180 (OAuth2-proxy):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: sales-terminal-best-practices
spec:
  ports:
    - name: http
      port: 80
      targetPort: 4180  # OAuth2-proxy port
  selector:
    app: sales-terminal-best-practices
```

## Testing

### 1. Test API Endpoint Locally
```bash
# Start API server
cd api
npm install
npm start

# In another terminal, test with mock headers
curl -H "x-auth-request-email: test@ibm.com" \
     -H "x-auth-request-user: Test User" \
     http://localhost:3000/api/user-info
```

Expected response:
```json
{
  "email": "test@ibm.com",
  "name": "Test User",
  "authenticated": true
}
```

### 2. Test in Production
After deployment, check browser console:
```javascript
// Should see logs like:
[OAuth2] User authenticated: { email: "user@ibm.com", name: "John Doe" }
[Instana] User tracking enabled: { userId: "user@ibm.com", userName: "John Doe", ... }
```

### 3. Verify in Instana
1. Open Instana dashboard
2. Navigate to Website Monitoring
3. Check "User Sessions" - you should see sessions tagged with user emails
4. Filter by user email to see specific user activity

## What Instana Tracks

With this implementation, Instana will track:

### User Identity
- **User ID**: Email address from OAuth2
- **User Name**: Display name from OAuth2
- **User Role**: "authenticated_user" or "visitor"

### User Actions
- Page views with user context
- Navigation between tabs
- Time spent on each page
- Click events and interactions

### Performance Metrics (per user)
- Page load times
- API call latency
- JavaScript errors
- Console warnings

### Business Metrics
- Which users access which training resources
- Most popular pages per user
- User engagement patterns
- Error rates by user

## Troubleshooting

### Issue: User info not appearing in Instana

**Check 1: OAuth2 headers**
```bash
# SSH into the pod
kubectl exec -it <pod-name> -c app -- sh

# Check if headers are being received
# (Add temporary logging in api/server.js)
```

**Check 2: API endpoint**
```bash
# Test the API endpoint
kubectl port-forward <pod-name> 3000:3000
curl http://localhost:3000/api/user-info
```

**Check 3: Frontend logs**
Open browser DevTools Console and look for:
- `[OAuth2] User authenticated:` - Should show user info
- `[Instana] User tracking enabled:` - Should show Instana received user data

### Issue: API returns null email

**Possible causes:**
1. OAuth2-proxy not configured with `--set-xauthrequest=true`
2. Headers not being forwarded to API
3. API container not receiving requests through OAuth2-proxy

**Solution:**
Verify deployment configuration includes:
```yaml
args:
  - '--set-xauthrequest=true'
  - '--set-authorization-header=true'
  - '--pass-access-token=true'
```

### Issue: Instana not showing user data

**Check:**
1. Instana EUM script is loaded (check `index.html`)
2. `window.ineum` function is available
3. User data is being passed to `useInstana` hook
4. Browser console shows Instana tracking logs

## Security Considerations

### Header Trust
- OAuth2-proxy is the **only** source of authentication headers
- API server trusts these headers because they come through OAuth2-proxy
- Never expose the API directly without OAuth2-proxy in front

### Data Privacy
- User emails are logged for debugging (consider removing in production)
- Instana receives user emails for session tracking
- Ensure compliance with data privacy policies (GDPR, etc.)

### Rate Limiting
Consider adding rate limiting to `/api/user-info`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Benefits

### For Developers
- Debug issues for specific users
- Track user journeys through the app
- Identify problematic user flows

### For Product Managers
- Understand which features users engage with
- Measure training effectiveness per user
- Identify power users vs. casual users

### For Support Teams
- Quickly find user sessions when investigating issues
- See exact user actions leading to errors
- Provide personalized support based on usage patterns

## Next Steps

1. **Deploy changes**: Build and deploy the updated Docker image
2. **Verify tracking**: Check Instana dashboard for user sessions
3. **Monitor logs**: Watch for OAuth2 and Instana log messages
4. **Iterate**: Add custom events for specific user actions

## Related Files

- [`src/App.tsx`](./src/App.tsx) - Frontend user info fetching
- [`src/hooks/useInstana.ts`](./src/hooks/useInstana.ts) - Instana integration
- [`api/server.js`](./api/server.js) - API server with header extraction
- [`Dockerfile`](./Dockerfile) - Multi-service container build
- [`PATH_RESTRICTION_GUIDE.md`](./PATH_RESTRICTION_GUIDE.md) - Path-based access control

## Made with Bob