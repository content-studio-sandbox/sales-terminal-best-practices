import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Terminal, Keyboard } from "@carbon/icons-react";
import InteractiveTerminal from "../components/InteractiveTerminal";

export default function InteractiveTerminalPage() {
  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Terminal size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>Interactive Terminal Practice</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px" }}>
            Practice terminal commands in a safe, interactive environment. Try the commands you've learned!
          </p>
        </Section>

        <Section level={3} style={{ marginBottom: "2rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "1.5rem", 
            borderRadius: "8px",
            marginBottom: "2rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Keyboard size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 600, color: "#0f62fe" }}>
                Quick Tips
              </h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li>This is a <strong>safe, simulated terminal</strong> - perfect for learning without risk</li>
              <li>Try commands like: <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>ls</code>, <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>pwd</code>, <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>mkdir</code>, <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>cd</code>, <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>git status</code></li>
              <li>Use <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>↑</code> and <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>↓</code> arrow keys to navigate command history</li>
              <li>Type <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>help</code> to see all available commands</li>
            </ul>
          </div>

          <InteractiveTerminal
            welcomeMessage="🚀 FSM Terminal Practice Environment - Type 'help' to get started!"
            initialCommands={[]}
          />
        </Section>

        <Section level={3} style={{ marginTop: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Try These Exercises
            </h3>
            
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "1.5rem", 
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                  Exercise 1: Basic Navigation
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>whoami</code> to see your username</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>pwd</code> to see your current directory</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>ls</code> to list files</li>
                </ol>
              </div>

              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "1.5rem", 
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                  Exercise 2: Git Commands
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>git status</code> to check repository status</li>
                  <li>Try using the up arrow to recall the previous command</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>history</code> to see all commands you've run</li>
                </ol>
              </div>

              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "1.5rem", 
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                  Exercise 3: Echo and Date
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>echo Hello World</code> to print text</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>date</code> to see the current date and time</li>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>clear</code> to clean up your terminal</li>
                </ol>
              </div>

              <div style={{ 
                backgroundColor: "#ffffff", 
                padding: "1.5rem", 
                borderRadius: "4px",
                border: "1px solid #e0e0e0"
              }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                  Exercise 4: SSH Demo
                </h4>
                <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                  <li>Type <code style={{ backgroundColor: "#f4f4f4", padding: "2px 6px", borderRadius: "3px" }}>ssh demo</code> to simulate an SSH connection</li>
                  <li>Observe the connection message and server prompt</li>
                  <li>This demonstrates what you'll see when connecting to real servers</li>
                </ol>
              </div>
            </div>
          </div>
        </Section>

        <Section level={3} style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#e8f4ff", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#0f62fe" }}>💡 Safe Learning Environment</h3>
          <p style={{ color: "#161616", lineHeight: 1.8, marginBottom: 0 }}>
            This is a <strong>simulated terminal</strong> - a safe sandbox for learning. All commands are simulated and won't affect your actual system.
            Practice freely without worrying about making mistakes! When you're comfortable, apply these skills in your real development environment.
          </p>
        </Section>
      </Column>
    </Grid>
  );
}