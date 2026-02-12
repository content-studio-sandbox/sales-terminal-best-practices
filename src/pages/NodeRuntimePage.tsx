import React from "react";
import { Grid, Column, Heading, Section, Button } from "@carbon/react";
import { Code, CheckmarkFilled, WarningAlt, Launch, ArrowRight } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import VisualDiagram from "../components/VisualDiagram";

export default function NodeRuntimePage() {
  const navigate = useNavigate();

  const nvmInstallMacDiagram = `
┌─────────────────────────────────────────────────────┐
│         Install nvm on Mac                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Install via Homebrew (recommended)              │
│     $ brew install nvm                              │
│                                                     │
│  2. Add to shell config (~/.zshrc or ~/.bash_profile)│
│     export NVM_DIR="$HOME/.nvm"                     │
│     [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \\     │
│       . "/opt/homebrew/opt/nvm/nvm.sh"              │
│                                                     │
│  3. Reload shell                                    │
│     $ source ~/.zshrc                               │
│                                                     │
│  4. Verify installation                             │
│     $ nvm --version                                 │
│     0.39.x                                          │
│                                                     │
│  5. Install Node LTS                                │
│     $ nvm install --lts                             │
│     $ nvm use --lts                                 │
│                                                     │
│  6. Verify Node is working                          │
│     $ node -v                                       │
│     v20.x.x                                         │
│     $ npm -v                                        │
│     10.x.x                                          │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const nvmInstallWindowsDiagram = `
┌─────────────────────────────────────────────────────┐
│         Install nvm on Windows                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Download nvm-windows installer                  │
│     Visit: github.com/coreybutler/nvm-windows       │
│     Download: nvm-setup.exe                         │
│                                                     │
│  2. Run installer (requires admin)                  │
│     Follow setup wizard                             │
│                                                     │
│  3. Open new Command Prompt or PowerShell           │
│     $ nvm version                                   │
│     1.1.x                                           │
│                                                     │
│  4. Install Node LTS                                │
│     $ nvm install lts                               │
│     $ nvm use lts                                   │
│                                                     │
│  5. Verify Node is working                          │
│     $ node -v                                       │
│     v20.x.x                                         │
│     $ npm -v                                        │
│     10.x.x                                          │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const projectWorkflowDiagram = `
┌─────────────────────────────────────────────────────┐
│         Node Project Workflow                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Clone the repo                                  │
│     $ git clone <repo-url>                          │
│     $ cd <repo-name>                                │
│                                                     │
│  2. Check for .nvmrc file                           │
│     $ cat .nvmrc                                    │
│     20.11.0                                         │
│                                                     │
│  3. Use the specified Node version                  │
│     $ nvm install    # installs version from .nvmrc │
│     $ nvm use        # switches to that version     │
│                                                     │
│  4. Install dependencies                            │
│     $ npm install                                   │
│     # or if repo uses pnpm:                         │
│     $ npm install -g pnpm                           │
│     $ pnpm install                                  │
│                                                     │
│  5. Check package.json for run scripts              │
│     $ cat package.json                              │
│     Look for "scripts" section                      │
│                                                     │
│  6. Start the dev server                            │
│     $ npm run dev                                   │
│     # or npm start, depending on project            │
│                                                     │
│  7. Open browser                                    │
│     Usually: http://localhost:3000                  │
│     Check terminal output for actual port           │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const commonErrorsDiagram = `
┌─────────────────────────────────────────────────────┐
│         Common Node Errors & Fixes                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Error: "node: command not found"                   │
│  Fix: nvm not in PATH or Node not installed         │
│       $ nvm install --lts                           │
│       $ nvm use --lts                               │
│       Restart terminal                              │
│                                                     │
│  Error: "permission denied" during npm install      │
│  Fix: Don't use sudo. Use nvm instead               │
│       $ nvm install 20                              │
│       $ nvm use 20                                  │
│       $ npm install  # no sudo needed               │
│                                                     │
│  Error: "Unsupported engine" or version mismatch    │
│  Fix: Switch to required Node version               │
│       $ nvm install 18  # or version from .nvmrc    │
│       $ nvm use 18                                  │
│       $ npm install                                 │
│                                                     │
│  Error: "EADDRINUSE: port already in use"           │
│  Fix: Kill process on that port or use different port│
│       $ lsof -ti:3000 | xargs kill -9               │
│       # or                                          │
│       $ PORT=3001 npm run dev                       │
│                                                     │
│  Error: "MODULE_NOT_FOUND"                          │
│  Fix: Dependencies not installed                    │
│       $ rm -rf node_modules package-lock.json       │
│       $ npm install                                 │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Code size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Node Runtime Setup (nvm / nodenv)</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Set up Node.js with a version manager so you can switch between Node versions per project. 
            This prevents "wrong Node version" errors and makes running demos reliable.
          </p>
        </Section>

        {/* Choose a Version Manager */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Choose a Version Manager</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              backgroundColor: "#ffffff",
              padding: "1.5rem",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              borderLeft: "4px solid #0f62fe"
            }}>
              <h3 style={{ marginTop: 0, color: "#161616", fontSize: "1.125rem", fontWeight: 600 }}>
                nvm (Recommended)
              </h3>
              <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "1rem" }}>
                Most popular Node version manager. Simple commands, works on Mac/Linux/Windows. 
                Automatically reads <code>.nvmrc</code> files in projects.
              </p>
              <ul style={{ marginLeft: "1.5rem", color: "#525252", lineHeight: 1.8 }}>
                <li>Easy to install via Homebrew (Mac) or installer (Windows)</li>
                <li>Simple commands: <code>nvm install</code>, <code>nvm use</code></li>
                <li>Widely used in IBM projects</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: "#ffffff",
              padding: "1.5rem",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              borderLeft: "4px solid #525252"
            }}>
              <h3 style={{ marginTop: 0, color: "#161616", fontSize: "1.125rem", fontWeight: 600 }}>
                nodenv (Alternative)
              </h3>
              <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "1rem" }}>
                Similar to pyenv. Automatically switches Node versions based on <code>.node-version</code> files. 
                Good if you already use pyenv for Python.
              </p>
              <ul style={{ marginLeft: "1.5rem", color: "#525252", lineHeight: 1.8 }}>
                <li>Automatic version switching per directory</li>
                <li>Consistent with pyenv workflow</li>
                <li>Less common but equally capable</li>
              </ul>
            </div>
          </div>

          <div style={{
            backgroundColor: "#e8f4ff",
            padding: "1.5rem",
            borderRadius: "4px",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem", fontWeight: 600 }}>
              💡 Recommendation: Start with nvm
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
              If you're new to Node, use <strong>nvm</strong>. It's the most common choice and has the best 
              documentation. You can always switch to nodenv later if needed.
            </p>
          </div>
        </Section>

        {/* Install + Verify (Mac) */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Install + Verify (Mac)</h2>
          </div>

          <VisualDiagram 
            content={nvmInstallMacDiagram}
            title="nvm Installation on Mac"
          />

          <div style={{
            backgroundColor: "#fff1f1",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #da1e28"
          }}>
            <h3 style={{ marginTop: 0, color: "#da1e28", fontSize: "1.125rem", fontWeight: 600 }}>
              ⚠️ Shell Config Required
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
              After installing nvm, you <strong>must</strong> add the initialization script to your shell config 
              (~/.zshrc or ~/.bash_profile). Without this, nvm won't work. The installer usually shows you the 
              exact lines to add.
            </p>
          </div>
        </Section>

        {/* Install + Verify (Windows) */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Install + Verify (Windows)</h2>
          </div>

          <VisualDiagram 
            content={nvmInstallWindowsDiagram}
            title="nvm Installation on Windows"
          />

          <div style={{
            backgroundColor: "#ffffff",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ marginTop: 0, color: "#161616", fontSize: "1.125rem", fontWeight: 600 }}>
              Windows Notes
            </h3>
            <ul style={{ marginLeft: "1.5rem", color: "#525252", lineHeight: 1.8, marginBottom: 0 }}>
              <li>Use <strong>nvm-windows</strong> (different from Mac/Linux nvm)</li>
              <li>Requires admin privileges to install</li>
              <li>Commands are slightly different: <code>nvm list</code> instead of <code>nvm ls</code></li>
              <li>Works in both Command Prompt and PowerShell</li>
            </ul>
          </div>
        </Section>

        {/* Project Workflow */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Project Workflow</h2>
          </div>

          <VisualDiagram 
            content={projectWorkflowDiagram}
            title="Running a Node Project"
          />

          <div style={{
            backgroundColor: "#e8f4ff",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem", fontWeight: 600 }}>
              💡 Pro Tip: Always Check .nvmrc First
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
              If a project has a <code>.nvmrc</code> file, run <code>nvm install && nvm use</code> before 
              <code>npm install</code>. This ensures you're using the correct Node version and prevents 
              "unsupported engine" errors.
            </p>
          </div>
        </Section>

        {/* Common Errors */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem", 
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #e0e0e0"
          }}>
            <WarningAlt size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Common Errors</h2>
          </div>

          <VisualDiagram 
            content={commonErrorsDiagram}
            title="Troubleshooting Node Issues"
          />
        </Section>

        {/* Next Steps */}
        <Section level={3} style={{ marginBottom: "2rem" }}>
          <div style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            borderLeft: "4px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#161616", marginBottom: "1rem", fontWeight: 600 }}>
              Node Setup Complete!
            </h3>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, marginBottom: "1.5rem", color: "#525252" }}>
              You're ready to run Node projects locally. Next, set up Python if you work with backend services, 
              or practice these commands in the Practice Lab.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button
                kind="primary"
                renderIcon={ArrowRight}
                onClick={() => navigate("/local-setup/python")}
              >
                Python Runtime Setup
              </Button>
              <Button
                kind="secondary"
                renderIcon={ArrowRight}
                onClick={() => navigate("/local-setup")}
              >
                Back to Local Setup
              </Button>
              <Button
                kind="tertiary"
                renderIcon={Launch}
                onClick={() => navigate("/interactive-terminal")}
              >
                Practice Lab
              </Button>
            </div>
          </div>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
