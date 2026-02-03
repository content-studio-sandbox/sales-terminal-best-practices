import React from "react";
import { Grid, Column, Heading, Section, Button, CodeSnippet, Accordion, AccordionItem, Tile, Tag } from "@carbon/react";
import { Document, Download, PresentationFile, Education, CheckmarkFilled, Terminal, Code, Edit, Folder, ArrowRight, Book } from "@carbon/icons-react";

export default function TrainingResourcesPage() {
  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Education size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Terminal Training Resources</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Comprehensive training materials created by Michael for mastering terminal skills. 
            These resources include detailed guides, presentation materials, and hands-on exercises.
          </p>
        </Section>

        {/* Philosophy Section */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <Tile style={{ padding: "2rem", marginBottom: "2rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Training Philosophy
            </h3>
            <p style={{ lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.125rem", fontWeight: 500 }}>
              "Create your own workflow and work environment that works for <strong>you</strong>."
            </p>
            <p style={{ lineHeight: 1.8, margin: 0 }}>
              This training is a <strong>starting point</strong> based on collective experience.
              The end goal is to make you as productive as possible to perform the task at hand.
              There's no "right" way—only what works for you.
            </p>
          </Tile>
        </Section>

        {/* Available Resources */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "2rem", fontSize: "1.75rem", fontWeight: 600 }}>
            Available Resources
          </h2>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {/* Comprehensive Training Plan */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <Document size={32} style={{ color: "#0f62fe", flexShrink: 0, marginTop: "4px" }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>
                    Comprehensive Training Plan
                  </h3>
                  <p style={{ color: "#525252", marginBottom: "1rem", lineHeight: 1.6 }}>
                    A detailed 1,988-line guide covering everything from terminal basics to advanced topics. 
                    Includes hands-on exercises, quick reference cheat sheets, and troubleshooting tips.
                  </p>
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#161616" }}>Topics Covered:</strong>
                    <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem", color: "#525252" }}>
                      <li>Terminal Applications (Mac & PC options)</li>
                      <li>Understanding Shells (sh, bash, zsh, oh-my-zsh)</li>
                      <li>Text Editors (nano, vim)</li>
                      <li>Filesystem Navigation</li>
                      <li>Redirection & Pipes</li>
                      <li>Advanced Topics (environment variables, aliases, permissions, tmux)</li>
                    </ul>
                  </div>
                  <Button
                    kind="primary"
                    renderIcon={Download}
                    onClick={() => window.open('/terminal-basics/terminal-training-plan.html', '_blank')}
                  >
                    View Training Plan (HTML)
                  </Button>
                </div>
              </div>
            </div>

            {/* Presentation Materials */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <PresentationFile size={32} style={{ color: "#0f62fe", flexShrink: 0, marginTop: "4px" }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>
                    Presentation Materials
                  </h3>
                  <p style={{ color: "#525252", marginBottom: "1rem", lineHeight: 1.6 }}>
                    Professional 15-minute presentation with detailed speaker notes. Perfect for team training 
                    sessions or lunch-and-learn events. Includes IBM Design Language styling.
                  </p>
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#161616" }}>Includes:</strong>
                    <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem", color: "#525252" }}>
                      <li>PowerPoint presentation (PPTX)</li>
                      <li>PDF version for easy sharing</li>
                      <li>Detailed speaker script with timing</li>
                      <li>Delivery notes and audience engagement tips</li>
                    </ul>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Button
                      kind="primary"
                      renderIcon={Download}
                      onClick={() => window.open('/terminal-basics/terminal-basics-presentation.pdf', '_blank')}
                    >
                      Download PDF
                    </Button>
                    <Button
                      kind="secondary"
                      renderIcon={Download}
                      onClick={() => window.open('/terminal-basics/terminal-basics-presentation.pptx', '_blank')}
                    >
                      Download PPTX
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Speaker Notes */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <Document size={32} style={{ color: "#0f62fe", flexShrink: 0, marginTop: "4px" }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>
                    Presentation Script & Speaker Notes
                  </h3>
                  <p style={{ color: "#525252", marginBottom: "1rem", lineHeight: 1.6 }}>
                    Detailed talking points for each slide with timing, delivery notes, analogies, 
                    and audience engagement strategies. Perfect for presenters who want to deliver 
                    a polished, professional training session.
                  </p>
                  <Button
                    kind="tertiary"
                    renderIcon={Document}
                    onClick={() => window.open('/terminal-basics/presentation-script.md', '_blank')}
                  >
                    View Speaker Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Interactive Training Content */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #0f62fe"
          }}>
            <h2 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
              <Education size={24} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
              Interactive Training Content
            </h2>
            <p style={{ color: "#161616", lineHeight: 1.8, marginBottom: "1rem" }}>
              Explore key sections from the comprehensive training plan below. Each section includes 
              practical examples, code snippets, and hands-on exercises.
            </p>
            <div style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#161616", lineHeight: 1.8 }}>
              <div><strong>Learning Path:</strong></div>
              <div>Terminal Apps → Shells → Text Editors → Navigation → Redirection → Advanced Topics</div>
            </div>
          </div>

          {/* Training Content Accordion */}
          <Accordion>
            {/* Section 1: Terminal Applications */}
            <AccordionItem
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Terminal size={20} style={{ color: "#0f62fe" }} />
                  <span style={{ fontWeight: 600 }}>1. Terminal Applications</span>
                </div>
              }
            >
              <div style={{ padding: "1rem 0" }}>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>What is a Terminal?</h4>
                <p style={{ lineHeight: 1.8, marginBottom: "1.5rem" }}>
                  A terminal (or terminal emulator) is an application that provides a text-based interface to interact 
                  with your computer's operating system. It allows you to execute commands, run programs, and manage 
                  files using text commands instead of graphical interfaces.
                </p>

                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>Mac Terminal Options</h4>
                
                <Tile style={{ padding: "1.5rem", marginBottom: "1rem" }}>
                  <h5 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Terminal.app (Built-in)</h5>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Location:</strong> /Applications/Utilities/Terminal.app</p>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Pros:</strong> No installation needed, reliable, integrates well with macOS</p>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Cons:</strong> Limited customization, basic feature set</p>
                  <p style={{ marginBottom: 0 }}><strong>Best for:</strong> Beginners, quick tasks, system administration</p>
                </Tile>

                <Tile style={{ padding: "1.5rem", marginBottom: "1rem", borderLeft: "4px solid #0f62fe" }}>
                  <h5 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
                    <CheckmarkFilled size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem", color: "#24a148" }} />
                    iTerm2 (Recommended)
                  </h5>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Website:</strong> <a href="https://iterm2.com" target="_blank" rel="noopener noreferrer">https://iterm2.com</a></p>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Pros:</strong></p>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: "0.5rem" }}>
                    <li>Split panes for multiple sessions</li>
                    <li>Extensive customization options</li>
                    <li>Search functionality</li>
                    <li>Hotkey window for quick access</li>
                    <li>Better color schemes and fonts</li>
                  </ul>
                  <p style={{ marginBottom: 0 }}><strong>Best for:</strong> Power users, developers, anyone spending significant time in terminal</p>
                </Tile>

                <h4 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Getting Started</h4>
                <ol style={{ marginLeft: "1.5rem", lineHeight: 1.8 }}>
                  <li>Open your terminal application (Mac: Press Cmd + Space, type "Terminal", press Enter)</li>
                  <li>Try your first commands:</li>
                </ol>
                <div style={{ marginTop: "1rem" }}>
                  <CodeSnippet type="multi">
{`echo "Hello, Terminal!"
whoami
hostname`}
                  </CodeSnippet>
                </div>
              </div>
            </AccordionItem>

            {/* Section 2: Understanding Shells */}
            <AccordionItem
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Code size={20} style={{ color: "#0f62fe" }} />
                  <span style={{ fontWeight: 600 }}>2. Understanding Shells</span>
                </div>
              }
            >
              <div style={{ padding: "1rem 0" }}>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>What is a Shell?</h4>
                <p style={{ lineHeight: 1.8, marginBottom: "1.5rem" }}>
                  A shell is a command-line interpreter that provides a user interface to access the operating system's 
                  services. When you type commands in a terminal, you're actually interacting with a shell program that 
                  interprets and executes those commands.
                </p>

                <Tile style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
                  <h5 style={{ marginTop: 0, marginBottom: "1rem" }}>Shell Architecture</h5>
                  <pre style={{ fontFamily: "monospace", fontSize: "0.875rem", margin: 0 }}>
{`┌─────────────────┐
│   Terminal App  │  (iTerm2, Terminal.app, etc.)
└────────┬────────┘
         │
┌────────▼────────┐
│     Shell       │  (bash, zsh, sh, etc.)
└────────┬────────┘
         │
┌────────▼────────┐
│  Operating      │
│  System         │
└─────────────────┘`}
                  </pre>
                </Tile>

                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>Common Shells</h4>
                
                <div style={{ display: "grid", gap: "1rem" }}>
                  <Tile style={{ padding: "1rem" }}>
                    <h5 style={{ marginTop: 0, marginBottom: "0.5rem" }}>sh (Bourne Shell)</h5>
                    <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>The original Unix shell (1979)</p>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}><strong>Use for:</strong> Portable shell scripts, system scripts</p>
                  </Tile>

                  <Tile style={{ padding: "1rem" }}>
                    <h5 style={{ marginTop: 0, marginBottom: "0.5rem" }}>bash (Bourne Again Shell)</h5>
                    <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>GNU's enhanced version of sh (1989)</p>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}><strong>Use for:</strong> General-purpose shell, scripting, system administration</p>
                  </Tile>

                  <Tile style={{ padding: "1rem", borderLeft: "4px solid #0f62fe" }}>
                    <h5 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
                      <CheckmarkFilled size={16} style={{ verticalAlign: "middle", marginRight: "0.5rem", color: "#24a148" }} />
                      zsh (Z Shell) - Recommended
                    </h5>
                    <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>Modern shell with powerful features (1990)</p>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}><strong>Use for:</strong> Daily use, advanced customization, oh-my-zsh framework</p>
                  </Tile>
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <CodeSnippet type="multi">
{`# Check your current shell
echo $SHELL

# Check zsh version
zsh --version

# Switch to zsh
chsh -s /bin/zsh`}
                  </CodeSnippet>
                </div>
              </div>
            </AccordionItem>

            {/* Section 3: Text Editors */}
            <AccordionItem
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Edit size={20} style={{ color: "#0f62fe" }} />
                  <span style={{ fontWeight: 600 }}>3. Text Editors</span>
                </div>
              }
            >
              <div style={{ padding: "1rem 0" }}>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>Why Learn a Terminal Text Editor?</h4>
                <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
                  <li>Edit files on remote servers via SSH</li>
                  <li>Quick edits without leaving the terminal</li>
                  <li>Work in environments without GUI</li>
                  <li>Faster for small changes</li>
                </ul>

                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>nano (Recommended for Beginners)</h4>
                <Tile style={{ padding: "1.5rem", marginBottom: "1.5rem", borderLeft: "4px solid #0f62fe" }}>
                  <p style={{ marginBottom: "1rem" }}><strong>Why nano?</strong> Simple, intuitive, commands shown at bottom</p>
                  <CodeSnippet type="single">nano filename.txt</CodeSnippet>
                  <p style={{ marginTop: "1rem", marginBottom: "0.5rem" }}><strong>Essential Commands:</strong></p>
                  <ul style={{ marginLeft: "1.5rem", fontSize: "0.875rem" }}>
                    <li>Ctrl+O: Save (Write Out)</li>
                    <li>Ctrl+X: Exit</li>
                    <li>Ctrl+K: Cut line</li>
                    <li>Ctrl+U: Paste</li>
                    <li>Ctrl+W: Search</li>
                  </ul>
                </Tile>

                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>vim (Advanced)</h4>
                <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px", marginBottom: "1rem" }}>
                  <p style={{ marginBottom: "1rem" }}><strong>Why vim?</strong> Powerful, ubiquitous, highly efficient once mastered</p>
                  <CodeSnippet type="single">vim filename.txt</CodeSnippet>
                  <p style={{ marginTop: "1rem", marginBottom: "0.5rem" }}><strong>Basic Survival Commands:</strong></p>
                  <ul style={{ marginLeft: "1.5rem", fontSize: "0.875rem" }}>
                    <li>i: Enter insert mode (start typing)</li>
                    <li>Esc: Exit insert mode</li>
                    <li>:w: Save</li>
                    <li>:q: Quit</li>
                    <li>:wq: Save and quit</li>
                    <li>:q!: Quit without saving</li>
                  </ul>
                </div>
              </div>
            </AccordionItem>

            {/* Section 4: Filesystem Navigation */}
            <AccordionItem
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Folder size={20} style={{ color: "#0f62fe" }} />
                  <span style={{ fontWeight: 600 }}>4. Filesystem Navigation</span>
                </div>
              }
            >
              <div style={{ padding: "1rem 0" }}>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>Essential Navigation Commands</h4>
                
                <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
                    <code style={{ color: "#0f62fe", fontWeight: "bold" }}>pwd</code>
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Print Working Directory - shows where you are</p>
                  </div>
                  <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
                    <code style={{ color: "#0f62fe", fontWeight: "bold" }}>ls</code>
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>List - shows files and folders in current directory</p>
                  </div>
                  <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
                    <code style={{ color: "#0f62fe", fontWeight: "bold" }}>cd</code>
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Change Directory - move to a different folder</p>
                  </div>
                </div>

                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>File Operations</h4>
                <CodeSnippet type="multi">
{`# Create directory
mkdir my-project

# Create file
touch README.md

# Copy file
cp file.txt backup.txt

# Move/rename file
mv old-name.txt new-name.txt

# Remove file (careful!)
rm file.txt

# Remove directory
rm -r directory-name`}
                </CodeSnippet>

                <div style={{ backgroundColor: "#fff3e0", padding: "1rem", borderRadius: "8px", marginTop: "1rem", border: "1px solid #ff832b" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>
                    <strong>⚠️ Warning:</strong> The <code>rm</code> command permanently deletes files. There's no trash/recycle bin. 
                    Always double-check before using <code>rm -rf</code>!
                  </p>
                </div>
              </div>
            </AccordionItem>

            {/* Section 5: Redirection & Pipes */}
            <AccordionItem
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <ArrowRight size={20} style={{ color: "#0f62fe" }} />
                  <span style={{ fontWeight: 600 }}>5. Redirection & Pipes</span>
                </div>
              }
            >
              <div style={{ padding: "1rem 0" }}>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>Output Redirection</h4>
                <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
                  Redirect command output to files instead of the screen.
                </p>
                <CodeSnippet type="multi">
{`# Redirect output to file (overwrite)
echo "Hello" > file.txt

# Append to file
echo "World" >> file.txt

# Redirect errors
command 2> errors.log

# Redirect both output and errors
command > output.log 2>&1`}
                </CodeSnippet>

                <h4 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Pipes</h4>
                <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
                  Connect commands together - output of one becomes input of another.
                </p>
                <CodeSnippet type="multi">
{`# Count lines in output
ls -l | wc -l

# Search in output
ps aux | grep python

# Chain multiple commands
cat file.txt | grep "error" | sort | uniq

# Real-world example: Find large files
du -sh * | sort -hr | head -10`}
                </CodeSnippet>
              </div>
            </AccordionItem>

            {/* Section 6: Advanced Topics */}
            <AccordionItem
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Terminal size={20} style={{ color: "#24a148" }} />
                  <span style={{ fontWeight: 600 }}>6. Advanced Topics</span>
                </div>
              }
            >
              <div style={{ padding: "1rem 0" }}>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>Environment Variables</h4>
                <CodeSnippet type="multi">
{`# View all environment variables
env

# View specific variable
echo $PATH

# Set temporary variable
export MY_VAR="value"

# Add to PATH
export PATH="$PATH:/new/path"`}
                </CodeSnippet>

                <h4 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Aliases</h4>
                <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
                  Create shortcuts for commonly used commands.
                </p>
                <CodeSnippet type="multi">
{`# Create alias
alias ll='ls -lah'
alias gs='git status'
alias ..='cd ..'

# Add to ~/.zshrc or ~/.bashrc to make permanent
echo "alias ll='ls -lah'" >> ~/.zshrc`}
                </CodeSnippet>

                <h4 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>File Permissions</h4>
                <CodeSnippet type="multi">
{`# View permissions
ls -l

# Change permissions
chmod 755 script.sh  # rwxr-xr-x
chmod +x script.sh   # Make executable

# Change owner
chown user:group file.txt`}
                </CodeSnippet>
              </div>
            </AccordionItem>

            {/* Section 7: Quick Reference */}
            <AccordionItem
              title={
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Book size={20} style={{ color: "#24a148" }} />
                  <span style={{ fontWeight: 600 }}>7. Quick Reference Cheat Sheet</span>
                </div>
              }
            >
              <div style={{ padding: "1rem 0" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                  <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
                    <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>Navigation</h5>
                    <ul style={{ marginLeft: "1.5rem", fontSize: "0.875rem", lineHeight: 1.6 }}>
                      <li><code>pwd</code> - Current directory</li>
                      <li><code>ls</code> - List files</li>
                      <li><code>cd</code> - Change directory</li>
                      <li><code>cd ~</code> - Go home</li>
                      <li><code>cd ..</code> - Go up one level</li>
                    </ul>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
                    <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>File Operations</h5>
                    <ul style={{ marginLeft: "1.5rem", fontSize: "0.875rem", lineHeight: 1.6 }}>
                      <li><code>touch</code> - Create file</li>
                      <li><code>mkdir</code> - Create directory</li>
                      <li><code>cp</code> - Copy</li>
                      <li><code>mv</code> - Move/rename</li>
                      <li><code>rm</code> - Remove</li>
                    </ul>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
                    <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>Viewing Files</h5>
                    <ul style={{ marginLeft: "1.5rem", fontSize: "0.875rem", lineHeight: 1.6 }}>
                      <li><code>cat</code> - Display file</li>
                      <li><code>less</code> - Page through file</li>
                      <li><code>head</code> - First 10 lines</li>
                      <li><code>tail</code> - Last 10 lines</li>
                      <li><code>grep</code> - Search in files</li>
                    </ul>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
                    <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>System Info</h5>
                    <ul style={{ marginLeft: "1.5rem", fontSize: "0.875rem", lineHeight: 1.6 }}>
                      <li><code>whoami</code> - Current user</li>
                      <li><code>hostname</code> - Computer name</li>
                      <li><code>date</code> - Current date/time</li>
                      <li><code>df -h</code> - Disk space</li>
                      <li><code>top</code> - Running processes</li>
                    </ul>
                  </div>
                </div>

                <div style={{ backgroundColor: "#e8f4ff", padding: "1.5rem", borderRadius: "8px", marginTop: "1.5rem", border: "1px solid #0f62fe" }}>
                  <h5 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>Pro Tips</h5>
                  <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8 }}>
                    <li>Use <strong>Tab</strong> for auto-completion</li>
                    <li>Use <strong>↑/↓ arrows</strong> to navigate command history</li>
                    <li>Use <strong>Ctrl+C</strong> to cancel a running command</li>
                    <li>Use <strong>Ctrl+L</strong> to clear the screen</li>
                    <li>Use <strong>man command</strong> to read the manual for any command</li>
                  </ul>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </Section>

        {/* Learning Path */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            background: "linear-gradient(135deg, #0f62fe 0%, #0353e9 100%)",
            padding: "2rem",
            borderRadius: "4px"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#ffffff" }}>Recommended Learning Path</h3>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                { week: "Week 1", task: "Pick a terminal app and get comfortable opening it", color: "#0f62fe" },
                { week: "Week 2", task: "Learn basic navigation (pwd, ls, cd, mkdir, rm)", color: "#0f62fe" },
                { week: "Week 3", task: "Master your editor (start with nano)", color: "#0f62fe" },
                { week: "Week 4", task: "Explore pipes and redirection", color: "#0f62fe" },
                { week: "Month 2", task: "Start customizing with aliases and oh-my-zsh", color: "#24a148" },
                { week: "Month 3", task: "You're dangerous now (in a good way)!", color: "#24a148" }
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "4px",
                    borderLeft: `4px solid ${item.color}`
                  }}
                >
                  <Tag type={item.color === "#24a148" ? "green" : "blue"} size="md" style={{ flexShrink: 0, minWidth: "80px", justifyContent: "center" }}>
                    {item.week}
                  </Tag>
                  <p style={{ margin: 0, fontSize: "0.9375rem", color: "#161616" }}>
                    {item.task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Key Principles */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <Tile style={{ padding: "2rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Key Principles to Remember</h3>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                { icon: "✅", text: "There's no \"right\" way - only what works for you" },
                { icon: "✅", text: "Start simple - complexity comes with time" },
                { icon: "✅", text: "Practice daily - even 5 minutes counts" },
                { icon: "✅", text: "Customize everything - make it yours" },
                { icon: "✅", text: "Share knowledge - we all learn together" }
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem"
                  }}
                >
                  <CheckmarkFilled size={24} style={{ flexShrink: 0, color: "#24a148" }} />
                  <p style={{ margin: 0, fontSize: "0.9375rem" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </Tile>
        </Section>

        {/* Credits */}
        <Section level={3} style={{ marginBottom: "2rem" }}>
          <Tile style={{ padding: "1.5rem", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "0.9375rem" }}>
              <strong>Training Materials Created By:</strong> Michael
            </p>
            <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem", opacity: 0.7 }}>
              Comprehensive terminal training for FSM Technical Sales teams
            </p>
          </Tile>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
