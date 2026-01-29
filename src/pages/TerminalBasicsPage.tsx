import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Terminal, Code, CheckmarkFilled, Information } from "@carbon/icons-react";
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
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Information size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "#0f62fe" }}>
                Why Learn Terminal Commands?
              </h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li><strong>Speed:</strong> Navigate and manage files 10x faster than clicking through folders</li>
              <li><strong>Power:</strong> Access advanced features not available in graphical interfaces</li>
              <li><strong>Automation:</strong> Run scripts and automate repetitive tasks</li>
              <li><strong>Remote Access:</strong> Manage servers and cloud resources from anywhere</li>
              <li><strong>Developer Tools:</strong> Most development tools (Git, npm, Docker) use terminal commands</li>
            </ul>
          </div>

          <VisualDiagram 
            title="Understanding the File System" 
            content={fileSystemDiagram}
          />
        </Section>

        {/* Navigation Commands */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Code size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                Navigation Commands - Moving Around
              </h3>
            </div>
            
            <p style={{ color: "#525252", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              These commands help you navigate through folders (directories) on your computer. 
              Think of it like using File Explorer or Finder, but with text commands.
            </p>

            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                { 
                  cmd: "pwd", 
                  name: "Print Working Directory",
                  desc: "Shows your current location in the file system",
                  example: "$ pwd\n/home/username/projects",
                  useCase: "Use this when you're lost and need to know where you are"
                },
                { 
                  cmd: "ls", 
                  name: "List",
                  desc: "Shows all files and folders in your current location",
                  example: "$ ls\nDocuments  Downloads  projects",
                  useCase: "Use this to see what's available in your current folder"
                },
                { 
                  cmd: "ls -la", 
                  name: "List All (detailed)",
                  desc: "Shows ALL files including hidden ones, with detailed information (permissions, size, date)",
                  example: "$ ls -la\ndrwxr-xr-x  5 user  staff   160 Jan 29 10:00 .\ndrwxr-xr-x  8 user  staff   256 Jan 28 15:30 ..\n-rw-r--r--  1 user  staff  1024 Jan 29 09:45 README.md",
                  useCase: "Use this to see file permissions, hidden config files, and detailed info"
                },
                { 
                  cmd: "cd <directory>", 
                  name: "Change Directory",
                  desc: "Moves you into a different folder",
                  example: "$ cd projects\n$ pwd\n/home/username/projects",
                  useCase: "Use this to navigate into folders"
                },
                { 
                  cmd: "cd ..", 
                  name: "Go Up One Level",
                  desc: "Moves you to the parent folder (one level up)",
                  example: "$ pwd\n/home/username/projects/project1\n$ cd ..\n$ pwd\n/home/username/projects",
                  useCase: "Use this to go back to the previous folder"
                },
                { 
                  cmd: "cd ~", 
                  name: "Go Home",
                  desc: "Takes you to your home directory (your user folder)",
                  example: "$ cd ~\n$ pwd\n/home/username",
                  useCase: "Use this as a quick way to get back to your home folder from anywhere"
                },
              ].map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                    <CheckmarkFilled size={20} style={{ color: "#24a148", marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontFamily: "'IBM Plex Mono', monospace",
                        display: "inline-block",
                        marginBottom: "0.5rem"
                      }}>
                        {item.cmd}
                      </code>
                      <h4 style={{ margin: "0.5rem 0", fontSize: "1rem", fontWeight: 600 }}>
                        {item.name}
                      </h4>
                      <p style={{ margin: "0 0 1rem 0", color: "#525252", fontSize: "0.875rem" }}>
                        {item.desc}
                      </p>
                      <div style={{ 
                        backgroundColor: "#f4f4f4", 
                        padding: "0.75rem", 
                        borderRadius: "4px",
                        marginBottom: "0.75rem"
                      }}>
                        <strong style={{ fontSize: "0.75rem", color: "#0f62fe" }}>Example:</strong>
                        <pre style={{ 
                          margin: "0.5rem 0 0 0", 
                          fontSize: "0.75rem", 
                          fontFamily: "'IBM Plex Mono', monospace",
                          whiteSpace: "pre-wrap"
                        }}>
                          {item.example}
                        </pre>
                      </div>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "0.75rem", 
                        color: "#0f62fe",
                        fontStyle: "italic"
                      }}>
                        Tip: {item.useCase}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <VisualDiagram 
            title="Navigation in Action" 
            content={navigationExample}
          />
        </Section>

        {/* File Operations */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              File Operations - Creating and Managing Files
            </h3>
            
            <p style={{ color: "#525252", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              These commands let you create, copy, move, and delete files and folders. 
              Be careful with delete commands - there's no "Recycle Bin" in the terminal!
            </p>

            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                { 
                  cmd: "mkdir <name>", 
                  name: "Make Directory",
                  desc: "Creates a new folder",
                  example: "$ mkdir my-project\n$ ls\nmy-project/",
                  useCase: "Use this to organize your work into folders",
                  warning: null
                },
                { 
                  cmd: "touch <file>", 
                  name: "Create File",
                  desc: "Creates a new empty file",
                  example: "$ touch README.md\n$ ls\nREADME.md",
                  useCase: "Use this to create new files quickly",
                  warning: null
                },
                { 
                  cmd: "cp <source> <dest>", 
                  name: "Copy",
                  desc: "Makes a copy of a file or folder",
                  example: "$ cp report.txt report-backup.txt\n$ ls\nreport.txt  report-backup.txt",
                  useCase: "Use this to create backups or duplicate files",
                  warning: null
                },
                { 
                  cmd: "mv <source> <dest>", 
                  name: "Move/Rename",
                  desc: "Moves a file to a new location OR renames it",
                  example: "$ mv old-name.txt new-name.txt\n# OR\n$ mv file.txt folder/",
                  useCase: "Use this to reorganize files or rename them",
                  warning: null
                },
                { 
                  cmd: "rm <file>", 
                  name: "Remove File",
                  desc: "Deletes a file permanently",
                  example: "$ rm unwanted-file.txt",
                  useCase: "Use this to delete files you no longer need",
                  warning: "⚠️ WARNING: This permanently deletes files - no undo!"
                },
                { 
                  cmd: "rm -rf <dir>", 
                  name: "Remove Directory (Recursive)",
                  desc: "Deletes a folder and everything inside it",
                  example: "$ rm -rf old-project/",
                  useCase: "Use this to delete entire folders",
                  warning: "🚨 DANGER: This deletes everything inside - use with extreme caution!"
                },
              ].map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: item.warning ? "2px solid #ff832b" : "1px solid #e0e0e0"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <CheckmarkFilled size={20} style={{ color: "#24a148", marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontFamily: "'IBM Plex Mono', monospace",
                        display: "inline-block",
                        marginBottom: "0.5rem"
                      }}>
                        {item.cmd}
                      </code>
                      <h4 style={{ margin: "0.5rem 0", fontSize: "1rem", fontWeight: 600 }}>
                        {item.name}
                      </h4>
                      <p style={{ margin: "0 0 1rem 0", color: "#525252", fontSize: "0.875rem" }}>
                        {item.desc}
                      </p>
                      {item.warning && (
                        <div style={{
                          backgroundColor: "#fff3e0",
                          border: "1px solid #ff832b",
                          padding: "0.75rem",
                          borderRadius: "4px",
                          marginBottom: "0.75rem"
                        }}>
                          <strong style={{ color: "#ff832b", fontSize: "0.875rem" }}>
                            {item.warning}
                          </strong>
                        </div>
                      )}
                      <div style={{ 
                        backgroundColor: "#f4f4f4", 
                        padding: "0.75rem", 
                        borderRadius: "4px",
                        marginBottom: "0.75rem"
                      }}>
                        <strong style={{ fontSize: "0.75rem", color: "#0f62fe" }}>EXAMPLE:</strong>
                        <pre style={{ 
                          margin: "0.5rem 0 0 0", 
                          fontSize: "0.75rem", 
                          fontFamily: "'IBM Plex Mono', monospace",
                          whiteSpace: "pre-wrap"
                        }}>
                          {item.example}
                        </pre>
                      </div>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "0.75rem", 
                        color: "#0f62fe",
                        fontStyle: "italic"
                      }}>
                        💡 {item.useCase}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <VisualDiagram 
            title="File Operations Example" 
            content={fileOperationsExample}
          />
        </Section>

        {/* Pro Tips */}
        <Section level={3} style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#e8f4ff", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#0f62fe" }}>💡 Pro Tips for Terminal Success</h3>
          <ul style={{ color: "#161616", lineHeight: 1.8 }}>
            <li><strong>Tab Completion:</strong> Press <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>Tab</code> to auto-complete file/folder names - saves tons of typing!</li>
            <li><strong>Command History:</strong> Press <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>↑</code> to recall previous commands - no need to retype</li>
            <li><strong>Cancel Command:</strong> Press <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>Ctrl+C</code> to stop a running command</li>
            <li><strong>Clear Screen:</strong> Type <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>clear</code> to clean up your terminal</li>
            <li><strong>Get Help:</strong> Type <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>{"man <command>"}</code> to read the manual for any command</li>
            <li><strong>Copy/Paste:</strong> Use <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>Ctrl+Shift+C</code> and <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>Ctrl+Shift+V</code> in terminal (not Ctrl+C/V)</li>
          </ul>
        </Section>

        {/* Next Steps */}
        <Section level={3} style={{ marginTop: "2rem", padding: "2rem", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#ff832b" }}>🚀 Ready for More?</h3>
          <p style={{ color: "#161616", lineHeight: 1.8, marginBottom: "1rem" }}>
            Now that you understand terminal basics, you're ready to learn Git workflows! 
            Git uses these same terminal commands plus version control commands to manage code.
          </p>
          <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
            Head to the <strong>Interactive Terminal</strong> page to practice these commands in a safe environment, 
            or jump to <strong>Git Workflows</strong> to learn version control!
          </p>
        </Section>
      </Column>
    </Grid>
  );
}