import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Terminal, Code, CheckmarkFilled, Information } from "@carbon/icons-react";
import VisualDiagram from "../components/VisualDiagram";

export default function CpdCliPage() {
  const cpdCliWorkflow = `
┌─────────────────────────────────────────────────────┐
│         CPD CLI Workflow                            │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Install cpd-cli                                 │
│     ↓                                               │
│  2. Configure Connection                            │
│     • Set CPD URL                                   │
│     • Provide credentials/API key                   │
│     ↓                                               │
│  3. Authenticate                                    │
│     cpd-cli config users set                        │
│     ↓                                               │
│  4. Execute Commands                                │
│     • Manage projects                               │
│     • Deploy models                                 │
│     • Manage assets                                 │
│     • Run jobs                                      │
│     ↓                                               │
│  5. Automate with Scripts                           │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const installationExample = `# Install CPD CLI

# Method 1: Download from IBM Cloud Pak for Data
# Navigate to: Profile > Downloads > Command Line Interface
# Download the appropriate version for your OS

# Method 2: Using curl (Linux/Mac)
curl -o cpd-cli https://github.com/IBM/cpd-cli/releases/download/v12.0.0/cpd-cli-linux-amd64
chmod +x cpd-cli
sudo mv cpd-cli /usr/local/bin/

# Method 3: Using curl (Windows)
# Download from GitHub releases and add to PATH

# Verify installation
cpd-cli version

# Output:
# CPD CLI Version: 12.0.0
# Build Date: 2024-01-15`;

  const configurationExample = `# Configure CPD CLI Connection

# Step 1: Set the CPD URL
cpd-cli config profile set default \\
  --url https://cpd-instance.example.com

# Step 2: Set user credentials
cpd-cli config users set default \\
  --username admin \\
  --apikey YOUR_ZEN_API_KEY

# Alternative: Use password instead of API key
cpd-cli config users set default \\
  --username admin \\
  --password YOUR_PASSWORD

# Step 3: Verify configuration
cpd-cli config profiles list
cpd-cli config users list

# Step 4: Test connection
cpd-cli version --cpd-scope`;

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Terminal size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>IBM Cloud Pak for Data CLI (cpd-cli)</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Master the CPD CLI for automating Cloud Pak for Data operations, managing projects, 
            deploying models, and streamlining customer demos and POCs.
          </p>
        </Section>

        {/* Why CPD CLI Matters */}
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
                Why CPD CLI is Essential for Sales Teams
              </h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li><strong>Rapid POC Setup:</strong> Quickly provision projects and deploy assets for demos</li>
              <li><strong>Automation:</strong> Script repetitive tasks for consistent customer environments</li>
              <li><strong>Troubleshooting:</strong> Diagnose issues faster than using the UI</li>
              <li><strong>Bulk Operations:</strong> Manage multiple resources efficiently</li>
              <li><strong>CI/CD Integration:</strong> Integrate CPD operations into DevOps pipelines</li>
              <li><strong>Remote Management:</strong> Manage CPD instances from anywhere</li>
            </ul>
          </div>

          <VisualDiagram 
            title="CPD CLI Workflow" 
            content={cpdCliWorkflow}
          />
        </Section>

        {/* Installation */}
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
                Installation and Setup
              </h3>
            </div>

            <VisualDiagram 
              title="Installing CPD CLI" 
              content={installationExample}
            />

            <div style={{ marginTop: "2rem" }}>
              <VisualDiagram 
                title="Configuring CPD CLI" 
                content={configurationExample}
              />
            </div>
          </div>
        </Section>

        {/* Common Commands */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Essential CPD CLI Commands
            </h3>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              {[
                {
                  category: "Project Management",
                  commands: [
                    {
                      title: "List Projects",
                      command: "cpd-cli project list",
                      description: "View all projects in your CPD instance"
                    },
                    {
                      title: "Create Project",
                      command: `cpd-cli project create \\
  --name "Sales Demo Project" \\
  --description "Demo environment for customer presentation"`,
                      description: "Create a new project for organizing assets"
                    },
                    {
                      title: "Get Project Details",
                      command: "cpd-cli project get --project-id PROJECT_ID",
                      description: "View detailed information about a specific project"
                    },
                    {
                      title: "Delete Project",
                      command: "cpd-cli project delete --project-id PROJECT_ID",
                      description: "Remove a project and its contents"
                    }
                  ]
                },
                {
                  category: "Asset Management",
                  commands: [
                    {
                      title: "List Assets",
                      command: "cpd-cli asset search --project-id PROJECT_ID",
                      description: "View all assets in a project"
                    },
                    {
                      title: "Export Asset",
                      command: `cpd-cli asset export \\
  --asset-id ASSET_ID \\
  --project-id PROJECT_ID \\
  --output-file asset.zip`,
                      description: "Export an asset for backup or migration"
                    },
                    {
                      title: "Import Asset",
                      command: `cpd-cli asset import \\
  --file asset.zip \\
  --project-id PROJECT_ID`,
                      description: "Import an asset into a project"
                    }
                  ]
                },
                {
                  category: "Space Management",
                  commands: [
                    {
                      title: "List Deployment Spaces",
                      command: "cpd-cli space list",
                      description: "View all deployment spaces"
                    },
                    {
                      title: "Create Deployment Space",
                      command: `cpd-cli space create \\
  --name "Production Space" \\
  --description "Production deployment environment"`,
                      description: "Create a space for deploying models"
                    },
                    {
                      title: "Promote Asset to Space",
                      command: `cpd-cli asset promote \\
  --asset-id ASSET_ID \\
  --project-id PROJECT_ID \\
  --space-id SPACE_ID`,
                      description: "Move an asset from project to deployment space"
                    }
                  ]
                },
                {
                  category: "Model Deployment",
                  commands: [
                    {
                      title: "List Deployments",
                      command: "cpd-cli deployment list --space-id SPACE_ID",
                      description: "View all deployed models in a space"
                    },
                    {
                      title: "Create Deployment",
                      command: `cpd-cli deployment create \\
  --name "Customer Churn Model" \\
  --asset-id ASSET_ID \\
  --space-id SPACE_ID \\
  --online`,
                      description: "Deploy a model for online scoring"
                    },
                    {
                      title: "Get Deployment Details",
                      command: "cpd-cli deployment get --deployment-id DEPLOYMENT_ID",
                      description: "View deployment configuration and status"
                    },
                    {
                      title: "Delete Deployment",
                      command: "cpd-cli deployment delete --deployment-id DEPLOYMENT_ID",
                      description: "Remove a deployment"
                    }
                  ]
                },
                {
                  category: "Job Management",
                  commands: [
                    {
                      title: "List Jobs",
                      command: "cpd-cli job list --project-id PROJECT_ID",
                      description: "View all jobs in a project"
                    },
                    {
                      title: "Run Job",
                      command: "cpd-cli job run --job-id JOB_ID --project-id PROJECT_ID",
                      description: "Execute a job"
                    },
                    {
                      title: "Get Job Status",
                      command: "cpd-cli job get-run --run-id RUN_ID",
                      description: "Check the status of a job run"
                    }
                  ]
                },
                {
                  category: "Connection Management",
                  commands: [
                    {
                      title: "List Connections",
                      command: "cpd-cli connection list --project-id PROJECT_ID",
                      description: "View all data source connections"
                    },
                    {
                      title: "Create Connection",
                      command: `cpd-cli connection create \\
  --name "PostgreSQL DB" \\
  --datasource-type postgresql \\
  --properties '{"database":"mydb","host":"localhost","port":"5432"}' \\
  --project-id PROJECT_ID`,
                      description: "Create a new data source connection"
                    },
                    {
                      title: "Test Connection",
                      command: "cpd-cli connection test --connection-id CONNECTION_ID",
                      description: "Verify connection is working"
                    }
                  ]
                }
              ].map((category, catIndex) => (
                <div key={catIndex}>
                  <h4 style={{ 
                    fontSize: "1.125rem", 
                    fontWeight: 600, 
                    marginBottom: "1rem",
                    color: "#0f62fe",
                    borderBottom: "2px solid #0f62fe",
                    paddingBottom: "0.5rem"
                  }}>
                    {category.category}
                  </h4>
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {category.commands.map((cmd, cmdIndex) => (
                      <div 
                        key={cmdIndex}
                        style={{
                          backgroundColor: "#ffffff",
                          padding: "1.5rem",
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                          <CheckmarkFilled size={20} style={{ color: "#24a148", marginTop: "2px", flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: 600 }}>
                              {cmd.title}
                            </h5>
                            <p style={{ margin: "0 0 1rem 0", color: "#525252", fontSize: "0.875rem" }}>
                              {cmd.description}
                            </p>
                            <div style={{ 
                              backgroundColor: "#161616", 
                              padding: "0.75rem", 
                              borderRadius: "4px",
                              overflowX: "auto"
                            }}>
                              <pre style={{ 
                                margin: 0, 
                                fontSize: "0.75rem", 
                                fontFamily: "'IBM Plex Mono', monospace",
                                color: "#f4f4f4",
                                whiteSpace: "pre-wrap"
                              }}>
                                {cmd.command}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Automation Scripts */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Automation Scripts for Sales Teams
            </h3>

            <div style={{ display: "grid", gap: "2rem" }}>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#0f62fe" }}>
                  Script 1: Quick POC Setup
                </h4>
                <p style={{ color: "#525252", marginBottom: "1rem", fontSize: "0.875rem" }}>
                  Automate the creation of a demo environment with project, connections, and sample data.
                </p>
                <div style={{ 
                  backgroundColor: "#161616", 
                  padding: "1rem", 
                  borderRadius: "4px",
                  overflowX: "auto"
                }}>
                  <pre style={{ 
                    margin: 0, 
                    fontSize: "0.75rem", 
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: "#f4f4f4",
                    whiteSpace: "pre-wrap"
                  }}>
{`#!/bin/bash
# Quick POC Setup Script

# Variables
PROJECT_NAME="Customer Demo - \${CUSTOMER_NAME}"
SPACE_NAME="Demo Deployment Space"

# Create project
echo "Creating project..."
PROJECT_ID=$(cpd-cli project create \\
  --name "$PROJECT_NAME" \\
  --description "Demo environment for $CUSTOMER_NAME" \\
  --output json | jq -r '.metadata.guid')

echo "Project created: $PROJECT_ID"

# Create deployment space
echo "Creating deployment space..."
SPACE_ID=$(cpd-cli space create \\
  --name "$SPACE_NAME" \\
  --description "Deployment space for demos" \\
  --output json | jq -r '.metadata.id')

echo "Space created: $SPACE_ID"

# Import sample assets
echo "Importing sample assets..."
cpd-cli asset import \\
  --file ./sample-assets.zip \\
  --project-id $PROJECT_ID

echo "POC environment ready!"
echo "Project ID: $PROJECT_ID"
echo "Space ID: $SPACE_ID"`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#0f62fe" }}>
                  Script 2: Bulk Model Deployment
                </h4>
                <p style={{ color: "#525252", marginBottom: "1rem", fontSize: "0.875rem" }}>
                  Deploy multiple models to a deployment space in one operation.
                </p>
                <div style={{ 
                  backgroundColor: "#161616", 
                  padding: "1rem", 
                  borderRadius: "4px",
                  overflowX: "auto"
                }}>
                  <pre style={{ 
                    margin: 0, 
                    fontSize: "0.75rem", 
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: "#f4f4f4",
                    whiteSpace: "pre-wrap"
                  }}>
{`#!/bin/bash
# Bulk Model Deployment Script

SPACE_ID="your-space-id"
MODELS_FILE="models.txt"  # File with model IDs, one per line

# Read model IDs and deploy each
while IFS= read -r MODEL_ID; do
  echo "Deploying model: $MODEL_ID"
  
  cpd-cli deployment create \\
    --name "Model-$MODEL_ID" \\
    --asset-id $MODEL_ID \\
    --space-id $SPACE_ID \\
    --online \\
    --output json
  
  echo "Model $MODEL_ID deployed successfully"
done < "$MODELS_FILE"

echo "All models deployed!"`}
                  </pre>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#0f62fe" }}>
                  Script 3: Environment Cleanup
                </h4>
                <p style={{ color: "#525252", marginBottom: "1rem", fontSize: "0.875rem" }}>
                  Clean up demo environments after customer presentations.
                </p>
                <div style={{ 
                  backgroundColor: "#161616", 
                  padding: "1rem", 
                  borderRadius: "4px",
                  overflowX: "auto"
                }}>
                  <pre style={{ 
                    margin: 0, 
                    fontSize: "0.75rem", 
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: "#f4f4f4",
                    whiteSpace: "pre-wrap"
                  }}>
{`#!/bin/bash
# Cleanup Demo Environment Script

PROJECT_PREFIX="Customer Demo"

# List all projects matching prefix
echo "Finding demo projects..."
cpd-cli project list --output json | \\
  jq -r ".resources[] | select(.entity.name | startswith(\\"$PROJECT_PREFIX\\")) | .metadata.guid" | \\
  while read PROJECT_ID; do
    echo "Deleting project: $PROJECT_ID"
    cpd-cli project delete --project-id $PROJECT_ID --force
  done

echo "Cleanup complete!"`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Pro Tips */}
        <Section level={3} style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#e8f4ff", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#0f62fe" }}>💡 Pro Tips for CPD CLI</h3>
          <ul style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
            <li><strong>Use JSON output:</strong> Add <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>--output json</code> for easier parsing in scripts</li>
            <li><strong>Store credentials securely:</strong> Use environment variables for API keys</li>
            <li><strong>Create aliases:</strong> Set up shell aliases for frequently used commands</li>
            <li><strong>Use jq for parsing:</strong> Combine with <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>jq</code> to extract specific fields from JSON output</li>
            <li><strong>Test in dev first:</strong> Always test scripts in a development environment before production</li>
            <li><strong>Document your scripts:</strong> Add comments explaining what each command does</li>
            <li><strong>Version control:</strong> Store automation scripts in Git for team collaboration</li>
            <li><strong>Error handling:</strong> Add error checking and logging to your scripts</li>
          </ul>
        </Section>

        {/* Troubleshooting */}
        <Section level={3} style={{ marginTop: "2rem", padding: "2rem", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#ff832b" }}>🔧 Common Troubleshooting</h3>
          <div style={{ display: "grid", gap: "1rem" }}>
            <div>
              <strong>Connection timeout:</strong>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
                Check network connectivity and firewall rules. Verify the CPD URL is correct.
              </p>
            </div>
            <div>
              <strong>Authentication failed:</strong>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
                Verify your API key or password is correct. Check if the user has necessary permissions.
              </p>
            </div>
            <div>
              <strong>Command not found:</strong>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
                Ensure cpd-cli is in your PATH. Try running with full path: <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>/usr/local/bin/cpd-cli</code>
              </p>
            </div>
            <div>
              <strong>SSL certificate errors:</strong>
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem" }}>
                For development environments with self-signed certificates, you may need to configure SSL verification settings.
              </p>
            </div>
          </div>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
