# Deployment Changes Summary

## What Changed

This deployment adds OAuth2 user tracking with Instana integration, matching the pattern used in your-projects.

### 1. Architecture Change: Frontend → Fullstack

**Before:**
- `kind: frontend` - Static files only
- No backend server
- No user tracking

**After:**
- `kind: fullstack` - Express backend + static frontend
- Backend extracts OAuth2 headers
- User tracking via Instana

### 2. Files Added/Modified

#### New Files
- `api/server.js` - Express server that:
  - Serves static frontend files
  - Provides `/api/user-info` endpoint
  - Extracts OAuth2 headers (x-auth-request-email, x-auth-request-user)
  
- `api/package.json` - Backend dependencies (express, cors)

- `src/components/RouteGuard.tsx` - Path restriction component

- `OAUTH2_USER_TRACKING_GUIDE.md` - Complete documentation

- `PATH_RESTRICTION_GUIDE.md` - Path restriction documentation

- `DEPLOYMENT_CHANGES.md` - This file

#### Modified Files
- `.goldenpath.yml` - Changed from `frontend` to `fullstack`
- `Dockerfile` - Updated to match your-projects pattern (single container with backend serving frontend)
- `src/App.tsx` - Added OAuth2 user info fetching and Instana integration

### 3. How It Works

```
User Request
    ↓
OAuth2-Proxy (port 4180)
    ↓ (sets x-auth-request-email header)
Express Backend (port 3000)
    ↓
    ├─→ /api/user-info → Returns user email/name
    └─→ /* → Serves static frontend files
         ↓
    Frontend calls /api/user-info
         ↓
    Passes user info to Instana
```

### 4. Key Configuration

#### .goldenpath.yml
```yaml
kind: fullstack          # Changed from 'frontend'
backend:
  path: api
  port: 3000
oauth2_args:
  - "--skip-provider-button=true"
  - "--skip-auth-regex=^/(terminal-basics|training-resources|...)(/.*)?$"
```

#### Dockerfile
- Matches your-projects pattern exactly
- Single container with Node.js
- Backend serves both API and static files
- No nginx needed

#### OAuth2 Headers
The backend extracts these headers set by OAuth2-proxy:
- `x-auth-request-email` - User's email
- `x-auth-request-user` - User's display name
- `x-forwarded-email` - Fallback email header

### 5. What Instana Will Track

With authenticated users:
- **User Identity**: Email and name from OAuth2
- **User Sessions**: Individual user journeys
- **Page Views**: Which pages each user visits
- **Performance**: Load times per user
- **Errors**: JavaScript errors with user context

### 6. Path Restrictions

Users are restricted to these paths only:
- `/training-resources`
- `/interactive-terminal`
- `/survey-results`
- `/terminal-basics`
- `/git-workflows`
- `/` (landing page)

Attempts to access other paths redirect to `/training-resources`.

## Testing Checklist

After deployment, verify:

### 1. Basic Functionality
- [ ] App loads at https://sales-terminal-best-practices-np.dinero.techzone.ibm.com
- [ ] OAuth2 login works
- [ ] All allowed pages are accessible

### 2. User Tracking
- [ ] Check browser console for: `[OAuth2] User authenticated: { email: "...", name: "..." }`
- [ ] Check browser console for: `[Instana] User tracking enabled: { userId: "...", ... }`
- [ ] Verify in Instana dashboard that user sessions appear with email addresses

### 3. Path Restrictions
- [ ] Try accessing `/ssh-best-practices` - should redirect to `/training-resources`
- [ ] Try accessing `/vim-best-practices` - should redirect to `/training-resources`
- [ ] Allowed paths work without redirect

### 4. API Endpoints
```bash
# Test user info endpoint (should return your email)
curl https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/api/user-info

# Test health check
curl https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/api/health
```

## Rollback Plan

If issues occur, revert these commits:
1. Restore `.goldenpath.yml` to `kind: frontend`
2. Restore original `Dockerfile` (nginx-based)
3. Remove `api/` directory
4. Revert `src/App.tsx` changes

## Comparison with your-projects

This implementation matches your-projects exactly:

| Aspect | your-projects | sales-terminal-best-practices |
|--------|---------------|-------------------------------|
| Architecture | Fullstack | Fullstack ✅ |
| Backend | Express serving static + API | Express serving static + API ✅ |
| OAuth2 Headers | x-auth-request-email | x-auth-request-email ✅ |
| User Tracking | Instana with user email | Instana with user email ✅ |
| Dockerfile | Single Node.js container | Single Node.js container ✅ |
| .goldenpath.yml | kind: fullstack | kind: fullstack ✅ |

## Expected Behavior

### On First Load
1. OAuth2-proxy authenticates user
2. Frontend loads
3. Frontend calls `/api/user-info`
4. Backend extracts email from OAuth2 headers
5. Frontend receives user info
6. Frontend passes user info to Instana
7. Instana tracks user session with email

### On Navigation
1. RouteGuard checks if path is allowed
2. If allowed: render page
3. If not allowed: redirect to `/training-resources`
4. Instana tracks page view with user context

## Support

For issues:
1. Check browser console for errors
2. Check pod logs: `kubectl logs <pod-name> -c app`
3. Verify OAuth2 headers are being set
4. Check Instana dashboard for user sessions

## Made with Bob