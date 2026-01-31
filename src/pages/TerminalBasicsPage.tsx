import React from "react";
import { Grid, Column, Heading, Section, Button } from "@carbon/react";
import { Terminal, Code, CheckmarkFilled, Information, Book, Education, Launch } from "@carbon/icons-react";
import VisualDiagram from "../components/VisualDiagram";

export default function TerminalBasicsPage() {
  const fileSystemDiagram = `
┌─────────────────────────────────────────┐
│         Your Computer (Root /)          │
├─────────────────────────────────────────┤
│                                         │
│  /home/                                 │
│    └── your-username/                   │
│         ├── Documents/                  │
│         │    ├── reports/               │
│         │    └── presentations/         │
│         ├── Downloads/                  │
│         ├── Desktop/                    │
│         └── projects/  ← You are here!  │
│              ├── project1/              │
│              ├── project2/              │
│              └── README.md              │
│                                         │
└─────────────────────────────────────────┘

Think of it like folders on your desktop,
but accessed through text commands!`;

  const navigationExample = `
# Example: Navigating to a project folder

$ pwd                          # Where am I?
/home/your-username            # You're in your home directory

$ ls                           # What's here?
Documents  Downloads  Desktop  projects

$ cd projects                  # Go into projects folder
$ pwd                          # Check location again
/home/your-username/projects   # Now you're in projects!

$ ls                           # What's in projects?
project1/  project2/  README.md

$ cd project1                  # Enter project1
$ pwd
/home/your-username/projects/project1

$ cd ..                        # Go back up one level
$ pwd
/home/your-username/projects   # Back in projects folder!`;

  const fileOperationsExample = `
# Real-world scenario: Creating a new project

$ pwd                          # Check where you are
/home/your-username/projects

$ mkdir sales-demo             # Create new folder
$ ls                           # Verify it was created
project1/  project2/  sales-demo/  README.md

$ cd sales-demo                # Enter the new folder
$ touch notes.txt              # Create a text file
$ touch presentation.pptx      # Create another file
$ ls                           # See your files
notes.txt  presentation.pptx

$ mkdir resources              # Create subfolder
$ ls                           # Now you have files and folder
notes.txt  presentation.pptx  resources/

# Copy a file
$ cp notes.txt notes-backup.txt
$ ls
notes.txt  notes-backup.txt  presentation.pptx  resources/

# Move/rename a file
$ mv notes-backup.txt resources/
$ ls resources/
notes-backup.txt`;

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Terminal size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Terminal Basics for Sales Teams</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            The terminal (also called command line or shell) is a text-based interface to your computer. 
            Instead of clicking icons, you type commands. It's faster, more powerful, and essential for 
            working with development tools, servers, and automation.
          </p>
        </Section>

        {/* What is a Terminal? */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e0e0e0"
          }}>
            <Information size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>What is a Terminal?</h2>
          </div>
          
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "1.5rem", 
            borderRadius: "8px",
            marginBottom: "2rem"
          }}>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, margin: 0 }}>
              Think of the terminal as a direct conversation with your computer. Instead of clicking through 
              menus and windows, you type commands in plain text. It might seem intimidating at first, but 
              it's actually more efficient once you learn the basics.
            </p>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            <div style={{ 
              backgroundColor: "#e8f4ff", 
              padding: "1.5rem", 
              borderRadius: "8px",
              border: "1px solid #0f62fe"
            }}>
              <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem" }}>
                <CheckmarkFilled size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                Why Learn Terminal?
              </h3>
              <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8 }}>
                <li>Faster than clicking through menus</li>
                <li>Required for many development tools</li>
                <li>Essential for server management</li>
                <li>Enables automation of repetitive tasks</li>
                <li>Universal across different systems</li>
              </ul>
            </div>

            <div style={{ 
              backgroundColor: "#fff3e0", 
              padding: "1.5rem", 
              borderRadius: "8px",
              border: "1px solid #ff832b"
            }}>
              <h3 style={{ marginTop: 0, color: "#ff832b", fontSize: "1.125rem" }}>
                <Code size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                Common Use Cases
              </h3>
              <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8 }}>
                <li>Running development servers</li>
                <li>Installing software packages</li>
                <li>Managing Git repositories</li>
                <li>Connecting to remote servers</li>
                <li>Automating workflows</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* File System Visualization */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e0e0e0"
          }}>
            <Terminal size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Understanding the File System</h2>
          </div>
          
          <p style={{ fontSize: "1rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            Your computer's files are organized in a tree structure. The terminal lets you navigate this 
            structure using text commands. Here's a visual representation:
          </p>

          <VisualDiagram 
            content={fileSystemDiagram}
            title="File System Structure"
          />

          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "1.5rem", 
            borderRadius: "8px",
            marginTop: "1.5rem",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe" }}>Key Concepts</h3>
            <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8 }}>
              <li><strong>Root directory (/):</strong> The top-level directory containing everything</li>
              <li><strong>Home directory (~):</strong> Your personal folder (e.g., /home/your-username)</li>
              <li><strong>Current directory (.):</strong> Where you are right now</li>
              <li><strong>Parent directory (..):</strong> One level up from current directory</li>
              <li><strong>Path:</strong> The location of a file or folder (e.g., /home/user/Documents)</li>
            </ul>
          </div>
        </Section>

        {/* Navigation Commands */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e0e0e0"
          }}>
            <Code size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Essential Navigation Commands</h2>
          </div>

          <VisualDiagram 
            content={navigationExample}
            title="Navigation Example"
          />

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "1rem",
            marginTop: "1.5rem"
          }}>
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
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>cd ..</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Go up one directory level</p>
            </div>
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>cd ~</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Go to your home directory</p>
            </div>
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>ls -la</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>List all files including hidden ones with details</p>
            </div>
          </div>
        </Section>

        {/* File Operations */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e0e0e0"
          }}>
            <Code size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Working with Files and Folders</h2>
          </div>

          <VisualDiagram 
            content={fileOperationsExample}
            title="File Operations Example"
          />

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
            gap: "1rem",
            marginTop: "1.5rem"
          }}>
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>mkdir</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Make Directory - create a new folder</p>
            </div>
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>touch</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Create a new empty file</p>
            </div>
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>cp</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Copy - duplicate files or folders</p>
            </div>
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>mv</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Move - move or rename files/folders</p>
            </div>
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>rm</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Remove - delete files (use with caution!)</p>
            </div>
            <div style={{ backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "8px" }}>
              <code style={{ color: "#0f62fe", fontWeight: "bold" }}>cat</code>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>Display file contents in terminal</p>
            </div>
          </div>
        </Section>

        {/* Comprehensive Training Resources */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e0e0e0"
          }}>
            <Education size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Comprehensive Training Materials</h2>
          </div>

          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "2px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
              <Book size={24} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
              Complete Terminal Training Plan
            </h3>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Ready to dive deeper? Access our comprehensive terminal training materials covering everything 
              from terminal applications and text editors to advanced topics like redirection, pipes, and 
              shell scripting. These materials include hands-on exercises and real-world examples.
            </p>
            
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button
                kind="primary"
                renderIcon={Launch}
                onClick={() => window.open('/terminal-basics/terminal-training-plan.html', '_blank')}
              >
                View Training Plan (HTML)
              </Button>
              <Button
                kind="secondary"
                renderIcon={Launch}
                onClick={() => window.open('/training-resources', '_blank')}
              >
                All Training Resources
              </Button>
            </div>

            <div style={{ 
              marginTop: "1.5rem", 
              padding: "1rem", 
              backgroundColor: "white", 
              borderRadius: "4px",
              fontSize: "0.875rem"
            }}>
              <strong>Training Topics Include:</strong>
              <ul style={{ marginLeft: "1.5rem", marginTop: "0.5rem", marginBottom: 0, lineHeight: 1.8 }}>
                <li>Terminal Applications (iTerm2, Terminal.app)</li>
                <li>Text Editors (vim, nano, VS Code)</li>
                <li>Filesystem Navigation & Management</li>
                <li>Redirection & Pipes</li>
                <li>Advanced Topics (Shell Scripting, Git, SSH)</li>
                <li>Quick Reference Guide</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Practice Tips */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e0e0e0"
          }}>
            <CheckmarkFilled size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Tips for Learning</h2>
          </div>

          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "1.5rem"
          }}>
            <div style={{ 
              backgroundColor: "#f4f4f4", 
              padding: "1.5rem", 
              borderRadius: "8px"
            }}>
              <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem" }}>Start Small</h3>
              <p style={{ lineHeight: 1.8, margin: 0 }}>
                Begin with basic navigation commands (pwd, ls, cd). Practice these until they feel natural 
                before moving on to more complex operations.
              </p>
            </div>

            <div style={{ 
              backgroundColor: "#f4f4f4", 
              padding: "1.5rem", 
              borderRadius: "8px"
            }}>
              <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem" }}>Practice Daily</h3>
              <p style={{ lineHeight: 1.8, margin: 0 }}>
                Spend 10-15 minutes each day using the terminal. Try to do at least one task via terminal 
                instead of the GUI. Consistency builds muscle memory.
              </p>
            </div>

            <div style={{ 
              backgroundColor: "#f4f4f4", 
              padding: "1.5rem", 
              borderRadius: "8px"
            }}>
              <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem" }}>Use Tab Completion</h3>
              <p style={{ lineHeight: 1.8, margin: 0 }}>
                Press Tab to auto-complete file and folder names. This saves time and prevents typos. 
                It's one of the terminal's most powerful features.
              </p>
            </div>

            <div style={{ 
              backgroundColor: "#f4f4f4", 
              padding: "1.5rem", 
              borderRadius: "8px"
            }}>
              <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem" }}>Don't Fear Mistakes</h3>
              <p style={{ lineHeight: 1.8, margin: 0 }}>
                The terminal will usually warn you before doing something destructive. Read error messages 
                carefully - they often tell you exactly what went wrong.
              </p>
            </div>

            <div style={{ 
              backgroundColor: "#f4f4f4", 
              padding: "1.5rem", 
              borderRadius: "8px"
            }}>
              <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem" }}>Learn Keyboard Shortcuts</h3>
              <p style={{ lineHeight: 1.8, margin: 0 }}>
                Ctrl+C (cancel command), Ctrl+L (clear screen), Up arrow (previous command). These shortcuts 
                make terminal work much faster.
              </p>
            </div>

            <div style={{ 
              backgroundColor: "#f4f4f4", 
              padding: "1.5rem", 
              borderRadius: "8px"
            }}>
              <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem" }}>Use man Pages</h3>
              <p style={{ lineHeight: 1.8, margin: 0 }}>
                Type "man [command]" to see the manual for any command. For example, "man ls" shows all 
                options for the ls command. Press 'q' to exit.
              </p>
            </div>
          </div>
        </Section>

        {/* Next Steps */}
        <Section level={3} style={{ marginBottom: "2rem" }}>
          <div style={{ 
            backgroundColor: "#fff3e0", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #ff832b"
          }}>
            <h3 style={{ marginTop: 0, color: "#ff832b", marginBottom: "1rem" }}>
              <Education size={24} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
              Ready for More?
            </h3>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              Once you're comfortable with these basics, explore our comprehensive training materials for 
              advanced topics including shell scripting, Git workflows, SSH connections, and automation.
            </p>
            <Button
              kind="primary"
              renderIcon={Launch}
              onClick={() => window.open('/training-resources', '_blank')}
            >
              Explore Advanced Training
            </Button>
          </div>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
