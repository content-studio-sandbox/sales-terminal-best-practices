# Real Terminal Setup Guide

This application includes a **real bash terminal** that executes actual commands on your system. Follow these steps to set it up.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
cd sales-terminal-best-practices
npm install
```

### 2. Install Terminal Server Dependencies

```bash
cd server
npm install
```

### 3. Start the Terminal Server

In one terminal window:

```bash
cd server
npm start
```

You should see:
```
Terminal WebSocket server running on port 3001
Terminal server initialized
```

### 4. Start the Frontend Application

In another terminal window:

```bash
cd sales-terminal-best-practices
npm run dev
```

The app will be available at: http://localhost:8081

## How It Works

1. **Frontend (React + xterm.js)**: Displays the terminal UI in the browser
2. **WebSocket Server (Node.js)**: Bridges the browser to a real shell process
3. **node-pty**: Creates a pseudo-terminal that spawns a real bash/shell process

## Architecture

```
Browser (xterm.js)
    ↓ WebSocket
Terminal Server (port 3001)
    ↓ node-pty
Real Bash Shell Process
```

## Features

✅ **Real Commands**: All bash commands work (ls, cd, mkdir, git, etc.)
✅ **Tab Completion**: Native shell tab completion
✅ **Command History**: Use ↑/↓ arrows to navigate history
✅ **Colors & Formatting**: Full ANSI color support
✅ **Interactive Programs**: Works with vim, nano, etc.

## Security Notes

⚠️ **Important**: This terminal has full access to your file system with your user permissions.

- Commands execute in your home directory
- Be careful with destructive commands (rm, mv, etc.)
- This is intended for learning and development only
- Do not expose the terminal server to the internet

## Troubleshooting

### Terminal Server Won't Start

**Error**: `Cannot find module 'node-pty'`

**Solution**: Make sure you installed dependencies in the server folder:
```bash
cd server
npm install
```

### Connection Failed in Browser

**Error**: "Disconnected - Terminal server is not running"

**Solution**: 
1. Check that the terminal server is running on port 3001
2. Look for error messages in the server terminal
3. Try restarting the server

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::3001`

**Solution**: Another process is using port 3001. Either:
- Stop the other process
- Change the port in `server/terminal-server.js` and `src/components/InteractiveTerminal.tsx`

## Development

### Changing the Port

1. Edit `server/terminal-server.js`:
```javascript
const PORT = 3002; // Change to your desired port
```

2. Edit `src/components/InteractiveTerminal.tsx`:
```javascript
const ws = new WebSocket('ws://localhost:3002'); // Match the port
```

### Customizing the Shell

By default, the server uses `bash` on Unix/Mac and `powershell.exe` on Windows.

To change the shell, edit `server/terminal-server.js`:
```javascript
const shell = 'zsh'; // or 'fish', 'sh', etc.
```

## Running in Production

⚠️ **Not Recommended**: This setup is for development/learning only.

For production use, you would need:
- Authentication and authorization
- Sandboxed environment (Docker container)
- Rate limiting
- Audit logging
- Network security (HTTPS, firewall rules)

## Learn More

- [xterm.js Documentation](https://xtermjs.org/)
- [node-pty GitHub](https://github.com/microsoft/node-pty)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)