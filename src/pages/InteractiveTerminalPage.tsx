import React, { useState } from "react";
import { Grid, Column, Heading, Section, Dropdown } from "@carbon/react";
import { Terminal, Keyboard, Branch, ChevronDown, ChevronUp } from "@carbon/icons-react";
import InteractiveTerminal from "../components/InteractiveTerminal";
import ExerciseCard from "../components/ExerciseCard";
import { CodeWithCopy } from "../components/CodeWithCopy";

export default function InteractiveTerminalPage() {
  const [selectedLab, setSelectedLab] = useState("lab1");
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());

  const labs = [
    { id: "lab1", text: "Lab 1: Terminal Basics" },
    { id: "lab2", text: "Lab 2: Git Workflows" }
  ];

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercises(prev => {
      const newSet = new Set(prev);
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId);
      } else {
        newSet.add(exerciseId);
      }
      return newSet;
    });
  };
  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Terminal size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Terminal Simulator Practice</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px" }}>
            Practice terminal commands in a safe, interactive environment. Try the commands you've learned!
          </p>
        </Section>

        {/* Safe Learning Environment Banner */}
        <Section level={3} style={{ marginBottom: "2rem" }}>
          <div style={{
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "4px",
            marginBottom: "1.5rem",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
            borderLeft: "4px solid #0f62fe"
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <span style={{ fontSize: "1.5rem", lineHeight: 1 }}>💡</span>
              <div>
                <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#161616", fontSize: "1.125rem", fontWeight: 600 }}>
                  Safe Learning Environment
                </h3>
                <p style={{ color: "#525252", lineHeight: 1.7, marginBottom: 0, fontSize: "0.9375rem" }}>
                  This is a <strong style={{ color: "#161616" }}>simulated terminal</strong> - a safe sandbox for learning. All commands are simulated and won't affect your actual system.
                  Practice freely without worrying about making mistakes! When you're comfortable, apply these skills in your real development environment.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div style={{
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "4px",
            marginBottom: "2rem",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Keyboard size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#161616" }}>
                Quick Tips
              </h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.7, fontSize: "0.9375rem" }}>
              <li style={{ marginBottom: "0.5rem" }}>
                Try commands like: <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>ls</code>, <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>pwd</code>, <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>mkdir</code>, <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>cd</code>, <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git status</code>
              </li>
              <li style={{ marginBottom: "0.5rem" }}>
                Use <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>↑</code> and <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>↓</code> arrow keys to navigate command history
              </li>
              <li>
                Type <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>help</code> to see all available commands
              </li>
            </ul>
          </div>
        </Section>

        {/* Side-by-side layout: Exercises on left, Terminal on right */}
        <Section level={3} style={{ marginBottom: "2rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "400px 1fr",
            gap: "2rem",
            alignItems: "start"
          }}>
            {/* Practice Exercises - Left Side */}
            <div style={{
              position: "sticky",
              top: "80px",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto"
            }}>
              <div style={{
                backgroundColor: "#f4f4f4",
                padding: "1.5rem",
                borderRadius: "4px"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#161616" }}>
                    Practice Exercises
                  </h3>
                </div>
                
                {/* Lab Selector Dropdown */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <Dropdown
                    id="lab-selector"
                    titleText="Select Lab"
                    label="Choose a lab"
                    items={labs}
                    itemToString={(item) => (item ? item.text : "")}
                    selectedItem={labs.find(lab => lab.id === selectedLab)}
                    onChange={({ selectedItem }) => setSelectedLab(selectedItem?.id || "lab1")}
                  />
                </div>
                
                {/* Lab 1: Terminal Basics */}
                {selectedLab === "lab1" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Exercise 1 */}
                  <ExerciseCard
                    id="lab1-ex1"
                    title="Exercise 1: Environment Discovery"
                    scenario="Scenario: You've just logged into a client's server"
                    isExpanded={expandedExercises.has('lab1-ex1')}
                    onToggle={toggleExercise}
                  >
                    <CodeWithCopy code="whoami" description="Verify your user identity" />
                    <CodeWithCopy code="pwd" description="Confirm working directory" />
                    <CodeWithCopy code="ls -la" description="List all files (including hidden)" />
                    <CodeWithCopy code="hostname" description="Identify the server" />
                  </ExerciseCard>

                  {/* Exercise 2 */}
                  <ExerciseCard
                    id="lab1-ex2"
                    title="Exercise 2: Repository Management"
                    scenario="Scenario: Checking deployment status"
                    isExpanded={expandedExercises.has('lab1-ex2')}
                    onToggle={toggleExercise}
                  >
                    <CodeWithCopy code="git status" description="Check repo state" />
                    <CodeWithCopy code="git branch" description="View current branch" />
                    <CodeWithCopy code="git log --oneline -5" description="Recent commits" />
                    <CodeWithCopy code="git diff" description="View uncommitted changes" />
                  </ExerciseCard>

                  {/* Exercise 3 */}
                  <ExerciseCard
                    id="lab1-ex3"
                    title="Exercise 3: File System Operations"
                    scenario="Scenario: Organizing project files"
                    isExpanded={expandedExercises.has('lab1-ex3')}
                    onToggle={toggleExercise}
                  >
                    <CodeWithCopy code="mkdir -p docs/api" description="Create nested directories" />
                    <CodeWithCopy code="touch README.md" description="Create documentation" />
                    <CodeWithCopy code="cp config.yml config.bak" description="Backup configuration" />
                    <CodeWithCopy code='find . -name "*.log"' description="Locate log files" />
                  </ExerciseCard>

                  {/* Exercise 4 */}
                  <ExerciseCard
                    id="lab1-ex4"
                    title="Exercise 4: System Diagnostics"
                    scenario="Scenario: Troubleshooting performance issues"
                    isExpanded={expandedExercises.has('lab1-ex4')}
                    onToggle={toggleExercise}
                  >
                    <CodeWithCopy code="df -h" description="Check disk space" />
                    <CodeWithCopy code="ps aux | grep node" description="Find Node processes" />
                    <CodeWithCopy code="tail -f app.log" description="Monitor logs live" />
                    <CodeWithCopy code="netstat -tuln" description="Check open ports" />
                  </ExerciseCard>

                  {/* Pro Tip */}
                  <div style={{
                    backgroundColor: "#e8f4ff",
                    padding: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #0f62fe",
                    marginTop: "0.5rem"
                  }}>
                    <div style={{ fontSize: "0.875rem", color: "#161616", lineHeight: 1.6 }}>
                      <strong style={{ color: "#0f62fe" }}>💡 Pro Tip:</strong> Use <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>↑/↓</code> arrows for command history, <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>Tab</code> for auto-complete, and <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>Ctrl+C</code> to cancel commands.
                    </div>
                  </div>
                </div>
                )}

                {/* Lab 2: Git Workflows */}
                {selectedLab === "lab2" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Exercise -1: Install Zsh (Optional but Recommended) */}
                  <ExerciseCard
                    id="lab2-ex-1"
                    title="Exercise -1: Install Zsh (Optional but Recommended) ⭐"
                    scenario="Scenario: Set up a modern, powerful shell with Oh My Zsh for better terminal experience"
                    isExpanded={expandedExercises.has('lab2-ex-1')}
                    onToggle={toggleExercise}
                    special={true}
                  >
                      <div style={{ marginBottom: "0.75rem", padding: "0.75rem", backgroundColor: "#f4f4f4", borderRadius: "3px" }}>
                        <strong style={{ color: "#161616" }}>💡 Why Zsh?</strong>
                        <p style={{ margin: "0.5rem 0 0 0", color: "#525252", fontSize: "0.8125rem" }}>
                          Zsh provides better auto-completion, syntax highlighting, and a beautiful prompt with git branch info - exactly like what you see in this simulator!
                        </p>
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #e0e0e0" }}>
                        <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Step 1: Install Zsh</strong>
                      </div>
                      <div style={{ paddingLeft: "1rem" }}>
                        <CodeWithCopy code="brew install zsh" description="macOS (Homebrew)" />
                        <CodeWithCopy code="sudo apt-get install zsh" description="Ubuntu/Debian" />
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                        <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Step 2: Install Oh My Zsh (Makes Zsh Beautiful)</strong>
                      </div>
                      <div style={{ paddingLeft: "1rem" }}>
                        <CodeWithCopy
                          code='sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"'
                          block={true}
                        />
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                        <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Step 3: Make Zsh Your Default Shell</strong>
                      </div>
                      <div style={{ paddingLeft: "1rem" }}>
                        <CodeWithCopy code="chsh -s $(which zsh)" description="Set as default" />
                      </div>
                      <div style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                        <span style={{ color: "#525252", fontSize: "0.8125rem" }}>Then restart your terminal to see the magic! ✨</span>
                      </div>
                      
                      <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f5e9", borderRadius: "3px", borderLeft: "3px solid #24a148" }}>
                        <strong style={{ color: "#24a148", fontSize: "0.8125rem" }}>🎯 Pro Tip:</strong>
                        <p style={{ margin: "0.5rem 0 0 0", color: "#161616", fontSize: "0.8125rem" }}>
                          After installing Oh My Zsh, your terminal will look just like this simulator with colorful prompts and git branch info!
                        </p>
                      </div>
                  </ExerciseCard>

                  {/* Exercise 0: Check Git Installation */}
                  <ExerciseCard
                    id="lab2-ex0"
                    title="Exercise 0: Verify Git Installation"
                    scenario="First time using Git - check if it's installed"
                    isExpanded={expandedExercises.has('lab2-ex0')}
                    onToggle={toggleExercise}
                  >
                      <CodeWithCopy code="git --version" description="Check Git version" />
                      <CodeWithCopy code="which git" description="Find Git location" />
                      <div style={{ marginBottom: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #e0e0e0" }}>
                        <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>📝 If Git is not installed:</strong>
                      </div>
                      <div style={{ paddingLeft: "1rem" }}>
                        <CodeWithCopy code="brew install git" description="macOS (Homebrew)" />
                        <CodeWithCopy code="sudo apt-get install git" description="Ubuntu/Debian" />
                      </div>
                      <div style={{ paddingLeft: "1rem" }}>
                        <span style={{ color: "#525252", fontSize: "0.8125rem" }}>Windows: Download from git-scm.com</span>
                      </div>
                  </ExerciseCard>

                  {/* Exercise 1: SSH Key Setup */}
                  <ExerciseCard
                    id="lab2-ex1"
                    title="Exercise 1: Set Up SSH Keys"
                    scenario="Secure authentication with GitHub/Enterprise Git"
                    isExpanded={expandedExercises.has('lab2-ex1')}
                    onToggle={toggleExercise}
                  >
                      <CodeWithCopy code='ssh-keygen -t ed25519 -C "your.email@ibm.com"' description="Generate SSH key" />
                      <CodeWithCopy code='eval "$(ssh-agent -s)"' description="Start SSH agent" />
                      <CodeWithCopy code="ssh-add ~/.ssh/id_ed25519" description="Add key to agent" />
                      <CodeWithCopy code="cat ~/.ssh/id_ed25519.pub" description="Display public key" />
                      <CodeWithCopy code="ssh -T git@github.ibm.com" description="Test connection" />
                      <div style={{ marginTop: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #e0e0e0", fontSize: "0.8125rem", color: "#525252" }}>
                        💡 Copy the public key and add it to GitHub Settings → SSH Keys
                      </div>
                  </ExerciseCard>

                  {/* Exercise 2: Git Configuration */}
                  <ExerciseCard
                    id="lab2-ex2"
                    title="Exercise 2: Configure Git"
                    scenario="Set up your Git identity and preferences"
                    isExpanded={expandedExercises.has('lab2-ex2')}
                    onToggle={toggleExercise}
                  >
                      <CodeWithCopy code='git config --global user.name "Your Name"' description="Set your name" />
                      <CodeWithCopy code='git config --global user.email "you@ibm.com"' description="Set your email" />
                      <CodeWithCopy code="git config --global init.defaultBranch main" description="Set default branch" />
                      <CodeWithCopy code="git config --list" description="Verify configuration" />
                  </ExerciseCard>

                  {/* Exercise 3: Real-World Feature Implementation */}
                  <ExerciseCard
                    id="lab2-ex3"
                    title="Exercise 3: Clone Real Repo & Implement Feature"
                    scenario="🎯 Real Scenario: Add a new terminal tip to this very app!"
                    isExpanded={expandedExercises.has('lab2-ex3')}
                    onToggle={toggleExercise}
                  >
                      <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0f7ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px" }}>
                        <strong style={{ color: "#0f62fe" }}>📦 Your Mission:</strong> Clone the sales-terminal-best-practices repo and add a new tip to the Terminal Basics page
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 1: Clone the repository
                      </div>
                      <CodeWithCopy
                        code="git clone https://github.com/content-studio-sandbox/sales-terminal-best-practices.git"
                        block={true}
                      />
                      <CodeWithCopy code="cd sales-terminal-best-practices" description="Enter the project" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 2: Explore the codebase
                      </div>
                      <CodeWithCopy code="ls -la" description="See project structure" />
                      <CodeWithCopy code="git log --oneline -5" description="View recent commits" />
                      <CodeWithCopy code="cat README.md" description="Read project docs" />
                      
                      <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#fff3cd", borderLeft: "3px solid #f1c21b", borderRadius: "3px", fontSize: "0.8125rem" }}>
                        💡 <strong>Pro Tip:</strong> Always explore a repo before making changes. Check the README, recent commits, and project structure!
                      </div>
                  </ExerciseCard>

                  {/* Exercise 4: Feature Branch & Implementation */}
                  <ExerciseCard
                    id="lab2-ex4"
                    title="Exercise 4: Create Feature Branch & Make Changes"
                    scenario="🚀 Real Scenario: Implement the 'Add Terminal Tip' feature"
                    isExpanded={expandedExercises.has('lab2-ex4')}
                    onToggle={toggleExercise}
                  >
                      <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0f7ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px" }}>
                        <strong style={{ color: "#0f62fe" }}>🎯 Your Task:</strong> Add a new tip about using <code style={{ backgroundColor: "#e0e0e0", padding: "2px 4px", borderRadius: "2px" }}>git status</code> frequently
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 1: Create a feature branch
                      </div>
                      <CodeWithCopy code="git checkout -b feature/add-git-status-tip" description="Create & switch to feature branch" />
                      <CodeWithCopy code="git branch" description="Verify you're on the new branch" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 2: Create a new OpenShift page
                      </div>
                      <div style={{ marginBottom: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f4ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px", fontSize: "0.8125rem" }}>
                        📋 <strong>Instructions:</strong> Copy the OpenShift page code from the <a href="/openshift-best-practices" target="_blank" style={{ color: "#0f62fe", textDecoration: "underline" }}>OpenShift Best Practices</a> page and paste it into a new file.
                      </div>
                      <CodeWithCopy code="ls src/pages/" description="List existing page files" />
                      <CodeWithCopy code="touch src/pages/OpenShiftBestPracticesPage.tsx" description="Create new file" />
                      <CodeWithCopy code="code src/pages/OpenShiftBestPracticesPage.tsx" description="Open in VS Code (or use nano/vim)" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 3: Verify the file was created
                      </div>
                      <CodeWithCopy code="ls src/pages/ | grep OpenShift" description="Confirm file exists" />
                      <CodeWithCopy code="wc -l src/pages/OpenShiftBestPracticesPage.tsx" description="Check line count (~444 lines)" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 4: Check what changed
                      </div>
                      <CodeWithCopy code="git status" description="See modified files" />
                      <CodeWithCopy code="git diff src/pages/TerminalBasicsPage.tsx" description="View exact changes" />
                      
                      <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#fff3cd", borderLeft: "3px solid #f1c21b", borderRadius: "3px", fontSize: "0.8125rem" }}>
                        💡 <strong>Best Practice:</strong> Always review your changes with <code style={{ backgroundColor: "#e0e0e0", padding: "2px 4px", borderRadius: "2px" }}>git diff</code> before committing!
                      </div>
                  </ExerciseCard>

                  {/* Exercise 5: Commit Your Feature */}
                  <ExerciseCard
                    id="lab2-ex5"
                    title="Exercise 5: Stage and Commit Your Changes"
                    scenario="📝 Real Scenario: Save your new OpenShift page with a good commit message"
                    isExpanded={expandedExercises.has('lab2-ex5')}
                    onToggle={toggleExercise}
                  >
                      <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0f7ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px" }}>
                        <strong style={{ color: "#0f62fe" }}>🎯 Goal:</strong> Create a clean, professional commit for your new page
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 1: Check what changed
                      </div>
                      <CodeWithCopy code="git status" description="See new file (untracked)" />
                      <CodeWithCopy code="git diff src/pages/OpenShiftBestPracticesPage.tsx" description="View the new file content" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 2: Stage your new file
                      </div>
                      <CodeWithCopy code="git add src/pages/OpenShiftBestPracticesPage.tsx" description="Stage the new file" />
                      <CodeWithCopy code="git status" description="Verify file is staged (green)" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 3: Write a good commit message
                      </div>
                      <CodeWithCopy
                        code='git commit -m "feat: add OpenShift Best Practices page for tech sellers"'
                        block={true}
                      />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 3: Verify your commit
                      </div>
                      <CodeWithCopy code="git log --oneline -1" description="See your latest commit" />
                      <CodeWithCopy code="git show" description="View commit details" />
                      
                      <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#e8f5e9", borderLeft: "3px solid #24a148", borderRadius: "3px", fontSize: "0.8125rem" }}>
                        ✅ <strong>Commit Message Best Practices:</strong>
                        <ul style={{ margin: "0.5rem 0 0 1.25rem", paddingLeft: 0 }}>
                          <li>Start with a type: feat, fix, docs, style, refactor, test, chore</li>
                          <li>Use present tense: "add" not "added"</li>
                          <li>Be specific but concise</li>
                          <li>Explain WHAT and WHY, not HOW</li>
                        </ul>
                      </div>
                  </ExerciseCard>

                  {/* Exercise 6: Push and Create PR */}
                  <ExerciseCard
                    id="lab2-ex6"
                    title="Exercise 6: Push Branch & Create Pull Request"
                    scenario="🚀 Real Scenario: Share your feature with the team for review"
                    isExpanded={expandedExercises.has('lab2-ex6')}
                    onToggle={toggleExercise}
                  >
                      <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0f7ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px" }}>
                        <strong style={{ color: "#0f62fe" }}>🎯 Goal:</strong> Push your feature branch and open a PR for team review
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 1: Sync with remote main
                      </div>
                      <CodeWithCopy code="git checkout main" description="Switch to main branch" />
                      <CodeWithCopy code="git pull origin main" description="Get latest changes" />
                      <CodeWithCopy code="git checkout feature/add-git-status-tip" description="Back to your branch" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 2: Push your feature branch
                      </div>
                      <CodeWithCopy
                        code="git push -u origin feature/add-git-status-tip"
                        description="Push and set upstream tracking"
                        block={true}
                      />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 3: Create Pull Request
                      </div>
                      <div style={{ marginBottom: "0.5rem", padding: "0.75rem", backgroundColor: "#f4f4f4", borderRadius: "3px", fontSize: "0.8125rem" }}>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>1.</strong> Go to: <a href="https://github.com/content-studio-sandbox/sales-terminal-best-practices" target="_blank" rel="noopener noreferrer" style={{ color: "#0f62fe", textDecoration: "none" }}>github.com/content-studio-sandbox/sales-terminal-best-practices</a>
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>2.</strong> Click "Compare & pull request" button
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>3.</strong> Write PR description:
                          <div style={{ marginTop: "0.5rem", padding: "0.5rem", backgroundColor: "#ffffff", border: "1px solid #e0e0e0", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.75rem" }}>
                            ## What Changed<br/>
                            Added new tip about using git status frequently<br/>
                            <br/>
                            ## Why<br/>
                            Helps users understand the importance of checking repo state<br/>
                            <br/>
                            ## Testing<br/>
                            - Verified tip displays correctly<br/>
                            - Checked formatting and styling
                          </div>
                        </div>
                        <div>
                          <strong>4.</strong> Click "Create pull request"
                        </div>
                      </div>
                      
                      <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#e8f5e9", borderLeft: "3px solid #24a148", borderRadius: "3px", fontSize: "0.8125rem" }}>
                        🎉 <strong>Congratulations!</strong> You've completed a full feature development workflow:
                        <ul style={{ margin: "0.5rem 0 0 1.25rem", paddingLeft: 0 }}>
                          <li>✅ Cloned a real repository</li>
                          <li>✅ Created a feature branch</li>
                          <li>✅ Made meaningful changes</li>
                          <li>✅ Committed with a good message</li>
                          <li>✅ Pushed and created a PR</li>
                        </ul>
                      </div>
                  </ExerciseCard>

                  {/* Pro Tip for Git */}
                  <div style={{
                    backgroundColor: "#e8f4ff",
                    padding: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #0f62fe",
                    marginTop: "0.5rem"
                  }}>
                    <div style={{ fontSize: "0.875rem", color: "#161616", lineHeight: 1.6 }}>
                      <strong style={{ color: "#0f62fe" }}>💡 Pro Tip:</strong> Always <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git pull</code> before starting work and <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git status</code> frequently to stay aware of your changes.
                    </div>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Terminal Simulator - Right Side */}
            <div style={{
              maxWidth: "100%",
              overflow: "hidden"
            }}>
              <InteractiveTerminal
                welcomeMessage="🚀 FSM Terminal Practice Environment - Type 'help' to get started!"
                initialCommands={[]}
              />
            </div>
          </div>
        </Section>

        {/* Removed old exercises section that was below */}
        <Section level={3} style={{ marginTop: "3rem", display: "none" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Try These Exercises
            </h3>
            
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "1.5rem", 
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                  Exercise 1: Basic Navigation
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>whoami</code> to see your username</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>pwd</code> to see your current directory</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>ls</code> to list files</li>
                </ol>
              </div>

              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "1.5rem", 
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                  Exercise 2: Git Commands
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>git status</code> to check repository status</li>
                  <li>Try using the up arrow to recall the previous command</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>history</code> to see all commands you've run</li>
                </ol>
              </div>

              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "1.5rem", 
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                  Exercise 3: Echo and Date
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>echo Hello World</code> to print text</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>date</code> to see the current date and time</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>clear</code> to clean up your terminal</li>
                </ol>
              </div>

              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "1.5rem", 
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                  Exercise 4: SSH Demo
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>ssh demo</code> to simulate an SSH connection</li>
                  <li>Observe the connection message and server prompt</li>
                  <li>This demonstrates what you'll see when connecting to real servers</li>
                </ol>
              </div>
            </div>

            {/* Terminal Simulator - Right Side */}
            <div>
              <InteractiveTerminal
                welcomeMessage="🚀 FSM Terminal Practice Environment - Type 'help' to get started!"
                initialCommands={[]}
              />
            </div>
          </div>
        </Section>

      </Column>
    </Grid>
  );
}