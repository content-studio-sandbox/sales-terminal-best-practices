import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Security, Locked, Unlocked, CheckmarkFilled, WarningAlt } from "@carbon/icons-react";

export default function SSHBestPracticesPage() {
  const sshBasics = [
    { cmd: "ssh user@hostname", desc: "Connect to remote server" },
    { cmd: "ssh -i ~/.ssh/key_name user@hostname", desc: "Connect using specific SSH key" },
    { cmd: "ssh -p 2222 user@hostname", desc: "Connect using custom port" },
    { cmd: "exit", desc: "Close SSH connection" },
  ];

  const keyManagement = [
    { cmd: "ssh-keygen -t rsa -b 4096", desc: "Generate new RSA key pair (4096 bits)" },
    { cmd: "ssh-keygen -t ed25519", desc: "Generate Ed25519 key (recommended)" },
    { cmd: "ssh-copy-id user@hostname", desc: "Copy public key to remote server" },
    { cmd: "ssh-add ~/.ssh/key_name", desc: "Add key to SSH agent" },
    { cmd: "ssh-add -l", desc: "List keys in SSH agent" },
  ];

  const securityTips = [
    {
      title: "Use Strong Keys",
      desc: "Always use Ed25519 or RSA 4096-bit keys for maximum security",
      icon: <Locked size={24} style={{ color: "#24a148" }} />
    },
    {
      title: "Protect Private Keys",
      desc: "Never share private keys. Keep them secure with proper permissions (chmod 600)",
      icon: <Security size={24} style={{ color: "#0f62fe" }} />
    },
    {
      title: "Use Passphrases",
      desc: "Always protect your SSH keys with strong passphrases",
      icon: <Locked size={24} style={{ color: "#24a148" }} />
    },
    {
      title: "Disable Password Auth",
      desc: "Use key-based authentication only on production servers",
      icon: <Security size={24} style={{ color: "#0f62fe" }} />
    }
  ];

  const commonIssues = [
    {
      issue: "Permission denied (publickey)",
      solution: "Check that your public key is in ~/.ssh/authorized_keys on the server"
    },
    {
      issue: "Connection timeout",
      solution: "Verify firewall rules and that SSH service is running on the server"
    },
    {
      issue: "Host key verification failed",
      solution: "Remove old host key with: ssh-keygen -R hostname"
    },
    {
      issue: "Too many authentication failures",
      solution: "Specify the correct key with -i flag or reduce keys in ssh-agent"
    }
  ];

  const configExample = `# ~/.ssh/config example
Host myserver
    HostName server.example.com
    User myusername
    Port 22
    IdentityFile ~/.ssh/id_ed25519
    
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_key`;

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Security size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>SSH Best Practices</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px" }}>
            Learn secure SSH practices for connecting to remote servers, managing keys, and troubleshooting common issues.
          </p>
        </Section>

        {/* SSH Basics */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Basic SSH Commands
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {sshBasics.map((item, i) => (
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

        {/* Key Management */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              SSH Key Management
            </h3>
            <div style={{ display: "grid", gap: "1rem" }}>
              {keyManagement.map((item, i) => (
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

        {/* Security Tips */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #0f62fe"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem", color: "#0f62fe" }}>
              🔒 Security Best Practices
            </h3>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {securityTips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  {tip.icon}
                  <div>
                    <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600 }}>
                      {tip.title}
                    </h4>
                    <p style={{ margin: 0, color: "#161616", fontSize: "0.875rem" }}>
                      {tip.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* SSH Config */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
              SSH Config File
            </h3>
            <p style={{ color: "#525252", marginBottom: "1rem" }}>
              Create shortcuts for frequently accessed servers:
            </p>
            <pre style={{
              backgroundColor: "#161616",
              color: "#f4f4f4",
              padding: "1rem",
              borderRadius: "4px",
              fontSize: "0.875rem",
              fontFamily: "'IBM Plex Mono', monospace",
              overflow: "auto",
              margin: 0
            }}>
              {configExample}
            </pre>
            <p style={{ color: "#525252", marginTop: "1rem", fontSize: "0.875rem" }}>
              Then connect simply with: <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>ssh myserver</code>
            </p>
          </div>
        </Section>

        {/* Common Issues */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#fff3e0", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #ff832b"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <WarningAlt size={24} style={{ color: "#ff832b" }} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "#ff832b" }}>
                Troubleshooting Common Issues
              </h3>
            </div>
            <div style={{ display: "grid", gap: "1rem" }}>
              {commonIssues.map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", fontWeight: 600, color: "#da1e28" }}>
                    ❌ {item.issue}
                  </h4>
                  <p style={{ margin: 0, color: "#161616", fontSize: "0.875rem" }}>
                    <strong>Solution:</strong> {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </Column>
    </Grid>
  );
}