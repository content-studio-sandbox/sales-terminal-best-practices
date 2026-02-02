# Path Restriction Implementation Guide

## Overview
This guide explains how to restrict users to only access specific tabs/routes in your application. Users will be automatically redirected if they try to access unauthorized paths.

## What Was Implemented

### 1. RouteGuard Component
Created [`RouteGuard.tsx`](./src/components/RouteGuard.tsx) that wraps your application routes and enforces path restrictions.

### 2. Allowed Paths
Users can ONLY access these paths:
- `/` - Landing page
- `/training-resources` - Training resources
- `/interactive-terminal` - Interactive terminal simulation
- `/survey-results` - Survey results
- `/terminal-basics` - Terminal basics
- `/git-workflows` - Git workflows

### 3. Blocked Paths
Users will be redirected if they try to access:
- `/ssh-best-practices` ❌
- `/vim-best-practices` ❌
- `/openshift-best-practices` ❌
- `/api-authentication` ❌
- `/cpd-cli` ❌
- `/agentic-tools` ❌
- Any other unlisted path ❌

## How It Works

1. **Route Guard Wrapper**: The `RouteGuard` component wraps all routes in [`App.tsx`](./src/App.tsx)
2. **Path Checking**: On every navigation, it checks if the current path is in the allowed list
3. **Automatic Redirect**: If the path is not allowed, users are redirected to `/training-resources`
4. **Console Warning**: A warning is logged when access is denied (helpful for debugging)

## Configuration

### Enable/Disable Restrictions
In [`RouteGuard.tsx`](./src/components/RouteGuard.tsx), change the feature flag:

```typescript
// Set to true to enforce restrictions
const ENABLE_PATH_RESTRICTIONS = true;

// Set to false to allow all paths (for testing/admin access)
const ENABLE_PATH_RESTRICTIONS = false;
```

### Modify Allowed Paths
Edit the `ALLOWED_PATHS` array in [`RouteGuard.tsx`](./src/components/RouteGuard.tsx):

```typescript
const ALLOWED_PATHS = [
  '/training-resources',
  '/interactive-terminal',
  '/survey-results',
  '/terminal-basics',
  '/git-workflows',
  '/',
  // Add more paths here as needed
];
```

## Testing

### Test Allowed Paths
Navigate to these URLs - they should work:
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/training-resources
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/interactive-terminal
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/survey-results
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/terminal-basics
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/git-workflows

### Test Blocked Paths
Navigate to these URLs - they should redirect to `/training-resources`:
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/ssh-best-practices
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/vim-best-practices
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/openshift-best-practices
- https://sales-terminal-best-practices-np.dinero.techzone.ibm.com/api-authentication

### Check Browser Console
Open browser DevTools (F12) and check the Console tab. You should see warnings like:
```
Access denied to path: /ssh-best-practices. Redirecting to /training-resources
```

## Advanced: Role-Based Access Control

If you need different access levels for different users, you can extend the RouteGuard:

```typescript
// Example: Check user role from OAuth2 headers or context
const userRole = getUserRole(); // Implement this based on your auth system

const ROLE_PERMISSIONS = {
  'restricted': ['/training-resources', '/interactive-terminal', '/survey-results', '/terminal-basics', '/git-workflows'],
  'standard': ['/training-resources', '/interactive-terminal', '/survey-results', '/terminal-basics', '/git-workflows', '/ssh-best-practices'],
  'admin': ['*'], // All paths
};

const allowedPaths = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS['restricted'];
```

## Hiding Navigation Links

To improve UX, you should also hide navigation links to restricted pages. Update your navigation component:

```typescript
// Example: In your navigation/header component
const ALLOWED_NAV_ITEMS = [
  { path: '/training-resources', label: 'Training Resources' },
  { path: '/interactive-terminal', label: 'Interactive Terminal' },
  { path: '/survey-results', label: 'Survey Results' },
  { path: '/terminal-basics', label: 'Terminal Basics' },
  { path: '/git-workflows', label: 'Git Workflows' },
];

// Only render these navigation items
```

## Deployment

### Build and Deploy
```bash
# Build the application
npm run build

# Deploy using your existing deployment process
# The RouteGuard will be included in the build
```

### No Server-Side Changes Needed
This is a **client-side** restriction that works with your existing OAuth2 setup. No changes to the Kubernetes deployment are required.

## Security Considerations

### ⚠️ Important Security Notes

1. **Client-Side Only**: This restriction is enforced in the browser. Tech-savvy users could potentially bypass it by:
   - Modifying the JavaScript code
   - Using browser DevTools
   - Making direct API calls

2. **Not a Security Boundary**: This is a **UX feature** to guide users, not a security control.

3. **For True Security**: If you need to prevent access at the server level, you must:
   - Implement server-side authorization checks
   - Use OAuth2 scopes/claims to determine user permissions
   - Add middleware to validate access before serving content

### Recommended Security Approach

For production security, combine both approaches:

1. **Client-Side (Current)**: Guide users and provide good UX
2. **Server-Side**: Add authorization middleware to your backend:

```javascript
// Example Express.js middleware
function checkPathAccess(req, res, next) {
  const allowedPaths = ['/training-resources', '/interactive-terminal', ...];
  const userPath = req.path;
  
  if (!allowedPaths.some(p => userPath.startsWith(p))) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
}
```

## Troubleshooting

### Issue: Restrictions not working
- Clear browser cache and hard reload (Ctrl+Shift+R)
- Check that `ENABLE_PATH_RESTRICTIONS` is set to `true`
- Verify the build includes the latest changes

### Issue: Infinite redirect loop
- Ensure the redirect target (`/training-resources`) is in the allowed paths list
- Check browser console for errors

### Issue: Users can still access blocked pages
- Remember this is client-side only
- Implement server-side checks for true security
- Consider adding API-level authorization

## Summary

✅ **What's Protected**: Navigation between pages in the React app
✅ **How**: Client-side route guard with automatic redirect
✅ **Easy to Configure**: Simple array of allowed paths
✅ **Feature Flag**: Can be easily enabled/disabled

❌ **Not Protected**: Direct API calls, server-side resources
❌ **Not Secure**: Can be bypassed by modifying client code
❌ **Not Persistent**: Resets on page reload if user modifies code

For a complete security solution, combine this with server-side authorization checks.