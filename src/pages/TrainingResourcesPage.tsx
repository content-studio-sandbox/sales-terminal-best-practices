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
        {/* Interactive Training Catalog Header */}
        <Section level={2} style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Education size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Interactive Training Catalog</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            Explore comprehensive training topics below. Each topic includes practical examples, visual diagrams, and hands-on exercises. Click any tile to dive deep into that subject.
          </p>
          
          {/* Learning Path */}
          <Tile style={{ padding: "1.5rem", backgroundColor: "#f4f4f4" }}>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#161616", marginBottom: "0.5rem" }}>
              Learning Path:
            </p>
            <p style={{ margin: 0, fontSize: "0.9375rem", color: "#525252", lineHeight: 1.6 }}>
              Terminal Apps → Shells → Git Concepts → Text Editors → Navigation → Redirection → Advanced Topics
            </p>
          </Tile>
        </Section>

        {/* Training Topics Grid */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem"
          }}>
            {trainingTopics.map((topic) => {
              const IconComponent = topic.icon;
              const isAvailable = topic.status === "Available";
              const isNew = topic.featured;
              
              return (
                <Tile
                  key={topic.id}
                  style={{
                    padding: "1.5rem",
                    cursor: isAvailable ? "pointer" : "default",
                    opacity: isAvailable ? 1 : 0.7,
                    transition: "all 0.2s",
                    position: "relative",
                    border: isAvailable ? "2px solid #0f62fe" : "1px solid #e0e0e0"
                  }}
                  onClick={() => {
                    if (isAvailable && topic.route) {
                      navigate(topic.route);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (isAvailable) {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isAvailable) {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {/* Status Badge */}
                  <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
                    <Tag
                      type={isAvailable ? "green" : "cool-gray"}
                      size="sm"
                    >
                      {topic.status}
                    </Tag>
                  </div>
                  
                  {/* New Badge */}
                  {isNew && (
                    <div style={{ position: "absolute", top: "3rem", right: "1rem" }}>
                      <Tag type="purple" size="sm">New</Tag>
                    </div>
                  )}
                  
                  {/* Icon */}
                  <div style={{ marginBottom: "1rem" }}>
                    <IconComponent size={32} style={{ color: topic.color }} />
                  </div>
                  
                  {/* Title */}
                  <h3 style={{
                    marginTop: 0,
                    marginBottom: "0.75rem",
                    fontSize: "1.25rem",
                    fontWeight: 600
                  }}>
                    {topic.title}
                  </h3>
                  
                  {/* Description */}
                  <p style={{
                    margin: 0,
                    fontSize: "0.875rem",
                    color: "#525252",
                    lineHeight: 1.6,
                    marginBottom: "1rem"
                  }}>
                    {topic.description}
                  </p>
                  
                  {/* Action Button */}
                  {isAvailable ? (
                    <Button
                      kind="tertiary"
                      size="sm"
                      renderIcon={Launch}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (topic.route) navigate(topic.route);
                      }}
                    >
                      Explore Topic
                    </Button>
                  ) : (
                    <Button
                      kind="ghost"
                      size="sm"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  )}
                </Tile>
              );
            })}
          </div>
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


      </Column>
    </Grid>
  );
}

// Made with Bob
