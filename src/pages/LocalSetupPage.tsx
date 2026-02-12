import React from "react";
import { Grid, Column, Heading, Section, Button } from "@carbon/react";
import { Laptop, CheckmarkFilled, WarningAlt, Launch, ArrowRight } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import VisualDiagram from "../components/VisualDiagram";

export default function LocalSetupPage() {
  const navigate = useNavigate();

  const quickChecklistDiagram = `
┌─────────────────────────────────────────────────────┐
│         Quick Setup Checklist                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Check Current Versions                          │
│     $ node -v                                       │
│     $ npm -v                                        │
│     $ python3 --version                             │
│     $ pip --version                                 │
│                                                     │
│  2. Install Version Managers (if needed)            │
│     Node:   nvm or nodenv                           │
│     Python: pyenv                                   │
│                                                     │
│  3. Clone a Repo & Run It                           │
│     $ git clone <repo-url>                          │
│     $ cd <repo-name>                                │
│                                                     │
│     For Node projects:                              │
│     $ nvm use          # if .nvmrc exists           │
│     $ npm install                                   │
│     $ npm run dev                                   │
│                                                     │
│     For Python projects:                            │
│     $ python -m venv .venv                          │
│     $ source .venv/bin/activate                     │
│     $ pip install -r requirements.txt               │
│     $ python app.py   # or uvicorn/flask command    │
│                                                     │
│  4. Verify It Works                                 │
│     Open browser to localhost:3000 (or port shown)  │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const commonFixesDiagram = `
┌─────────────────────────────────────────────────────┐
│         Common Issues & Quick Fixes                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Problem: Wrong Node/Python version                 │
│  Fix: Use version manager to switch versions        │
│       $ nvm use 18                                  │
│       $ pyenv local 3.11                            │
│                                                     │
│  Problem: Missing dependencies                      │
│  Fix: Install them                                  │
│       $ npm install  (or pnpm install)              │
│       $ pip install -r requirements.txt             │
│                                                     │
│  Problem: Port already in use                       │
│  Fix: Kill process or use different port            │
│       $ lsof -ti:3000 | xargs kill -9               │
│       $ PORT=3001 npm run dev                       │
│                                                     │
│  Problem: Missing .env file                         │
│  Fix: Copy example and add your keys                │
│       $ cp .env.example .env                        │
│       $ nano .env  # add your API keys              │
│                                                     │
│  Problem: Permission denied                         │
│  Fix: Don't use sudo with npm/pip                   │
│       Use version managers instead                  │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Laptop size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Lab 3: Local Setup - Run Projects Locally</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            A practical checklist to avoid version conflicts and get demos running quickly. Set up Node and Python 
            runtimes so you can reliably run repos locally without "works on my machine" issues.
          </p>
        </Section>

        {/* What You'll Set Up */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>What You'll Set Up</h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
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
                Node Runtime + Version Manager
              </h3>
              <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "0.5rem" }}>
                Use <strong>nvm</strong> or <strong>nodenv</strong> to switch Node versions per project. 
                Avoids conflicts when different repos need different Node versions.
              </p>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={ArrowRight}
                onClick={() => navigate("/local-setup/node")}
              >
                Node Setup Guide
              </Button>
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
                Python Runtime + Virtual Environments
              </h3>
              <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "0.5rem" }}>
                Use <strong>pyenv</strong> for Python versions and <strong>venv</strong> for isolated dependencies. 
                Prevents package conflicts between projects.
              </p>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={ArrowRight}
                onClick={() => navigate("/local-setup/python")}
              >
                Python Setup Guide
              </Button>
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
                Dependencies & Environment Variables
              </h3>
              <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "0.5rem" }}>
                Install packages with <strong>npm/pnpm</strong> or <strong>pip</strong>. 
                Configure API keys and secrets in <strong>.env</strong> files (never commit these!).
              </p>
            </div>
          </div>
        </Section>

        {/* Why This Matters */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Why This Matters</h2>
          </div>

          <div style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
          }}>
            <ul style={{ marginLeft: "1.5rem", lineHeight: 2, color: "#525252", fontSize: "1rem" }}>
              <li>
                <strong style={{ color: "#161616" }}>Avoid "works on my machine":</strong> Version managers ensure 
                everyone uses the same Node/Python version as the project specifies.
              </li>
              <li>
                <strong style={{ color: "#161616" }}>Reduce demo failures:</strong> Missing dependencies or wrong 
                versions are the #1 cause of "it won't start" issues during customer demos.
              </li>
              <li>
                <strong style={{ color: "#161616" }}>Faster troubleshooting:</strong> When deployments fail, you can 
                quickly reproduce the issue locally and test fixes.
              </li>
              <li>
                <strong style={{ color: "#161616" }}>Professional setup:</strong> Shows customers you understand 
                modern development workflows and can support their teams effectively.
              </li>
            </ul>
          </div>
        </Section>

        {/* Quick Start Checklist */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Quick Start Checklist</h2>
          </div>

          <VisualDiagram 
            content={quickChecklistDiagram}
            title="Setup Workflow"
          />

          <div style={{
            backgroundColor: "#e8f4ff",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem", fontWeight: 600 }}>
              💡 Pro Tip: Start with One Runtime
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
              If you're new to this, start with Node (most IBM demos use React/Node). Once you're comfortable, 
              add Python. Both follow similar patterns: version manager → install dependencies → run project.
            </p>
          </div>
        </Section>

        {/* Common Fixes */}
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
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Common Fixes</h2>
          </div>

          <VisualDiagram 
            content={commonFixesDiagram}
            title="Troubleshooting Guide"
          />

          <div style={{
            backgroundColor: "#fff1f1",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #da1e28"
          }}>
            <h3 style={{ marginTop: 0, color: "#da1e28", fontSize: "1.125rem", fontWeight: 600 }}>
              ⚠️ Never Use sudo with npm or pip
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
              If you need sudo to install packages, your setup is wrong. Use version managers (nvm/pyenv) instead. 
              They install to your user directory and don't require admin permissions.
            </p>
          </div>
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
              Ready to Set Up Your Workstation?
            </h3>
            <p style={{ fontSize: "1rem", lineHeight: 1.8, marginBottom: "1.5rem", color: "#525252" }}>
              Choose your runtime to get started. Most IBM demos use Node, but many backend services use Python. 
              Set up both for maximum flexibility.
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
                onClick={() => navigate("/local-setup/python")}
              >
                Python Runtime Setup
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
