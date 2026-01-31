import React, { useState } from "react";
import { Grid, Column, Heading, Section, Tabs, TabList, Tab, TabPanels, TabPanel, CodeSnippet } from "@carbon/react";
import { Terminal, Code, CheckmarkFilled, Information, Book, Education } from "@carbon/icons-react";

export default function TerminalBasicsPage() {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        {/* Header */}
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Terminal size={32} style={{ color: "#0f62fe" }} />
            <Heading>Terminal Basics Training Plan</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Comprehensive training for mastering terminal fundamentals from beginner to intermediate level. 
            Whether you're new to the command line or looking to strengthen your skills, this guide provides 
            a structured learning path with hands-on exercises.
          </p>
        </Section>

        {/* Overview */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
              <Education size={24} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
              Learning Path
            </h3>
            <div style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#161616", lineHeight: 1.8 }}>
              <div>A[Terminal Apps] → B[Text Editors]</div>
              <div>B → C[Filesystem Navigation]</div>
              <div>C → D[Redirection & Pipes]</div>
              <div>D → E[Advanced Topics]</div>
              <div>E → F[Practical Mastery]</div>
            </div>
          </div>
        </Section>

        {/* Main Content Tabs */}
        <Tabs selectedIndex={selectedTab} onChange={(e) => setSelectedTab(e.selectedIndex)}>
          <TabList aria-label="Terminal training sections" contained>
            <Tab>Terminal Apps</Tab>
            <Tab>Text Editors</Tab>
            <Tab>Navigation</Tab>
            <Tab>Redirection</Tab>
            <Tab>Advanced</Tab>
            <Tab>Quick Ref</Tab>
          </TabList>
          
          <TabPanels>
            {/* Tab 1: Terminal Applications */}
            <TabPanel>
              <Section level={3} style={{ padding: "2rem 0" }}>
                <h2 style={{ marginBottom: "1.5rem" }}>1. Terminal Applications</h2>
                
                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>What is a Terminal?</h3>
                <p style={{ lineHeight: 1.8, marginBottom: "2rem" }}>
                  A terminal (or terminal emulator) is an application that provides a text-based interface to interact 
                  with your computer's operating system. It allows you to execute commands, run programs, and manage 
                  files using text commands instead of graphical interfaces.
                </p>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Mac Terminal Options</h3>
                
                <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                  <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>Built-in Option: Terminal.app</h4>
                  <p style={{ marginBottom: "1rem" }}>Pre-installed on every Mac</p>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Location:</strong> /Applications/Utilities/Terminal.app</p>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Pros:</strong> No installation needed, reliable, integrates well with macOS</p>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Cons:</strong> Limited customization, basic feature set</p>
                  <p style={{ marginBottom: 0 }}><strong>Best for:</strong> Beginners, quick tasks, system administration</p>
                </div>

                <div style={{ backgroundColor: "#e8f4ff", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid #0f62fe" }}>
                  <h4 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>
                    <CheckmarkFilled size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                    Recommended: iTerm2
                  </h4>
                  <p style={{ marginBottom: "1rem" }}>Website: <a href="https://iterm2.com" target="_blank" rel="noopener noreferrer">https://iterm2.com</a></p>
                  <p style={{ marginBottom: "0.5rem" }}><strong>Pros:</strong></p>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: "1rem" }}>
                    <li>Split panes for multiple sessions</li>
                    <li>Extensive customization options</li>
                    <li>Search functionality</li>
                    <li>Hotkey window for quick access</li>
                    <li>Better color schemes and fonts</li>
                  </ul>
                  <p style={{ marginBottom: 0 }}><strong>Best for:</strong> Power users, developers, anyone spending significant time in terminal</p>
                </div>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Getting Started</h3>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Open your terminal application
# Mac: Press Cmd + Space, type "Terminal", press Enter
# Or navigate to Applications → Utilities → Terminal

# Basic terminal anatomy:
username@computername:~$

# Your first command:
echo "Hello, Terminal!"

# Check your username:
whoami

# Check your computer's name:
hostname`}
                </CodeSnippet>

                <div style={{ backgroundColor: "#fff3cd", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem", border: "1px solid #ffc107" }}>
                  <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>
                    <Information size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                    Exercise 1.1: Terminal Setup
                  </h4>
                  <ol style={{ marginLeft: "1.5rem", marginBottom: 0 }}>
                    <li>Open your default terminal application</li>
                    <li>Try the echo command above</li>
                    <li>Type <code>whoami</code> to see your username</li>
                    <li>Type <code>hostname</code> to see your computer's name</li>
                    <li>(Optional) Install iTerm2 and compare the experience</li>
                  </ol>
                </div>
              </Section>
            </TabPanel>

            {/* Tab 2: Text Editors */}
            <TabPanel>
              <Section level={3} style={{ padding: "2rem 0" }}>
                <h2 style={{ marginBottom: "1.5rem" }}>2. Text Editors</h2>
                <p style={{ lineHeight: 1.8, marginBottom: "2rem" }}>
                  Working in the terminal often requires editing files. Two essential editors you should know are 
                  <strong> nano</strong> (beginner-friendly) and <strong> vim</strong> (powerful but steeper learning curve).
                </p>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>nano - The Beginner-Friendly Editor</h3>
                <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                  <p style={{ marginBottom: "1rem" }}><strong>Why nano?</strong></p>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: 0 }}>
                    <li>Simple and intuitive</li>
                    <li>Commands displayed at bottom of screen</li>
                    <li>No modes to worry about</li>
                    <li>Great for quick edits</li>
                  </ul>
                </div>

                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Create or edit a file
nano filename.txt

# Common commands (shown at bottom):
# ^X = Exit (Ctrl+X)
# ^O = Save (WriteOut)
# ^K = Cut line
# ^U = Paste (UnCut)
# ^W = Search
# ^\\ = Search and replace`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>vim - The Power User's Editor</h3>
                <div style={{ backgroundColor: "#e8f4ff", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem", border: "1px solid #0f62fe" }}>
                  <p style={{ marginBottom: "1rem" }}><strong>Why vim?</strong></p>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: 0 }}>
                    <li>Extremely powerful and efficient</li>
                    <li>Available on virtually every Unix system</li>
                    <li>Modal editing allows for complex operations</li>
                    <li>Highly customizable</li>
                  </ul>
                </div>

                <h4 style={{ marginTop: "2rem", marginBottom: "1rem" }}>The vim Survival Guide</h4>
                <p style={{ marginBottom: "1rem" }}>vim operates in different "modes":</p>
                <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem" }}>
                  <li><strong>Normal mode:</strong> Navigate and execute commands (default)</li>
                  <li><strong>Insert mode:</strong> Type and edit text</li>
                  <li><strong>Visual mode:</strong> Select text</li>
                  <li><strong>Command mode:</strong> Execute commands (save, quit, etc.)</li>
                </ul>

                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Open a file
vim filename.txt

# SURVIVAL COMMANDS (memorize these first!)
i          # Enter INSERT mode (start typing)
Esc        # Return to NORMAL mode
:w         # Save (write) file
:q         # Quit
:wq        # Save and quit
:q!        # Quit without saving (force quit)

# Essential Normal Mode Commands
x          # Delete character
dd         # Delete line
yy         # Copy line
p          # Paste
u          # Undo
Ctrl+r     # Redo
/search    # Search for "search"
n          # Next search result
gg         # Go to start of file
G          # Go to end of file`}
                </CodeSnippet>

                <div style={{ backgroundColor: "#fff3cd", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem", border: "1px solid #ffc107" }}>
                  <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>
                    <Information size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                    When to Use Which Editor?
                  </h4>
                  <p style={{ marginBottom: "1rem" }}><strong>Use nano when:</strong></p>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: "1rem" }}>
                    <li>Making quick edits</li>
                    <li>You're a beginner</li>
                    <li>You need to edit system files (less risk of mistakes)</li>
                  </ul>
                  <p style={{ marginBottom: "1rem" }}><strong>Use vim when:</strong></p>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: 0 }}>
                    <li>You need powerful editing features</li>
                    <li>Working with large files</li>
                    <li>You want to be more efficient (after learning)</li>
                  </ul>
                </div>
              </Section>
            </TabPanel>

            {/* Tab 3: Filesystem Navigation */}
            <TabPanel>
              <Section level={3} style={{ padding: "2rem 0" }}>
                <h2 style={{ marginBottom: "1.5rem" }}>3. Filesystem Navigation</h2>
                
                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Understanding the Filesystem Hierarchy</h3>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`/                          (root - top of filesystem)
├── Users/                 (user home directories)
│   └── yourname/         (your home directory, also ~)
│       ├── Documents/
│       ├── Downloads/
│       ├── Desktop/
│       └── ...
├── Applications/          (installed applications)
├── System/               (system files)
├── Library/              (system libraries)
└── tmp/                  (temporary files)`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Essential Navigation Commands</h3>
                
                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>pwd - Print Working Directory</h4>
                <CodeSnippet type="single" feedback="Copied to clipboard">pwd</CodeSnippet>
                <p style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }}>Shows your current location in the filesystem.</p>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>ls - List Files and Directories</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Basic listing
ls

# Long format (detailed)
ls -l

# Show hidden files (files starting with .)
ls -a

# Long format with hidden files
ls -la

# Human-readable file sizes
ls -lh

# Sort by modification time
ls -lt`}
                </CodeSnippet>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>cd - Change Directory</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Go to home directory
cd
cd ~

# Go to specific directory
cd /Users/yourname/Documents

# Go up one level
cd ..

# Go up two levels
cd ../..

# Go to previous directory
cd -

# Go to root directory
cd /`}
                </CodeSnippet>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>mkdir - Make Directory</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Create a single directory
mkdir newfolder

# Create nested directories
mkdir -p projects/web/css

# Create multiple directories
mkdir folder1 folder2 folder3`}
                </CodeSnippet>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>rm - Remove Files and Directories</h4>
                <div style={{ backgroundColor: "#ffebee", padding: "1rem", borderRadius: "8px", marginBottom: "1rem", border: "1px solid #f44336" }}>
                  <p style={{ margin: 0, color: "#c62828" }}>
                    <strong>⚠️ Warning:</strong> rm is permanent! There's no trash/recycle bin. Be especially careful with rm -rf.
                  </p>
                </div>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Remove a file
rm file.txt

# Remove multiple files
rm file1.txt file2.txt

# Remove directory and contents (recursive)
rm -r foldername

# Force remove without confirmation
rm -f file.txt

# Interactive mode (asks for confirmation)
rm -i file.txt`}
                </CodeSnippet>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>cp - Copy Files and Directories</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Copy a file
cp source.txt destination.txt

# Copy to a directory
cp file.txt /path/to/directory/

# Copy directory recursively
cp -r sourcedir/ destdir/

# Copy with verbose output
cp -v file.txt newfile.txt`}
                </CodeSnippet>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>mv - Move or Rename Files</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Rename a file
mv oldname.txt newname.txt

# Move file to directory
mv file.txt /path/to/directory/

# Move multiple files
mv file1.txt file2.txt /destination/

# Move directory
mv olddir/ newdir/`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Special Directory Symbols</h3>
                <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                        <th style={{ padding: "0.5rem", textAlign: "left" }}>Symbol</th>
                        <th style={{ padding: "0.5rem", textAlign: "left" }}>Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td style={{ padding: "0.5rem" }}><code>/</code></td><td style={{ padding: "0.5rem" }}>Root directory</td></tr>
                      <tr><td style={{ padding: "0.5rem" }}><code>~</code></td><td style={{ padding: "0.5rem" }}>Home directory</td></tr>
                      <tr><td style={{ padding: "0.5rem" }}><code>.</code></td><td style={{ padding: "0.5rem" }}>Current directory</td></tr>
                      <tr><td style={{ padding: "0.5rem" }}><code>..</code></td><td style={{ padding: "0.5rem" }}>Parent directory</td></tr>
                      <tr><td style={{ padding: "0.5rem" }}><code>-</code></td><td style={{ padding: "0.5rem" }}>Previous directory (with cd)</td></tr>
                    </tbody>
                  </table>
                </div>
              </Section>
            </TabPanel>

            {/* Tab 4: Redirection & Pipes */}
            <TabPanel>
              <Section level={3} style={{ padding: "2rem 0" }}>
                <h2 style={{ marginBottom: "1.5rem" }}>4. Redirection & Pipes</h2>
                <p style={{ lineHeight: 1.8, marginBottom: "2rem" }}>
                  Redirection and pipes are powerful features that allow you to control where command input comes from 
                  and where output goes.
                </p>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Understanding Standard Streams</h3>
                <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px", marginBottom: "1.5rem" }}>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: 0 }}>
                    <li><strong>stdin (Standard Input) - Stream 0:</strong> Where command reads input from (default: keyboard)</li>
                    <li><strong>stdout (Standard Output) - Stream 1:</strong> Where command writes normal output (default: terminal screen)</li>
                    <li><strong>stderr (Standard Error) - Stream 2:</strong> Where command writes error messages (default: terminal screen)</li>
                  </ul>
                </div>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Output Redirection</h3>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Overwrite file with output (>)
echo "Hello World" > output.txt
ls -l > filelist.txt

# Append to file (>>)
echo "New line" >> output.txt
date >> log.txt

# Redirect stderr to a file (2>)
command-that-fails 2> errors.txt

# Redirect both stdout and stderr (&>)
command &> output.txt

# Discard output (send to /dev/null)
command > /dev/null           # Discard stdout
command 2> /dev/null          # Discard stderr
command &> /dev/null          # Discard both`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Pipes (|)</h3>
                <p style={{ marginBottom: "1rem" }}>
                  Pipes connect the stdout of one command to the stdin of another, allowing you to chain commands together.
                </p>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Basic pipe
command1 | command2

# Examples:
ls -l | grep ".txt"                    # List only .txt files
cat file.txt | sort                    # Sort file contents
ps aux | grep "python"                 # Find Python processes
history | tail -20                     # Show last 20 commands`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Common Pipe Patterns</h3>
                
                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>grep - Search for Patterns</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Find lines containing "error"
cat log.txt | grep "error"

# Case-insensitive search
cat log.txt | grep -i "error"

# Show line numbers
cat log.txt | grep -n "error"

# Count matches
cat log.txt | grep -c "error"`}
                </CodeSnippet>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>sort - Sort Lines</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Sort alphabetically
cat names.txt | sort

# Sort numerically
cat numbers.txt | sort -n

# Reverse sort
cat names.txt | sort -r`}
                </CodeSnippet>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>wc - Word Count</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Count lines, words, characters
wc file.txt

# Count only lines
wc -l file.txt

# Count files in directory
ls | wc -l`}
                </CodeSnippet>

                <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>head and tail - Show Beginning or End</h4>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# First 10 lines (default)
head file.txt

# First 5 lines
head -n 5 file.txt

# Last 10 lines (default)
tail file.txt

# Last 20 lines
tail -n 20 file.txt

# Follow file (watch for new lines)
tail -f log.txt`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Advanced Pipe Chains</h3>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Find largest files in current directory
ls -lh | sort -k 5 -h -r | head -10

# Count unique IP addresses in log
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn

# Find most common commands in history
history | awk '{print $2}' | sort | uniq -c | sort -rn | head -10`}
                </CodeSnippet>
              </Section>
            </TabPanel>

            {/* Tab 5: Advanced Topics */}
            <TabPanel>
              <Section level={3} style={{ padding: "2rem 0" }}>
                <h2 style={{ marginBottom: "1.5rem" }}>5. Advanced Topics</h2>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Environment Variables</h3>
                <p style={{ marginBottom: "1rem" }}>
                  Environment variables are dynamic values that affect how processes run on your system.
                </p>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Show all environment variables
env
printenv

# Show specific variable
echo $HOME
echo $PATH
echo $USER

# Set temporary variable (current session only)
export MY_VAR="Hello"
echo $MY_VAR

# Add to PATH
export PATH="$PATH:/new/directory"

# Make permanent (add to ~/.zshrc or ~/.bashrc)
echo 'export MY_VAR="Hello"' >> ~/.zshrc
source ~/.zshrc`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Aliases</h3>
                <p style={{ marginBottom: "1rem" }}>
                  Aliases are shortcuts for longer commands. They save time and reduce typing errors.
                </p>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# Create temporary alias (current session)
alias ll='ls -lah'
alias ..='cd ..'
alias ...='cd ../..'

# Make permanent (add to ~/.zshrc or ~/.bashrc)
echo "alias ll='ls -lah'" >> ~/.zshrc
echo "alias gs='git status'" >> ~/.zshrc
echo "alias ga='git add'" >> ~/.zshrc
source ~/.zshrc

# Show all aliases
alias

# Remove alias
unalias ll`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>File Permissions</h3>
                <p style={{ marginBottom: "1rem" }}>
                  Understanding file permissions is crucial for security and proper file management.
                </p>
                <CodeSnippet type="multi" feedback="Copied to clipboard">
{`# View permissions
ls -l file.txt
# Output: -rw-r--r--  1 user  staff  1234 Jan 29 10:30 file.txt
#         │││││││││
#         │└┴┴┴┴┴┴┴─ permissions
#         └───────── file type (- = file, d = directory)

# Permission breakdown:
# - rw- r-- r--
#   │   │   │
#   │   │   └── others (everyone else)
#   │   └────── group
#   └────────── owner (user)

# Each section has three permissions:
# r = read (4)
# w = write (2)
# x = execute (1)

# Change permissions (numeric method)
chmod 644 file.txt              # rw-r--r--
chmod 755 script.sh             # rwxr-xr-x
chmod 700 private.txt           # rwx------

# Change permissions (symbolic method)
chmod u+x script.sh             # Add execute for user
chmod g-w file.txt              # Remove write for group
chmod o+r file.txt              # Add read for others
chmod a+x script.sh             # Add execute for all

# Make script executable
chmod +x script.sh

# Secure private key
chmod 600 ~/.ssh/id_rsa`}
                </CodeSnippet>

                <h3 style={{ color: "#0f62fe", marginTop: "2rem", marginBottom: "1rem" }}>Keyboard Shortcuts</h3>
                <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                  <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>Navigation</h4>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem" }}>
                    <li><code>Ctrl + A</code> - Move to beginning of line</li>
                    <li><code>Ctrl + E</code> - Move to end of line</li>
                    <li><code>Alt + B</code> - Move back one word</li>
                    <li><code>Alt + F</code> - Move forward one word</li>
                  </ul>

                  <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>Editing</h4>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem" }}>
                    <li><code>Ctrl + U</code> - Cut from cursor to beginning of line</li>
                    <li><code>Ctrl + K</code> - Cut from cursor to end of line</li>
                    <li><code>Ctrl + W</code> - Cut word before cursor</li>
                    <li><code>Ctrl + Y</code> - Paste (yank) cut text</li>
                    <li><code>Ctrl + L</code> - Clear screen</li>
                    <li><code>Ctrl + C</code> - Cancel current command</li>
                  </ul>

                  <h4 style={{ marginTop: "1.5rem", marginBottom: "1rem" }}>History</h4>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: 0 }}>
                    <li><code>Ctrl + R</code> - Reverse search history</li>
                    <li><code>↑ / ↓</code> - Previous/Next command</li>
                    <li><code>!!</code> - Repeat last command</li>
                    <li><code>!$</code> - Last argument of previous command</li>
                  </ul>
                </div>
              </Section>
            </TabPanel>

            {/* Tab 6: Quick Reference */}
            <TabPanel>
              <Section level={3} style={{ padding: "2rem 0" }}>
                <h2 style={{ marginBottom: "1.5rem" }}>Quick Reference Cheat Sheet</h2>

                <div style={{ display: "grid", gap: "1.5rem" }}>
                  <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>Navigation</h3>
                    <CodeSnippet type="multi" feedback="Copied to clipboard">
{`pwd                 # Print working directory
cd directory        # Change directory
cd ~                # Go to home
cd ..               # Go up one level
cd -                # Go to previous directory
ls                  # List files
ls -la              # List all files (detailed)`}
                    </CodeSnippet>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>File Operations</h3>
                    <CodeSnippet type="multi" feedback="Copied to clipboard">
{`touch file          # Create empty file
mkdir dir           # Create directory
mkdir -p a/b/c      # Create nested directories
cp src dest         # Copy file
cp -r src dest      # Copy directory
mv src dest         # Move/rename
rm file             # Remove file
rm -r dir           # Remove directory`}
                    </CodeSnippet>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>File Viewing</h3>
                    <CodeSnippet type="multi" feedback="Copied to clipboard">
{`cat file            # Display file
less file           # Page through file
head file           # First 10 lines
tail file           # Last 10 lines
tail -f file        # Follow file updates`}
                    </CodeSnippet>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>Search and Filter</h3>
                    <CodeSnippet type="multi" feedback="Copied to clipboard">
{`grep pattern file   # Search in file
grep -r pattern dir # Search recursively
find . -name "*.txt" # Find files
wc -l file          # Count lines`}
                    </CodeSnippet>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>Redirection</h3>
                    <CodeSnippet type="multi" feedback="Copied to clipboard">
{`cmd > file          # Redirect output
cmd >> file         # Append output
cmd < file          # Input from file
cmd1 | cmd2         # Pipe output
cmd &> file         # Redirect stdout and stderr`}
                    </CodeSnippet>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>Permissions</h3>
                    <CodeSnippet type="multi" feedback="Copied to clipboard">
{`chmod 755 file      # Change permissions
chmod +x file       # Make executable
chown user file     # Change owner
ls -l               # View permissions`}
                    </CodeSnippet>
                  </div>

                  <div style={{ backgroundColor: "#f4f4f4", padding: "1.5rem", borderRadius: "8px" }}>
                    <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>System</h3>
                    <CodeSnippet type="multi" feedback="Copied to clipboard">
{`whoami              # Current user
hostname            # Computer name
date                # Current date/time
history             # Command history
clear               # Clear screen
exit                # Exit terminal`}
                    </CodeSnippet>
                  </div>
                </div>

                <div style={{ backgroundColor: "#e8f4ff", padding: "2rem", borderRadius: "8px", marginTop: "2rem", border: "1px solid #0f62fe" }}>
                  <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>
                    <CheckmarkFilled size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
                    Next Steps
                  </h3>
                  <p style={{ marginBottom: "1rem" }}>After completing this training plan, you should be comfortable with:</p>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem" }}>
                    <li>✅ Choosing and using a terminal application</li>
                    <li>✅ Editing files with nano and vim</li>
                    <li>✅ Navigating the filesystem confidently</li>
                    <li>✅ Using redirection and pipes effectively</li>
                    <li>✅ Managing environment variables and aliases</li>
                    <li>✅ Understanding and setting file permissions</li>
                  </ul>
                  <p style={{ marginBottom: "1rem" }}><strong>Continue Learning:</strong></p>
                  <ul style={{ marginLeft: "1.5rem", marginBottom: 0 }}>
                    <li>Practice Daily: Use the terminal for everyday tasks</li>
                    <li>Explore More Commands: awk, sed, cut, paste, xargs</li>
                    <li>Learn Shell Scripting: Automate repetitive tasks</li>
                    <li>Master Git: Version control from the command line</li>
                  </ul>
                </div>
              </Section>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Footer */}
        <Section level={3} style={{ marginTop: "3rem", marginBottom: "2rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "1.5rem", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <p style={{ margin: 0, color: "#525252", fontSize: "0.875rem" }}>
              <strong>Training Materials Created By:</strong> Michael | 
              <strong> Version:</strong> 1.0 | 
              <strong> Last Updated:</strong> January 2026
            </p>
          </div>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
