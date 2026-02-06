import React from "react";
import { Grid, Column, Heading, Section, CodeSnippet, Tile, Breadcrumb, BreadcrumbItem } from "@carbon/react";
import { Code, ArrowLeft, CheckmarkFilled } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";

export default function GitConceptsPage() {
  const navigate = useNavigate();

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        {/* Breadcrumb Navigation */}
        <Breadcrumb noTrailingSlash style={{ marginBottom: "2rem" }}>
          <BreadcrumbItem onClick={() => navigate("/training-resources")} style={{ cursor: "pointer" }}>
            Training Resources
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Git & Version Control</BreadcrumbItem>
        </Breadcrumb>

        {/* Header */}
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Code size={32} style={{ color: "#24a148" }} />
            <Heading style={{ margin: 0 }}>Git & Version Control - Mental Models</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Understanding the fundamental concepts of Git before diving into commands. Learn what Git is doing 
            and why, so commands make intuitive sense.
          </p>
        </Section>

        {/* Why This Matters */}
        <div style={{ backgroundColor: "#e8f4ff", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem", border: "1px solid #0f62fe" }}>
          <h4 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
            Why Conceptual Understanding Comes First
          </h4>
          <p style={{ lineHeight: 1.8, margin: 0 }}>
            Before jumping into Git commands, it's crucial to understand <strong>what Git is doing</strong> and 
            <strong>why</strong>. Think of this as learning the rules of chess before memorizing opening moves. 
            Once you understand the mental model, the commands will make sense.
          </p>
        </div>

        {/* What is Version Control */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            What is Version Control?
          </h2>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
            Imagine you're writing a novel. You might save versions like:
          </p>
          <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8, marginBottom: "1.5rem" }}>
            <li><code>novel_draft1.docx</code></li>
            <li><code>novel_draft2_edited.docx</code></li>
            <li><code>novel_draft3_final.docx</code></li>
            <li><code>novel_draft3_final_REALLY_FINAL.docx</code></li>
          </ul>
          <p style={{ lineHeight: 1.8, marginBottom: "1.5rem" }}>
            This gets messy fast. <strong>Version control systems</strong> like Git solve this by:
          </p>
          <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8, marginBottom: "2rem" }}>
            <li>Tracking every change you make</li>
            <li>Letting you go back to any previous version</li>
            <li>Allowing multiple people to work on the same files simultaneously</li>
            <li>Keeping a complete history of who changed what and when</li>
          </ul>
        </Section>

        {/* Git Mental Model */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            The Git Mental Model: Snapshots, Not Differences
          </h2>
          <Tile style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ marginBottom: "1rem", fontWeight: 600 }}>Key Concept: Git takes snapshots of your entire project</p>
            <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
              Unlike some version control systems that track file differences, Git takes a complete snapshot 
              of your project at each commit. Think of it like taking photos of your desk at different times:
            </p>
            <pre style={{ fontFamily: "monospace", fontSize: "0.875rem", backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
{`Commit 1 (Photo 1):     Commit 2 (Photo 2):     Commit 3 (Photo 3):
📄 file1.txt v1         📄 file1.txt v2         📄 file1.txt v2
📄 file2.txt v1         📄 file2.txt v1         📄 file2.txt v2
                        📄 file3.txt v1         📄 file3.txt v1`}
            </pre>
            <p style={{ lineHeight: 1.8, margin: 0 }}>
              Each commit is a complete snapshot. If a file didn't change, Git just links to the previous version 
              (efficient!). This makes branching and merging incredibly fast.
            </p>
          </Tile>
        </Section>

        {/* Three States */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            The Three States of Git
          </h2>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
            This is the most important concept to understand. Your files can be in three states:
          </p>
          
          <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
            <Tile style={{ padding: "1.5rem", borderLeft: "4px solid #da1e28" }}>
              <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#da1e28" }}>
                1. Working Directory (Modified)
              </h5>
              <p style={{ marginBottom: "0.5rem" }}><strong>What it is:</strong> Your actual files on disk that you're editing</p>
              <p style={{ marginBottom: "0.5rem" }}><strong>Analogy:</strong> Your messy desk while you're working</p>
              <p style={{ marginBottom: 0 }}><strong>Status:</strong> Files you've changed but haven't told Git about yet</p>
            </Tile>

            <Tile style={{ padding: "1.5rem", borderLeft: "4px solid #ff832b" }}>
              <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#ff832b" }}>
                2. Staging Area (Staged)
              </h5>
              <p style={{ marginBottom: "0.5rem" }}><strong>What it is:</strong> A holding area for changes you want to commit</p>
              <p style={{ marginBottom: "0.5rem" }}><strong>Analogy:</strong> A box where you put items you want to ship</p>
              <p style={{ marginBottom: 0 }}><strong>Status:</strong> Files you've marked to be included in the next commit</p>
            </Tile>

            <Tile style={{ padding: "1.5rem", borderLeft: "4px solid #24a148" }}>
              <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#24a148" }}>
                3. Repository (Committed)
              </h5>
              <p style={{ marginBottom: "0.5rem" }}><strong>What it is:</strong> Permanent snapshots stored in Git's database</p>
              <p style={{ marginBottom: "0.5rem" }}><strong>Analogy:</strong> Photos in your photo album - permanent and safe</p>
              <p style={{ marginBottom: 0 }}><strong>Status:</strong> Changes that are permanently saved in Git history</p>
            </Tile>
          </div>

          <Tile style={{ padding: "1.5rem", marginBottom: "2rem", backgroundColor: "#f4f4f4" }}>
            <h5 style={{ marginTop: 0, marginBottom: "1rem" }}>The Git Workflow Visualized</h5>
            <pre style={{ fontFamily: "monospace", fontSize: "0.875rem", margin: 0, lineHeight: 1.6 }}>
{`Working Directory          Staging Area           Repository
(Your files)              (git add)              (git commit)
─────────────────         ──────────────         ────────────
                                                              
📝 Edit files      ──────>  📦 Stage changes  ──────>  📸 Commit snapshot
                  git add                    git commit
                                                              
Example:
1. Edit file.txt           2. git add file.txt    3. git commit -m "message"
   (modified)                 (staged)               (committed)
                                                              
You can always check status with: git status`}
            </pre>
          </Tile>
        </Section>

        {/* Branches */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            Branches: Parallel Universes for Your Code
          </h2>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
            Branches are one of Git's superpowers. Think of them as parallel timelines:
          </p>
          
          <Tile style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h5 style={{ marginTop: 0, marginBottom: "1rem" }}>The Branch Concept</h5>
            <pre style={{ fontFamily: "monospace", fontSize: "0.875rem", backgroundColor: "#ffffff", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
{`main branch:     A ─── B ─── C ─── D ─── E
                              │
                              └─── F ─── G    (feature branch)
                                    │
                                    └─── H    (bugfix branch)

• Each letter is a commit (snapshot)
• Branches let you work on features without affecting main
• You can switch between branches instantly
• Merging brings changes back together`}
            </pre>
            <p style={{ lineHeight: 1.8, marginTop: "1rem", marginBottom: 0 }}>
              <strong>Why this matters:</strong> You can work on a new feature while someone else fixes a bug, 
              and neither of you interferes with the other's work. When ready, you merge your changes back.
            </p>
          </Tile>
        </Section>

        {/* Merging */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            Merging: Bringing Changes Together
          </h2>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
            Merging combines changes from different branches. Git is smart about this:
          </p>
          
          <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
            <Tile style={{ padding: "1rem" }}>
              <h5 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#24a148" }}>✅ Fast-Forward Merge</h5>
              <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                When no changes happened on main, Git just moves the pointer forward
              </p>
              <pre style={{ fontFamily: "monospace", fontSize: "0.75rem", margin: 0 }}>
{`Before:  main: A ─── B
         feature:    └─── C ─── D

After:   main: A ─── B ─── C ─── D`}
              </pre>
            </Tile>

            <Tile style={{ padding: "1rem" }}>
              <h5 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#0f62fe" }}>🔀 Three-Way Merge</h5>
              <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                When both branches have changes, Git creates a merge commit
              </p>
              <pre style={{ fontFamily: "monospace", fontSize: "0.75rem", margin: 0 }}>
{`Before:  main: A ─── B ─── C
         feature:    └─── D ─── E

After:   main: A ─── B ─── C ─── F (merge commit)
                      └─── D ─── E ─┘`}
              </pre>
            </Tile>

            <Tile style={{ padding: "1rem", borderLeft: "4px solid #da1e28" }}>
              <h5 style={{ marginTop: 0, marginBottom: "0.5rem", color: "#da1e28" }}>⚠️ Merge Conflicts</h5>
              <p style={{ fontSize: "0.875rem", margin: 0 }}>
                When the same lines were changed in both branches, Git asks you to decide which to keep. 
                This is normal and not scary - Git marks the conflicts and you choose what to keep.
              </p>
            </Tile>
          </div>
        </Section>

        {/* Remote Repositories */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            Remote Repositories: Collaboration Hub
          </h2>
          <Tile style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
            <p style={{ marginBottom: "1rem", fontWeight: 600 }}>
              Your local Git repository can sync with remote repositories (like GitHub)
            </p>
            <pre style={{ fontFamily: "monospace", fontSize: "0.875rem", backgroundColor: "#f4f4f4", padding: "1rem", borderRadius: "4px", overflow: "auto" }}>
{`Your Computer                    GitHub (Remote)
─────────────                    ───────────────

Local Repository  ─── push ──>   Remote Repository
                                 (origin/main)
                  <── pull ───
                  <── fetch ──

• push: Send your commits to remote
• pull: Get commits from remote (fetch + merge)
• fetch: Download commits but don't merge yet
• clone: Copy entire repository to your computer`}
            </pre>
          </Tile>
        </Section>

        {/* Common Workflows */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            Common Git Workflows
          </h2>
          <Tile style={{ padding: "1.5rem", marginBottom: "1.5rem", borderLeft: "4px solid #0f62fe" }}>
            <h5 style={{ marginTop: 0, marginBottom: "1rem" }}>Feature Branch Workflow (Most Common)</h5>
            <ol style={{ marginLeft: "1.5rem", lineHeight: 1.8 }}>
              <li><strong>Create branch:</strong> Start from main, create feature branch</li>
              <li><strong>Make changes:</strong> Edit files, commit regularly</li>
              <li><strong>Push branch:</strong> Share your work on remote</li>
              <li><strong>Create Pull Request:</strong> Ask team to review</li>
              <li><strong>Review & Merge:</strong> Team reviews, then merge to main</li>
              <li><strong>Delete branch:</strong> Clean up after merge</li>
            </ol>
            <div style={{ marginTop: "1rem" }}>
              <CodeSnippet type="multi">
{`# 1. Create and switch to feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push to remote
git push origin feature/new-feature

# 4. Create PR on GitHub (via web interface)

# 5. After merge, update local main
git checkout main
git pull origin main

# 6. Delete local branch
git branch -d feature/new-feature`}
              </CodeSnippet>
            </div>
          </Tile>
        </Section>

        {/* Key Principles */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            Key Principles to Remember
          </h2>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {[
              { icon: "💡", text: "Commit often - small, focused commits are better than large ones" },
              { icon: "💡", text: "Write clear commit messages - your future self will thank you" },
              { icon: "💡", text: "Pull before you push - stay in sync with your team" },
              { icon: "💡", text: "Branch for every feature - keep main stable" },
              { icon: "💡", text: "Don't fear mistakes - Git can undo almost anything" }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "4px"
                }}
              >
                <span style={{ fontSize: "1.25rem", flexShrink: 0 }}>{item.icon}</span>
                <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Call to Action */}
        <div style={{ backgroundColor: "#e8f4ff", padding: "1.5rem", borderRadius: "8px", marginBottom: "2rem", border: "1px solid #0f62fe" }}>
          <h5 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
            Now You're Ready for Commands!
          </h5>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
            With these mental models in place, Git commands will make sense. You're not just memorizing 
            syntax - you understand <strong>what's happening</strong> and <strong>why</strong>.
          </p>
          <button
            onClick={() => navigate("/interactive-terminal")}
            style={{
              backgroundColor: "#0f62fe",
              color: "white",
              border: "none",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 600
            }}
          >
            Practice in Interactive Terminal →
          </button>
        </div>

        {/* Back Button */}
        <div style={{ marginTop: "3rem", marginBottom: "2rem" }}>
          <button
            onClick={() => navigate("/training-resources")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "transparent",
              border: "1px solid #0f62fe",
              color: "#0f62fe",
              padding: "0.75rem 1.5rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            <ArrowLeft size={20} />
            Back to Training Resources
          </button>
        </div>
      </Column>
    </Grid>
  );
}

// Made with Bob