import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Security, Code, CheckmarkFilled, Warning } from "@carbon/icons-react";
import VisualDiagram from "../components/VisualDiagram";

export default function ApiAuthenticationPage() {
  const authFlowDiagram = `
┌─────────────────────────────────────────────────────┐
│         API Authentication Flow                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  1. Client Request                                  │
│     ↓                                               │
│  2. Generate/Obtain Token                           │
│     • Bearer Token (OAuth 2.0)                      │
│     • API Key (ZenAPI Key)                          │
│     • Basic Auth (username:password)                │
│     ↓                                               │
│  3. Include in Request Header                       │
│     Authorization: Bearer <token>                   │
│     OR                                              │
│     X-API-Key: <api-key>                            │
│     ↓                                               │
│  4. Server Validates                                │
│     ↓                                               │
│  5. Response (200 OK or 401 Unauthorized)           │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const curlBearerExample = `# Step 1: Obtain Bearer Token (OAuth 2.0)
curl -X POST https://api.example.com/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials" \\
  -d "client_id=YOUR_CLIENT_ID" \\
  -d "client_secret=YOUR_CLIENT_SECRET"

# Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}

# Step 2: Use Bearer Token in API Request
curl -X GET https://api.example.com/v1/data \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\
  -H "Content-Type: application/json"`;

  const zenApiKeyExample = `# IBM Cloud Pak for Data - ZenAPI Key Authentication

# Step 1: Generate ZenAPI Key (via UI or CLI)
# Navigate to: Profile > API Key > Generate New Key

# Step 2: Use ZenAPI Key in curl request
curl -X GET https://cpd-instance.example.com/v2/assets \\
  -H "Authorization: ZenApiKey <your-zen-api-key>" \\
  -H "Content-Type: application/json"

# Alternative: Using username and API key
curl -X GET https://cpd-instance.example.com/v2/assets \\
  -u "username:<zen-api-key>" \\
  -H "Content-Type: application/json"

# Step 3: Example with POST request
curl -X POST https://cpd-instance.example.com/v2/projects \\
  -H "Authorization: ZenApiKey <your-zen-api-key>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "My Project",
    "description": "Demo project"
  }'`;

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Security size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>API Authentication for Sales Teams</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Master API authentication methods including Bearer tokens, ZenAPI keys, and curl commands. 
            Essential for demos, POCs, and technical discussions with clients.
          </p>
        </Section>

        {/* Why Authentication Matters */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Security size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "#0f62fe" }}>
                Why API Authentication Matters for Sales
              </h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li><strong>Client Demos:</strong> Quickly test APIs during customer presentations</li>
              <li><strong>POC Setup:</strong> Configure authentication for proof-of-concept environments</li>
              <li><strong>Troubleshooting:</strong> Diagnose authentication issues in customer environments</li>
              <li><strong>Integration Testing:</strong> Verify API connectivity before customer handoff</li>
              <li><strong>Security Discussions:</strong> Explain authentication best practices to clients</li>
            </ul>
          </div>

          <VisualDiagram 
            title="API Authentication Flow" 
            content={authFlowDiagram}
          />
        </Section>

        {/* Bearer Token Authentication */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Code size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                Bearer Token Authentication (OAuth 2.0)
              </h3>
            </div>
            
            <p style={{ color: "#525252", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Bearer tokens are the most common authentication method for modern APIs. They're temporary 
              credentials that grant access without exposing passwords.
            </p>

            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#161616" }}>
                How Bearer Tokens Work:
              </h4>
              <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                <li>Client authenticates with credentials (client_id + client_secret)</li>
                <li>Server returns an access_token (Bearer token)</li>
                <li>Client includes token in Authorization header for subsequent requests</li>
                <li>Token expires after a set time (typically 1-24 hours)</li>
                <li>Client requests new token when expired</li>
              </ol>
            </div>

            <VisualDiagram 
              title="Bearer Token Example with curl" 
              content={curlBearerExample}
            />

            <div style={{ 
              backgroundColor: "#fff3e0", 
              border: "1px solid #ff832b",
              padding: "1rem",
              borderRadius: "4px",
              marginTop: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <Warning size={20} style={{ color: "#ff832b", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <strong style={{ color: "#ff832b" }}>Security Best Practice:</strong>
                  <p style={{ margin: "0.5rem 0 0 0", color: "#161616", fontSize: "0.875rem" }}>
                    Never hardcode tokens in scripts or commit them to version control. Use environment 
                    variables or secure credential management systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ZenAPI Key Authentication */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Code size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                IBM Cloud Pak for Data - ZenAPI Key
              </h3>
            </div>
            
            <p style={{ color: "#525252", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              ZenAPI Keys are IBM Cloud Pak for Data's authentication method. They're long-lived credentials 
              that simplify API access for automation and integration scenarios.
            </p>

            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "1rem", color: "#161616" }}>
                Generating a ZenAPI Key:
              </h4>
              <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
                <li>Log into Cloud Pak for Data web interface</li>
                <li>Click on your profile icon (top right)</li>
                <li>Select "Profile and Settings"</li>
                <li>Navigate to "API Key" tab</li>
                <li>Click "Generate New Key"</li>
                <li>Copy and securely store the key (it won't be shown again)</li>
              </ol>
            </div>

            <VisualDiagram 
              title="ZenAPI Key Usage with curl" 
              content={zenApiKeyExample}
            />

            <div style={{ 
              backgroundColor: "#e8f4ff", 
              padding: "1rem",
              borderRadius: "4px",
              marginTop: "1.5rem"
            }}>
              <strong style={{ color: "#0f62fe" }}>💡 Pro Tip:</strong>
              <p style={{ margin: "0.5rem 0 0 0", color: "#161616", fontSize: "0.875rem" }}>
                Store your ZenAPI key in an environment variable: <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>export ZEN_API_KEY="your-key-here"</code>
                <br />
                Then use it in curl: <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px" }}>-H "Authorization: ZenApiKey $ZEN_API_KEY"</code>
              </p>
            </div>
          </div>
        </Section>

        {/* Common curl Patterns */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Common curl Command Patterns
            </h3>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              {[
                {
                  title: "GET Request with Bearer Token",
                  description: "Retrieve data from an API",
                  command: `curl -X GET https://api.example.com/v1/users \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`,
                  useCase: "Fetching user lists, retrieving resources"
                },
                {
                  title: "POST Request with JSON Body",
                  description: "Create a new resource",
                  command: `curl -X POST https://api.example.com/v1/users \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'`,
                  useCase: "Creating users, submitting forms, uploading data"
                },
                {
                  title: "PUT Request (Update)",
                  description: "Update an existing resource",
                  command: `curl -X PUT https://api.example.com/v1/users/123 \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Doe"
  }'`,
                  useCase: "Updating user profiles, modifying settings"
                },
                {
                  title: "DELETE Request",
                  description: "Remove a resource",
                  command: `curl -X DELETE https://api.example.com/v1/users/123 \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
                  useCase: "Deleting users, removing resources"
                },
                {
                  title: "Request with Query Parameters",
                  description: "Filter or paginate results",
                  command: `curl -X GET "https://api.example.com/v1/users?page=2&limit=10&status=active" \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
                  useCase: "Searching, filtering, pagination"
                },
                {
                  title: "Save Response to File",
                  description: "Download API response",
                  command: `curl -X GET https://api.example.com/v1/report \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -o report.json`,
                  useCase: "Downloading reports, saving large responses"
                },
                {
                  title: "Verbose Output (Debugging)",
                  description: "See full request/response details",
                  command: `curl -v -X GET https://api.example.com/v1/users \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
                  useCase: "Troubleshooting, debugging authentication issues"
                },
                {
                  title: "Ignore SSL Certificate (Dev Only)",
                  description: "Skip SSL verification for testing",
                  command: `curl -k -X GET https://dev-api.example.com/v1/users \\
  -H "Authorization: Bearer YOUR_TOKEN"`,
                  useCase: "Testing in development environments with self-signed certs"
                }
              ].map((pattern, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                    <CheckmarkFilled size={20} style={{ color: "#24a148", marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600 }}>
                        {pattern.title}
                      </h4>
                      <p style={{ margin: "0 0 1rem 0", color: "#525252", fontSize: "0.875rem" }}>
                        {pattern.description}
                      </p>
                      <div style={{ 
                        backgroundColor: "#161616", 
                        padding: "1rem", 
                        borderRadius: "4px",
                        marginBottom: "0.75rem",
                        overflowX: "auto"
                      }}>
                        <pre style={{ 
                          margin: 0, 
                          fontSize: "0.75rem", 
                          fontFamily: "'IBM Plex Mono', monospace",
                          color: "#f4f4f4",
                          whiteSpace: "pre-wrap"
                        }}>
                          {pattern.command}
                        </pre>
                      </div>
                      <p style={{ 
                        margin: 0, 
                        fontSize: "0.75rem", 
                        color: "#0f62fe",
                        fontStyle: "italic"
                      }}>
                        💡 Use Case: {pattern.useCase}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Quick Reference */}
        <Section level={3} style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#e8f4ff", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#0f62fe" }}>🔑 Quick Reference: curl Options</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>-X</code>
              <span style={{ marginLeft: "0.5rem" }}>HTTP method (GET, POST, PUT, DELETE)</span>
            </div>
            <div>
              <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>-H</code>
              <span style={{ marginLeft: "0.5rem" }}>Add header (Authorization, Content-Type)</span>
            </div>
            <div>
              <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>-d</code>
              <span style={{ marginLeft: "0.5rem" }}>Request body data (JSON, form data)</span>
            </div>
            <div>
              <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>-o</code>
              <span style={{ marginLeft: "0.5rem" }}>Save output to file</span>
            </div>
            <div>
              <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>-v</code>
              <span style={{ marginLeft: "0.5rem" }}>Verbose output (debugging)</span>
            </div>
            <div>
              <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>-k</code>
              <span style={{ marginLeft: "0.5rem" }}>Ignore SSL certificate errors</span>
            </div>
            <div>
              <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>-u</code>
              <span style={{ marginLeft: "0.5rem" }}>Basic authentication (user:pass)</span>
            </div>
            <div>
              <code style={{ backgroundColor: "#ffffff", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>-i</code>
              <span style={{ marginLeft: "0.5rem" }}>Include response headers</span>
            </div>
          </div>
        </Section>

        {/* Best Practices */}
        <Section level={3} style={{ marginTop: "2rem", padding: "2rem", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#ff832b" }}>🔒 Security Best Practices</h3>
          <ul style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
            <li><strong>Never commit credentials:</strong> Use .env files and add them to .gitignore</li>
            <li><strong>Use environment variables:</strong> Store tokens/keys as env vars, not in code</li>
            <li><strong>Rotate keys regularly:</strong> Generate new API keys periodically</li>
            <li><strong>Use HTTPS only:</strong> Never send credentials over unencrypted HTTP</li>
            <li><strong>Limit token scope:</strong> Request only the permissions you need</li>
            <li><strong>Monitor token usage:</strong> Track API calls to detect unauthorized access</li>
            <li><strong>Implement token expiration:</strong> Use short-lived tokens when possible</li>
            <li><strong>Secure storage:</strong> Use credential managers (AWS Secrets Manager, HashiCorp Vault)</li>
          </ul>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
