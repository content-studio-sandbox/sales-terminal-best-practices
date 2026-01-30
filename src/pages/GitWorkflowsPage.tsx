import React, { useState } from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Branch, Commit, PullRequest, CheckmarkFilled, Enterprise, Laptop, Copy, Checkmark } from "@carbon/icons-react";

export default function GitWorkflowsPage() {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };
  const workflows = [
    {
      title: "Getting Started with Git",
      icon: <Commit size={24} style={{ color: "#0f62fe" }} />,
      steps: [
        { cmd: "git config --global user.name \"Your Name\"", desc: "Set your name" },
        { cmd: "git config --global user.email \"your.email@ibm.com\"", desc: "Set your email" },
        { cmd: "git clone <repository-url>", desc: "Clone a repository" },
        { cmd: "git status", desc: "Check repository status" },
      ]
    },
    {
      title: "Daily Workflow",
      icon: <Branch size={24} style={{ color: "#0f62fe" }} />,
      steps: [
        { cmd: "git pull origin main", desc: "Get latest changes from remote" },
        { cmd: "git checkout -b feature/your-feature", desc: "Create and switch to new branch" },
        { cmd: "git add .", desc: "Stage all changes" },
        { cmd: "git commit -m \"Your message\"", desc: "Commit with descriptive message" },
        { cmd: "git push origin feature/your-feature", desc: "Push branch to remote" },
      ]
    },
    {
      title: "Collaboration",
      icon: <PullRequest size={24} style={{ color: "#0f62fe" }} />,
      steps: [
        { cmd: "git fetch origin", desc: "Fetch all remote branches" },
        { cmd: "git checkout main", desc: "Switch to main branch" },
        { cmd: "git merge feature/branch-name", desc: "Merge feature branch" },
        { cmd: "git branch -d feature/branch-name", desc: "Delete local branch after merge" },
        { cmd: "git push origin --delete feature/branch-name", desc: "Delete remote branch" },
      ]
    },
    {
      title: "Demo Preparation Workflow",
      icon: <Laptop size={24} style={{ color: "#0f62fe" }} />,
      steps: [
        { cmd: "git clone <demo-repo-url>", desc: "Clone the demo repository" },
        { cmd: "git checkout -b demo/client-name", desc: "Create client-specific demo branch" },
        { cmd: "# Customize demo for client", desc: "Update configs, branding, sample data" },
        { cmd: "git add . && git commit -m \"Prepare demo for [Client]\"", desc: "Commit customizations" },
        { cmd: "git tag demo-v1.0-client-name", desc: "Tag the demo version for reference" },
        { cmd: "git push origin demo/client-name --tags", desc: "Push demo branch and tags" },
      ]
    },
    {
      title: "Client Repository Workflow",
      icon: <Enterprise size={24} style={{ color: "#0f62fe" }} />,
      steps: [
        { cmd: "git clone <client-repo-url>", desc: "Clone client's repository" },
        { cmd: "git checkout -b poc/feature-name", desc: "Create POC feature branch" },
        { cmd: "# Implement POC feature", desc: "Add code, configs, or integrations" },
        { cmd: "git add . && git commit -m \"POC: [Feature description]\"", desc: "Commit POC changes" },
        { cmd: "git push origin poc/feature-name", desc: "Push POC branch for client review" },
        { cmd: "# Create pull request in client's repo", desc: "Submit PR for client team review" },
      ]
    }
  ];

  const bestPractices = [
    "Write clear, descriptive commit messages",
    "Commit often with small, logical changes",
    "Always pull before starting new work",
    "Create feature branches for new work",
    "Review changes before committing",
    "Never commit sensitive information (passwords, keys)",
    "Use .gitignore for files that shouldn't be tracked",
    "Keep your branches up to date with main"
  ];

  const commonCommands = [
    { cmd: "git log", desc: "View commit history" },
    { cmd: "git diff", desc: "See changes not yet staged" },
    { cmd: "git stash", desc: "Temporarily save changes" },
    { cmd: "git stash pop", desc: "Restore stashed changes" },
    { cmd: "git reset --hard HEAD", desc: "Discard all local changes (careful!)" },
    { cmd: "git revert <commit>", desc: "Undo a specific commit" },
  ];

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Branch size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Git Workflows for Sales Teams</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px" }}>
            Learn essential Git workflows to collaborate effectively, manage code versions, and contribute to team projects.
          </p>
        </Section>

        {workflows.map((workflow, idx) => (
          <Section key={idx} level={3} style={{ marginBottom: "3rem" }}>
            <div style={{ 
              backgroundColor: "#f4f4f4", 
              padding: "2rem", 
              borderRadius: "8px",
              border: "1px solid #e0e0e0"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                {workflow.icon}
                <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                  {workflow.title}
                </h3>
              </div>
              
              <div style={{ display: "grid", gap: "1rem" }}>
                {workflow.steps.map((step, i) => (
                  <div 
                    key={i}
                    style={{
                      backgroundColor: "#ffffff",
                      padding: "1rem",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem"
                    }}
                  >
                    <div style={{
                      backgroundColor: "#0f62fe",
                      color: "#ffffff",
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      flexShrink: 0,
                      marginTop: "2px"
                    }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <code style={{
                          backgroundColor: "#161616",
                          color: "#f4f4f4",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          fontFamily: "'IBM Plex Mono', monospace",
                          display: "inline-block",
                          maxWidth: "fit-content"
                        }}>
                          {step.cmd}
                        </code>
                        <button
                          onClick={() => copyToClipboard(step.cmd)}
                          style={{
                            backgroundColor: copiedCmd === step.cmd ? "#24a148" : "#0f62fe",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "4px",
                            padding: "0.25rem 0.5rem",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.25rem",
                            fontSize: "0.75rem",
                            transition: "background-color 0.2s"
                          }}
                          title="Copy to clipboard"
                        >
                          {copiedCmd === step.cmd ? (
                            <>
                              <Checkmark size={16} />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                      <p style={{ margin: 0, color: "#525252", fontSize: "0.875rem" }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        ))}

        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Common Git Commands
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {commonCommands.map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem"
                  }}
                >
                  <CheckmarkFilled size={20} style={{ color: "#24a148", marginTop: "2px", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.875rem",
                        fontFamily: "'IBM Plex Mono', monospace",
                        flex: 1
                      }}>
                        {item.cmd}
                      </code>
                      <button
                        onClick={() => copyToClipboard(item.cmd)}
                        style={{
                          backgroundColor: copiedCmd === item.cmd ? "#24a148" : "#0f62fe",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.25rem 0.5rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          fontSize: "0.75rem",
                          transition: "background-color 0.2s"
                        }}
                        title="Copy to clipboard"
                      >
                        {copiedCmd === item.cmd ? (
                          <>
                            <Checkmark size={16} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <p style={{ margin: 0, color: "#525252", fontSize: "0.875rem" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "8px",
            border: "2px solid #0f62fe",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Enterprise size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                GitHub Enterprise vs Regular Git
              </h3>
            </div>
            
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "0.5rem" }}>Git (Core Technology)</h4>
                <p style={{ color: "#525252", lineHeight: 1.6, margin: 0 }}>
                  Git is the distributed version control system that runs locally on your machine. It tracks changes, manages branches, and handles commits. Git works offline and is the foundation for all version control operations.
                </p>
              </div>

              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "0.5rem" }}>GitHub.com (Public Platform)</h4>
                <p style={{ color: "#525252", lineHeight: 1.6, margin: 0 }}>
                  GitHub.com is a cloud-based hosting service for Git repositories. It adds collaboration features like pull requests, issues, and project management. Free for public repositories, with paid plans for private repos and teams.
                </p>
              </div>

              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "0.5rem" }}>GitHub Enterprise (IBM's Solution)</h4>
                <p style={{ color: "#525252", lineHeight: 1.6, marginBottom: "0.75rem" }}>
                  GitHub Enterprise is a self-hosted or cloud version of GitHub designed for organizations. IBM uses GitHub Enterprise for:
                </p>
                <ul style={{ color: "#525252", lineHeight: 1.8, marginLeft: "1.5rem", marginBottom: 0 }}>
                  <li><strong>Security & Compliance:</strong> Enterprise-grade security, audit logs, and compliance certifications</li>
                  <li><strong>Access Control:</strong> Advanced permissions, SAML SSO, and team management</li>
                  <li><strong>Private Hosting:</strong> Keep sensitive code on IBM's infrastructure (github.ibm.com)</li>
                  <li><strong>Integration:</strong> Connect with IBM tools, CI/CD pipelines, and enterprise systems</li>
                  <li><strong>Support:</strong> Dedicated support and SLAs for mission-critical projects</li>
                </ul>
              </div>

              <div style={{
                backgroundColor: "#e8f4ff",
                padding: "1rem",
                borderRadius: "4px",
                border: "1px solid #0f62fe"
              }}>
                <p style={{ margin: 0, color: "#161616", fontSize: "0.875rem" }}>
                  <strong>For Tech Sellers:</strong> When discussing version control with clients, emphasize that GitHub Enterprise provides the collaboration benefits of GitHub.com with the security, compliance, and control that enterprises require. It's the same Git commands, but with enterprise-grade infrastructure.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section level={3} style={{ padding: "2rem", backgroundColor: "#e8f4ff", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#0f62fe" }}>🎯 Git Best Practices</h3>
          <ul style={{ color: "#161616", lineHeight: 1.8, marginBottom: 0 }}>
            {bestPractices.map((practice, i) => (
              <li key={i}>{practice}</li>
            ))}
          </ul>
        </Section>
      </Column>
    </Grid>
  );
}