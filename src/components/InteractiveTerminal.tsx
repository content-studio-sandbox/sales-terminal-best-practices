import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import { Button } from "@carbon/react";
import { Restart, Copy } from "@carbon/icons-react";

interface InteractiveTerminalProps {
  initialCommands?: string[];
  welcomeMessage?: string;
}

export default function InteractiveTerminal({ 
  initialCommands = [],
  welcomeMessage = "Welcome to the Interactive Terminal! Type 'help' for available commands."
}: InteractiveTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [currentLine, setCurrentLine] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentDir, setCurrentDir] = useState("/home/sales-user/projects");

  const [fileSystem, setFileSystem] = useState<Record<string, string[]>>({
    "/home/sales-user/projects": ["project1/", "project2/", "README.md", "notes.txt"]
  });

  const commands: Record<string, (args?: string) => string> = {
    help: () => `Available commands:
  help            - Show this help message
  clear           - Clear the terminal
  whoami          - Display current user
  pwd             - Print working directory
  ls [-la]        - List files and directories (supports -l, -a, -la flags)
  cd [dir]        - Change directory
  mkdir [name]    - Create a new directory
  touch [name]    - Create a new file
  cat [file]      - Display file contents
  echo [text]     - Echo text back
  date            - Show current date and time
  git status      - Show git status (demo)
  git clone [url] - Clone a repository (demo)
  git log         - Show git log (demo)
  ssh demo        - Demo SSH connection
  history         - Show command history`,
    
    clear: () => {
      xtermRef.current?.clear();
      return "";
    },
    
    whoami: () => "sales-user",
    
    pwd: () => currentDir,
    
    ls: (args?: string) => {
      const files = fileSystem[currentDir] || [];
      if (files.length === 0) return "Directory is empty";
      
      // Handle -la, -l, -a flags
      if (args && (args.includes("-l") || args.includes("-a"))) {
        return files.map(f => {
          const isDir = f.endsWith("/");
          const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
          const size = isDir ? "4096" : "1024";
          const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          return `${perms}  1 sales-user  staff  ${size}  ${date}  ${f}`;
        }).join("\n");
      }
      
      return files.join("\n");
    },
    
    cd: (args?: string) => {
      if (!args || !args.trim()) {
        setCurrentDir("/home/sales-user/projects");
        return "";
      }
      
      const target = args.trim();
      if (target === "..") {
        const parts = currentDir.split("/").filter(p => p);
        if (parts.length > 1) {
          parts.pop();
          setCurrentDir("/" + parts.join("/"));
        }
        return "";
      }
      
      if (target === "~" || target === "/") {
        setCurrentDir("/home/sales-user/projects");
        return "";
      }
      
      // Check if directory exists
      const files = fileSystem[currentDir] || [];
      if (files.includes(target + "/")) {
        const newPath = currentDir + "/" + target;
        setCurrentDir(newPath);
        if (!fileSystem[newPath]) {
          setFileSystem(prev => ({ ...prev, [newPath]: [] }));
        }
        return "";
      }
      
      return `cd: ${target}: No such file or directory`;
    },
    
    mkdir: (args?: string) => {
      if (!args || !args.trim()) {
        return "mkdir: missing operand\nTry 'mkdir [directory_name]'";
      }
      const dirName = args.trim() + "/";
      const files = fileSystem[currentDir] || [];
      
      if (files.includes(dirName)) {
        return `mkdir: cannot create directory '${args.trim()}': File exists`;
      }
      
      setFileSystem(prev => ({
        ...prev,
        [currentDir]: [...(prev[currentDir] || []), dirName]
      }));
      return "";
    },
    
    touch: (args?: string) => {
      if (!args || !args.trim()) {
        return "touch: missing file operand\nTry 'touch [filename]'";
      }
      const fileName = args.trim();
      const files = fileSystem[currentDir] || [];
      
      if (files.includes(fileName)) {
        return "";  // touch updates timestamp, but we'll just silently succeed
      }
      
      setFileSystem(prev => ({
        ...prev,
        [currentDir]: [...(prev[currentDir] || []), fileName]
      }));
      return "";
    },
    
    cat: (args?: string) => {
      if (!args || !args.trim()) {
        return "cat: missing file operand";
      }
      const fileName = args.trim();
      const files = fileSystem[currentDir] || [];
      
      if (!files.includes(fileName)) {
        return `cat: ${fileName}: No such file or directory`;
      }
      
      if (fileName === "README.md") {
        return "# Welcome to FSM Technical Best Practices\n\nThis is a learning environment for terminal commands.";
      }
      
      return `Contents of ${fileName}\n(This is a simulated file system)`;
    },
    
    date: () => new Date().toString(),
    
    "git status": () => `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`,
    
    "git clone": (args?: string) => {
      if (!args || !args.trim()) {
        return "fatal: You must specify a repository to clone.";
      }
      
      const repoUrl = args.trim();
      const repoName = repoUrl.split("/").pop()?.replace(".git", "") || "repository";
      
      // Add the cloned repo to file system
      const files = fileSystem[currentDir] || [];
      if (!files.includes(repoName + "/")) {
        setFileSystem(prev => ({
          ...prev,
          [currentDir]: [...files, repoName + "/"],
          [`${currentDir}/${repoName}`]: ["README.md", "src/", "package.json"]
        }));
      }
      
      return `Cloning into '${repoName}'...
remote: Enumerating objects: 42, done.
remote: Counting objects: 100% (42/42), done.
remote: Compressing objects: 100% (28/28), done.
remote: Total 42 (delta 12), reused 38 (delta 10), pack-reused 0
Receiving objects: 100% (42/42), 15.23 KiB | 2.17 MiB/s, done.
Resolving deltas: 100% (12/12), done.`;
    },
    
    "git log": () => `commit abc123def456 (HEAD -> main, origin/main)
Author: Sales User <sales@ibm.com>
Date:   ${new Date().toDateString()}

    Initial commit: Added project files
    
commit 789ghi012jkl
Author: Sales User <sales@ibm.com>
Date:   ${new Date(Date.now() - 86400000).toDateString()}

    Updated documentation`,
    
    "ssh demo": () => `Connecting to demo-server.ibm.com...
Welcome to IBM Demo Server
Last login: ${new Date().toLocaleString()}
[demo-user@demo-server ~]$`,
    
    history: () => commandHistory.map((cmd, i) => `${i + 1}  ${cmd}`).join("\n")
  };

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

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
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    
    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);
    
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.writeln(welcomeMessage);
    term.writeln("");
    
    // Define executeCommand inside useEffect to access current state
    const executeCommand = (cmd: string): string => {
      const trimmedCmd = cmd.trim();
      
      // Handle echo command
      if (trimmedCmd.startsWith("echo ")) {
        return trimmedCmd.substring(5);
      }
      
      // Handle commands with arguments
      const parts = trimmedCmd.split(" ");
      const command = parts[0];
      const args = parts.slice(1).join(" ");
      
      if (commands[command]) {
        return commands[command](args);
      }
      // Check for multi-word commands
      if (commands[trimmedCmd]) {
        return commands[trimmedCmd]();
      }
      return `Command not found: ${command}. Type 'help' for available commands.`;
    };

    // Run initial commands
    initialCommands.forEach(cmd => {
      term.writeln(`$ ${cmd}`);
      const output = executeCommand(cmd);
      if (output) term.writeln(output);
    });
    
    term.write("$ ");
    
    // Focus terminal on mount
    term.focus();

    // Handle input
    term.onData((data) => {
      const code = data.charCodeAt(0);

      // Handle Enter
      if (code === 13) {
        term.write("\r\n");
        const trimmedLine = currentLine.trim();
        
        if (trimmedLine) {
          setCommandHistory(prev => [...prev, trimmedLine]);
          const output = executeCommand(trimmedLine);
          if (output) {
            term.writeln(output);
          }
        }
        
        setCurrentLine("");
        setHistoryIndex(-1);
        term.write("$ ");
      }
      // Handle Backspace
      else if (code === 127) {
        if (currentLine.length > 0) {
          setCurrentLine(prev => prev.slice(0, -1));
          term.write("\b \b");
        }
      }
      // Handle Up Arrow (history)
      else if (code === 27 && data === "\x1b[A") {
        if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          const cmd = commandHistory[commandHistory.length - 1 - newIndex];
          
          // Clear current line
          term.write("\r\x1b[K$ ");
          term.write(cmd);
          setCurrentLine(cmd);
        }
      }
      // Handle Down Arrow (history)
      else if (code === 27 && data === "\x1b[B") {
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          const cmd = commandHistory[commandHistory.length - 1 - newIndex];
          
          // Clear current line
          term.write("\r\x1b[K$ ");
          term.write(cmd);
          setCurrentLine(cmd);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          term.write("\r\x1b[K$ ");
          setCurrentLine("");
        }
      }
      // Handle regular characters
      else if (code >= 32 && code < 127) {
        setCurrentLine(prev => prev + data);
        term.write(data);
      }
    });

    // Handle resize
    const handleResize = () => {
      fitAddon.fit();
    };
    window.addEventListener("resize", handleResize);
    
    // Focus terminal when clicked
    const handleClick = () => {
      term.focus();
    };
    terminalRef.current.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (terminalRef.current) {
        terminalRef.current.removeEventListener("click", handleClick);
      }
      term.dispose();
    };
  }, []);

  const handleReset = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.writeln(welcomeMessage);
      xtermRef.current.writeln("");
      xtermRef.current.write("$ ");
      setCurrentLine("");
      setCommandHistory([]);
      setHistoryIndex(-1);
      setCurrentDir("/home/sales-user/projects");
      setFileSystem({
        "/home/sales-user/projects": ["project1/", "project2/", "README.md", "notes.txt"]
      });
    }
  };

  const handleCopy = () => {
    if (xtermRef.current) {
      const selection = xtermRef.current.getSelection();
      if (selection) {
        navigator.clipboard.writeText(selection);
      }
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ 
        display: "flex", 
        gap: "0.5rem", 
        marginBottom: "0.5rem",
        justifyContent: "flex-end"
      }}>
        <Button
          kind="ghost"
          size="sm"
          renderIcon={Copy}
          onClick={handleCopy}
          iconDescription="Copy selection"
        >
          Copy
        </Button>
        <Button
          kind="ghost"
          size="sm"
          renderIcon={Restart}
          onClick={handleReset}
          iconDescription="Reset terminal"
        >
          Reset
        </Button>
      </div>
      <div 
        ref={terminalRef}
        style={{
          backgroundColor: "#161616",
          padding: "1rem",
          borderRadius: "4px",
          border: "1px solid #393939"
        }}
      />
    </div>
  );
}