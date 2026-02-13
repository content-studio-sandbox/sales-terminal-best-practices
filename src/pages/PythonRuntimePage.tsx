import React from "react";
import { Grid, Column, Heading, Section, Button } from "@carbon/react";
import { Code, CheckmarkFilled, WarningAlt, Launch, ArrowRight } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import VisualDiagram from "../components/VisualDiagram";

export default function PythonRuntimePage() {
  const navigate = useNavigate();

  const pyenvInstallMacDiagram = `
┌─────────────────────────────────────────────────────┐
│         Install pyenv on Mac                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Install via Homebrew                            │
│     $ brew install pyenv                            │
│                                                     │
│  2. Add to shell config (~/.zshrc or ~/.bash_profile)│
│     export PYENV_ROOT="$HOME/.pyenv"                │
│     export PATH="$PYENV_ROOT/bin:$PATH"             │
│     eval "$(pyenv init --path)"                     │
│     eval "$(pyenv init -)"                          │
│                                                     │
│  3. Reload shell                                    │
│     $ source ~/.zshrc                               │
│                                                     │
│  4. Verify installation                             │
│     $ pyenv --version                               │
│     pyenv 2.x.x                                     │
│                                                     │
│  5. Install Python 3.11 (recommended)               │
│     $ pyenv install 3.11                            │
│     $ pyenv global 3.11                             │
│                                                     │
│  6. Verify Python is working                        │
│     $ python --version                              │
│     Python 3.11.x                                   │
│     $ pip --version                                 │
│     pip 23.x.x                                      │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const venvWorkflowDiagram = `
┌─────────────────────────────────────────────────────┐
│         Virtual Environment Workflow                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Clone the repo                                  │
│     $ git clone <repo-url>                          │
│     $ cd <repo-name>                                │
│                                                     │
│  2. Check for .python-version file                  │
│     $ cat .python-version                           │
│     3.11.0                                          │
│                                                     │
│  3. Install and set Python version (if needed)      │
│     $ pyenv install 3.11.0                          │
│     $ pyenv local 3.11.0                            │
│                                                     │
│  4. Create virtual environment                      │
│     $ python -m venv .venv                          │
│                                                     │
│  5. Activate virtual environment                    │
│     Mac/Linux:                                      │
│     $ source .venv/bin/activate                     │
│                                                     │
│     Windows:                                        │
│     $ .venv\\Scripts\\activate                      │
│                                                     │
│  6. Verify activation (prompt shows (.venv))        │
│     (.venv) $ which python                          │
│     /path/to/project/.venv/bin/python               │
│                                                     │
│  7. Install dependencies                            │
│     (.venv) $ pip install -r requirements.txt       │
│                                                     │
│  8. Run the application                             │
│     (.venv) $ python app.py                         │
│     # or                                            │
│     (.venv) $ uvicorn main:app --reload             │
│     # or                                            │
│     (.venv) $ flask run                             │
│                                                     │
│  9. Deactivate when done                            │
│     (.venv) $ deactivate                            │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const commonErrorsDiagram = `
┌─────────────────────────────────────────────────────┐
│         Common Python Errors & Fixes                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Error: "python: command not found"                 │
│  Fix: pyenv not in PATH or Python not installed     │
│       $ pyenv install 3.11                          │
│       $ pyenv global 3.11                           │
│       Restart terminal                              │
│                                                     │
│  Error: pip installs to wrong Python version        │
│  Fix: Activate virtual environment first            │
│       $ source .venv/bin/activate                   │
│       (.venv) $ pip install -r requirements.txt     │
│                                                     │
│  Error: "No module named 'xyz'"                     │
│  Fix: Dependencies not installed or wrong venv      │
│       $ source .venv/bin/activate                   │
│       (.venv) $ pip install -r requirements.txt     │
│                                                     │
│  Error: Python version mismatch                     │
│  Fix: Use pyenv to switch versions                  │
│       $ pyenv install 3.11                          │
│       $ pyenv local 3.11                            │
│       $ rm -rf .venv                                │
│       $ python -m venv .venv                        │
│       $ source .venv/bin/activate                   │
│       (.venv) $ pip install -r requirements.txt     │
│                                                     │
│  Error: SSL certificate errors                      │
│  Fix: Update certificates or use --trusted-host     │
│       $ pip install --upgrade certifi               │
│       # or                                          │
│       $ pip install --trusted-host pypi.org \\      │
│         --trusted-host files.pythonhosted.org <pkg> │
│                                                     │
│  Error: "externally-managed-environment"            │
│  Fix: Always use virtual environments               │
│       Don't install packages globally               │
│       $ python -m venv .venv                        │
│       $ source .venv/bin/activate                   │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const quickReferenceDiagram = `
┌─────────────────────────────────────────────────────┐
│         Python Quick Reference                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│  pyenv commands:                                    │
│    pyenv install 3.11      # Install Python 3.11    │
│    pyenv versions          # List installed versions│
│    pyenv global 3.11       # Set default version    │
│    pyenv local 3.11        # Set version for project│
│                                                     │
│  Virtual environment:                               │
│    python -m venv .venv    # Create venv            │
│    source .venv/bin/activate  # Activate (Mac/Linux)│
│    .venv\\Scripts\\activate   # Activate (Windows)  │
│    deactivate              # Deactivate             │
│                                                     │
│  Package management:                                │
│    pip install <package>   # Install package        │
│    pip install -r requirements.txt  # Install all   │
│    pip freeze > requirements.txt    # Save deps     │
│    pip list                # List installed packages│
│                                                     │
│  Common run commands:                               │
│    python app.py           # Run Python script      │
│    uvicorn main:app --reload  # FastAPI             │
│    flask run               # Flask                  │
│    python -m http.server   # Simple HTTP server     │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Code size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Python Runtime Setup (pyenv + venv)</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Set up Python with pyenv for version management and virtual environments for isolated dependencies. 
            This prevents package conflicts and ensures your Python projects run reliably.
          </p>
        </Section>

        {/* pyenv + venv Basics */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>pyenv + venv Basics</h2>
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
                pyenv (Version Manager)
              </h3>
              <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "1rem" }}>
                Manages multiple Python versions on your system. Similar to nvm for Node. 
                Lets you switch Python versions per project using <code>.python-version</code> files.
              </p>
              <ul style={{ marginLeft: "1.5rem", color: "#525252", lineHeight: 1.8, marginBottom: 0 }}>
                <li>Install any Python version</li>
                <li>Switch versions per project</li>
                <li>No sudo required</li>
              </ul>
            </div>

            <div style={{
              backgroundColor: "#ffffff",
              padding: "1.5rem",
              borderRadius: "4px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              borderLeft: "4px solid #0f62fe"
            }}>
              <h3 style={{ marginTop: 0, color: "#161616", fontSize: "1.125rem", fontWeight: 600 }}>
                venv (Virtual Environments)
              </h3>
              <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "1rem" }}>
                Built into Python 3. Creates isolated environments for each project's dependencies. 
                Prevents package version conflicts between projects.
              </p>
              <ul style={{ marginLeft: "1.5rem", color: "#525252", lineHeight: 1.8, marginBottom: 0 }}>
                <li>Isolate project dependencies</li>
                <li>No global package pollution</li>
                <li>Standard Python tool (no extra install)</li>
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
              💡 Why Both?
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
              <strong>pyenv</strong> manages Python versions (3.9, 3.10, 3.11, etc.). 
              <strong>venv</strong> isolates packages within a project. Use pyenv to install the right Python version, 
              then use venv to keep each project's packages separate.
            </p>
          </div>
        </Section>

        {/* Install + Verify */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Install + Verify</h2>
          </div>

          <VisualDiagram 
            content={pyenvInstallMacDiagram}
            title="pyenv Installation on Mac"
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
              Windows Users
            </h3>
            <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "1rem" }}>
              pyenv doesn't officially support Windows. Use one of these alternatives:
            </p>
            <ul style={{ marginLeft: "1.5rem", color: "#525252", lineHeight: 1.8, marginBottom: 0 }}>
              <li><strong>pyenv-win:</strong> Windows port of pyenv (github.com/pyenv-win/pyenv-win)</li>
              <li><strong>Python installer:</strong> Download from python.org and manage versions manually</li>
              <li><strong>WSL:</strong> Use Windows Subsystem for Linux and install pyenv there</li>
            </ul>
          </div>

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
              After installing pyenv, you <strong>must</strong> add the initialization script to your shell config. 
              Without this, pyenv won't work. The exact lines depend on your shell (zsh/bash) and are shown during 
              installation.
            </p>
          </div>
        </Section>

        {/* Virtual Environment Workflow */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Virtual Environment Workflow</h2>
          </div>

          <VisualDiagram 
            content={venvWorkflowDiagram}
            title="Running a Python Project"
          />

          <div style={{
            backgroundColor: "#e8f4ff",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem", fontWeight: 600 }}>
              💡 Pro Tip: Always Activate Before Installing
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
              Always activate your virtual environment (<code>source .venv/bin/activate</code>) before running 
              <code>pip install</code>. This ensures packages install to the project's venv, not globally. 
              Your prompt should show <code>(.venv)</code> when activated.
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
            title="Troubleshooting Python Issues"
          />
        </Section>

        {/* Quick Reference */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Quick Reference</h2>
          </div>

          <VisualDiagram 
            content={quickReferenceDiagram}
            title="Python Commands Cheat Sheet"
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
              Python Setup Complete!
            </h3>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, marginBottom: "1.5rem", color: "#525252" }}>
              You're ready to run Python projects locally. Practice these commands in the Practice Lab, 
              or go back to set up Node if you haven't already.
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Button
                kind="primary"
                renderIcon={ArrowRight}
                onClick={() => navigate("/local-setup/node")}
              >
                Node Runtime Setup
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
