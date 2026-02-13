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

        {/* Hands-On Exercise: Financial News Aggregator */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #0f62fe"
          }}>
            <Launch size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Hands-On Exercise: Clone & Run a Real Project</h2>
          </div>

          <div style={{
            backgroundColor: "#f4f4f4",
            padding: "1.5rem",
            borderRadius: "4px",
            marginBottom: "1.5rem",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, color: "#161616", fontSize: "1.125rem", fontWeight: 600 }}>
              📦 Project: Financial News Aggregator
            </h3>
            <p style={{ color: "#525252", lineHeight: 1.8, marginBottom: "1rem" }}>
              A React + Node.js app that aggregates financial news and generates AI-powered seller insights using IBM watsonx.ai.
              This project has both a frontend (React/Vite) and backend (Express.js proxy server).
            </p>
            <p style={{ color: "#525252", lineHeight: 1.8, margin: 0 }}>
              <strong>Repo:</strong> <code>github.com:content-studio-sandbox/financial-news-aggregator.git</code>
            </p>
          </div>

          <VisualDiagram
            content={`
┌─────────────────────────────────────────────────────┐
│    Clone & Run: Financial News Aggregator           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Clone the repository                            │
│     $ git clone git@github.com:content-studio-sandbox/financial-news-aggregator.git│
│     $ cd financial-news-aggregator                  │
│                                                     │
│  2. Check Node version requirement                  │
│     $ cat .nvmrc                                    │
│     20.11.0                                         │
│                                                     │
│  3. Use the correct Node version                    │
│     $ nvm install    # installs Node 20.11.0        │
│     $ nvm use        # switches to Node 20.11.0     │
│                                                     │
│  4. Install dependencies                            │
│     $ npm install                                   │
│     # This installs both frontend and backend deps  │
│                                                     │
│  5. Set up environment variables                    │
│     $ cp .env.example .env                          │
│     $ nano .env      # Add your API keys            │
│                                                     │
│     Required API keys:                              │
│     - VITE_NEWS_API_KEY (newsapi.org)               │
│     - VITE_FINNHUB_API_KEY (finnhub.io)             │
│     - VITE_WATSONX_API_KEY (IBM watsonx)            │
│                                                     │
│  6. Start the development server                    │
│     $ npm run dev                                   │
│     # This starts BOTH:                             │
│     # - Frontend: http://localhost:5173             │
│     # - Backend:  http://localhost:3001             │
│                                                     │
│  7. Open in browser                                 │
│     Navigate to: http://localhost:5173              │
│     You should see the Financial News Aggregator    │
│                                                     │
└─────────────────────────────────────────────────────┘`}
            title="Step-by-Step Setup"
          />

          <div style={{
            backgroundColor: "#e8f4ff",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem", fontWeight: 600 }}>
              🏗️ Project Structure Explained
            </h3>
            <pre style={{
              backgroundColor: "#ffffff",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              color: "#161616"
            }}>{`financial-news-aggregator/
├── src/                    # Frontend React code
│   ├── pages/             # Page components
│   ├── components/        # Reusable components
│   └── services/          # API service functions
├── api/                   # Backend Express server
│   └── server.js          # API proxy (port 3001)
├── server.js              # Main backend entry point
├── package.json           # Dependencies & scripts
├── .nvmrc                 # Node version (20.11.0)
├── .env.example           # Environment template
└── vite.config.ts         # Vite configuration`}</pre>
            <p style={{ color: "#161616", lineHeight: 1.8, marginTop: "1rem", marginBottom: 0 }}>
              <strong>Key Points:</strong>
            </p>
            <ul style={{ marginLeft: "1.5rem", color: "#161616", lineHeight: 1.8, marginTop: "0.5rem" }}>
              <li><code>server.js</code> at root is the main backend server</li>
              <li><code>api/server.js</code> is the Express proxy for API calls</li>
              <li><code>npm run dev</code> starts both frontend (Vite) and backend (Express) concurrently</li>
              <li>Frontend makes API calls to backend proxy to avoid CORS issues</li>
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
              ⚠️ Common Issues When Cloning
            </h3>
            <ul style={{ marginLeft: "1.5rem", color: "#161616", lineHeight: 1.8, marginBottom: 0 }}>
              <li><strong>Wrong Node version:</strong> Make sure you run <code>nvm use</code> before <code>npm install</code></li>
              <li><strong>Missing .env file:</strong> Copy <code>.env.example</code> to <code>.env</code> and add your API keys</li>
              <li><strong>Port already in use:</strong> If port 5173 or 3001 is busy, kill the process or change ports</li>
              <li><strong>API keys not working:</strong> Make sure you've signed up for free accounts at newsapi.org, finnhub.io, and IBM watsonx</li>
            </ul>
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
        {/* NEW: Microservices Architecture Exercise */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
            paddingBottom: "0.75rem",
            borderBottom: "2px solid #0f62fe"
          }}>
            <Launch size={24} style={{ color: "#0f62fe" }} />
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Advanced Exercise: Polyglot Microservices (nvm + pyenv)</h2>
          </div>

          <div style={{
            backgroundColor: "#fff3cd",
            padding: "1.5rem",
            borderRadius: "4px",
            marginBottom: "1.5rem",
            border: "1px solid #ffc107"
          }}>
            <h3 style={{ marginTop: 0, color: "#856404", fontSize: "1.125rem", fontWeight: 600 }}>
              💼 Why Tech Sellers Need to Know This
            </h3>
            <p style={{ color: "#856404", lineHeight: 1.8, marginBottom: "1rem" }}>
              In financial services, you'll encounter clients running <strong>polyglot microservices</strong> - 
              multiple services in different languages working together. Understanding how to run these locally 
              helps you:
            </p>
            <ul style={{ marginLeft: "1.5rem", color: "#856404", lineHeight: 1.8, marginTop: "0.5rem" }}>
              <li><strong>Demo solutions confidently</strong> - Show clients how services integrate</li>
              <li><strong>Troubleshoot faster</strong> - Understand deployment issues before they escalate</li>
              <li><strong>Speak the language</strong> - Discuss architecture with technical stakeholders</li>
              <li><strong>Close deals faster</strong> - Fewer technical blockers = faster deployments = you get paid!</li>
            </ul>
          </div>

          <VisualDiagram
            content={`
┌─────────────────────────────────────────────────────────────────┐
│         Microservices Architecture: Real-World Example          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Browser (http://localhost:8084)                        │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │  Financial News Aggregator (Node.js/React)        │  │   │
│  │  │  - News Page                                      │  │   │
│  │  │  - AI Insights (WatsonX.ai)                       │  │   │
│  │  │  - Market Data Page ← Calls Python service       │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                           ↓ HTTP Request                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Market Data Service (http://localhost:8000)            │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │  Python FastAPI Backend                           │  │   │
│  │  │  - Stock prices (IBM, JPM, AAPL, etc.)            │  │   │
│  │  │  - Commodity data (Gold, Silver, Oil)             │  │   │
│  │  │  - Forex rates (USD-EUR, USD-GBP, etc.)           │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  │                      ↓                                   │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │  Redis Cache (port 6379)                          │  │   │
│  │  │  - 95% cache hit rate                             │  │   │
│  │  │  - Reduces API costs                              │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Why Two Languages?                                             │
│  • Node.js: Fast UI, real-time updates, React ecosystem        │
│  • Python: Data processing, ML libraries, API integrations     │
│  • Best tool for each job = Better performance & maintainability│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘`}
            title="Polyglot Microservices Architecture"
          />

          <div style={{
            backgroundColor: "#f4f4f4",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            marginBottom: "1.5rem",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, color: "#161616", fontSize: "1.125rem", fontWeight: 600 }}>
              🎯 Exercise Goal
            </h3>
            <p style={{ color: "#525252", lineHeight: 1.8, margin: 0 }}>
              Run <strong>two microservices simultaneously</strong> - one in Node.js (using nvm) and one in Python (using pyenv). 
              See how they communicate and understand why version management matters for both.
            </p>
          </div>

          <VisualDiagram
            content={`
┌─────────────────────────────────────────────────────────────────┐
│              Step 1: Set Up Node.js Service (nvm)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Clone the Node.js frontend                                  │
│     $ git clone git@github.ibm.com:fsm-content-studio/financial-news-aggregator.git│
│     $ cd financial-news-aggregator                              │
│                                                                 │
│  2. Check Node version requirement                              │
│     $ cat .nvmrc                                                │
│     20.11.0                                                     │
│                                                                 │
│  3. Use correct Node version with nvm                           │
│     $ nvm install 20.11.0                                       │
│     $ nvm use 20.11.0                                           │
│     $ node -v              # Verify: v20.11.0                   │
│                                                                 │
│  4. Install dependencies                                        │
│     $ npm install                                               │
│                                                                 │
│  5. Start the Node.js service                                   │
│     $ npm run dev:all                                           │
│     ✅ Frontend: http://localhost:8084                          │
│     ✅ Backend:  http://localhost:3001                          │
│                                                                 │
│  Keep this terminal running! ⚠️                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘`}
            title="Part 1: Node.js Service"
          />

          <VisualDiagram
            content={`
┌─────────────────────────────────────────────────────────────────┐
│            Step 2: Set Up Python Service (pyenv)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Open a NEW terminal window (keep Node.js running!)            │
│                                                                 │
│  1. Clone the Python backend                                    │
│     $ git clone git@github.ibm.com:fsm-content-studio/market-data-service.git│
│     $ cd market-data-service                                    │
│                                                                 │
│  2. Check Python version requirement                            │
│     $ cat .python-version                                       │
│     3.11.7                                                      │
│                                                                 │
│  3. Use correct Python version with pyenv                       │
│     $ pyenv install 3.11.7                                      │
│     $ pyenv local 3.11.7                                        │
│     $ python --version     # Verify: Python 3.11.7              │
│                                                                 │
│  4. Create virtual environment                                  │
│     $ python -m venv venv                                       │
│     $ source venv/bin/activate  # macOS/Linux                   │
│     # OR: venv\\Scripts\\activate  # Windows                      │
│                                                                 │
│  5. Install dependencies                                        │
│     $ pip install -r requirements.txt                           │
│                                                                 │
│  6. Start Redis (in another terminal or Docker)                 │
│     $ docker run -d -p 6379:6379 redis:alpine                   │
│                                                                 │
│  7. Start the Python service                                    │
│     $ uvicorn main:app --reload --port 8000                     │
│     ✅ Service: http://localhost:8000                           │
│                                                                 │
│  Keep this terminal running too! ⚠️                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘`}
            title="Part 2: Python Service"
          />

          <VisualDiagram
            content={`
┌─────────────────────────────────────────────────────────────────┐
│                Step 3: See Them Work Together                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Now you have THREE services running:                           │
│                                                                 │
│  Terminal 1: Node.js Frontend (port 8084)                       │
│  Terminal 2: Python Backend (port 8000)                         │
│  Terminal 3: Redis Cache (port 6379)                            │
│                                                                 │
│  1. Open browser to: http://localhost:8084                      │
│                                                                 │
│  2. Navigate to "Market Data" tab                               │
│                                                                 │
│  3. You should see:                                             │
│     ✅ Service Online badge (green)                             │
│     ✅ 12 stock prices (IBM, JPM, AAPL, TSLA, etc.)             │
│     ✅ 4 commodity prices (Gold, Silver, Oil, Gas)              │
│     ✅ 4 forex rates (USD-EUR, USD-GBP, USD-JPY, USD-CNY)       │
│                                                                 │
│  4. Watch the magic happen:                                     │
│     • React frontend (Node.js) makes HTTP request               │
│     • Python service receives request                           │
│     • Python checks Redis cache first                           │
│     • If cached: Returns instantly (95% of requests)            │
│     • If not cached: Fetches from API, caches, returns          │
│     • Frontend displays data beautifully                        │
│                                                                 │
│  5. Click "Refresh" button - notice how fast it is!             │
│     That's the Redis cache working! 🚀                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘`}
            title="Part 3: Integration Test"
          />

          <div style={{
            backgroundColor: "#e8f4ff",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", fontSize: "1.125rem", fontWeight: 600 }}>
              🎓 Key Learnings: nvm vs pyenv
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "1rem",
                backgroundColor: "#ffffff"
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#f4f4f4" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #0f62fe" }}>Step</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #0f62fe" }}>Node.js (nvm)</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", borderBottom: "2px solid #0f62fe" }}>Python (pyenv)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><strong>Version file</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>.nvmrc</code></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>.python-version</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><strong>Install version</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>nvm install</code></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>pyenv install 3.11.7</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><strong>Use version</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>nvm use</code></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>pyenv local 3.11.7</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><strong>Dependencies file</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>package.json</code></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>requirements.txt</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><strong>Install deps</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>npm install</code></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>pip install -r requirements.txt</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><strong>Dependency folder</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>node_modules/</code></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>venv/</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><strong>Run dev server</strong></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>npm run dev</code></td>
                    <td style={{ padding: "0.75rem", borderBottom: "1px solid #e0e0e0" }}><code>uvicorn main:app --reload</code></td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem" }}><strong>Check version</strong></td>
                    <td style={{ padding: "0.75rem" }}><code>node -v</code></td>
                    <td style={{ padding: "0.75rem" }}><code>python --version</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div style={{
            backgroundColor: "#d4edda",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #28a745"
          }}>
            <h3 style={{ marginTop: 0, color: "#155724", fontSize: "1.125rem", fontWeight: 600 }}>
              💼 Sales Conversation Starters
            </h3>
            <p style={{ color: "#155724", lineHeight: 1.8, marginBottom: "1rem" }}>
              After completing this exercise, you can confidently discuss:
            </p>
            <ul style={{ marginLeft: "1.5rem", color: "#155724", lineHeight: 1.8, marginTop: "0.5rem", marginBottom: 0 }}>
              <li><strong>"We use polyglot microservices..."</strong> - You've run them locally!</li>
              <li><strong>"Our caching reduces API costs by 95%..."</strong> - You've seen Redis in action!</li>
              <li><strong>"Python for data, Node.js for UI..."</strong> - You understand the architecture!</li>
              <li><strong>"Version management prevents deployment issues..."</strong> - You've used nvm and pyenv!</li>
              <li><strong>"IBM can help modernize your architecture..."</strong> - You know what modern looks like!</li>
            </ul>
          </div>

          <div style={{
            backgroundColor: "#fff3cd",
            padding: "1.5rem",
            borderRadius: "4px",
            marginTop: "1.5rem",
            border: "1px solid #ffc107"
          }}>
            <h3 style={{ marginTop: 0, color: "#856404", fontSize: "1.125rem", fontWeight: 600 }}>
              ⚠️ Common Issues & Solutions
            </h3>
            <div style={{ color: "#856404", lineHeight: 1.8 }}>
              <p><strong>Issue:</strong> "Python service shows offline"</p>
              <p style={{ marginLeft: "1.5rem" }}>✅ Make sure Python service is running on port 8000</p>
              <p style={{ marginLeft: "1.5rem" }}>✅ Check: <code>curl http://localhost:8000/health</code></p>
              
              <p style={{ marginTop: "1rem" }}><strong>Issue:</strong> "Redis connection failed"</p>
              <p style={{ marginLeft: "1.5rem" }}>✅ Start Redis: <code>docker run -d -p 6379:6379 redis:alpine</code></p>
              <p style={{ marginLeft: "1.5rem" }}>✅ Or install locally: <code>brew install redis && brew services start redis</code></p>
              
              <p style={{ marginTop: "1rem" }}><strong>Issue:</strong> "Wrong Python version"</p>
              <p style={{ marginLeft: "1.5rem" }}>✅ Run: <code>pyenv local 3.11.7</code></p>
              <p style={{ marginLeft: "1.5rem" }}>✅ Verify: <code>python --version</code></p>
              
              <p style={{ marginTop: "1rem" }}><strong>Issue:</strong> "Port already in use"</p>
              <p style={{ marginLeft: "1.5rem" }}>✅ Find process: <code>lsof -i :8000</code> or <code>lsof -i :8084</code></p>
              <p style={{ marginLeft: "1.5rem", marginBottom: 0 }}>✅ Kill it: <code>kill -9 &lt;PID&gt;</code></p>
            </div>
          </div>
        </Section>

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
