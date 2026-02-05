import React, { useState } from "react";
import { Grid, Column, Heading, Section, Dropdown } from "@carbon/react";
import { Terminal, Keyboard, Branch } from "@carbon/icons-react";
import InteractiveTerminal from "../components/InteractiveTerminal";

export default function InteractiveTerminalPage() {
  const [selectedLab, setSelectedLab] = useState("lab1");

  const labs = [
    { id: "lab1", text: "Lab 1: Terminal Basics" },
    { id: "lab2", text: "Lab 2: Git Workflows" }
  ];
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

        {/* Side-by-side layout: Terminal on left, Exercises on right */}
        <Section level={3} style={{ marginBottom: "2rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "2rem",
            alignItems: "start"
          }}>
            {/* Terminal Simulator - Left Side */}
            <div>
              <InteractiveTerminal
                welcomeMessage="🚀 FSM Terminal Practice Environment - Type 'help' to get started!"
                initialCommands={[]}
              />
            </div>

            {/* Practice Exercises - Right Side */}
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
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 1: Environment Discovery
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: You've just logged into a client's server
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>whoami</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Verify your user identity</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>pwd</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Confirm working directory</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>ls -la</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ List all files (including hidden)</span>
                      </div>
                      <div>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>hostname</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Identify the server</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise 2 */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 2: Repository Management
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: Checking deployment status
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git status</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Check repo state</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git branch</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ View current branch</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git log --oneline -5</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Recent commits</span>
                      </div>
                      <div>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git diff</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ View uncommitted changes</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise 3 */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 3: File System Operations
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: Organizing project files
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>mkdir -p docs/api</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Create nested directories</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>touch README.md</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Create documentation</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>cp config.yml config.bak</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Backup configuration</span>
                      </div>
                      <div>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>find . -name "*.log"</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Locate log files</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise 4 */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 4: System Diagnostics
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: Troubleshooting performance issues
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>df -h</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Check disk space</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>ps aux | grep node</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Find Node processes</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>tail -f app.log</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Monitor logs live</span>
                      </div>
                      <div>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>netstat -tuln</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Check open ports</span>
                      </div>
                    </div>
                  </div>

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
                  {/* Exercise 1: Git Setup */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 1: Git Configuration
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: Setting up Git for the first time
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git config --global user.name "Your Name"</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Set your name</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git config --global user.email "you@ibm.com"</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Set your email</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git config --list</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Verify configuration</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise 2: Clone and Explore */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 2: Clone and Explore Repository
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: Starting work on a project
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git clone https://github.com/example/repo.git</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Clone repository</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>cd repo</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Enter directory</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git status</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Check status</span>
                      </div>
                      <div>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git log --oneline -5</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ View recent commits</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise 3: Branching */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 3: Create and Switch Branches
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: Working on a new feature
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git branch</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ List branches</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git checkout -b feature/new-feature</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Create & switch branch</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git branch</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Verify current branch</span>
                      </div>
                      <div>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git checkout main</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Switch back to main</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise 4: Commit Workflow */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 4: Stage and Commit Changes
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: Saving your work
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>touch newfile.txt</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Create a file</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git status</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ See untracked file</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git add newfile.txt</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Stage the file</span>
                      </div>
                      <div>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git commit -m "Add new file"</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Commit changes</span>
                      </div>
                    </div>
                  </div>

                  {/* Exercise 5: Push and Pull */}
                  <div style={{
                    backgroundColor: "#ffffff",
                    padding: "1.25rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                      Exercise 5: Sync with Remote
                    </h4>
                    <p style={{ margin: "0 0 0.75rem 0", fontSize: "0.875rem", color: "#525252", fontStyle: "italic" }}>
                      Scenario: Sharing your work with the team
                    </p>
                    <div style={{ fontSize: "0.875rem", lineHeight: 1.7, color: "#161616" }}>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git pull origin main</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Get latest changes</span>
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git push origin feature/new-feature</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Push your branch</span>
                      </div>
                      <div>
                        <code style={{ backgroundColor: "#f4f4f4", padding: "3px 6px", borderRadius: "3px", fontFamily: "'IBM Plex Mono', monospace" }}>git diff main</code>
                        <span style={{ color: "#525252", marginLeft: "0.5rem" }}>→ Compare with main</span>
                      </div>
                    </div>
                  </div>

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
          </div>
        </Section>

      </Column>
    </Grid>
  );
}