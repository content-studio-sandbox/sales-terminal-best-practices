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

        {/* The Big Picture */}
        <div style={{ backgroundColor: "#e8f4ff", padding: "2rem", borderRadius: "8px", marginBottom: "3rem", border: "1px solid #0f62fe" }}>
          <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
            🎯 The Big Picture: Why Mental Models Matter
          </h3>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.125rem" }}>
            Imagine trying to drive a car by just memorizing: "Turn the wheel left, press the pedal, turn the wheel right..."
            You'd crash immediately! You need to understand <strong>what the car does</strong> and <strong>why</strong>.
          </p>
          <p style={{ lineHeight: 1.8, margin: 0, fontSize: "1.125rem" }}>
            Git is the same way. Before learning commands like <code>git add</code> and <code>git commit</code>,
            you need to understand the mental model. Once you "get it," the commands become obvious.
          </p>
        </div>

        {/* The Story Analogy */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <Tile style={{ padding: "2rem", backgroundColor: "#fff3e0", border: "2px solid #ff832b" }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#ff832b" }}>
              📖 Think of Git Like Writing a Book with Your Team
            </h3>
            <div style={{ lineHeight: 1.8, fontSize: "1.0625rem" }}>
              <p style={{ marginBottom: "1rem" }}>
                <strong>The Problem:</strong> You and 5 friends are writing a book together. How do you:
              </p>
              <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem" }}>
                <li>Keep track of who wrote what?</li>
                <li>Go back to yesterday's version if today's changes are terrible?</li>
                <li>Work on different chapters without interfering with each other?</li>
                <li>Combine everyone's work at the end?</li>
              </ul>
              <p style={{ marginBottom: "1rem" }}>
                <strong>The Old Way:</strong> Email files back and forth with names like:
              </p>
              <ul style={{ marginLeft: "1.5rem", marginBottom: "1.5rem", fontFamily: "monospace", fontSize: "0.9375rem" }}>
                <li>book_draft_v1.docx</li>
                <li>book_draft_v2_johns_edits.docx</li>
                <li>book_draft_v3_FINAL.docx</li>
                <li>book_draft_v3_FINAL_REALLY_FINAL.docx</li>
                <li>book_draft_v3_FINAL_USE_THIS_ONE.docx</li>
              </ul>
              <p style={{ marginBottom: 0, fontWeight: 600, color: "#24a148", fontSize: "1.125rem" }}>
                <strong>Git's Way:</strong> One book, complete history, everyone works in parallel, no confusion.
                That's the magic! ✨
              </p>
            </div>
          </Tile>
        </Section>

        {/* What is Version Control - Enhanced */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            🕰️ Git is a Time Machine for Your Code
          </h2>
          
          <Tile style={{ padding: "2rem", marginBottom: "2rem", backgroundColor: "#f4f4f4" }}>
            <h4 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>
              The Time Machine Analogy
            </h4>
            <p style={{ lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.0625rem" }}>
              Imagine you have a time machine for your project:
            </p>
            <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8, fontSize: "1.0625rem" }}>
              <li><strong>Take snapshots</strong> - Like taking photos at different moments in time</li>
              <li><strong>Travel back</strong> - Go back to any snapshot if something breaks</li>
              <li><strong>Parallel universes</strong> - Try different ideas without affecting the main timeline</li>
              <li><strong>Merge timelines</strong> - Bring the best ideas from different universes together</li>
              <li><strong>See the history</strong> - Know exactly what changed, when, and why</li>
            </ul>
            <p style={{ lineHeight: 1.8, marginTop: "1.5rem", marginBottom: 0, fontSize: "1.0625rem", fontWeight: 600, color: "#24a148" }}>
              That's Git! It's not just "saving files" - it's managing the entire history of your project.
            </p>
          </Tile>

          <Tile style={{ padding: "2rem", marginBottom: "2rem" }}>
            <h4 style={{ marginTop: 0, marginBottom: "1rem", color: "#0f62fe" }}>
              Why This Matters for Teams
            </h4>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "#e8f4ff", borderRadius: "4px", borderLeft: "4px solid #0f62fe" }}>
                <strong>Without Git:</strong> "Hey, did you get my email with the updated file? Wait, which version are you working on?
                Oh no, I just overwrote your changes!"
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#defbe6", borderRadius: "4px", borderLeft: "4px solid #24a148" }}>
                <strong>With Git:</strong> Everyone works independently, Git tracks everything, and merging happens automatically.
                No lost work, no confusion, no stress.
              </div>
            </div>
          </Tile>
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

        {/* Three States - Enhanced */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            📦 The Three States: Your Work's Journey
          </h2>
          
          <Tile style={{ padding: "2rem", marginBottom: "2rem", backgroundColor: "#fff3e0", border: "2px solid #ff832b" }}>
            <h4 style={{ marginTop: 0, marginBottom: "1rem", color: "#ff832b" }}>
              🎨 Think of It Like Creating Art for a Museum
            </h4>
            <p style={{ lineHeight: 1.8, fontSize: "1.0625rem", marginBottom: "1.5rem" }}>
              Imagine you're an artist preparing work for a museum exhibition:
            </p>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#ffffff", borderRadius: "8px", borderLeft: "6px solid #da1e28" }}>
                <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#da1e28", fontSize: "1.125rem" }}>
                  🎨 1. Your Studio (Working Directory)
                </h5>
                <p style={{ marginBottom: "0.75rem", fontSize: "1.0625rem" }}>
                  <strong>What it is:</strong> Your messy studio where you're actively painting
                </p>
                <p style={{ marginBottom: "0.75rem", fontSize: "1.0625rem" }}>
                  <strong>Real example:</strong> You're editing <code>HomePage.tsx</code> in VS Code
                </p>
                <p style={{ marginBottom: 0, fontSize: "1.0625rem", fontStyle: "italic", color: "#525252" }}>
                  "I'm working on this, but it's not ready to show anyone yet"
                </p>
              </div>

              <div style={{ padding: "1.5rem", backgroundColor: "#ffffff", borderRadius: "8px", borderLeft: "6px solid #ff832b" }}>
                <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#ff832b", fontSize: "1.125rem" }}>
                  📦 2. The Shipping Box (Staging Area)
                </h5>
                <p style={{ marginBottom: "0.75rem", fontSize: "1.0625rem" }}>
                  <strong>What it is:</strong> You've selected which paintings to send to the museum
                </p>
                <p style={{ marginBottom: "0.75rem", fontSize: "1.0625rem" }}>
                  <strong>Real example:</strong> You run <code>git add HomePage.tsx</code>
                </p>
                <p style={{ marginBottom: 0, fontSize: "1.0625rem", fontStyle: "italic", color: "#525252" }}>
                  "These changes are ready. I want to save them together as one snapshot"
                </p>
              </div>

              <div style={{ padding: "1.5rem", backgroundColor: "#ffffff", borderRadius: "8px", borderLeft: "6px solid #24a148" }}>
                <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#24a148", fontSize: "1.125rem" }}>
                  🏛️ 3. The Museum (Repository)
                </h5>
                <p style={{ marginBottom: "0.75rem", fontSize: "1.0625rem" }}>
                  <strong>What it is:</strong> Your work is now permanently displayed in the museum
                </p>
                <p style={{ marginBottom: "0.75rem", fontSize: "1.0625rem" }}>
                  <strong>Real example:</strong> You run <code>git commit -m "Add new homepage"</code>
                </p>
                <p style={{ marginBottom: 0, fontSize: "1.0625rem", fontStyle: "italic", color: "#525252" }}>
                  "This snapshot is permanent. I can always come back to this exact moment"
                </p>
              </div>
            </div>
          </Tile>

          <Tile style={{ padding: "2rem", marginBottom: "2rem", backgroundColor: "#e8f4ff", border: "2px solid #0f62fe" }}>
            <h4 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#0f62fe" }}>
              🎬 The Complete Workflow (Like Making a Movie)
            </h4>
            <pre style={{ fontFamily: "monospace", fontSize: "0.9375rem", margin: 0, lineHeight: 1.8, backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "8px" }}>
{`🎨 STUDIO              📦 EDITING ROOM         🏛️ CINEMA
(Working Directory)    (Staging Area)          (Repository)
─────────────────      ─────────────────       ─────────────

You're filming...      Select best takes       Premiere night!
Changes not saved      Ready to publish        Permanent record

📝 Edit code      ──────>  📦 git add      ──────>  📸 git commit
   (modified)              (staged)                (saved forever)

REAL EXAMPLE:
─────────────────────────────────────────────────────────────
1. You edit HomePage.tsx in VS Code
   Status: Modified (red in git status)
   
2. You run: git add HomePage.tsx
   Status: Staged (green in git status)
   
3. You run: git commit -m "Add hero section"
   Status: Committed (saved in history)

💡 Pro Tip: Run 'git status' anytime to see where your files are!`}
            </pre>
          </Tile>
        </Section>

        {/* Branches - Enhanced */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "1.5rem", fontSize: "1.75rem", fontWeight: 600 }}>
            🌳 Branches: Parallel Universes for Your Code
          </h2>
          
          <Tile style={{ padding: "2rem", marginBottom: "2rem", backgroundColor: "#defbe6", border: "2px solid #24a148" }}>
            <h4 style={{ marginTop: 0, marginBottom: "1rem", color: "#24a148" }}>
              🎮 Think of It Like a Video Game with Save Points
            </h4>
            <p style={{ lineHeight: 1.8, fontSize: "1.0625rem", marginBottom: "1.5rem" }}>
              Imagine you're playing a video game and you reach a fork in the road:
            </p>
            <ul style={{ marginLeft: "1.5rem", lineHeight: 1.8, fontSize: "1.0625rem", marginBottom: "1.5rem" }}>
              <li><strong>Main path (main branch):</strong> Your main game progress - always stable and working</li>
              <li><strong>Side quest (feature branch):</strong> Try a risky new strategy without messing up your main save</li>
              <li><strong>If it works:</strong> Merge it back into your main game</li>
              <li><strong>If it fails:</strong> Just delete that save and go back to main - no harm done!</li>
            </ul>
            <p style={{ lineHeight: 1.8, fontSize: "1.0625rem", marginBottom: 0, fontWeight: 600, color: "#24a148" }}>
              This is exactly how professional developers work! They never risk breaking the main code.
            </p>
          </Tile>

          <Tile style={{ padding: "2rem", marginBottom: "1.5rem", backgroundColor: "#f4f4f4" }}>
            <h5 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#0f62fe" }}>Visual: How Branches Work</h5>
            <pre style={{ fontFamily: "monospace", fontSize: "0.9375rem", backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "8px", overflow: "auto", lineHeight: 1.8 }}>
{`🌳 THE MAIN TREE (main branch - always stable)
═══════════════════════════════════════════════════════

main:  A ─── B ─── C ─── D ─── E ─── F ─── G
                    │           │
                    │           └─── Merge feature back!
                    │
                    └─── H ─── I    (feature/new-homepage)
                          │
                          └─── J    (bugfix/typo)

REAL WORLD EXAMPLE:
───────────────────────────────────────────────────────
Monday:    You're on 'main' - everything works ✅
           Create branch: git checkout -b feature/dark-mode
           
Tue-Thu:   Work on dark mode feature on your branch
           Main branch is untouched - still works! ✅
           
Friday:    Dark mode is done and tested
           Merge back: git checkout main
                      git merge feature/dark-mode
           
Result:    Main now has dark mode! 🎉

💡 The Magic: While you worked on dark mode, your teammate
   fixed bugs on a different branch. No conflicts!`}
            </pre>
          </Tile>

          <Tile style={{ padding: "1.5rem", backgroundColor: "#fff3e0", border: "1px solid #ff832b" }}>
            <h5 style={{ marginTop: 0, marginBottom: "1rem", color: "#ff832b" }}>
              🎯 Why Branches Are a Superpower
            </h5>
            <div style={{ display: "grid", gap: "1rem" }}>
              <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "4px" }}>
                <strong>✅ Experiment Safely:</strong> Try crazy ideas without breaking anything
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "4px" }}>
                <strong>✅ Work in Parallel:</strong> 5 people, 5 features, zero conflicts
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "4px" }}>
                <strong>✅ Easy Rollback:</strong> Feature didn't work? Delete the branch, done!
              </div>
              <div style={{ padding: "1rem", backgroundColor: "#ffffff", borderRadius: "4px" }}>
                <strong>✅ Code Review:</strong> Team reviews your branch before merging to main
              </div>
            </div>
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