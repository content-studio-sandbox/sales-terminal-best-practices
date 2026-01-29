import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Branch, Commit, PullRequest, CheckmarkFilled } from "@carbon/icons-react";

export default function GitWorkflowsPage() {
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
                        {step.cmd}
                      </code>
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
                    <p style={{ margin: 0, color: "#525252", fontSize: "0.875rem" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
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