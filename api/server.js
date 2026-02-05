// api/server.js - Express server to serve frontend and extract OAuth2 user info

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/**
 * Extract user email from OAuth2 proxy headers
 * OAuth2-proxy sets these headers when --set-xauthrequest=true is configured
 */
function getUserEmailFromHeaders(req) {
  return (
    req.get('x-auth-request-email') ||
    req.get('x-forwarded-email') ||
    req.get('x-auth-request-preferred-username') ||
    ''
  );
}

/**
 * Extract user name from OAuth2 proxy headers
 */
function getUserNameFromHeaders(req) {
  return (
    req.get('x-auth-request-user') ||
    req.get('x-forwarded-user') ||
    req.get('x-auth-request-preferred-username') ||
    req.get('x-auth-request-name') ||
    ''
  );
}

/**
 * Endpoint to get current user info from OAuth2 headers
 * This is called by the frontend to identify the authenticated user
 */
app.get('/api/user-info', (req, res) => {
  const email = getUserEmailFromHeaders(req);
  const name = getUserNameFromHeaders(req);
  
  // Log for debugging (will be captured by Instana if configured)
  console.log('[User Info Request]', {
    email: email || 'anonymous',
    name: name || 'anonymous',
    headers: {
      'x-auth-request-email': req.get('x-auth-request-email'),
      'x-auth-request-user': req.get('x-auth-request-user'),
      'x-forwarded-email': req.get('x-forwarded-email'),
    },
    timestamp: new Date().toISOString(),
  });
  
  res.json({
    email: email || null,
    name: name || null,
    authenticated: !!email,
  });
});

/**
 * Log terminal usage analytics
 * Tracks user interactions with the interactive terminal
 */
app.post('/api/terminal-analytics', (req, res) => {
  const email = getUserEmailFromHeaders(req);
  const name = getUserNameFromHeaders(req);
  const { event, data } = req.body;
  
  // Log analytics event (will be captured by Instana)
  console.log('[Terminal Analytics]', {
    event,
    user: {
      email: email || 'anonymous',
      name: name || 'anonymous',
    },
    data,
    timestamp: new Date().toISOString(),
    userAgent: req.get('user-agent'),
  });
  
  res.json({ success: true });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'sales-terminal-best-practices-api',
  });
});

/**
 * Serve static frontend files
 * This must come AFTER API routes
 *
 * Golden Path builds frontend to /app/web/dist in production
 * For local development, falls back to ../dist
 */
const WEB_ROOT = process.env.WEB_ROOT || "/app/web/dist";
console.log('[Server] Serving static files from:', WEB_ROOT, 'exists?', fs.existsSync(WEB_ROOT));

app.use(express.static(WEB_ROOT));

/**
 * SPA fallback - serve index.html for all non-API routes
 * This enables client-side routing
 */
app.get('*', (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      error: 'API endpoint not found',
      path: req.path,
    });
  }
  
  // Serve React app for all other routes
  const indexFile = path.join(WEB_ROOT, 'index.html');
  res.sendFile(indexFile, (err) => {
    if (err) {
      console.error('[Server] Error serving index.html:', err);
      res.status(500).end();
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[Server] User info: http://localhost:${PORT}/api/user-info`);
});

// Made with Bob