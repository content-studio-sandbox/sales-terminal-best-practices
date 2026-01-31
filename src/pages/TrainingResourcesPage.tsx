import React from "react";
import { Grid, Column, Heading, Section, Button } from "@carbon/react";
import { Document, Download, PresentationFile, Education } from "@carbon/icons-react";

export default function TrainingResourcesPage() {
  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Education size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Terminal Training Resources</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Comprehensive training materials created by Michael for mastering terminal skills. 
            These resources include detailed guides, presentation materials, and hands-on exercises.
          </p>
        </Section>

        {/* Philosophy Section */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
              Training Philosophy
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.125rem", fontWeight: 500 }}>
              "Create your own workflow and work environment that works for <strong>you</strong>."
            </p>
            <p style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
              This training is a <strong>starting point</strong> based on collective experience. 
              The end goal is to make you as productive as possible to perform the task at hand. 
              There's no "right" way—only what works for you.
            </p>
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

        {/* Learning Path */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Recommended Learning Path</h3>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                { week: "Week 1", task: "Pick a terminal app and get comfortable opening it" },
                { week: "Week 2", task: "Learn basic navigation (pwd, ls, cd, mkdir, rm)" },
                { week: "Week 3", task: "Master your editor (start with nano)" },
                { week: "Week 4", task: "Explore pipes and redirection" },
                { week: "Month 2", task: "Start customizing with aliases and oh-my-zsh" },
                { week: "Month 3", task: "You're dangerous now (in a good way)!" }
              ].map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}
                >
                  <div style={{
                    backgroundColor: "#0f62fe",
                    color: "#ffffff",
                    width: "80px",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textAlign: "center",
                    flexShrink: 0
                  }}>
                    {item.week}
                  </div>
                  <p style={{ margin: 0, color: "#161616", fontSize: "0.9375rem" }}>
                    {item.task}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Key Principles */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#ffffff", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Key Principles to Remember</h3>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                { icon: "✅", text: "There's no \"right\" way - only what works for you" },
                { icon: "✅", text: "Start simple - complexity comes with time" },
                { icon: "✅", text: "Practice daily - even 5 minutes counts" },
                { icon: "✅", text: "Customize everything - make it yours" },
                { icon: "✅", text: "Share knowledge - we all learn together" }
              ].map((item, i) => (
                <div 
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.75rem",
                    backgroundColor: "#f4f4f4",
                    borderRadius: "4px"
                  }}
                >
                  <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{item.icon}</span>
                  <p style={{ margin: 0, color: "#161616", fontSize: "0.9375rem" }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Credits */}
        <Section level={3} style={{ marginBottom: "2rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "1.5rem", 
            borderRadius: "8px",
            border: "1px solid #0f62fe",
            textAlign: "center"
          }}>
            <p style={{ margin: 0, color: "#161616", fontSize: "0.9375rem" }}>
              <strong>Training Materials Created By:</strong> Michael
            </p>
            <p style={{ margin: "0.5rem 0 0 0", color: "#525252", fontSize: "0.875rem" }}>
              Comprehensive terminal training for FSM Technical Sales teams
            </p>
          </div>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
