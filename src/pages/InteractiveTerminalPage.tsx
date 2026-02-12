import React, { useState } from "react";
import { Grid, Column, Heading, Section, Dropdown } from "@carbon/react";
import { Terminal, Keyboard, Branch, ChevronDown, ChevronUp, Rocket, Checkmark, Information, Idea, FlagFilled, DocumentTasks, WarningAlt } from "@carbon/icons-react";
import InteractiveTerminal from "../components/InteractiveTerminal";
import ExerciseCard from "../components/ExerciseCard";
import { CodeWithCopy } from "../components/CodeWithCopy";

export default function InteractiveTerminalPage() {
  const [selectedLab, setSelectedLab] = useState<"lab1" | "lab2" | "lab3">("lab1");
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(new Set());

  const labs = [
    { id: "lab1", text: "Lab 1: Terminal Basics" },
    { id: "lab2", text: "Lab 2: Git Workflows" },
    { id: "lab3", text: "Lab 3: Local Setup + Run Project" }
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
            <Heading style={{ margin: 0 }}>Practice Lab</Heading>
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
              <Idea size={32} style={{ color: "#0f62fe", flexShrink: 0 }} />
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
                    onChange={({ selectedItem }) => setSelectedLab((selectedItem?.id || "lab1") as "lab1" | "lab2" | "lab3")}
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
                    <div style={{ fontSize: "0.875rem", color: "#161616", lineHeight: 1.6, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Information size={20} style={{ color: "#0f62fe", flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: "#0f62fe" }}>Pro Tip:</strong> Use <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>↑/↓</code> arrows for command history, <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>Tab</code> for auto-complete, and <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>Ctrl+C</code> to cancel commands.
                      </div>
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
                      <div style={{ marginBottom: "0.75rem", padding: "0.75rem", backgroundColor: "#f4f4f4", borderRadius: "3px", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <Information size={20} style={{ color: "#0f62fe", flexShrink: 0, marginTop: "0.125rem" }} />
                        <div>
                          <strong style={{ color: "#161616" }}>Why Zsh?</strong>
                          <p style={{ margin: "0.5rem 0 0 0", color: "#525252", fontSize: "0.8125rem" }}>
                            Zsh provides better auto-completion, syntax highlighting, and a beautiful prompt with git branch info - exactly like what you see in this simulator!
                          </p>
                        </div>
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
                      
                      <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f5e9", borderRadius: "3px", borderLeft: "3px solid #24a148", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <FlagFilled size={20} style={{ color: "#24a148", flexShrink: 0, marginTop: "0.125rem" }} />
                        <div>
                          <strong style={{ color: "#24a148", fontSize: "0.8125rem" }}>Pro Tip:</strong>
                          <p style={{ margin: "0.5rem 0 0 0", color: "#161616", fontSize: "0.8125rem" }}>
                            After installing Oh My Zsh, your terminal will look just like this simulator with colorful prompts and git branch info!
                          </p>
                        </div>
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
                      <div style={{ marginTop: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid #e0e0e0", fontSize: "0.8125rem", color: "#525252", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Information size={16} style={{ color: "#0f62fe", flexShrink: 0 }} />
                        <span>Copy the public key and add it to GitHub Settings → SSH Keys</span>
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
                    scenario="Real Scenario: Add a new terminal tip to this very app!"
                    isExpanded={expandedExercises.has('lab2-ex3')}
                    onToggle={toggleExercise}
                  >
                      <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0f7ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FlagFilled size={20} style={{ color: "#0f62fe", flexShrink: 0 }} />
                        <div><strong style={{ color: "#0f62fe" }}>Your Mission:</strong> Clone the sales-terminal-best-practices repo and add a new tip to the Terminal Basics page</div>
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
                      
                      <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#fff3cd", borderLeft: "3px solid #f1c21b", borderRadius: "3px", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Information size={20} style={{ color: "#f1c21b", flexShrink: 0 }} />
                        <div><strong>Pro Tip:</strong> Always explore a repo before making changes. Check the README, recent commits, and project structure!</div>
                      </div>
                  </ExerciseCard>

                  {/* Exercise 4: Feature Branch & Implementation */}
                  <ExerciseCard
                    id="lab2-ex4"
                    title="Exercise 4: Create Feature Branch & Make Changes"
                    scenario="Real Scenario: Implement the 'Add Terminal Tip' feature"
                    isExpanded={expandedExercises.has('lab2-ex4')}
                    onToggle={toggleExercise}
                  >
                      <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0f7ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FlagFilled size={20} style={{ color: "#0f62fe", flexShrink: 0 }} />
                        <div><strong style={{ color: "#0f62fe" }}>Your Task:</strong> Add a new OpenShift Best Practices page to the application</div>
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 1: Create a feature branch
                      </div>
                      <CodeWithCopy code="git checkout -b feature/add-openshift-page" description="Create & switch to feature branch" />
                      <CodeWithCopy code="git branch" description="Verify you're on the new branch" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 2: Create the OpenShift page/tab from the navigation bar
                      </div>
                      <div style={{ marginBottom: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f4ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px", fontSize: "0.8125rem", display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                        <DocumentTasks size={20} style={{ color: "#0f62fe", flexShrink: 0, marginTop: "0.125rem" }} />
                        <div><strong>Instructions:</strong> Copy the OpenShift page code from <a href="https://gist.github.ibm.com/Oscar-Ricaud/1f51bc2e06070dc0306ab15a1d1c869a" target="_blank" rel="noopener noreferrer" style={{ color: "#0f62fe", textDecoration: "underline" }}>this GitHub gist</a> and paste it into vim when you open the file.</div>
                      </div>
                      <CodeWithCopy code="ls src/pages/" description="List existing page files" />
                      <CodeWithCopy
                        code="touch src/pages/OpenShiftBestPracticesPage.tsx"
                        description="Create new file"
                        block={true}
                      />
                      <CodeWithCopy
                        code="vim src/pages/OpenShiftBestPracticesPage.tsx"
                        description="Open in vim, press 'i' for INSERT mode, paste gist content, ESC then :wq to save"
                        block={true}
                      />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 3: Verify the file was created
                      </div>
                      <CodeWithCopy
                        code="ls src/pages/ | grep OpenShift"
                        description="Confirm file exists"
                      />
                      <CodeWithCopy
                        code="wc -l src/pages/OpenShiftBestPracticesPage.tsx"
                        description="Check line count (~444 lines)"
                        block={true}
                      />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 4: Check what changed
                      </div>
                      <CodeWithCopy code="git status" description="See new file" />
                      <CodeWithCopy
                        code="git diff src/pages/OpenShiftBestPracticesPage.tsx"
                        description="View the new file (shows as new file before staging)"
                        block={true}
                      />
                      <CodeWithCopy
                        code="cat src/pages/OpenShiftBestPracticesPage.tsx"
                        description="Or view file content directly"
                        block={true}
                      />
                      
                      <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#fff3cd", borderLeft: "3px solid #f1c21b", borderRadius: "3px", fontSize: "0.8125rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Information size={20} style={{ color: "#f1c21b", flexShrink: 0 }} />
                        <div><strong>Best Practice:</strong> Always review your changes with <code style={{ backgroundColor: "#e0e0e0", padding: "2px 4px", borderRadius: "2px" }}>git diff</code> before committing!</div>
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
                      <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0f7ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FlagFilled size={20} style={{ color: "#0f62fe", flexShrink: 0 }} />
                        <div><strong style={{ color: "#0f62fe" }}>Goal:</strong> Create a clean, professional commit for your new page</div>
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 1: Check what changed
                      </div>
                      <CodeWithCopy code="git status" description="See new file (untracked)" />
                      <CodeWithCopy
                        code="git diff src/pages/OpenShiftBestPracticesPage.tsx"
                        description="View the new file content"
                        block={true}
                      />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 2: Stage your new file
                      </div>
                      <CodeWithCopy
                        code="git add src/pages/OpenShiftBestPracticesPage.tsx"
                        description="Stage the new file"
                        block={true}
                      />
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
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <Checkmark size={20} style={{ color: "#24a148", flexShrink: 0 }} />
                          <strong>Commit Message Best Practices:</strong>
                        </div>
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
                    scenario="Real Scenario: Share your feature with the team for review"
                    isExpanded={expandedExercises.has('lab2-ex6')}
                    onToggle={toggleExercise}
                  >
                      <div style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: "#f0f7ff", borderLeft: "3px solid #0f62fe", borderRadius: "3px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <Rocket size={20} style={{ color: "#0f62fe", flexShrink: 0 }} />
                        <div><strong style={{ color: "#0f62fe" }}>Goal:</strong> Push your feature branch and open a PR for team review</div>
                      </div>
                      
                      <div style={{ marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 1: Verify you're on the correct branch
                      </div>
                      <CodeWithCopy code="git status" description="Confirm you're on feature/add-openshift-page" />
                      
                      <div style={{ marginTop: "1rem", marginBottom: "0.75rem", fontWeight: 600, color: "#161616" }}>
                        Step 2: Push your feature branch
                      </div>
                      <CodeWithCopy
                        code="git push -u origin feature/add-openshift-page"
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
                            Added new OpenShift Best Practices page<br/>
                            <br/>
                            ## Why<br/>
                            Provides comprehensive OpenShift guidance for developers<br/>
                            <br/>
                            ## Testing<br/>
                            - Verified page displays correctly<br/>
                            - Checked all links and navigation<br/>
                            - Validated content formatting
                          </div>
                        </div>
                        <div>
                          <strong>4.</strong> Click "Create pull request"
                        </div>
                      </div>
                      
                      <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#e8f5e9", borderLeft: "3px solid #24a148", borderRadius: "3px", fontSize: "0.8125rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                          <Checkmark size={20} style={{ color: "#24a148", flexShrink: 0 }} />
                          <strong>Congratulations!</strong> You've completed a full feature development workflow:
                        </div>
                        <ul style={{ margin: "0.5rem 0 0 1.25rem", paddingLeft: 0 }}>
                          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <Checkmark size={16} style={{ color: "#24a148", flexShrink: 0 }} />
                            <span>Cloned a real repository</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <Checkmark size={16} style={{ color: "#24a148", flexShrink: 0 }} />
                            <span>Created a feature branch</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <Checkmark size={16} style={{ color: "#24a148", flexShrink: 0 }} />
                            <span>Made meaningful changes</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <Checkmark size={16} style={{ color: "#24a148", flexShrink: 0 }} />
                            <span>Committed with a good message</span>
                          </li>
                          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Checkmark size={16} style={{ color: "#24a148", flexShrink: 0 }} />
                            <span>Pushed and created a PR</span>
                          </li>
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
                    <div style={{ fontSize: "0.875rem", color: "#161616", lineHeight: 1.6, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Information size={20} style={{ color: "#0f62fe", flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: "#0f62fe" }}>Pro Tip:</strong> Always <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git pull</code> before starting work and <code style={{ backgroundColor: "#ffffff", padding: "2px 5px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git status</code> frequently to stay aware of your changes.
                      </div>
                    </div>
                  </div>

                {/* Lab 3: Local Setup + Run Project */}
                {selectedLab === "lab3" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Instructor Notes */}
                  <div style={{
                    backgroundColor: "#fff3cd",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: "2px solid #ffc107",
                    marginBottom: "0.5rem"
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <Rocket size={24} style={{ color: "#856404", flexShrink: 0, marginTop: "0.125rem" }} />
                      <div>
                        <h4 style={{ margin: "0 0 0.75rem 0", color: "#856404", fontSize: "1rem", fontWeight: 600 }}>
                          📋 Instructor Notes - 30-Minute Live Training
                        </h4>
                        <p style={{ margin: "0 0 0.5rem 0", color: "#856404", fontSize: "0.875rem", lineHeight: 1.6 }}>
                          <strong>Presentation Flow:</strong> Start in simulator for confidence building, then transition to real terminal for live demo.
                        </p>
                        <p style={{ margin: "0", color: "#856404", fontSize: "0.875rem", lineHeight: 1.6, fontStyle: "italic" }}>
                          <strong>Handoff Moment:</strong> "Everything here is simulated. Next I'll run the same workflow in my real terminal."
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Exercise 1: Preflight Checks */}
                  <ExerciseCard
                    id="lab3-ex1"
                    title="Exercise 1: Preflight Checks"
                    scenario="Verify your development environment is ready"
                    isExpanded={expandedExercises.has('lab3-ex1')}
                    onToggle={toggleExercise}
                  >
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Check Node.js & npm:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="node -v" description="Check Node version" />
                      <CodeWithCopy code="npm -v" description="Check npm version" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Check Python & pip:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="python3 --version" description="Check Python version" />
                      <CodeWithCopy code="pip --version" description="Check pip version" />
                    </div>
                    
                    <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f5e9", borderRadius: "3px", borderLeft: "3px solid #24a148" }}>
                      <p style={{ margin: 0, color: "#161616", fontSize: "0.8125rem" }}>
                        ✅ <strong>Success:</strong> If all commands return version numbers, you're ready to proceed!
                      </p>
                    </div>
                  </ExerciseCard>

                  {/* Exercise 2: Understand the Repo */}
                  <ExerciseCard
                    id="lab3-ex2"
                    title="Exercise 2: Understand the Repo"
                    scenario="Identify if it's a Node or Python project"
                    isExpanded={expandedExercises.has('lab3-ex2')}
                    onToggle={toggleExercise}
                  >
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Navigate and explore:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="ls -la" description="List all files" />
                      <CodeWithCopy code="cat README.md" description="Read project documentation" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Look for these signals:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem", marginBottom: "0.5rem" }}>
                      <CodeWithCopy code="ls package.json" description="Node.js project indicator" />
                      <CodeWithCopy code="ls requirements.txt" description="Python project indicator" />
                    </div>
                    
                    <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f4ff", borderRadius: "3px", borderLeft: "3px solid #0f62fe" }}>
                      <p style={{ margin: 0, color: "#161616", fontSize: "0.8125rem" }}>
                        💡 <strong>Pro Tip:</strong> package.json = Node project, requirements.txt = Python project
                      </p>
                    </div>
                  </ExerciseCard>

                  {/* Exercise 3: Node Version Control (nvm) */}
                  <ExerciseCard
                    id="lab3-ex3"
                    title="Exercise 3: Node Version Control (nvm)"
                    scenario="Manage Node.js versions with nvm"
                    isExpanded={expandedExercises.has('lab3-ex3')}
                    onToggle={toggleExercise}
                  >
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Check nvm installation:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="nvm --version" description="Verify nvm is installed" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>List and switch versions:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="nvm ls" description="List installed Node versions" />
                      <CodeWithCopy code="nvm install 18" description="Install Node 18" />
                      <CodeWithCopy code="nvm use 18" description="Switch to Node 18" />
                      <CodeWithCopy code="node -v" description="Verify version changed" />
                    </div>
                    
                    <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#fff3cd", borderRadius: "3px", borderLeft: "3px solid #ffc107" }}>
                      <p style={{ margin: 0, color: "#856404", fontSize: "0.8125rem" }}>
                        ⚠️ <strong>Note:</strong> Different projects may require different Node versions. Always check .nvmrc or README.md
                      </p>
                    </div>
                  </ExerciseCard>

                  {/* Exercise 4: Python Version Control (pyenv) */}
                  <ExerciseCard
                    id="lab3-ex4"
                    title="Exercise 4: Python Version Control (pyenv)"
                    scenario="Manage Python versions with pyenv"
                    isExpanded={expandedExercises.has('lab3-ex4')}
                    onToggle={toggleExercise}
                  >
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Check pyenv installation:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="pyenv --version" description="Verify pyenv is installed" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>List and set versions:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="pyenv versions" description="List installed Python versions" />
                      <CodeWithCopy code="pyenv install 3.11" description="Install Python 3.11" />
                      <CodeWithCopy code="pyenv local 3.11" description="Set local version to 3.11" />
                      <CodeWithCopy code="python --version" description="Verify version changed" />
                    </div>
                  </ExerciseCard>

                  {/* Exercise 5: Dependencies & Environment */}
                  <ExerciseCard
                    id="lab3-ex5"
                    title="Exercise 5: Dependencies & Environment"
                    scenario="Install project dependencies"
                    isExpanded={expandedExercises.has('lab3-ex5')}
                    onToggle={toggleExercise}
                  >
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>For Node.js projects:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="npm install" description="Install dependencies from package.json" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>For Python projects:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="python -m venv .venv" description="Create virtual environment" />
                      <CodeWithCopy code="source .venv/bin/activate" description="Activate virtual environment" />
                      <CodeWithCopy code="pip install -r requirements.txt" description="Install dependencies" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Environment variables:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="cp .env.example .env" description="Copy environment template" />
                      <span style={{ color: "#525252", fontSize: "0.8125rem" }}>Then edit .env with your values</span>
                    </div>
                  </ExerciseCard>

                  {/* Exercise 6: Run It Locally (Capstone) */}
                  <ExerciseCard
                    id="lab3-ex6"
                    title="Exercise 6: Run It Locally (Capstone) 🎯"
                    scenario="Complete workflow: clone → setup → run"
                    isExpanded={expandedExercises.has('lab3-ex6')}
                    onToggle={toggleExercise}
                    special={true}
                  >
                    <div style={{ marginBottom: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f5e9", borderRadius: "3px" }}>
                      <strong style={{ color: "#24a148" }}>🎯 Capstone Exercise:</strong>
                      <p style={{ margin: "0.5rem 0 0 0", color: "#161616", fontSize: "0.8125rem" }}>
                        This simulates the complete workflow you'll use in real projects
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Step 1: Clone the repository</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="git clone https://github.com/example/demo-app.git" block={true} />
                      <CodeWithCopy code="cd demo-app" description="Navigate into project" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Step 2: Set correct version</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="nvm use" description="Use Node version from .nvmrc" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Step 3: Install dependencies</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="npm install" description="Install all packages" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Step 4: Run the dev server</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="npm run dev" description="Start development server" />
                    </div>
                    
                    <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f5e9", borderRadius: "3px", borderLeft: "3px solid #24a148" }}>
                      <p style={{ margin: 0, color: "#161616", fontSize: "0.8125rem" }}>
                        ✅ <strong>Success!</strong> You should see: "Server running on http://localhost:3000"
                      </p>
                    </div>
                  </ExerciseCard>

                  {/* Exercise 7: Common Fix - Wrong Node Version */}
                  <ExerciseCard
                    id="lab3-ex7"
                    title="Exercise 7: Troubleshooting - Wrong Node Version"
                    scenario="Fix: 'Error: Requires Node.js 18.x'"
                    isExpanded={expandedExercises.has('lab3-ex7')}
                    onToggle={toggleExercise}
                  >
                    <div style={{ marginBottom: "0.75rem", padding: "0.75rem", backgroundColor: "#ffebee", borderRadius: "3px", borderLeft: "3px solid #d32f2f" }}>
                      <strong style={{ color: "#d32f2f" }}>❌ Error:</strong>
                      <p style={{ margin: "0.5rem 0 0 0", color: "#161616", fontSize: "0.8125rem", fontFamily: "monospace" }}>
                        Error: The engine "node" is incompatible with this module. Expected version "18.x". Got "16.14.0"
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Solution:</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="node -v" description="Check current version" />
                      <CodeWithCopy code="nvm install 18" description="Install required version" />
                      <CodeWithCopy code="nvm use 18" description="Switch to Node 18" />
                      <CodeWithCopy code="npm install" description="Reinstall dependencies" />
                    </div>
                  </ExerciseCard>

                  {/* Exercise 8: Common Fix - Port in Use */}
                  <ExerciseCard
                    id="lab3-ex8"
                    title="Exercise 8: Troubleshooting - Port Already in Use"
                    scenario="Fix: 'Error: Port 3000 is already in use'"
                    isExpanded={expandedExercises.has('lab3-ex8')}
                    onToggle={toggleExercise}
                  >
                    <div style={{ marginBottom: "0.75rem", padding: "0.75rem", backgroundColor: "#ffebee", borderRadius: "3px", borderLeft: "3px solid #d32f2f" }}>
                      <strong style={{ color: "#d32f2f" }}>❌ Error:</strong>
                      <p style={{ margin: "0.5rem 0 0 0", color: "#161616", fontSize: "0.8125rem", fontFamily: "monospace" }}>
                        Error: listen EADDRINUSE: address already in use :::3000
                      </p>
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Solution 1: Find and kill the process</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="lsof -i :3000" description="Find process using port 3000" />
                      <CodeWithCopy code="kill -9 <PID>" description="Kill the process (replace <PID>)" />
                    </div>
                    
                    <div style={{ marginBottom: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #e0e0e0" }}>
                      <strong style={{ color: "#161616", fontSize: "0.8125rem" }}>Solution 2: Use a different port</strong>
                    </div>
                    <div style={{ paddingLeft: "1rem" }}>
                      <CodeWithCopy code="PORT=3001 npm run dev" description="Run on port 3001 instead" />
                    </div>
                    
                    <div style={{ marginTop: "0.75rem", padding: "0.75rem", backgroundColor: "#e8f4ff", borderRadius: "3px", borderLeft: "3px solid #0f62fe" }}>
                      <p style={{ margin: 0, color: "#161616", fontSize: "0.8125rem" }}>
                        💡 <strong>Pro Tip:</strong> Check .env file for PORT configuration options
                      </p>
                    </div>
                  </ExerciseCard>

                  {/* Pro Tip for Lab 3 */}
                  <div style={{
                    backgroundColor: "#e8f4ff",
                    padding: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #0f62fe",
                    marginTop: "0.5rem"
                  }}>
                    <div style={{ fontSize: "0.875rem", color: "#161616", lineHeight: 1.6, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Information size={20} style={{ color: "#0f62fe", flexShrink: 0 }} />
                      <div>
                        <strong style={{ color: "#0f62fe" }}>Pro Tip:</strong> Always read the README.md first! It contains project-specific setup instructions and requirements.
                      </div>
                    </div>
                  </div>
                </div>
                )}
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
                welcomeMessage="FSM Terminal Practice Environment - Type 'help' to get started!"
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