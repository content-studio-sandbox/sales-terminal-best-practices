import express from 'express';
import { WebSocketServer } from 'ws';
import { spawn } from 'node-pty';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;

// Start HTTP server
const server = app.listen(PORT, () => {
  console.log(`Terminal WebSocket server running on port ${PORT}`);
});

// Create WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New terminal connection established');

  // Determine shell based on OS
  const shell = os.platform() === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/zsh';
  
  // Spawn a new terminal process
  const ptyProcess = spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME || process.env.USERPROFILE,
    env: process.env
  });

  console.log(`Spawned ${shell} process with PID: ${ptyProcess.pid}`);

  // Send terminal output to WebSocket client
  ptyProcess.onData((data) => {
    try {
      ws.send(data);
    } catch (err) {
      console.error('Error sending data to client:', err);
    }
  });

  // Handle terminal exit
  ptyProcess.onExit(({ exitCode, signal }) => {
    console.log(`Terminal process exited with code ${exitCode}, signal ${signal}`);
    ws.close();
  });

  // Receive input from WebSocket client and write to terminal
  ws.on('message', (msg) => {
    try {
      ptyProcess.write(msg.toString());
    } catch (err) {
      console.error('Error writing to terminal:', err);
    }
  });

  // Handle terminal resize
  ws.on('message', (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === 'resize') {
        ptyProcess.resize(data.cols, data.rows);
      }
    } catch (err) {
      // Not a resize message, ignore
    }
  });

  // Clean up on disconnect
  ws.on('close', () => {
    console.log('Terminal connection closed');
    ptyProcess.kill();
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    ptyProcess.kill();
  });
});

console.log('Terminal server initialized');