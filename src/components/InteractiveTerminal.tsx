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

  // Use refs to store latest state values for event handlers
  const currentLineRef = useRef(currentLine);
  const currentDirRef = useRef(currentDir);
  const fileSystemRef = useRef(fileSystem);
  const commandHistoryRef = useRef(commandHistory);

  // Update refs when state changes
  useEffect(() => {
    currentLineRef.current = currentLine;
  }, [currentLine]);

  useEffect(() => {
    currentDirRef.current = currentDir;
  }, [currentDir]);

  useEffect(() => {
    fileSystemRef.current = fileSystem;
  }, [fileSystem]);

  useEffect(() => {
    commandHistoryRef.current = commandHistory;
  }, [commandHistory]);

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
      const fileName = args.trim();
      
      // Handle SSH public key file specially
      if (fileName === "~/.ssh/id_ed25519.pub" || fileName === ".ssh/id_ed25519.pub" || fileName.includes("id_ed25519.pub")) {
        return `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl your.email@ibm.com

✓ This is your SSH public key - copy this and add it to GitHub Settings → SSH Keys`;
      }
      
      const files = fileSystemRef.current[currentDirRef.current] || [];
      
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
      const files = fileSystemRef.current[currentDirRef.current] || [];
      if (!files.includes(repoName + "/")) {
        setFileSystem(prev => ({
          ...prev,
          [currentDirRef.current]: [...files, repoName + "/"],
          [`${currentDirRef.current}/${repoName}`]: ["README.md", "src/", "package.json"]
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
    
    // Text editors
    vim: (args?: string) => {
      const file = args?.trim() || "untitled";
      return `Opening ${file} in vim...
~ VIM - Vi IMproved
~
~ version 9.0
~ by Bram Moolenaar et al.
~
~ type  :help<Enter>       for information
~ type  :q<Enter>          to exit
~ type  :wq<Enter>         to save and exit
~
"${file}" [New File]
-- INSERT --`;
    },
    
    nano: (args?: string) => {
      const file = args?.trim() || "untitled";
      return `GNU nano 7.2                    ${file}


  


^G Help     ^O Write Out ^W Where Is  ^K Cut
^X Exit     ^R Read File ^\\ Replace   ^U Paste`;
    },
    
    // Git commands
    "git branch": () => `* main
  develop
  feature/new-dashboard
  hotfix/security-patch`,
    
    "git checkout": (args?: string) => {
      if (!args || !args.trim()) {
        return "error: you must specify a branch name";
      }
      return `Switched to branch '${args.trim()}'`;
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
    
    "git diff": () => `diff --git a/src/app.ts b/src/app.ts
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
 }`,
    
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
        return "✓ Staged all changes";
      }
      
      return `✓ Staged: ${files}`;
    },
    
    "git commit": (args?: string) => {
      if (!args || !args.includes("-m")) {
        return `error: no commit message provided
usage: git commit -m "message"`;
      }
      
      const match = args.match(/-m\s+["']([^"']+)["']/);
      const message = match ? match[1] : "Update files";
      
      return `[main abc123d] ${message}
 1 file changed, 5 insertions(+), 2 deletions(-)`;
    },
    
    // Git setup and utility commands
    "git --version": () => "git version 2.39.3",
    
    "git version": () => "git version 2.39.3",
    
    which: (args?: string) => {
      const cmd = args?.trim() || "";
      const paths: Record<string, string> = {
        git: "/usr/bin/git",
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
    
    // Package managers
    brew: (args?: string) => {
      if (!args || !args.trim()) {
        return `Example usage:
  brew install git
  brew update
  brew upgrade`;
      }
      
      const trimmedArgs = args.trim();
      
      if (trimmedArgs.startsWith("install")) {
        const pkg = trimmedArgs.split(/\s+/)[1] || "package";
        return `==> Downloading ${pkg}
==> Pouring ${pkg}--2.39.3.arm64_ventura.bottle.tar.gz
🍺  ${pkg} 2.39.3 is installed

✓ ${pkg} installed successfully via Homebrew`;
      }
      
      if (trimmedArgs === "update") {
        return `==> Updating Homebrew...
==> Auto-updated Homebrew!
Updated 2 taps (homebrew/core and homebrew/cask).

✓ Homebrew updated successfully`;
      }
      
      return "Homebrew command executed";
    },
    
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
    
    curl: (args?: string) => {
      const url = args?.trim() || "https://api.example.com";
      return `HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 85

{
  "status": "success",
  "message": "API is running",
  "version": "1.0.0"
}`;
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

    // Welcome message
    term.writeln(welcomeMessage);
    term.writeln("");
    
    // Define executeCommand inside useEffect to access current state
    const executeCommand = (cmd: string): string => {
      const trimmedCmd = cmd.trim();
      const commands = getCommands(); // Get fresh commands object
      
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
      
      return `Command not found: ${command}. Type 'help' for available commands.`;
    };

    // Run initial commands
    initialCommands.forEach(cmd => {
      term.writeln(`$ ${cmd}`);
      const output = executeCommand(cmd);
      if (output) {
        // Write each line separately to avoid indentation issues
        output.split('\n').forEach(line => term.writeln(line));
      }
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
        const trimmedLine = currentLineRef.current.trim();
        
        if (trimmedLine) {
          setCommandHistory(prev => [...prev, trimmedLine]);
          const output = executeCommand(trimmedLine);
          if (output) {
            // Write each line separately to avoid indentation issues
            output.split('\n').forEach(line => term.writeln(line));
          }
        }
        
        setCurrentLine("");
        setHistoryIndex(-1);
        term.write("$ ");
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