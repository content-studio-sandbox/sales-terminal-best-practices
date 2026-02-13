import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";
import { Button } from "@carbon/react";
import { Restart, Copy } from "@carbon/icons-react";
import { trackSessionStart, trackSessionEnd, trackCommand, trackEditorUsage } from "../utils/analytics";

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
  const [currentBranch, setCurrentBranch] = useState("main");
  const [isZshInstalled, setIsZshInstalled] = useState(false);
  const [isGitInstalled, setIsGitInstalled] = useState(false);
  const [isNvmInstalled, setIsNvmInstalled] = useState(false); // NOT pre-installed
  const [isPyenvInstalled, setIsPyenvInstalled] = useState(false); // NOT pre-installed
  const [nodeVersion, setNodeVersion] = useState("");
  const [pythonVersion, setPythonVersion] = useState("");
  const [installedNodeVersions, setInstalledNodeVersions] = useState<string[]>([]);
  const [installedPythonVersions, setInstalledPythonVersions] = useState<string[]>([]);

  const [fileSystem, setFileSystem] = useState<Record<string, string[]>>({
    "/home/sales-user/projects": ["project1/", "project2/", "README.md", "notes.txt"]
  });

  // Editor mode state
  const [editorMode, setEditorMode] = useState<'none' | 'vim' | 'nano'>('none');
  const [editorFile, setEditorFile] = useState<string>('');
  const [editorContent, setEditorContent] = useState<string[]>([]);
  const [cursorRow, setCursorRow] = useState<number>(0);
  const [cursorCol, setCursorCol] = useState<number>(0);
  const [vimMode, setVimMode] = useState<'normal' | 'insert' | 'command'>('normal');
  const [vimCommand, setVimCommand] = useState<string>('');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [stagedFiles, setStagedFiles] = useState<string[]>([]);

  // Analytics tracking state
  const sessionStartTime = useRef<number>(Date.now());
  const commandCount = useRef<number>(0);
  
  // Paste buffer for handling multi-line pastes
  const pasteBufferRef = useRef<string>('');
  const pasteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use refs to store latest state values for event handlers
  const currentLineRef = useRef(currentLine);
  const currentDirRef = useRef(currentDir);
  const currentBranchRef = useRef(currentBranch);
  const isZshInstalledRef = useRef(isZshInstalled);
  const isGitInstalledRef = useRef(isGitInstalled);
  const isNvmInstalledRef = useRef(isNvmInstalled);
  const isPyenvInstalledRef = useRef(isPyenvInstalled);
  const nodeVersionRef = useRef(nodeVersion);
  const pythonVersionRef = useRef(pythonVersion);
  const installedNodeVersionsRef = useRef(installedNodeVersions);
  const installedPythonVersionsRef = useRef(installedPythonVersions);
  const fileSystemRef = useRef(fileSystem);
  const commandHistoryRef = useRef(commandHistory);
  const editorModeRef = useRef(editorMode);
  const editorFileRef = useRef(editorFile);
  const editorContentRef = useRef(editorContent);
  const cursorRowRef = useRef(cursorRow);
  const cursorColRef = useRef(cursorCol);
  const vimModeRef = useRef(vimMode);
  const vimCommandRef = useRef(vimCommand);
  const fileContentsRef = useRef(fileContents);
  const stagedFilesRef = useRef(stagedFiles);

  // Update refs when state changes
  useEffect(() => {
    currentLineRef.current = currentLine;
  }, [currentLine]);

  useEffect(() => {
    currentDirRef.current = currentDir;
  }, [currentDir]);

  useEffect(() => {
    currentBranchRef.current = currentBranch;
  }, [currentBranch]);

  useEffect(() => {
    isZshInstalledRef.current = isZshInstalled;
  }, [isZshInstalled]);

  useEffect(() => {
    isGitInstalledRef.current = isGitInstalled;
  }, [isGitInstalled]);

  useEffect(() => {
    isNvmInstalledRef.current = isNvmInstalled;
  }, [isNvmInstalled]);

  useEffect(() => {
    isPyenvInstalledRef.current = isPyenvInstalled;
  }, [isPyenvInstalled]);

  useEffect(() => {
    nodeVersionRef.current = nodeVersion;
  }, [nodeVersion]);

  useEffect(() => {
    pythonVersionRef.current = pythonVersion;
  }, [pythonVersion]);

  useEffect(() => {
    installedNodeVersionsRef.current = installedNodeVersions;
  }, [installedNodeVersions]);

  useEffect(() => {
    installedPythonVersionsRef.current = installedPythonVersions;
  }, [installedPythonVersions]);

  useEffect(() => {
    fileSystemRef.current = fileSystem;
  }, [fileSystem]);

  useEffect(() => {
    commandHistoryRef.current = commandHistory;
  }, [commandHistory]);

  useEffect(() => {
    editorModeRef.current = editorMode;
  }, [editorMode]);

  useEffect(() => {
    editorFileRef.current = editorFile;
  }, [editorFile]);

  useEffect(() => {
    editorContentRef.current = editorContent;
  }, [editorContent]);

  useEffect(() => {
    vimModeRef.current = vimMode;
  }, [vimMode]);

  useEffect(() => {
    vimCommandRef.current = vimCommand;
  }, [vimCommand]);

  useEffect(() => {
    fileContentsRef.current = fileContents;
  }, [fileContents]);

  useEffect(() => {
    stagedFilesRef.current = stagedFiles;
  }, [stagedFiles]);

  useEffect(() => {
    cursorRowRef.current = cursorRow;
  }, [cursorRow]);

  useEffect(() => {
    cursorColRef.current = cursorCol;
  }, [cursorCol]);

  // Generate prompt - bash initially, then zsh after installation
  const getPrompt = (): string => {
    const dir = currentDirRef.current.replace("/home/sales-user", "~");
    
    // If zsh is not installed, show basic bash prompt
    if (!isZshInstalledRef.current) {
      return `$ `;
    }
    
    // After zsh is installed, show beautiful colorful prompt
    const branch = currentBranchRef.current;
    const cyan = "\x1b[36m";      // Cyan for username@host
    const blue = "\x1b[34m";      // Blue for directory
    const green = "\x1b[32m";     // Green for git branch
    const reset = "\x1b[0m";      // Reset color
    const bold = "\x1b[1m";       // Bold text
    
    // Build prompt: sales-user@ibm ~/projects (main) ❯
    return `${cyan}${bold}sales-user@ibm${reset} ${blue}${dir}${reset} ${green}(${branch})${reset} ❯ `;
  };

  // Helper function to get file content (used by cat, vim, nano)
  const getFileContent = (fileName: string): string => {
    // Check if file has saved content from editor (use ref to avoid stale closure)
    if (fileContentsRef.current[fileName]) {
      return fileContentsRef.current[fileName];
    }
    
    // Handle SSH public key file
    if (fileName === "~/.ssh/id_ed25519.pub" || fileName === ".ssh/id_ed25519.pub" || fileName.includes("id_ed25519.pub")) {
      return `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl your.email@ibm.com`;
    }
    
    // Handle special files in cloned repo
    if (fileName.includes("TerminalBasicsPage.tsx") || fileName.includes("src/pages/TerminalBasicsPage.tsx")) {
      return `import React from 'react';
import { Button } from '@carbon/react';

export default function TerminalBasicsPage() {
  const tips = [
    {
      icon: "⌨️",
      title: "Use Tab Completion",
      description: "Press Tab to auto-complete file and directory names."
    },
    {
      icon: "🔍",
      title: "Search Command History",
      description: "Press Ctrl+R to search through your command history."
    },
    {
      icon: "📂",
      title: "Navigate Efficiently",
      description: "Use 'cd -' to go back to the previous directory."
    }
  ];

  return (
    <div>
      <h1>Terminal Basics</h1>
      {tips.map((tip, index) => (
        <div key={index}>
          <span>{tip.icon}</span>
          <h3>{tip.title}</h3>
          <p>{tip.description}</p>
        </div>
      ))}
    </div>
  );
}`;
    }
    
    if (fileName === "README.md") {
      return "# Sales Terminal Best Practices\n\nA comprehensive guide for mastering terminal commands and Git workflows.\n\n## Features\n- Interactive terminal simulator\n- Git workflow tutorials\n- Real-world examples\n\n## Getting Started\nExplore the src/ directory to see the codebase.";
    }
    
    return ""; // Empty file
  };

  // Move commands inside useEffect or use a function that returns commands
  const getCommands = (): Record<string, (args?: string) => string> => ({
    help: () => `Available commands:

📁 File System:
  ls [-la]        - List files and directories
  pwd             - Print working directory
  cd [dir]        - Change directory
  mkdir [name]    - Create directory
  touch [name]    - Create file
  cat [file]      - Display file contents
  rm [file]       - Remove file
  cp [src] [dst]  - Copy file
  mv [src] [dst]  - Move/rename file
  find [pattern]  - Find files by pattern

📝 Text Editing:
  vim [file]      - Open vim editor (demo)
  nano [file]     - Open nano editor (demo)
  echo [text]     - Echo text back

🔧 Git Commands:
  git --version   - Check Git version
  git config      - Configure Git settings
  git add [file]  - Stage files for commit
  git commit -m   - Commit staged changes
  git status      - Show git status
  git clone [url] - Clone repository
  git log         - Show commit history
  git branch      - List branches
  git checkout    - Switch branches
  git pull        - Pull latest changes
  git push        - Push commits
  git diff        - Show changes

🌐 Network & SSH:
  ssh [host]      - SSH into remote server
  ssh-keygen      - Generate SSH key pair
  ssh-agent       - Start SSH agent
  ssh-add [key]   - Add SSH key to agent
  scp [file]      - Secure copy files
  ping [host]     - Ping a host
  curl [url]      - Make HTTP request
  wget [url]      - Download file

🐳 Docker:
  docker ps       - List containers
  docker images   - List images
  docker build    - Build image
  docker run      - Run container
  docker logs     - View container logs
  docker exec     - Execute in container

☸️  Kubernetes:
  kubectl get     - Get resources
  kubectl describe- Describe resource
  kubectl logs    - View pod logs
  kubectl exec    - Execute in pod
  kubectl apply   - Apply configuration

💻 System:
  whoami          - Display current user
  which [cmd]     - Locate a command
  date            - Show date and time
  top             - Show processes
  df -h           - Disk usage
  free -h         - Memory usage
  ps aux          - List processes
  
📦 Package Managers:
  brew [cmd]      - Homebrew (macOS)
  apt-get [cmd]   - APT (Debian/Ubuntu)
  sudo [cmd]      - Run command as admin
  npm [cmd]       - Node Package Manager
  
🔧 Version Managers:
  nvm [cmd]       - Node Version Manager
  pyenv [cmd]     - Python Version Manager
  node [--version]- Node.js runtime
  python [--version] - Python interpreter
  source [file]   - Load environment/activate venv
  
📚 Utilities:
  clear           - Clear terminal
  history         - Command history
  man [cmd]       - Show manual
  alias           - Show aliases
  tips            - Hot tips for tech sellers`,
    
    clear: () => {
      xtermRef.current?.clear();
      return "";
    },
    
    whoami: () => "sales-user",
    
    pwd: () => currentDirRef.current,
    
    ls: (args?: string) => {
      const files = fileSystemRef.current[currentDirRef.current] || [];
      if (files.length === 0) return "Directory is empty";
      
      // Handle -la, -l, -a flags
      if (args && (args.includes("-l") || args.includes("-a"))) {
        return files.map(f => {
          const isDir = f.endsWith("/");
          const perms = isDir ? "drwxr-xr-x" : "-rw-r--r--";
          const size = isDir ? "   4096" : "   1024";
          const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
          return `${perms}  1 sales-user  staff ${size}  ${date}  ${f}`;
        }).join("\n");
      }
      
      // Regular ls - show files in columns (simulated with spacing)
      return files.map(f => f.endsWith("/") ? f : f).join("  ");
    },
    
    cd: (args?: string) => {
      if (!args || !args.trim()) {
        setCurrentDir("/home/sales-user/projects");
        return "";
      }
      
      const target = args.trim();
      if (target === "..") {
        const parts = currentDirRef.current.split("/").filter(p => p);
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
      const files = fileSystemRef.current[currentDirRef.current] || [];
      if (files.includes(target + "/")) {
        const newPath = currentDirRef.current + "/" + target;
        setCurrentDir(newPath);
        if (!fileSystemRef.current[newPath]) {
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
      const files = fileSystemRef.current[currentDirRef.current] || [];
      
      if (files.includes(dirName)) {
        return `mkdir: cannot create directory '${args.trim()}': File exists`;
      }
      
      setFileSystem(prev => ({
        ...prev,
        [currentDirRef.current]: [...(prev[currentDirRef.current] || []), dirName]
      }));
      return "";
    },
    
    touch: (args?: string) => {
      if (!args || !args.trim()) {
        return "touch: missing file operand\nTry 'touch [filename]'";
      }
      const fileName = args.trim();
      const files = fileSystemRef.current[currentDirRef.current] || [];
      
      if (files.includes(fileName)) {
        return "";  // touch updates timestamp, but we'll just silently succeed
      }
      
      setFileSystem(prev => ({
        ...prev,
        [currentDirRef.current]: [...(prev[currentDirRef.current] || []), fileName]
      }));
      return "";
    },
    
    cat: (args?: string) => {
      if (!args || !args.trim()) {
        return "cat: missing file operand";
      }
      
      // Handle pipe commands (e.g., cat file | head -50)
      const pipeIndex = args.indexOf("|");
      let fileName = args.trim();
      let pipeCommand = "";
      
      if (pipeIndex !== -1) {
        fileName = args.substring(0, pipeIndex).trim();
        pipeCommand = args.substring(pipeIndex + 1).trim();
      }
      
      // Handle SSH public key file specially
      if (fileName === "~/.ssh/id_ed25519.pub" || fileName === ".ssh/id_ed25519.pub" || fileName.includes("id_ed25519.pub")) {
        return `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl your.email@ibm.com

✓ This is your SSH public key - copy this and add it to GitHub Settings → SSH Keys`;
      }
      
      // Handle special files in cloned repo
      if (fileName.includes("TerminalBasicsPage.tsx") || fileName.includes("src/pages/TerminalBasicsPage.tsx")) {
        const content = `import React from 'react';
import { Button } from '@carbon/react';

export default function TerminalBasicsPage() {
  const tips = [
    {
      icon: "⌨️",
      title: "Use Tab Completion",
      description: "Press Tab to auto-complete file and directory names."
    },
    {
      icon: "🔍",
      title: "Search Command History",
      description: "Press Ctrl+R to search through your command history."
    },
    {
      icon: "📂",
      title: "Navigate Efficiently",
      description: "Use 'cd -' to go back to the previous directory."
    }
  ];

  return (
    <div>
      <h1>Terminal Basics</h1>
      {tips.map((tip, index) => (
        <div key={index}>
          <span>{tip.icon}</span>
          <h3>{tip.title}</h3>
          <p>{tip.description}</p>
        </div>
      ))}
    </div>
  );
}`;
        
        // Handle pipe to head
        if (pipeCommand.startsWith("head")) {
          const lines = content.split("\n");
          const numLines = pipeCommand.includes("-") ? parseInt(pipeCommand.split("-")[1]) || 10 : 10;
          return lines.slice(0, numLines).join("\n");
        }
        
        return content;
      }
      
      const files = fileSystemRef.current[currentDirRef.current] || [];
      
      if (!files.includes(fileName)) {
        return `cat: ${fileName}: No such file or directory`;
      }
      
      // Check if file has saved content from editor
      if (fileContentsRef.current[fileName]) {
        return fileContentsRef.current[fileName];
      }
      
      if (fileName === "README.md") {
        return "# Sales Terminal Best Practices\n\nA comprehensive guide for mastering terminal commands and Git workflows.\n\n## Features\n- Interactive terminal simulator\n- Git workflow tutorials\n- Real-world examples\n\n## Getting Started\nExplore the src/ directory to see the codebase.";
      }
      
      return `Contents of ${fileName}\n(This is a simulated file system)`;
    },
    
    wc: (args?: string) => {
      if (!args || !args.trim()) {
        return "wc: missing file operand\nTry 'wc --help' for more information.";
      }
      
      const parts = args.trim().split(/\s+/);
      const hasLineFlag = parts.includes('-l');
      const fileName = parts.find(p => !p.startsWith('-')) || '';
      
      if (!fileName) {
        return "wc: missing file operand";
      }
      
      // Check if file exists
      const files = fileSystemRef.current[currentDirRef.current] || [];
      if (!files.includes(fileName) && !fileName.includes('/')) {
        return `wc: ${fileName}: No such file or directory`;
      }
      
      // Get file content
      const content = getFileContent(fileName);
      const lines = content.split('\n').length;
      const words = content.split(/\s+/).filter(w => w.length > 0).length;
      const chars = content.length;
      
      if (hasLineFlag) {
        // Format: right-aligned number, space, filename
        return `${String(lines).padStart(7)} ${fileName}`;
      }
      
      // Format: lines, words, chars (all right-aligned), then filename
      return `${String(lines).padStart(7)} ${String(words).padStart(7)} ${String(chars).padStart(7)} ${fileName}`;
    },
    
    date: () => new Date().toString(),
    
    "git status": () => {
      const branch = currentBranchRef.current;
      const staged = stagedFilesRef.current;
      
      if (staged.length === 0) {
        return `On branch ${branch}
Your branch is up to date with 'origin/${branch}'.

nothing to commit, working tree clean`;
      }
      
      return `On branch ${branch}
Your branch is up to date with 'origin/${branch}'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
${staged.map(f => `\t\x1b[32mnew file:   ${f}\x1b[0m`).join('\n')}
`;
    },
    
    "git clone": (args?: string) => {
      if (!args || !args.trim()) {
        return "fatal: You must specify a repository to clone.";
      }
      
      const repoUrl = args.trim();
      const repoName = repoUrl.split("/").pop()?.replace(".git", "") || "repository";
      
      // Add the cloned repo to file system with realistic structure
      const files = fileSystemRef.current[currentDirRef.current] || [];
      if (!files.includes(repoName + "/")) {
        const repoPath = `${currentDirRef.current}/${repoName}`;
        const srcPath = `${repoPath}/src`;
        const pagesPath = `${srcPath}/pages`;
        const componentsPath = `${srcPath}/components`;
        
        setFileSystem(prev => ({
          ...prev,
          [currentDirRef.current]: [...files, repoName + "/"],
          [repoPath]: ["README.md", "src/", "package.json", ".gitignore", "tsconfig.json"],
          [srcPath]: ["pages/", "components/", "App.tsx", "index.tsx"],
          [pagesPath]: ["TerminalBasicsPage.tsx", "GitWorkflowsPage.tsx", "InteractiveTerminalPage.tsx"],
          [componentsPath]: ["InteractiveTerminal.tsx", "Header.tsx", "Footer.tsx"]
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
    
    "git show": () => {
      const branch = currentBranchRef.current;
      const staged = stagedFilesRef.current;
      const lastCommitFile = staged.length > 0 ? staged[0] : 'src/pages/OpenShiftBestPracticesPage.tsx';
      
      return `commit abc123def456 (HEAD -> ${branch})
Author: Sales User <sales@ibm.com>
Date:   ${new Date().toDateString()}

    feat: add OpenShift Best Practices page for tech sellers

diff --git a/${lastCommitFile} b/${lastCommitFile}
new file mode 100644
index 0000000..def456e
--- /dev/null
+++ b/${lastCommitFile}
@@ -0,0 +1,5 @@
+import React from 'react';
+
+export default function OpenShiftBestPracticesPage() {
+  return <div>OpenShift Best Practices</div>;
+}`;
    },
    
    "ssh demo": () => `Connecting to demo-server.ibm.com...
Welcome to IBM Demo Server
Last login: ${new Date().toLocaleString()}
[demo-user@demo-server ~]$`,
    
    history: () => commandHistoryRef.current.map((cmd, i) => `${i + 1}  ${cmd}`).join("\n"),
    
    // Additional file system commands
    rm: (args?: string) => {
      if (!args || !args.trim()) {
        return "rm: missing operand\nTry 'rm [filename]'";
      }
      
      const argParts = args.trim().split(" ");
      const hasRfFlag = argParts.includes("-rf") || argParts.includes("-r");
      const fileName = argParts.filter(a => !a.startsWith("-")).join(" ");
      
      if (!fileName) {
        return "rm: missing operand\nTry 'rm [filename]' or 'rm -rf [directory]'";
      }
      
      const files = fileSystemRef.current[currentDirRef.current] || [];
      
      // Handle directory removal with -rf flag
      if (hasRfFlag && fileName.endsWith("/")) {
        const dirName = fileName;
        if (!files.includes(dirName)) {
          return `rm: cannot remove '${fileName}': No such file or directory`;
        }
        
        // Remove directory and its contents
        const dirPath = `${currentDirRef.current}/${fileName.replace("/", "")}`;
        setFileSystem(prev => {
          const newFs = { ...prev };
          delete newFs[dirPath]; // Remove directory contents
          newFs[currentDirRef.current] = files.filter(f => f !== dirName);
          return newFs;
        });
        return "";
      }
      
      // Handle directory without -rf flag
      if (fileName.endsWith("/")) {
        return `rm: cannot remove '${fileName}': Is a directory\nTry 'rm -rf ${fileName}' to remove directories`;
      }
      
      // Handle regular file removal
      if (!files.includes(fileName)) {
        return `rm: cannot remove '${fileName}': No such file or directory`;
      }
      
      setFileSystem(prev => ({
        ...prev,
        [currentDirRef.current]: files.filter(f => f !== fileName)
      }));
      return "";
    },
    
    cp: (args?: string) => {
      if (!args || !args.trim()) {
        return "cp: missing file operand\nTry 'cp [source] [destination]'";
      }
      const parts = args.trim().split(" ");
      if (parts.length < 2) {
        return "cp: missing destination file operand";
      }
      const [src, dst] = parts;
      const files = fileSystemRef.current[currentDirRef.current] || [];
      
      if (!files.includes(src)) {
        return `cp: cannot stat '${src}': No such file or directory`;
      }
      
      if (files.includes(dst)) {
        return `cp: '${dst}' already exists`;
      }
      
      setFileSystem(prev => ({
        ...prev,
        [currentDirRef.current]: [...files, dst]
      }));
      return "";
    },
    
    mv: (args?: string) => {
      if (!args || !args.trim()) {
        return "mv: missing file operand\nTry 'mv [source] [destination]'";
      }
      const parts = args.trim().split(" ");
      if (parts.length < 2) {
        return "mv: missing destination file operand";
      }
      const [src, dst] = parts;
      const files = fileSystemRef.current[currentDirRef.current] || [];
      
      if (!files.includes(src)) {
        return `mv: cannot stat '${src}': No such file or directory`;
      }
      
      setFileSystem(prev => ({
        ...prev,
        [currentDirRef.current]: files.map(f => f === src ? dst : f)
      }));
      return "";
    },
    
    find: (args?: string) => {
      if (!args || !args.trim()) {
        return "find: missing search pattern\nTry 'find [pattern]'";
      }
      const pattern = args.trim();
      const files = fileSystemRef.current[currentDirRef.current] || [];
      const matches = files.filter(f => f.includes(pattern));
      
      if (matches.length === 0) {
        return `find: no files matching '${pattern}'`;
      }
      
      return matches.map(f => `./${f}`).join("\n");
    },
    
    // Text editors - Interactive simulation
    vim: (args?: string) => {
      const file = args?.trim() || "untitled";
      
      // Load file content using helper function
      const content = getFileContent(file);
      const lines = content ? content.split('\n') : [''];
      
      // Determine if this is a new file or existing file
      const isNewFile = !content && !fileContentsRef.current[file];
      
      // Create file in filesystem if it doesn't exist
      const files = fileSystemRef.current[currentDirRef.current] || [];
      if (!files.includes(file) && file !== "untitled") {
        setFileSystem(prev => ({
          ...prev,
          [currentDirRef.current]: [...files, file]
        }));
      }
      
      // Enter vim editor mode
      setEditorMode('vim');
      setEditorFile(file);
      editorFileRef.current = file; // Update ref immediately
      setEditorContent(lines);
      setCursorRow(0);
      setCursorCol(0);
      setVimMode('normal');
      
      // Track editor usage
      trackEditorUsage('vim', 'open', file);
      
      return `Opening ${file} in vim...
~ VIM - Vi IMproved
~
~ version 9.0
~ by Bram Moolenaar et al.
~
~ Press 'i' to enter INSERT mode
~ Press ESC to return to NORMAL mode
~ Type ':w' to save, ':q' to quit, ':wq' to save and quit
~
"${file}" ${isNewFile ? '[New File]' : `${lines.length}L, ${content.length}C`}

${lines.join('\n')}

-- NORMAL MODE -- (Press 'i' for INSERT mode)`;
    },
    
    nano: (args?: string) => {
      const file = args?.trim() || "untitled";
      
      // Load file content using helper function
      const content = getFileContent(file);
      const lines = content ? content.split('\n') : [''];
      
      // Create file in filesystem if it doesn't exist
      const files = fileSystemRef.current[currentDirRef.current] || [];
      if (!files.includes(file) && file !== "untitled") {
        setFileSystem(prev => ({
          ...prev,
          [currentDirRef.current]: [...files, file]
        }));
      }
      
      // Enter nano editor mode
      setEditorMode('nano');
      setEditorFile(file);
      editorFileRef.current = file; // Update ref immediately
      setEditorContent(lines);
      setCursorRow(0);
      setCursorCol(0);
      
      // Track editor usage
      trackEditorUsage('nano', 'open', file);
      
      return `GNU nano 7.2                    ${file}

${lines.join('\n')}


^G Help     ^O Write Out ^W Where Is  ^K Cut
^X Exit     ^R Read File ^\\ Replace   ^U Paste

-- INSERT MODE -- (Type to edit, Ctrl+X to exit, Ctrl+O to save)`;
    },
    
    // Git commands
    "git branch": () => {
      const currentBranch = currentBranchRef.current;
      const branches = ["main", "develop", "feature/new-dashboard", "hotfix/security-patch"];
      
      // Add current branch if it's not in the list
      if (!branches.includes(currentBranch)) {
        branches.push(currentBranch);
      }
      
      return branches.map(b => b === currentBranch ? `* ${b}` : `  ${b}`).join("\n");
    },
    
    "git checkout": (args?: string) => {
      if (!args || !args.trim()) {
        return "error: you must specify a branch name";
      }
      const branch = args.trim().replace("-b ", "");
      setCurrentBranch(branch);
      if (args.includes("-b")) {
        return `Switched to a new branch '${branch}'`;
      }
      return `Switched to branch '${branch}'`;
    },
    
    "git pull": () => `remote: Enumerating objects: 15, done.
remote: Counting objects: 100% (15/15), done.
remote: Compressing objects: 100% (8/8), done.
remote: Total 10 (delta 5), reused 8 (delta 3), pack-reused 0
Unpacking objects: 100% (10/10), 2.45 KiB | 627.00 KiB/s, done.
From github.com:ibm/demo-repo
   abc123d..def456e  main       -> origin/main
Updating abc123d..def456e
Fast-forward
 src/app.ts | 12 ++++++++++--
 1 file changed, 10 insertions(+), 2 deletions(-)`,
    
    "git push": () => `Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 342 bytes | 342.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0), pack-reused 0
To github.com:ibm/demo-repo.git
   def456e..ghi789j  main -> main`,
    
    "git diff": (args?: string) => {
      const fileContents = fileContentsRef.current;
      
      // If a specific file is requested
      if (args && args.trim()) {
        const fileName = args.trim();
        const content = fileContents[fileName] || '';
        
        if (content) {
          const lines = content.split('\n');
          const lineCount = lines.length;
          
          return `diff --git a/${fileName} b/${fileName}
new file mode 100644
index 0000000..abc1234
--- /dev/null
+++ b/${fileName}
@@ -0,0 +1,${lineCount} @@
${lines.map(line => '+' + line).join('\n')}`;
        } else {
          return `diff --git a/${fileName} b/${fileName}
new file mode 100644
--- /dev/null
+++ b/${fileName}
@@ -0,0 +1 @@
+// File not yet created or empty`;
        }
      }
      
      // If there are staged files, show their diff
      const staged = stagedFilesRef.current;
      if (staged.length > 0) {
        const fileName = staged[0];
        const content = fileContents[fileName] || '';
        const lines = content.split('\n');
        const lineCount = lines.length;
        
        return `diff --git a/${fileName} b/${fileName}
new file mode 100644
index 0000000..abc1234
--- /dev/null
+++ b/${fileName}
@@ -0,0 +1,${lineCount} @@
${lines.map(line => '+' + line).join('\n')}`;
      }
      
      // Default diff if no staged files
      return `diff --git a/src/app.ts b/src/app.ts
index abc123d..def456e 100644
--- a/src/app.ts
+++ b/src/app.ts
@@ -10,7 +10,7 @@ export class App {
   }
   
-  public start(): void {
+  public async start(): Promise<void> {
     console.log('Starting application...');
+    await this.initialize();
   }
 }`;
    },
    
    // Git configuration commands
    "git config": (args?: string) => {
      if (!args || !args.trim()) {
        return `usage: git config [--global] <key> <value>
   or: git config --list`;
      }
      
      const trimmedArgs = args.trim();
      
      if (trimmedArgs === "--list" || trimmedArgs === "-l") {
        return `user.name=Sales User
user.email=sales@ibm.com
init.defaultBranch=main
core.editor=vim
color.ui=auto
push.default=simple`;
      }
      
      if (trimmedArgs.includes("--global")) {
        const parts = trimmedArgs.split(/\s+/);
        if (parts.length >= 3) {
          const key = parts[1];
          const value = parts.slice(2).join(" ").replace(/['"]/g, "");
          return `✓ Set ${key} to "${value}"`;
        }
      }
      
      return "Configuration updated successfully";
    },
    
    "git add": (args?: string) => {
      if (!args || !args.trim()) {
        return "Nothing specified, nothing added.\nMaybe you wanted to say 'git add .'?";
      }
      
      const files = args.trim();
      if (files === ".") {
        // Add all files in current directory
        const currentFiles = fileSystemRef.current[currentDirRef.current] || [];
        setStagedFiles(prev => [...new Set([...prev, ...currentFiles.filter(f => !f.endsWith('/'))])]);
        return "✓ Staged all changes";
      }
      
      // Add specific file
      setStagedFiles(prev => [...new Set([...prev, files])]);
      return `✓ Staged: ${files}`;
    },
    
    "git commit": (args?: string) => {
      if (!args || !args.includes("-m")) {
        return `error: no commit message provided
usage: git commit -m "message"`;
      }
      
      const match = args.match(/-m\s+["']([^"']+)["']/);
      const message = match ? match[1] : "Update files";
      const branch = currentBranchRef.current;
      const fileCount = stagedFilesRef.current.length;
      
      // Clear staged files after commit
      setStagedFiles([]);
      
      return `[${branch} abc123d] ${message}
 ${fileCount} file${fileCount !== 1 ? 's' : ''} changed, 5 insertions(+), 2 deletions(-)`;
    },
    
    // Git setup and utility commands
    "git --version": () => "git version 2.39.3",
    
    "git version": () => "git version 2.39.3",
    
    which: (args?: string) => {
      const cmd = args?.trim() || "";
      
      // Check if git is being queried and it's not installed
      if (cmd === "git" && !isGitInstalledRef.current) {
        return "git not found";
      }
      
      const paths: Record<string, string> = {
        git: "/usr/bin/git",
        zsh: "/bin/zsh",
        bash: "/bin/bash",
        ssh: "/usr/bin/ssh",
        "ssh-keygen": "/usr/bin/ssh-keygen",
        "ssh-agent": "/usr/bin/ssh-agent",
        "ssh-add": "/usr/bin/ssh-add",
        brew: "/opt/homebrew/bin/brew",
        node: "/usr/local/bin/node",
        npm: "/usr/local/bin/npm",
        docker: "/usr/local/bin/docker",
        kubectl: "/usr/local/bin/kubectl"
      };
      
      if (paths[cmd]) {
        return paths[cmd];
      }
      
      return `${cmd} not found`;
    },
    
    brew: (args?: string) => {
      if (!args || !args.trim()) {
        return "usage: brew install <package>";
      }
      
      const pkg = args.trim().replace("install ", "");
      
      if (pkg === "zsh") {
        setIsZshInstalled(true);
        return `==> Downloading zsh...
==> Installing zsh...
🍺  /opt/homebrew/Cellar/zsh/5.9: 1,532 files, 15.2MB
==> Running \`brew cleanup zsh\`...

✨ Zsh installed successfully!
💡 Your prompt will now transform to show beautiful colors and git branch info!
🔄 Restart your terminal or run: exec zsh`;
      }
      
      if (pkg === "git") {
        setIsGitInstalled(true);
        return `==> Downloading git...
==> Installing git...
🍺  /opt/homebrew/Cellar/git/2.39.3: 1,631 files, 48.4MB
==> Running \`brew cleanup git\`...

✅ Git installed successfully! You can now use git commands.`;
      }
      
      if (pkg === "pyenv") {
        setIsPyenvInstalled(true);
        return `==> Downloading pyenv...
==> Installing pyenv...
🍺  /opt/homebrew/Cellar/pyenv/2.3.36: 1,083 files, 3.3MB
==> Running \`brew cleanup pyenv\`...

✅ pyenv installed successfully!
💡 Configure your shell:
   echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
   echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
   echo 'eval "$(pyenv init -)"' >> ~/.zshrc
   source ~/.zshrc`;
      }
      
      return `==> Downloading ${pkg}...
==> Installing ${pkg}...
✓ ${pkg} installed successfully via Homebrew`;
    },
    
    // Node Version Manager (nvm)
    nvm: (args?: string) => {
      // Check if nvm is installed
      if (!isNvmInstalledRef.current) {
        return `bash: nvm: command not found

💡 To install nvm, run:
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   source ~/.nvm/nvm.sh`;
      }
      
      if (!args || !args.trim()) {
        return `Node Version Manager (v0.39.7)

Usage:
  nvm --version              Show nvm version
  nvm ls                     List installed Node versions
  nvm install <version>      Install a Node version
  nvm use <version>          Switch to a Node version
  nvm current                Show current Node version
  nvm alias default <ver>    Set default Node version`;
      }
      
      const cmd = args.trim();
      
      if (cmd === "--version") {
        return "0.39.7";
      }
      
      if (cmd === "ls" || cmd === "list") {
        const versions = installedNodeVersionsRef.current;
        const current = nodeVersionRef.current;
        return versions.map(v =>
          v === current ? `->     ${v} (Currently using)` : `       ${v}`
        ).join("\n") + "\ndefault -> v20.11.0";
      }
      
      if (cmd === "current") {
        return nodeVersionRef.current;
      }
      
      if (cmd.startsWith("install ")) {
        const version = cmd.replace("install ", "").trim();
        const versionNum = version.startsWith("v") ? version : `v${version}`;
        
        if (installedNodeVersionsRef.current.includes(versionNum)) {
          return `Version ${versionNum} is already installed`;
        }
        
        setInstalledNodeVersions(prev => [...prev, versionNum]);
        setNodeVersion(versionNum); // Auto-set as current version
        return `Downloading and installing node ${versionNum}...
Downloading https://nodejs.org/dist/${versionNum}/node-${versionNum}-darwin-arm64.tar.xz
######################################################################### 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node ${versionNum} (npm v10.2.4)
✅ Node ${versionNum} installed successfully!`;
      }
      
      if (cmd.startsWith("use ")) {
        const version = cmd.replace("use ", "").trim();
        const versionNum = version.startsWith("v") ? version : `v${version}`;
        
        if (!installedNodeVersionsRef.current.includes(versionNum)) {
          return `Version ${versionNum} is not installed. Run: nvm install ${versionNum}`;
        }
        
        setNodeVersion(versionNum);
        return `Now using node ${versionNum} (npm v10.2.4)`;
      }
      
      if (cmd.startsWith("alias default ")) {
        const version = cmd.replace("alias default ", "").trim();
        return `default -> ${version}`;
      }
      
      return `nvm: command not found: ${cmd}`;
    },
    
    // Python Version Manager (pyenv)
    pyenv: (args?: string) => {
      // Check if pyenv is installed
      if (!isPyenvInstalledRef.current) {
        return `bash: pyenv: command not found

💡 To install pyenv, run:
   brew install pyenv
   echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
   echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
   echo 'eval "$(pyenv init -)"' >> ~/.zshrc
   source ~/.zshrc`;
      }
      
      if (!args || !args.trim()) {
        return `pyenv 2.3.36

Usage: pyenv <command> [<args>]

Commands:
  --version              Show pyenv version
  versions               List installed Python versions
  install <version>      Install a Python version
  local <version>        Set local Python version
  global <version>       Set global Python version
  which python           Show path to Python executable`;
      }
      
      const cmd = args.trim();
      
      if (cmd === "--version") {
        return "pyenv 2.3.36";
      }
      
      if (cmd === "versions") {
        const versions = installedPythonVersionsRef.current;
        const current = pythonVersionRef.current;
        return versions.map(v =>
          v === current ? `* ${v} (set by /Users/sales-user/.python-version)` : `  ${v}`
        ).join("\n");
      }
      
      if (cmd.startsWith("install ")) {
        const version = cmd.replace("install ", "").trim();
        
        if (installedPythonVersionsRef.current.includes(version)) {
          return `python-build: definition '${version}' already installed`;
        }
        
        setInstalledPythonVersions(prev => [...prev, version]);
        return `Downloading Python-${version}.tar.xz...
-> https://www.python.org/ftp/python/${version}/Python-${version}.tar.xz
Installing Python-${version}...
Installed Python-${version} to /Users/sales-user/.pyenv/versions/${version}
✅ Python ${version} installed successfully!`;
      }
      
      if (cmd.startsWith("local ") || cmd.startsWith("global ")) {
        const version = cmd.replace(/^(local|global) /, "").trim();
        
        if (!installedPythonVersionsRef.current.includes(version)) {
          return `pyenv: version \`${version}\` not installed`;
        }
        
        setPythonVersion(version);
        return "";
      }
      
      if (cmd === "which python" || cmd === "which python3") {
        return `/Users/sales-user/.pyenv/versions/${pythonVersionRef.current}/bin/python`;
      }
      
      return `pyenv: no such command \`${cmd}\``;
    },
    
    // Node.js
    node: (args?: string) => {
      // Check if node is installed via nvm
      if (!nodeVersionRef.current) {
        return `bash: node: command not found`;
      }
      
      if (!args || args.trim() === "--version" || args.trim() === "-v") {
        return nodeVersionRef.current;
      }
      
      if (args?.trim() === "-e" || args?.includes("console.log")) {
        return "Node.js REPL simulation - command executed";
      }
      
      return `Welcome to Node.js ${nodeVersionRef.current}
Type ".help" for more information.`;
    },
    
    // Python
    python: (args?: string) => {
      // Check if python is installed via pyenv
      if (!pythonVersionRef.current) {
        return `bash: python: command not found`;
      }
      
      if (!args || args.trim() === "--version" || args.trim() === "-V") {
        return `Python ${pythonVersionRef.current}`;
      }
      
      if (args?.trim() === "-m venv venv") {
        // Create virtual environment
        const files = fileSystemRef.current[currentDirRef.current] || [];
        if (!files.includes("venv/")) {
          setFileSystem(prev => ({
            ...prev,
            [currentDirRef.current]: [...files, "venv/"]
          }));
        }
        return "✅ Virtual environment created in ./venv";
      }
      
      if (args?.includes("-c")) {
        return "Python code executed";
      }
      
      return `Python ${pythonVersionRef.current}
Type "help", "copyright", "credits" or "license" for more information.
>>>`;
    },
    
    python3: (args?: string) => {
      // Alias to python
      return getCommands().python(args);
    },
    
    // NPM commands
    npm: (args?: string) => {
      // Check if npm is available (comes with node)
      if (!nodeVersionRef.current) {
        return `bash: npm: command not found`;
      }
      
      if (!args || !args.trim()) {
        return `npm <command>

Usage:
  npm install [package]      Install dependencies
  npm run <script>           Run package.json script
  npm start                  Start the application
  npm test                   Run tests
  npm --version              Show npm version`;
      }
      
      const cmd = args.trim();
      
      if (cmd === "--version" || cmd === "-v") {
        return "10.2.4";
      }
      
      if (cmd === "install" || cmd === "i") {
        return `
added 1247 packages, and audited 1248 packages in 8s

198 packages are looking for funding
  run \`npm fund\` for details

found 0 vulnerabilities
✅ Dependencies installed successfully!`;
      }
      
      if (cmd.startsWith("install ") || cmd.startsWith("i ")) {
        const pkg = cmd.replace(/^(install|i) /, "").trim();
        return `
added 1 package, and audited 1249 packages in 2s

✅ ${pkg} installed successfully!`;
      }
      
      if (cmd === "run dev" || cmd === "run start" || cmd === "start") {
        return `> sales-terminal-best-practices@1.0.0 dev
> vite

  VITE v5.0.8  ready in 423 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

🚀 Development server started successfully!`;
      }
      
      if (cmd === "test") {
        return `> sales-terminal-best-practices@1.0.0 test
> jest

PASS  src/components/InteractiveTerminal.test.tsx
✓ renders terminal (45 ms)
✓ executes commands (23 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
✅ All tests passed!`;
      }
      
      return `npm ERR! Unknown command: "${cmd}"`;
    },
    
    // Source command for activating virtual environments
    source: (args?: string) => {
      if (!args || !args.trim()) {
        return "source: filename argument required";
      }
      
      if (args.includes("venv/bin/activate") || args.includes(".venv/bin/activate")) {
        return "✅ Virtual environment activated\n(venv) will appear in your prompt";
      }
      
      if (args.includes("nvm.sh") || args.includes(".nvm/nvm.sh")) {
        setIsNvmInstalled(true);
        return "✅ nvm loaded successfully";
      }
      
      if (args.includes(".zshrc") || args.includes(".bashrc")) {
        // Loading shell config - check if pyenv was configured
        if (args.includes("pyenv")) {
          setIsPyenvInstalled(true);
        }
        return "✅ Shell configuration reloaded";
      }
      
      return `source: ${args}: No such file or directory`;
    },
    
    // Curl command for downloading nvm installer
    curl: (args?: string) => {
      if (!args || !args.trim()) {
        return "curl: try 'curl --help' for more information";
      }
      
      // Check for nvm installation
      if (args.includes("nvm-sh/nvm") && args.includes("install.sh")) {
        if (args.includes("| bash")) {
          setIsNvmInstalled(true);
          return `  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 15916  100 15916    0     0  98765      0 --:--:-- --:--:-- --:--:-- 98765
=> Downloading nvm from git to '/Users/sales-user/.nvm'
=> Cloning into '/Users/sales-user/.nvm'...
=> Compressing and cleaning up git repository

=> Appending nvm source string to /Users/sales-user/.zshrc
=> Appending bash_completion source string to /Users/sales-user/.zshrc
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"  # This loads nvm

✅ nvm installed successfully! Run: source ~/.nvm/nvm.sh`;
        }
        return "Downloading nvm installer...";
      }
      
      return `curl: ${args}: URL not recognized`;
    },
    
    chsh: (args?: string) => {
      if (!args || !args.includes("-s")) {
        return "usage: chsh -s /path/to/shell";
      }
      
      return `Changing shell for sales-user.
Password for sales-user:
✓ Shell changed successfully to zsh
🎉 Restart your terminal to see the new shell in action!`;
    },
    
    sh: (args?: string) => {
      if (!args || !args.includes("-c")) {
        return "usage: sh -c 'command'";
      }
      
      // Simulate Oh My Zsh installation
      if (args.includes("ohmyzsh")) {
        return `Cloning Oh My Zsh...
remote: Enumerating objects: 1234, done.
remote: Counting objects: 100% (1234/1234), done.
remote: Compressing objects: 100% (890/890), done.
remote: Total 1234 (delta 456), reused 1100 (delta 400)
Receiving objects: 100% (1234/1234), 825.50 KiB | 2.50 MiB/s, done.
Resolving deltas: 100% (456/456), done.

Looking for an existing zsh config...
Using the Oh My Zsh template file and adding it to ~/.zshrc.

         __                                     __
  ____  / /_     ____ ___  __  __   ____  _____/ /_
 / __ \\/ __ \\   / __ \`__ \\/ / / /  /_  / / ___/ __ \\
/ /_/ / / / /  / / / / / / /_/ /    / /_(__  ) / / /
\\____/_/ /_/  /_/ /_/ /_/\\__, /    /___/____/_/ /_/
                        /____/                       ....is now installed!

Please look over the ~/.zshrc file to select plugins, themes, and options.

🎉 Oh My Zsh installed successfully!
💡 Restart your terminal to see the beautiful new prompt!`;
      }
      
      return "sh: command executed";
    },
    
    // SSH key generation and management
    "ssh-keygen": (args?: string) => {
      if (!args || !args.includes("-t")) {
        return `usage: ssh-keygen -t ed25519 -C "your.email@example.com"`;
      }
      
      return `Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/sales-user/.ssh/id_ed25519): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /Users/sales-user/.ssh/id_ed25519
Your public key has been saved in /Users/sales-user/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:abc123def456ghi789jkl012mno345pqr678stu901 your.email@ibm.com
The key's randomart image is:
+--[ED25519 256]--+
|        .o+      |
|       . o =     |
|        o B +    |
|       . = B o   |
|        S = * .  |
|         o * =   |
|          + B    |
|         . + o   |
|          E.o    |
+----[SHA256]-----+

✓ SSH key pair generated successfully!
✓ Public key: ~/.ssh/id_ed25519.pub
✓ Private key: ~/.ssh/id_ed25519`;
    },
    
    eval: (args?: string) => {
      if (args?.includes("ssh-agent")) {
        return `Agent pid 12345
SSH_AUTH_SOCK=/tmp/ssh-XXXXXX/agent.12345; export SSH_AUTH_SOCK;
SSH_AGENT_PID=12345; export SSH_AGENT_PID;
echo Agent pid 12345;

✓ SSH agent started successfully`;
      }
      return "eval: command evaluation simulated";
    },
    
    "ssh-agent": () => {
      return `SSH_AUTH_SOCK=/tmp/ssh-XXXXXX/agent.12345; export SSH_AUTH_SOCK;
SSH_AGENT_PID=12345; export SSH_AGENT_PID;
echo Agent pid 12345;`;
    },
    
    "ssh-add": (args?: string) => {
      const keyPath = args?.trim() || "~/.ssh/id_ed25519";
      return `Enter passphrase for ${keyPath}: 
Identity added: ${keyPath} (your.email@ibm.com)

✓ SSH key added to agent successfully`;
    },
    // Package managers (apt for Ubuntu/Debian)
    
    apt: (args?: string) => {
      return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  git
0 upgraded, 1 newly installed, 0 to remove and 0 not upgraded.

✓ Package installed successfully via apt`;
    },
    
    "apt-get": (args?: string) => {
      if (args?.includes("install git")) {
        return `Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
The following NEW packages will be installed:
  git git-man liberror-perl
0 upgraded, 3 newly installed, 0 to remove and 0 not upgraded.
Need to get 8,524 kB of archives.
After this operation, 43.6 MB of additional disk space will be used.
Get:1 http://archive.ubuntu.com/ubuntu jammy/main amd64 git amd64 1:2.34.1-1ubuntu1 [3,165 kB]
Fetched 8,524 kB in 2s (4,262 kB/s)
Selecting previously unselected package git.
Unpacking git (1:2.34.1-1ubuntu1) ...
Setting up git (1:2.34.1-1ubuntu1) ...

✓ Git installed successfully via apt-get`;
      }
      return "apt-get command executed";
    },
    
    sudo: (args?: string) => {
      if (!args) {
        return "usage: sudo <command>";
      }
      
      // Simulate sudo by running the command
      const command = args.trim();
      if (command.startsWith("apt-get install git")) {
        return `[sudo] password for sales-user: 
Reading package lists... Done
Building dependency tree... Done
Git installed successfully`;
      }
      
      return `[sudo] password for sales-user: 
Command executed with sudo privileges`;
    },
    
    // Network commands
    ssh: (args?: string) => {
      const host = args?.trim() || "demo-server.ibm.com";
      return `Connecting to ${host}...
The authenticity of host '${host}' can't be established.
ED25519 key fingerprint is SHA256:abc123def456ghi789jkl012mno345pqr678stu901.
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '${host}' (ED25519) to the list of known hosts.
sales-user@${host}'s password:
Welcome to ${host}
Last login: ${new Date().toLocaleString()} from 192.168.1.100
[sales-user@${host} ~]$`;
    },
    
    scp: (args?: string) => {
      if (!args || !args.trim()) {
        return "usage: scp [source] [destination]";
      }
      return `Copying file...
file.txt                                      100%  1024    1.0MB/s   00:00`;
    },
    
    ping: (args?: string) => {
      const host = args?.trim() || "ibm.com";
      return `PING ${host} (104.94.220.129): 56 data bytes
64 bytes from 104.94.220.129: icmp_seq=0 ttl=54 time=12.345 ms
64 bytes from 104.94.220.129: icmp_seq=1 ttl=54 time=11.234 ms
64 bytes from 104.94.220.129: icmp_seq=2 ttl=54 time=13.456 ms
64 bytes from 104.94.220.129: icmp_seq=3 ttl=54 time=12.567 ms

--- ${host} ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 11.234/12.401/13.456/0.789 ms`;
    },
    
    wget: (args?: string) => {
      const url = args?.trim() || "https://example.com/file.zip";
      return `--${new Date().toISOString()}--  ${url}
Resolving example.com (example.com)... 93.184.216.34
Connecting to example.com (example.com)|93.184.216.34|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1048576 (1.0M) [application/zip]
Saving to: 'file.zip'

file.zip            100%[===================>]   1.00M  5.23MB/s    in 0.2s

${new Date().toISOString()} (5.23 MB/s) - 'file.zip' saved [1048576/1048576]`;
    },
    
    // Docker commands
    "docker ps": () => `CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                    NAMES
abc123def456   nginx:latest   "/docker-entrypoint.…"   2 hours ago     Up 2 hours     0.0.0.0:80->80/tcp       web-server
def456ghi789   postgres:14    "docker-entrypoint.s…"   3 hours ago     Up 3 hours     0.0.0.0:5432->5432/tcp   database
ghi789jkl012   redis:alpine   "docker-entrypoint.s…"   4 hours ago     Up 4 hours     0.0.0.0:6379->6379/tcp   cache`,
    
    "docker images": () => `REPOSITORY          TAG       IMAGE ID       CREATED        SIZE
nginx               latest    abc123def456   2 days ago     142MB
postgres            14        def456ghi789   3 days ago     376MB
redis               alpine    ghi789jkl012   5 days ago     32.3MB
node                18        jkl012mno345   1 week ago     993MB`,
    
    "docker build": (args?: string) => {
      const tag = args?.trim() || "myapp:latest";
      return `[+] Building 12.3s (15/15) FINISHED
 => [internal] load build definition from Dockerfile
 => => transferring dockerfile: 456B
 => [internal] load .dockerignore
 => => transferring context: 2B
 => [internal] load metadata for docker.io/library/node:18
 => [1/8] FROM docker.io/library/node:18
 => [2/8] WORKDIR /app
 => [3/8] COPY package*.json ./
 => [4/8] RUN npm install
 => [5/8] COPY . .
 => [6/8] RUN npm run build
 => exporting to image
 => => exporting layers
 => => writing image sha256:abc123...
 => => naming to docker.io/library/${tag}`;
    },
    
    "docker run": (args?: string) => {
      const image = args?.trim() || "myapp:latest";
      return `Unable to find image '${image}' locally
latest: Pulling from library/${image}
abc123def456: Pull complete
def456ghi789: Pull complete
ghi789jkl012: Pull complete
Digest: sha256:abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
Status: Downloaded newer image for ${image}
Container started: abc123def456ghi789jkl012mno345pqr678`;
    },
    
    "docker logs": (args?: string) => {
      const container = args?.trim() || "web-server";
      return `[${new Date().toISOString()}] INFO: Starting application...
[${new Date().toISOString()}] INFO: Server listening on port 3000
[${new Date().toISOString()}] INFO: Database connected successfully
[${new Date().toISOString()}] INFO: Ready to accept connections`;
    },
    
    "docker exec": (args?: string) => {
      if (!args || !args.trim()) {
        return "usage: docker exec [container] [command]";
      }
      return `Executing command in container...
root@abc123def456:/#`;
    },
    
    // Kubernetes commands
    "kubectl get": (args?: string) => {
      const resource = args?.trim() || "pods";
      if (resource === "pods") {
        return `NAME                          READY   STATUS    RESTARTS   AGE
web-app-7d4b8c9f5d-abc12      1/1     Running   0          2d
web-app-7d4b8c9f5d-def34      1/1     Running   0          2d
api-server-6c8d7b5f4e-ghi56   1/1     Running   0          3d
database-5b7c6d4e3f-jkl78     1/1     Running   0          5d`;
      }
      return `NAME                     TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
${resource}              ClusterIP   10.96.0.1       <none>        443/TCP    10d`;
    },
    
    "kubectl describe": (args?: string) => {
      const resource = args?.trim() || "pod web-app-7d4b8c9f5d-abc12";
      return `Name:         ${resource}
Namespace:    default
Priority:     0
Node:         node-1/192.168.1.10
Start Time:   ${new Date(Date.now() - 172800000).toISOString()}
Labels:       app=web-app
              version=v1.0.0
Status:       Running
IP:           10.244.0.5
Containers:
  web-app:
    Container ID:   docker://abc123def456
    Image:          myapp:latest
    Port:           3000/TCP
    State:          Running
      Started:      ${new Date(Date.now() - 172800000).toISOString()}
    Ready:          True
    Restart Count:  0`;
    },
    
    "kubectl logs": (args?: string) => {
      const pod = args?.trim() || "web-app-7d4b8c9f5d-abc12";
      return `[${new Date().toISOString()}] INFO: Application started
[${new Date().toISOString()}] INFO: Connected to database
[${new Date().toISOString()}] INFO: Server listening on port 3000
[${new Date().toISOString()}] INFO: Health check passed`;
    },
    
    "kubectl exec": (args?: string) => {
      if (!args || !args.trim()) {
        return "error: you must specify a pod";
      }
      return `Defaulting container name to web-app.
Use 'kubectl describe pod/${args.trim()}' to see all of the containers in this pod.
root@${args.trim()}:/#`;
    },
    
    "kubectl apply": (args?: string) => {
      const file = args?.trim() || "deployment.yaml";
      return `deployment.apps/web-app configured
service/web-app-service unchanged
configmap/app-config created`;
    },
    
    // System commands
    top: () => `top - ${new Date().toLocaleTimeString()} up 10 days, 5:23, 2 users, load average: 0.52, 0.58, 0.59
Tasks: 245 total,   1 running, 244 sleeping,   0 stopped,   0 zombie
%Cpu(s):  3.2 us,  1.5 sy,  0.0 ni, 95.1 id,  0.2 wa,  0.0 hi,  0.0 si,  0.0 st
MiB Mem :  16384.0 total,   2048.5 free,   8192.3 used,   6143.2 buff/cache
MiB Swap:   4096.0 total,   4096.0 free,      0.0 used.   7168.4 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
 1234 sales-u+  20   0 2048576 524288  32768 S   5.2   3.1   1:23.45 node
 5678 sales-u+  20   0 1048576 262144  16384 S   2.1   1.6   0:45.67 docker
 9012 sales-u+  20   0  524288 131072   8192 S   1.0   0.8   0:12.34 kubectl`,
    
    "df -h": () => `Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       100G   45G   50G  48% /
tmpfs           8.0G  1.2G  6.8G  15% /dev/shm
/dev/sda2       500G  250G  225G  53% /home
/dev/sdb1       1.0T  500G  500G  50% /data`,
    
    "free -h": () => `              total        used        free      shared  buff/cache   available
Mem:           16Gi       8.0Gi       2.0Gi       1.2Gi       6.0Gi       7.0Gi
Swap:         4.0Gi          0B       4.0Gi`,
    
    "ps aux": () => `USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
root         1  0.0  0.1 169416 11532 ?        Ss   Jan20   0:03 /sbin/init
sales-u+  1234  2.1  3.1 2048576 524288 ?      Sl   08:15   1:23 node server.js
sales-u+  5678  1.0  1.6 1048576 262144 ?      Sl   09:30   0:45 docker daemon
sales-u+  9012  0.5  0.8 524288 131072 ?       S    10:00   0:12 kubectl proxy`,
    
    man: (args?: string) => {
      const cmd = args?.trim() || "help";
      return `MAN(1)                    User Commands                    MAN(1)

NAME
       ${cmd} - manual page for ${cmd}

SYNOPSIS
       ${cmd} [OPTIONS] [ARGUMENTS]

DESCRIPTION
       This is a simulated manual page for the ${cmd} command.
       In a real terminal, this would show detailed documentation.
       
       For more information, visit: https://man7.org/linux/man-pages/

OPTIONS
       -h, --help
              Display help message and exit
       
       -v, --version
              Display version information

EXAMPLES
       ${cmd} --help
              Show help information

SEE ALSO
       help(1), info(1)

IBM Sales Terminal                2026                         MAN(1)`;
    },
    
    alias: () => `alias ll='ls -la'
alias la='ls -A'
alias l='ls -CF'
alias ..='cd ..'
alias ...='cd ../..'
alias gs='git status'
alias gp='git pull'
alias gc='git commit'
alias gco='git checkout'
alias k='kubectl'
alias d='docker'`,
    
    tips: () => `🎯 Hot Tips for Tech Sellers:

1. 📁 File Navigation:
   • Use 'cd -' to go back to previous directory
   • Use 'cd ~' to go to home directory
   • Use 'ls -lah' to see hidden files with sizes

2. 🔧 Git Best Practices:
   • Always 'git pull' before starting work
   • Use 'git status' frequently to check changes
   • Commit often with clear messages
   • Use 'git branch' to see all branches

3. 🐳 Docker Tips:
   • Use 'docker ps -a' to see all containers (including stopped)
   • Use 'docker logs -f' to follow logs in real-time
   • Clean up with 'docker system prune' regularly

4. ☸️  Kubernetes Essentials:
   • Use 'kubectl get pods -w' to watch pod status
   • Use 'kubectl describe' for detailed resource info
   • Use 'kubectl exec -it' for interactive shell

5. 🌐 SSH & Remote Access:
   • Use SSH keys instead of passwords
   • Use 'ssh-copy-id' to copy your public key
   • Use 'scp' for secure file transfers

6. 💡 Productivity Hacks:
   • Use Tab for auto-completion
   • Use Ctrl+R to search command history
   • Use Ctrl+C to cancel current command
   • Use Ctrl+L to clear screen (same as 'clear')
   • Use '!!' to repeat last command
   • Use 'history | grep [term]' to search history

7. 📊 Monitoring:
   • Use 'top' or 'htop' for system monitoring
   • Use 'df -h' to check disk space
   • Use 'free -h' to check memory usage

8. 🔍 Finding Files:
   • Use 'find . -name "*.js"' to find JavaScript files
   • Use 'grep -r "search term" .' to search in files

Type 'help' to see all available commands!`
  });

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      fontFamily: "'IBM Plex Mono', monospace",
      fontWeight: 400,
      fontWeightBold: 600,
      letterSpacing: 0,
      lineHeight: 1.2,
      theme: {
        background: "#161616",        // IBM Gray 100
        foreground: "#f4f4f4",        // IBM Gray 10
        cursor: "#0f62fe",            // IBM Blue 60
        cursorAccent: "#161616",
        selectionBackground: "rgba(15, 98, 254, 0.3)",
        black: "#161616",
        red: "#fa4d56",               // IBM Red 50
        green: "#24a148",             // IBM Green 50
        yellow: "#f1c21b",            // IBM Yellow 30
        blue: "#0f62fe",              // IBM Blue 60
        magenta: "#d12771",           // IBM Magenta 50
        cyan: "#1192e8",              // IBM Cyan 40
        white: "#f4f4f4",
        brightBlack: "#525252",       // IBM Gray 70
        brightRed: "#ff8389",         // IBM Red 40
        brightGreen: "#42be65",       // IBM Green 40
        brightYellow: "#fddc69",      // IBM Yellow 20
        brightBlue: "#4589ff",        // IBM Blue 50
        brightMagenta: "#ee5396",     // IBM Magenta 40
        brightCyan: "#33b1ff",        // IBM Cyan 30
        brightWhite: "#ffffff",
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

    // Track session start
    trackSessionStart();
    sessionStartTime.current = Date.now();
    commandCount.current = 0;

    // Welcome message
    term.writeln(welcomeMessage);
    term.writeln("");
    
    // Function to write output with realistic typing delay
    // For cat command and file content, write instantly (no delay)
    const writeOutputWithDelay = async (term: Terminal, output: string, delayMs: number = 8, instant: boolean = false) => {
      if (instant) {
        // Write instantly for cat and file content
        const lines = output.split('\n');
        lines.forEach((line, i) => {
          if (i < lines.length - 1) {
            term.writeln(line);
          } else {
            term.write(line);
          }
        });
        return;
      }
      
      const lines = output.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Write each character with a small delay for realistic effect
        for (const char of line) {
          term.write(char);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        // Add newline after each line except the last one
        if (i < lines.length - 1) {
          term.writeln('');
        }
      }
    };
    
    // Define executeCommand inside useEffect to access current state
    const executeCommand = (cmd: string): string => {
      const trimmedCmd = cmd.trim();
      const commands = getCommands(); // Get fresh commands object
      
      // Track command execution
      commandCount.current++;
      trackCommand(trimmedCmd, true);
      
      // Check if git command is being run without git installed
      if (trimmedCmd.startsWith("git ") && !isGitInstalledRef.current) {
        trackCommand(trimmedCmd, false);
        return "bash: git: command not found";
      }
      
      // Handle echo command
      if (trimmedCmd.startsWith("echo ")) {
        return trimmedCmd.substring(5);
      }
      
      // Check for exact multi-word command matches first (e.g., "git status", "docker ps")
      if (commands[trimmedCmd]) {
        return commands[trimmedCmd]();
      }
      
      // Check for two-word commands (e.g., "git status", "docker ps", "kubectl get")
      const parts = trimmedCmd.split(" ");
      if (parts.length >= 2) {
        const twoWordCmd = `${parts[0]} ${parts[1]}`;
        if (commands[twoWordCmd]) {
          const args = parts.slice(2).join(" ");
          return commands[twoWordCmd](args);
        }
      }
      
      // Handle single-word commands with arguments
      const command = parts[0];
      const args = parts.slice(1).join(" ");
      
      if (commands[command]) {
        return commands[command](args);
      }
      
      trackCommand(trimmedCmd, false);
      return `Command not found: ${command}. Type 'help' for available commands.`;
    };

    // Handle editor input (vim/nano)
    const handleEditorInput = (term: Terminal, data: string, code: number) => {
      const mode = editorModeRef.current;
      
      // Handle arrow keys (escape sequences)
      if (data.startsWith('\x1b[')) {
        const currentRow = cursorRowRef.current;
        const currentCol = cursorColRef.current;
        const content = editorContentRef.current;
        const vimModeVal = vimModeRef.current;
        
        // Arrow Up
        if (data === '\x1b[A') {
          if (currentRow > 0) {
            const newRow = currentRow - 1;
            setCursorRow(newRow);
            cursorRowRef.current = newRow;
            // Adjust column if new line is shorter
            const newLineLength = content[newRow]?.length || 0;
            if (currentCol > newLineLength) {
              setCursorCol(newLineLength);
              cursorColRef.current = newLineLength;
            }
            // Show visual feedback in NORMAL mode
            if (mode === 'vim' && vimModeVal === 'normal') {
              term.write('\r\n↑ Moved to line ' + (newRow + 1));
            }
          }
          return;
        }
        // Arrow Down
        else if (data === '\x1b[B') {
          if (currentRow < content.length - 1) {
            const newRow = currentRow + 1;
            setCursorRow(newRow);
            cursorRowRef.current = newRow;
            // Adjust column if new line is shorter
            const newLineLength = content[newRow]?.length || 0;
            if (currentCol > newLineLength) {
              setCursorCol(newLineLength);
              cursorColRef.current = newLineLength;
            }
            // Show visual feedback in NORMAL mode
            if (mode === 'vim' && vimModeVal === 'normal') {
              term.write('\r\n↓ Moved to line ' + (newRow + 1));
            }
          }
          return;
        }
        // Arrow Right
        else if (data === '\x1b[C') {
          const currentLineLength = content[currentRow]?.length || 0;
          if (currentCol < currentLineLength) {
            const newCol = currentCol + 1;
            setCursorCol(newCol);
            cursorColRef.current = newCol;
          }
          return;
        }
        // Arrow Left
        else if (data === '\x1b[D') {
          if (currentCol > 0) {
            const newCol = currentCol - 1;
            setCursorCol(newCol);
            cursorColRef.current = newCol;
          }
          return;
        }
      }
      
      if (mode === 'vim') {
        const vimModeVal = vimModeRef.current;
        
        // Handle ESC key (code 27)
        if (code === 27) {
          setVimMode('normal');
          // Show updated file content
          const content = editorContentRef.current;
          term.write('\r\n\nFile content:\r\n');
          content.forEach((line, idx) => {
            const marker = idx === cursorRowRef.current ? '> ' : '  ';
            term.write(`${marker}${line}\r\n`);
          });
          term.write('\r\n-- NORMAL MODE -- (Press \'i\' for INSERT, arrow keys to navigate)');
          return;
        }
        
        // NORMAL MODE
        if (vimModeVal === 'normal') {
          if (data === 'i') {
            setVimMode('insert');
            // Show which line is being edited
            const currentRow = cursorRowRef.current;
            const currentLine = editorContentRef.current[currentRow] || '';
            term.write(`\r\n-- INSERT MODE -- (Editing line ${currentRow + 1})\r\n`);
            term.write(`> ${currentLine}`);
          } else if (data === ':') {
            setVimMode('command');
            setVimCommand('');
            term.write('\r\n:');
          }
        }
        // INSERT MODE
        else if (vimModeVal === 'insert') {
          const currentRow = cursorRowRef.current;
          const currentCol = cursorColRef.current;
          
          // Handle pasted content (multi-line or multi-character)
          // Check for newlines first, then multi-character
          if (data.includes('\n') || data.includes('\r') || data.length > 1) {
            console.log('Paste detected:', { dataLength: data.length, hasNewline: data.includes('\n'), data: data.substring(0, 100) });
            const lines = data.split(/\r?\n/).filter(line => line !== ''); // Remove empty lines from split
            setEditorContent(prev => {
              const newContent = [...prev];
              const currentLine = newContent[currentRow] || '';
              const beforeCursor = currentLine.slice(0, currentCol);
              const afterCursor = currentLine.slice(currentCol);
              
              if (lines.length === 0) {
                return newContent;
              } else if (lines.length === 1) {
                // Single line paste
                newContent[currentRow] = beforeCursor + lines[0] + afterCursor;
                setCursorCol(currentCol + lines[0].length);
                cursorColRef.current = currentCol + lines[0].length;
              } else {
                // Multi-line paste
                newContent[currentRow] = beforeCursor + lines[0];
                // Insert middle lines
                for (let i = 1; i < lines.length; i++) {
                  newContent.splice(currentRow + i, 0, lines[i]);
                }
                // Append afterCursor to the last inserted line
                const lastLineIndex = currentRow + lines.length - 1;
                newContent[lastLineIndex] = newContent[lastLineIndex] + afterCursor;
                
                setCursorRow(lastLineIndex);
                cursorRowRef.current = lastLineIndex;
                setCursorCol(lines[lines.length - 1].length);
                cursorColRef.current = lines[lines.length - 1].length;
              }
              return newContent;
            });
            term.write(data.replace(/\n/g, '\r\n').replace(/\r\r/g, '\r'));
            return;
          }
          
          if (code === 13) { // Enter
            setEditorContent(prev => {
              const newContent = [...prev];
              const currentLine = newContent[currentRow] || '';
              // Split line at cursor position
              const beforeCursor = currentLine.slice(0, currentCol);
              const afterCursor = currentLine.slice(currentCol);
              newContent[currentRow] = beforeCursor;
              newContent.splice(currentRow + 1, 0, afterCursor);
              return newContent;
            });
            // Move cursor to start of new line
            setCursorRow(currentRow + 1);
            cursorRowRef.current = currentRow + 1;
            setCursorCol(0);
            cursorColRef.current = 0;
            term.write('\r\n');
          } else if (code === 127) { // Backspace
            if (currentCol > 0) {
              setEditorContent(prev => {
                const newContent = [...prev];
                const currentLine = newContent[currentRow] || '';
                newContent[currentRow] = currentLine.slice(0, currentCol - 1) + currentLine.slice(currentCol);
                return newContent;
              });
              setCursorCol(currentCol - 1);
              cursorColRef.current = currentCol - 1;
              term.write('\b \b');
            } else if (currentRow > 0) {
              // Backspace at start of line - merge with previous line
              setEditorContent(prev => {
                const newContent = [...prev];
                const prevLine = newContent[currentRow - 1] || '';
                const currentLine = newContent[currentRow] || '';
                newContent[currentRow - 1] = prevLine + currentLine;
                newContent.splice(currentRow, 1);
                return newContent;
              });
              const prevLineLength = editorContentRef.current[currentRow - 1]?.length || 0;
              setCursorRow(currentRow - 1);
              cursorRowRef.current = currentRow - 1;
              setCursorCol(prevLineLength);
              cursorColRef.current = prevLineLength;
            }
          } else if (code >= 32 && code < 127) {
            setEditorContent(prev => {
              const newContent = [...prev];
              const currentLine = newContent[currentRow] || '';
              // Insert character at cursor position
              newContent[currentRow] = currentLine.slice(0, currentCol) + data + currentLine.slice(currentCol);
              return newContent;
            });
            setCursorCol(currentCol + 1);
            cursorColRef.current = currentCol + 1;
            term.write(data);
          }
        }
        // COMMAND MODE
        else if (vimModeVal === 'command') {
          if (code === 13) { // Enter - execute command
            const cmd = vimCommandRef.current;
            const fileName = editorFileRef.current;
            if (cmd === 'w' || cmd === 'wq') {
              // Save file
              const content = editorContentRef.current.join('\n');
              setFileContents(prev => ({
                ...prev,
                [fileName]: content
              }));
              term.write('\r\n"' + fileName + '" written');
              trackEditorUsage('vim', 'save', fileName);
            }
            if (cmd === 'q' || cmd === 'wq') {
              // Quit editor
              setEditorMode('none');
              setVimMode('normal');
              term.write('\r\n');
              term.write(getPrompt());
              trackEditorUsage('vim', 'close', fileName);
              return;
            }
            // If invalid command, show error
            if (cmd && cmd !== 'w' && cmd !== 'q' && cmd !== 'wq') {
              term.write('\r\nE492: Not an editor command: ' + cmd);
            }
            setVimMode('normal');
          } else if (code === 127) { // Backspace
            setVimCommand(prev => {
              const newCmd = prev.slice(0, -1);
              term.write('\b \b');
              return newCmd;
            });
          } else if (code >= 32 && code < 127) {
            setVimCommand(prev => prev + data);
            term.write(data);
          }
        }
      }
      // NANO MODE (always in insert mode)
      else if (mode === 'nano') {
        const currentRow = cursorRowRef.current;
        const currentCol = cursorColRef.current;
        
        // Handle Ctrl+X (code 24) - Exit
        if (code === 24) {
          const fileName = editorFileRef.current;
          setEditorMode('none');
          term.write('\r\nExiting nano...\r\n');
          term.write(getPrompt());
          trackEditorUsage('nano', 'close', fileName);
          return;
        }
        // Handle Ctrl+O (code 15) - Save
        else if (code === 15) {
          const fileName = editorFileRef.current;
          const content = editorContentRef.current.join('\n');
          setFileContents(prev => ({
            ...prev,
            [fileName]: content
          }));
          term.write('\r\n[ Wrote ' + editorContentRef.current.length + ' lines ]\r\n');
          trackEditorUsage('nano', 'save', fileName);
        }
        // Handle pasted content (multi-line or multi-character)
        else if (data.length > 1 || data.includes('\n') || data.includes('\r')) {
          const lines = data.split(/\r?\n/).filter(line => line !== ''); // Remove empty lines from split
          setEditorContent(prev => {
            const newContent = [...prev];
            const currentLine = newContent[currentRow] || '';
            const beforeCursor = currentLine.slice(0, currentCol);
            const afterCursor = currentLine.slice(currentCol);
            
            if (lines.length === 0) {
              return newContent;
            } else if (lines.length === 1) {
              // Single line paste
              newContent[currentRow] = beforeCursor + lines[0] + afterCursor;
              setCursorCol(currentCol + lines[0].length);
              cursorColRef.current = currentCol + lines[0].length;
            } else {
              // Multi-line paste
              newContent[currentRow] = beforeCursor + lines[0];
              // Insert middle lines
              for (let i = 1; i < lines.length; i++) {
                newContent.splice(currentRow + i, 0, lines[i]);
              }
              // Append afterCursor to the last inserted line
              const lastLineIndex = currentRow + lines.length - 1;
              newContent[lastLineIndex] = newContent[lastLineIndex] + afterCursor;
              
              setCursorRow(lastLineIndex);
              cursorRowRef.current = lastLineIndex;
              setCursorCol(lines[lines.length - 1].length);
              cursorColRef.current = lines[lines.length - 1].length;
            }
            return newContent;
          });
          term.write(data.replace(/\n/g, '\r\n').replace(/\r\r/g, '\r'));
        }
        // Handle Enter
        else if (code === 13) {
          setEditorContent(prev => {
            const newContent = [...prev];
            const currentLine = newContent[currentRow] || '';
            // Split line at cursor position
            const beforeCursor = currentLine.slice(0, currentCol);
            const afterCursor = currentLine.slice(currentCol);
            newContent[currentRow] = beforeCursor;
            newContent.splice(currentRow + 1, 0, afterCursor);
            return newContent;
          });
          // Move cursor to start of new line
          setCursorRow(currentRow + 1);
          cursorRowRef.current = currentRow + 1;
          setCursorCol(0);
          cursorColRef.current = 0;
          term.write('\r\n');
        }
        // Handle Backspace
        else if (code === 127) {
          if (currentCol > 0) {
            setEditorContent(prev => {
              const newContent = [...prev];
              const currentLine = newContent[currentRow] || '';
              newContent[currentRow] = currentLine.slice(0, currentCol - 1) + currentLine.slice(currentCol);
              return newContent;
            });
            setCursorCol(currentCol - 1);
            cursorColRef.current = currentCol - 1;
            term.write('\b \b');
          } else if (currentRow > 0) {
            // Backspace at start of line - merge with previous line
            setEditorContent(prev => {
              const newContent = [...prev];
              const prevLine = newContent[currentRow - 1] || '';
              const currentLine = newContent[currentRow] || '';
              newContent[currentRow - 1] = prevLine + currentLine;
              newContent.splice(currentRow, 1);
              return newContent;
            });
            const prevLineLength = editorContentRef.current[currentRow - 1]?.length || 0;
            setCursorRow(currentRow - 1);
            cursorRowRef.current = currentRow - 1;
            setCursorCol(prevLineLength);
            cursorColRef.current = prevLineLength;
          }
        }
        // Handle regular characters
        else if (code >= 32 && code < 127) {
          setEditorContent(prev => {
            const newContent = [...prev];
            const currentLine = newContent[currentRow] || '';
            // Insert character at cursor position
            newContent[currentRow] = currentLine.slice(0, currentCol) + data + currentLine.slice(currentCol);
            return newContent;
          });
          setCursorCol(currentCol + 1);
          cursorColRef.current = currentCol + 1;
          term.write(data);
        }
      }
    };

    // Run initial commands
    initialCommands.forEach(cmd => {
      term.write(getPrompt());
      term.writeln(cmd);
      const output = executeCommand(cmd);
      if (output) {
        // Write each line separately to avoid indentation issues
        output.split('\n').forEach(line => term.writeln(line));
      }
    });
    
    term.write(getPrompt());
    
    // Focus terminal on mount
    term.focus();

    // Handle input
    term.onData((data) => {
      const code = data.charCodeAt(0);

      // Check if we're in editor mode
      if (editorModeRef.current !== 'none') {
        handleEditorInput(term, data, code);
        return;
      }

      // Handle Enter
      if (code === 13) {
        term.write("\r\n");
        const trimmedLine = currentLineRef.current.trim();
        
        if (trimmedLine) {
          setCommandHistory(prev => [...prev, trimmedLine]);
          const output = executeCommand(trimmedLine);
          if (output) {
            // Check if command is cat or wc - use instant output for file content
            const isInstantCommand = trimmedLine.startsWith('cat ') || trimmedLine.startsWith('wc ');
            
            // Write output with realistic typing delay (or instant for cat/wc)
            writeOutputWithDelay(term, output, 8, isInstantCommand).then(() => {
              term.writeln('');
              // Only show prompt if we're not in editor mode
              if (editorModeRef.current === 'none') {
                term.write(getPrompt());
              }
            });
          } else {
            // Only show prompt if we're not in editor mode
            if (editorModeRef.current === 'none') {
              term.write(getPrompt());
            }
          }
        } else {
          term.write(getPrompt());
        }
        
        setCurrentLine("");
        setHistoryIndex(-1);
      }
      // Handle Backspace
      else if (code === 127) {
        if (currentLineRef.current.length > 0) {
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
          term.write("\r\x1b[K");
          term.write(getPrompt());
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
          term.write("\r\x1b[K");
          term.write(getPrompt());
          term.write(cmd);
          setCurrentLine(cmd);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          term.write("\r\x1b[K");
          term.write(getPrompt());
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
      // Track session end
      const duration = Date.now() - sessionStartTime.current;
      trackSessionEnd(duration, commandCount.current);
      
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
      xtermRef.current.write(getPrompt());
      setCurrentLine("");
      setCommandHistory([]);
      setHistoryIndex(-1);
      setCurrentDir("/home/sales-user/projects");
      setCurrentBranch("main");
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