import React from "react";
import { Grid, Column, Heading, Section, Button } from "@carbon/react";
import { ArrowRight, Rocket } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";

export default function TBDPage() {
  const navigate = useNavigate();

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem", textAlign: "center", paddingTop: "4rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: "600px", margin: "0 auto" }}>
            <Rocket size={64} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Coming Soon</Heading>
            <p style={{ fontSize: "1.125rem", color: "#525252", lineHeight: 1.6 }}>
              This section is planned for a future training session. In the meantime, check out our available 
              resources and practice labs to build your skills.
            </p>
          </div>
        </Section>

        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "4px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            <h3 style={{ marginTop: 0, color: "#161616", marginBottom: "1rem", fontWeight: 600 }}>
              What's Available Now
            </h3>
            <ul style={{ marginLeft: "1.5rem", color: "#525252", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              <li><strong>Command Line:</strong> Master terminal basics for running demos</li>
              <li><strong>Git & PRs:</strong> Learn version control and collaboration workflows</li>
              <li><strong>Local Setup:</strong> Set up Node and Python runtimes</li>
              <li><strong>Practice Lab:</strong> Interactive terminal simulator</li>
              <li><strong>Playbooks:</strong> Comprehensive training materials and guides</li>
            </ul>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
              <Button
                kind="primary"
                renderIcon={ArrowRight}
                onClick={() => navigate("/training-resources")}
              >
                View Playbooks
              </Button>
              <Button
                kind="secondary"
                renderIcon={ArrowRight}
                onClick={() => navigate("/interactive-terminal")}
              >
                Practice Lab
              </Button>
              <Button
                kind="tertiary"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </div>
          </div>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
