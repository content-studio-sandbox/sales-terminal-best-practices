import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { AttachAddon } from "@xterm/addon-attach";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import { Button, InlineNotification } from "@carbon/react";
import { Restart, Checkmark, WarningAlt } from "@carbon/icons-react";

interface InteractiveTerminalProps {
  welcomeMessage?: string;
}

export default function InteractiveTerminal({ 
  welcomeMessage = "Connecting to real bash terminal..."
}: InteractiveTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    // Create terminal instance
    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "'IBM Plex Mono', monospace",
      theme: {
        background: "#161616",
        foreground: "#f4f4f4",
        cursor: "#0f62fe",
      },
      rows: 24,
      cols: 80,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Show welcome message
    term.writeln(welcomeMessage);
    term.writeln("");

    // Connect to WebSocket server
    const ws = new WebSocket('ws://localhost:3001');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnectionStatus('connected');
      term.writeln('\x1b[32m✓ Connected to terminal server\x1b[0m');
      term.writeln('');
      
      // Attach WebSocket to terminal
      const attachAddon = new AttachAddon(ws);
      term.loadAddon(attachAddon);
      
      // Send terminal size to server
      ws.send(JSON.stringify({
        type: 'resize',
        cols: term.cols,
        rows: term.rows
      }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('disconnected');
      term.writeln('\x1b[31m✗ Connection error\x1b[0m');
      term.writeln('Make sure the terminal server is running on port 3001');
      term.writeln('Run: cd server && npm start');
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      setConnectionStatus('disconnected');
      term.writeln('\x1b[33m⚠ Connection closed\x1b[0m');
    };

    // Handle terminal resize
    const handleResize = () => {
      fitAddon.fit();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'resize',
          cols: term.cols,
          rows: term.rows
        }));
      }
    };

    // Listen for resize events
    term.onResize(({ cols, rows }) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          type: 'resize',
          cols,
          rows
        }));
      }
    });

    window.addEventListener("resize", handleResize);
    
    // Focus terminal when clicked
    const handleClick = () => {
      term.focus();
    };
    terminalRef.current.addEventListener("click", handleClick);

    // Focus terminal on mount
    term.focus();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (terminalRef.current) {
        terminalRef.current.removeEventListener("click", handleClick);
      }
      ws.close();
      term.dispose();
    };
  }, [welcomeMessage]);

  const handleReconnect = () => {
    if (xtermRef.current && wsRef.current) {
      wsRef.current.close();
      setConnectionStatus('connecting');
      
      // Reconnect after a short delay
      setTimeout(() => {
        const ws = new WebSocket('ws://localhost:3001');
        wsRef.current = ws;

        ws.onopen = () => {
          setConnectionStatus('connected');
          xtermRef.current?.writeln('\x1b[32m✓ Reconnected to terminal server\x1b[0m');
          xtermRef.current?.writeln('');
          
          const attachAddon = new AttachAddon(ws);
          xtermRef.current?.loadAddon(attachAddon);
        };

        ws.onerror = () => {
          setConnectionStatus('disconnected');
          xtermRef.current?.writeln('\x1b[31m✗ Reconnection failed\x1b[0m');
        };

        ws.onclose = () => {
          setConnectionStatus('disconnected');
        };
      }, 500);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Connection Status */}
      <div style={{ marginBottom: "1rem" }}>
        {connectionStatus === 'connecting' && (
          <InlineNotification
            kind="info"
            title="Connecting"
            subtitle="Establishing connection to terminal server..."
            hideCloseButton
            lowContrast
          />
        )}
        {connectionStatus === 'connected' && (
          <InlineNotification
            kind="success"
            title="Connected"
            subtitle="Real bash terminal is ready. Try commands like: ls, pwd, mkdir, cd, git status"
            hideCloseButton
            lowContrast
          />
        )}
        {connectionStatus === 'disconnected' && (
          <div>
            <InlineNotification
              kind="error"
              title="Disconnected"
              subtitle="Terminal server is not running. Start it with: cd server && npm start"
              hideCloseButton
              lowContrast
            />
            <Button
              kind="ghost"
              size="sm"
              renderIcon={Restart}
              onClick={handleReconnect}
              style={{ marginTop: "0.5rem" }}
            >
              Reconnect
            </Button>
          </div>
        )}
      </div>

      {/* Terminal */}
      <div 
        ref={terminalRef}
        style={{
          backgroundColor: "#161616",
          padding: "1rem",
          borderRadius: "4px",
          border: "1px solid #393939",
          minHeight: "500px"
        }}
      />
    </div>
  );
}