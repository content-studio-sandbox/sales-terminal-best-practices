import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Code, Keyboard, Lightning } from "@carbon/icons-react";

export default function VimBestPracticesPage() {
  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Code size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Editors (Vim)</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Vim is a powerful text editor used by developers worldwide. While it has a steep learning curve,
            mastering basic Vim commands will make you significantly more productive when working on servers
            or in terminal environments.
          </p>
        </Section>

        {/* Why Learn Vim */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
              Why Learn Vim?
            </h3>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li><strong>Universal:</strong> Pre-installed on virtually every Linux/Unix system</li>
              <li><strong>Fast:</strong> Edit files without leaving the terminal</li>
              <li><strong>Powerful:</strong> Complex edits with just a few keystrokes</li>
              <li><strong>Remote Work:</strong> Essential for SSH sessions and server management</li>
              <li><strong>Professional:</strong> Expected skill for technical roles</li>
            </ul>
          </div>
        </Section>

        {/* Vim Modes */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Understanding Vim Modes</h3>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                {
                  mode: "Normal Mode",
                  key: "ESC",
                  desc: "Default mode for navigation and commands",
                  color: "#0f62fe"
                },
                {
                  mode: "Insert Mode",
                  key: "i",
                  desc: "Type and edit text like a regular editor",
                  color: "#24a148"
                },
                {
                  mode: "Visual Mode",
                  key: "v",
                  desc: "Select text for copying, cutting, or manipulation",
                  color: "#d12771"
                },
                {
                  mode: "Command Mode",
                  key: ":",
                  desc: "Execute commands like save, quit, search & replace",
                  color: "#f1c21b"
                }
              ].map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: `2px solid ${item.color}`
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                    <code style={{
                      backgroundColor: item.color,
                      color: "#ffffff",
                      padding: "0.5rem 1rem",
                      borderRadius: "4px",
                      fontSize: "1rem",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontWeight: 600
                    }}>
                      {item.key}
                    </code>
                    <h4 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600 }}>
                      {item.mode}
                    </h4>
                  </div>
                  <p style={{ margin: 0, color: "#525252" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Essential Commands */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Keyboard size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0 }}>Essential Vim Commands</h3>
            </div>

            <div style={{ display: "grid", gap: "2rem" }}>
              {/* Basic Operations */}
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>📝 Basic Operations</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { cmd: "vim filename", desc: "Open a file in Vim" },
                    { cmd: ":w", desc: "Save (write) the file" },
                    { cmd: ":q", desc: "Quit Vim" },
                    { cmd: ":wq", desc: "Save and quit" },
                    { cmd: ":q!", desc: "Quit without saving (force quit)" },
                    { cmd: ":x", desc: "Save and quit (same as :wq)" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        minWidth: "140px"
                      }}>
                        {item.cmd}
                      </code>
                      <span style={{ color: "#525252" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>🧭 Navigation (Normal Mode)</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { cmd: "h j k l", desc: "Move left, down, up, right" },
                    { cmd: "w", desc: "Jump forward to start of next word" },
                    { cmd: "b", desc: "Jump backward to start of previous word" },
                    { cmd: "0", desc: "Jump to start of line" },
                    { cmd: "$", desc: "Jump to end of line" },
                    { cmd: "gg", desc: "Go to first line of file" },
                    { cmd: "G", desc: "Go to last line of file" },
                    { cmd: ":42", desc: "Go to line 42" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        minWidth: "140px"
                      }}>
                        {item.cmd}
                      </code>
                      <span style={{ color: "#525252" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Editing */}
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>✏️ Editing Commands</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { cmd: "i", desc: "Insert before cursor" },
                    { cmd: "a", desc: "Insert after cursor" },
                    { cmd: "o", desc: "Open new line below and insert" },
                    { cmd: "O", desc: "Open new line above and insert" },
                    { cmd: "x", desc: "Delete character under cursor" },
                    { cmd: "dd", desc: "Delete entire line" },
                    { cmd: "yy", desc: "Copy (yank) entire line" },
                    { cmd: "p", desc: "Paste after cursor" },
                    { cmd: "u", desc: "Undo last change" },
                    { cmd: "Ctrl+r", desc: "Redo" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        minWidth: "140px"
                      }}>
                        {item.cmd}
                      </code>
                      <span style={{ color: "#525252" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search & Replace */}
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>🔍 Search & Replace</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { cmd: "/pattern", desc: "Search forward for pattern" },
                    { cmd: "?pattern", desc: "Search backward for pattern" },
                    { cmd: "n", desc: "Go to next search result" },
                    { cmd: "N", desc: "Go to previous search result" },
                    { cmd: ":%s/old/new/g", desc: "Replace all 'old' with 'new' in file" },
                    { cmd: ":s/old/new/g", desc: "Replace all 'old' with 'new' in current line" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        minWidth: "140px"
                      }}>
                        {item.cmd}
                      </code>
                      <span style={{ color: "#525252" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Pro Tips */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#fff3e0", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #ff832b"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Lightning size={24} style={{ color: "#ff832b" }} />
              <h3 style={{ margin: 0, color: "#ff832b" }}>Pro Tips for Tech Sellers</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li><strong>Start Small:</strong> Learn :w, :q, :wq, i, ESC first - that's 80% of what you need</li>
              <li><strong>Practice Daily:</strong> Use `vimtutor` command for interactive lessons</li>
              <li><strong>Muscle Memory:</strong> Force yourself to use hjkl instead of arrow keys</li>
              <li><strong>Emergency Exit:</strong> When stuck, press ESC multiple times, then type :q!</li>
              <li><strong>Read-Only Mode:</strong> Use `view filename` to open files without risk of editing</li>
              <li><strong>Configuration:</strong> Create ~/.vimrc file to customize Vim settings</li>
              <li><strong>Cheat Sheet:</strong> Keep a Vim cheat sheet handy until commands become automatic</li>
            </ul>
          </div>
        </Section>

        {/* Common Scenarios */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1.5rem" }}>
              Common Scenarios for Tech Sellers
            </h3>
            
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {[
                {
                  scenario: "Editing a config file on a server",
                  steps: [
                    "1. SSH into server: ssh user@server.com",
                    "2. Open file: vim /etc/config.conf",
                    "3. Press 'i' to enter insert mode",
                    "4. Make your changes",
                    "5. Press ESC to return to normal mode",
                    "6. Type :wq to save and quit"
                  ]
                },
                {
                  scenario: "Quickly viewing a log file",
                  steps: [
                    "1. Open in read-only: view /var/log/app.log",
                    "2. Use / to search for errors: /ERROR",
                    "3. Press 'n' to jump to next occurrence",
                    "4. Type :q to quit when done"
                  ]
                },
                {
                  scenario: "Making a quick edit during a demo",
                  steps: [
                    "1. Open file: vim demo-script.sh",
                    "2. Navigate to line: :42",
                    "3. Press 'i' to edit",
                    "4. Make change",
                    "5. ESC then :wq to save"
                  ]
                }
              ].map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: "1px solid #0f62fe"
                  }}
                >
                  <h4 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
                    {item.scenario}
                  </h4>
                  <div style={{ 
                    backgroundColor: "#f4f4f4", 
                    padding: "1rem", 
                    borderRadius: "4px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.875rem"
                  }}>
                    {item.steps.map((step, j) => (
                      <div key={j} style={{ marginBottom: j < item.steps.length - 1 ? "0.5rem" : 0 }}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Practice */}
        <Section level={3} style={{ padding: "2rem", backgroundColor: "#24a148", borderRadius: "8px", color: "white" }}>
          <h3 style={{ marginTop: 0, color: "white" }}>🎯 Ready to Practice?</h3>
          <p style={{ lineHeight: 1.8, margin: 0 }}>
            Head to the <strong>Interactive Terminal</strong> and try these Vim commands in a safe environment!
            Type <code style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: "3px" }}>vim test.txt</code> to get started.
          </p>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
