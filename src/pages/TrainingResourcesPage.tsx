import React from "react";
import { Grid, Column, Heading, Section, Button, Tile, Tag } from "@carbon/react";
import { Document, Download, PresentationFile, Education, Terminal, Code, Edit, Folder, ArrowRight, Book, Rocket, Launch } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";

export default function TrainingResourcesPage() {
  const navigate = useNavigate();

  const trainingTopics = [
    {
      id: "terminal-apps",
      title: "Terminal Applications",
      description: "Learn about terminal emulators, iTerm2, and getting started with command-line interfaces",
      icon: Terminal,
      color: "#0f62fe",
      status: "Coming Soon",
      route: null
    },
    {
      id: "shells",
      title: "Understanding Shells",
      description: "Explore sh, bash, zsh, and oh-my-zsh. Understand the shell architecture and customization",
      icon: Code,
      color: "#0f62fe",
      status: "Coming Soon",
      route: null
    },
    {
      id: "git-concepts",
      title: "Git & Version Control",
      description: "Master Git mental models: snapshots, three states, branching, merging, and workflows",
      icon: Code,
      color: "#24a148",
      status: "Available",
      route: "/training/git-concepts",
      featured: true
    },
    {
      id: "text-editors",
      title: "Text Editors",
      description: "Master nano and vim for editing files directly in the terminal",
      icon: Edit,
      color: "#0f62fe",
      status: "Coming Soon",
      route: null
    },
    {
      id: "filesystem",
      title: "Filesystem Navigation",
      description: "Navigate directories, manage files, and understand Unix filesystem structure",
      icon: Folder,
      color: "#0f62fe",
      status: "Coming Soon",
      route: null
    },
    {
      id: "redirection",
      title: "Redirection & Pipes",
      description: "Chain commands together with pipes and redirect input/output",
      icon: ArrowRight,
      color: "#0f62fe",
      status: "Coming Soon",
      route: null
    },
    {
      id: "advanced",
      title: "Advanced Topics",
      description: "Environment variables, aliases, permissions, and power user techniques",
      icon: Terminal,
      color: "#24a148",
      status: "Coming Soon",
      route: null
    },
    {
      id: "quick-reference",
      title: "Quick Reference",
      description: "Cheat sheet with essential commands and keyboard shortcuts",
      icon: Book,
      color: "#24a148",
      status: "Coming Soon",
      route: null
    }
  ];

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Education size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Playbooks & Resources</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Comprehensive training materials for mastering terminal skills.
            These resources include detailed guides, presentation materials, and hands-on exercises.
          </p>
        </Section>

        {/* Philosophy Section */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <Tile style={{ padding: "2rem", marginBottom: "2rem" }}>
            <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Training Philosophy
            </h3>
            <p style={{ lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.125rem", fontWeight: 500 }}>
              "Create your own workflow and work environment that works for <strong>you</strong>."
            </p>
            <p style={{ lineHeight: 1.8, margin: 0 }}>
              This training is a <strong>starting point</strong> based on collective experience.
              The end goal is to make you as productive as possible to perform the task at hand.
              There's no "right" way—only what works for you.
            </p>
          </Tile>
        </Section>

        {/* Available Resources */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <h2 style={{ marginBottom: "2rem", fontSize: "1.75rem", fontWeight: 600 }}>
            Available Resources
          </h2>

          <div style={{ display: "grid", gap: "1.5rem" }}>
            {/* Comprehensive Training Plan */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <Document size={32} style={{ color: "#0f62fe", flexShrink: 0, marginTop: "4px" }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>
                    Comprehensive Training Plan
                  </h3>
                  <p style={{ color: "#525252", marginBottom: "1rem", lineHeight: 1.6 }}>
                    A detailed 1,988-line guide covering everything from terminal basics to advanced topics. 
                    Includes hands-on exercises, quick reference cheat sheets, and troubleshooting tips.
                  </p>
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#161616" }}>Topics Covered:</strong>
                    <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem", color: "#525252" }}>
                      <li>Terminal Applications (Mac & PC options)</li>
                      <li>Understanding Shells (sh, bash, zsh, oh-my-zsh)</li>
                      <li>Text Editors (nano, vim)</li>
                      <li>Filesystem Navigation</li>
                      <li>Redirection & Pipes</li>
                      <li>Advanced Topics (environment variables, aliases, permissions, tmux)</li>
                    </ul>
                  </div>
                  <Button
                    kind="primary"
                    renderIcon={Download}
                    onClick={() => window.open('/terminal-basics/terminal-training-plan.html', '_blank')}
                  >
                    View Training Plan (HTML)
                  </Button>
                </div>
              </div>
            </div>

            {/* Presentation Materials */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <PresentationFile size={32} style={{ color: "#0f62fe", flexShrink: 0, marginTop: "4px" }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>
                    Presentation Materials
                  </h3>
                  <p style={{ color: "#525252", marginBottom: "1rem", lineHeight: 1.6 }}>
                    Professional 15-minute presentation with detailed speaker notes. Perfect for team training 
                    sessions or lunch-and-learn events. Includes IBM Design Language styling.
                  </p>
                  <div style={{ marginBottom: "1rem" }}>
                    <strong style={{ color: "#161616" }}>Includes:</strong>
                    <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem", color: "#525252" }}>
                      <li>PowerPoint presentation (PPTX)</li>
                      <li>PDF version for easy sharing</li>
                      <li>Detailed speaker script with timing</li>
                      <li>Delivery notes and audience engagement tips</li>
                    </ul>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <Button
                      kind="primary"
                      renderIcon={Download}
                      onClick={() => window.open('/terminal-basics/terminal-basics-presentation.pdf', '_blank')}
                    >
                      Download PDF
                    </Button>
                    <Button
                      kind="secondary"
                      renderIcon={Download}
                      onClick={() => window.open('/terminal-basics/terminal-basics-presentation.pptx', '_blank')}
                    >
                      Download PPTX
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Speaker Notes */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <Document size={32} style={{ color: "#0f62fe", flexShrink: 0, marginTop: "4px" }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#0f62fe" }}>
                    Presentation Script & Speaker Notes
                  </h3>
                  <p style={{ color: "#525252", marginBottom: "1rem", lineHeight: 1.6 }}>
                    Detailed talking points for each slide with timing, delivery notes, analogies, 
                    and audience engagement strategies. Perfect for presenters who want to deliver 
                    a polished, professional training session.
                  </p>
                  <Button
                    kind="tertiary"
                    renderIcon={Document}
                    onClick={() => window.open('/terminal-basics/presentation-script.md', '_blank')}
                  >
                    View Speaker Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Interactive Training Catalog */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #0f62fe"
          }}>
            <h2 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
              <Education size={24} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
              Interactive Training Catalog
            </h2>
            <p style={{ color: "#161616", lineHeight: 1.8, marginBottom: "1rem" }}>
              Explore comprehensive training topics below. Each topic includes practical examples, 
              visual diagrams, and hands-on exercises. Click any tile to dive deep into that subject.
            </p>
            <div style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#161616", lineHeight: 1.8 }}>
              <div><strong>Learning Path:</strong></div>
              <div>Terminal Apps → Shells → Git Concepts → Text Editors → Navigation → Redirection → Advanced Topics</div>
            </div>
          </div>

          {/* Training Topic Tiles */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", 
            gap: "1.5rem",
            marginBottom: "2rem"
          }}>
            {trainingTopics.map((topic) => {
              const IconComponent = topic.icon;
              const isAvailable = topic.route !== null;
              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    if (isAvailable && topic.route) {
                      navigate(topic.route);
                    }
                  }}
                  style={{
                    backgroundColor: isAvailable ? "#ffffff" : "#f4f4f4",
                    border: topic.featured ? "2px solid #24a148" : "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    position: "relative",
                    opacity: isAvailable ? 1 : 0.7
                  }}
                  onMouseEnter={(e) => {
                    if (isAvailable) {
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isAvailable) {
                      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {topic.featured && (
                    <div style={{
                      position: "absolute",
                      top: "1rem",
                      right: "1rem"
                    }}>
                      <Tag type="green" size="sm">
                        <Rocket size={16} style={{ marginRight: "0.25rem" }} />
                        New
                      </Tag>
                    </div>
                  )}
                  
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                    <div style={{
                      backgroundColor: topic.color,
                      borderRadius: "8px",
                      padding: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <IconComponent size={24} style={{ color: "#ffffff" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        margin: 0, 
                        marginBottom: "0.5rem", 
                        color: "#161616",
                        fontSize: "1.125rem",
                        fontWeight: 600
                      }}>
                        {topic.title}
                      </h3>
                      <Tag type={topic.status === "Available" ? "blue" : "gray"} size="sm">
                        {topic.status}
                      </Tag>
                    </div>
                  </div>
                  
                  <p style={{ 
                    color: "#525252", 
                    lineHeight: 1.6,
                    marginBottom: "1rem",
                    fontSize: "0.9375rem"
                  }}>
                    {topic.description}
                  </p>
                  
                  {isAvailable ? (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#0f62fe",
                      fontWeight: 600,
                      fontSize: "0.9375rem"
                    }}>
                      <span>Explore Topic</span>
                      <Launch size={16} />
                    </div>
                  ) : (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "#8d8d8d",
                      fontWeight: 600,
                      fontSize: "0.9375rem"
                    }}>
                      <span>Coming Soon</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>


      </Column>
    </Grid>
  );
}

// Made with Bob
