import { Grid, Column, Button } from "@carbon/react";
import { ArrowRight, Terminal, Code, Security, Keyboard } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import { trackUserAction } from "../hooks/useInstana";
import "./LandingPage.scss";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleNavigate = (path: string, buttonName: string) => {
    trackUserAction('button_click', {
      button: buttonName,
      destination: path,
      page: 'landing'
    });
    navigate(path);
  };

  const features = [
    {
      icon: <Terminal size={32} />,
      title: "Command Line Basics",
      description: "Master command-line navigation, file operations, and essential system commands for efficient terminal usage.",
      path: "/terminal-basics"
    },
    {
      icon: <Code size={32} />,
      title: "Git & PR Workflow",
      description: "Learn version control fundamentals, branching strategies, and collaboration workflows for team development.",
      path: "/git-workflows"
    },
    {
      icon: <Security size={32} />,
      title: "Secure Access (SSH)",
      description: "Understand secure remote connections, key management, and best practices for server access.",
      path: "/ssh-best-practices"
    },
    {
      icon: <Keyboard size={32} />,
      title: "Terminal Simulator",
      description: "Practice commands in a safe, simulated environment with real-time feedback and guided exercises.",
      path: "/interactive-terminal"
    }
  ];

  return (
    <div>
      {/* Hero Section - Full Width */}
      <div style={{
        padding: "4rem 2rem",
        textAlign: "center",
        background: "linear-gradient(135deg, #0f62fe 0%, #0043ce 50%, #002d9c 100%)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        margin: 0
      }}>
            {/* Geometric Pattern Overlay */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px),
                repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)
              `,
              pointerEvents: "none"
            }} />
            <div style={{ position: "relative", zIndex: 1 }}>
            <Terminal size={64} style={{ color: "#ffffff", marginBottom: "1.5rem" }} />
            <h1 style={{
              fontSize: "2.5rem",
              fontWeight: 600,
              color: "#ffffff",
              marginBottom: "1rem",
              lineHeight: 1.2
            }}>
              FSM Technical Best Practices
            </h1>
            <p style={{
              fontSize: "1.25rem",
              color: "#ffffff",
              maxWidth: "700px",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
              opacity: 0.95
            }}>
              Practical skills for CSEs and tech sellers: run, ship, and support assets with confidence.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                kind="primary"
                size="lg"
                renderIcon={ArrowRight}
                onClick={() => handleNavigate("/terminal-basics", "Start Here")}
              >
                Start Here
              </Button>
              <Button
                kind="secondary"
                size="lg"
                onClick={() => handleNavigate("/interactive-terminal", "Practice Lab")}
              >
                Practice Lab
              </Button>
            </div>
            </div>
      </div>

      {/* Features Grid */}
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <div style={{ padding: "4rem 2rem" }}>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: 600,
              color: "#161616",
              marginBottom: "3rem",
              textAlign: "center"
            }}>
              Learning Modules
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
              maxWidth: "1200px",
              margin: "0 auto"
            }}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    padding: "2rem",
                    transition: "all 0.2s",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(feature.path)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#0f62fe";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div style={{ color: "#0f62fe", marginBottom: "1rem" }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#161616",
                    marginBottom: "0.75rem"
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: "0.875rem",
                    color: "#525252",
                    lineHeight: 1.6,
                    marginBottom: "1.5rem"
                  }}>
                    {feature.description}
                  </p>
                  <Button
                    kind="ghost"
                    size="sm"
                    renderIcon={ArrowRight}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(feature.path);
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div style={{
            padding: "4rem 2rem",
            backgroundColor: "#f4f4f4",
            borderTop: "1px solid #e0e0e0"
          }}>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: 600,
              color: "#161616",
              marginBottom: "3rem",
              textAlign: "center"
            }}>
              How It Works
            </h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "3rem",
              maxWidth: "1000px",
              margin: "0 auto"
            }}>
              {[
                {
                  number: "1",
                  title: "Learn Fundamentals",
                  description: "Start with Command Line Basics to understand core commands and navigation patterns."
                },
                {
                  number: "2",
                  title: "Master Tools",
                  description: "Progress through Git and SSH modules to learn industry-standard development tools."
                },
                {
                  number: "3",
                  title: "Practice Safely",
                  description: "Use the Terminal Simulator to practice commands in a risk-free environment."
                }
              ].map((step, index) => (
                <div key={index} style={{ textAlign: "center" }}>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "#0f62fe",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    margin: "0 auto 1.5rem"
                  }}>
                    {step.number}
                  </div>
                  <h3 style={{
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    color: "#161616",
                    marginBottom: "0.75rem"
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: "0.875rem",
                    color: "#525252",
                    lineHeight: 1.6
                  }}>
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div style={{
            padding: "4rem 2rem",
            textAlign: "center"
          }}>
            <h2 style={{
              fontSize: "2rem",
              fontWeight: 600,
              color: "#161616",
              marginBottom: "1rem"
            }}>
              Ready to Get Started?
            </h2>
            <p style={{
              fontSize: "1.125rem",
              color: "#525252",
              maxWidth: "600px",
              margin: "0 auto 2rem",
              lineHeight: 1.6
            }}>
              Begin your journey to mastering terminal, Git, and SSH. All materials are designed for IBM FSM teams.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                kind="primary"
                size="lg"
                renderIcon={ArrowRight}
                onClick={() => navigate("/terminal-basics")}
              >
                Begin Learning
              </Button>
              <Button
                kind="tertiary"
                size="lg"
                onClick={() => navigate("/interactive-terminal")}
              >
                Practice Lab
              </Button>
            </div>
          </div>
        </Column>
      </Grid>
    </div>
  );
}
