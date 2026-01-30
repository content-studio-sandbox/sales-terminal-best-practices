import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Cloud, Rocket, Security } from "@carbon/icons-react";

export default function OpenShiftBestPracticesPage() {
  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Cloud size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>OpenShift Best Practices for Tech Sellers</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Red Hat OpenShift is IBM's enterprise Kubernetes platform. Understanding OpenShift basics
            will help you have more technical conversations with clients and demonstrate IBM's cloud capabilities.
          </p>
        </Section>

        {/* What is OpenShift */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
              What is OpenShift?
            </h3>
            <p style={{ color: "#161616", lineHeight: 1.8, marginBottom: "1rem" }}>
              OpenShift is Red Hat's enterprise Kubernetes platform that makes it easier to deploy,
              manage, and scale containerized applications. Think of it as "Kubernetes with guardrails" -
              it adds security, automation, and developer-friendly tools on top of Kubernetes.
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li><strong>Built on Kubernetes:</strong> Industry-standard container orchestration</li>
              <li><strong>Enterprise Ready:</strong> Security, compliance, and support built-in</li>
              <li><strong>Developer Friendly:</strong> Easy deployment with source-to-image (S2I)</li>
              <li><strong>Hybrid Cloud:</strong> Run anywhere - on-prem, cloud, or edge</li>
              <li><strong>IBM Integration:</strong> Deep integration with IBM Cloud and services</li>
            </ul>
          </div>
        </Section>

        {/* Key Concepts */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Key OpenShift Concepts</h3>
            
            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                {
                  concept: "Project",
                  desc: "A Kubernetes namespace with additional annotations. Think of it as a workspace for your application.",
                  example: "oc new-project my-app"
                },
                {
                  concept: "Pod",
                  desc: "The smallest deployable unit - one or more containers that run together.",
                  example: "oc get pods"
                },
                {
                  concept: "Deployment",
                  desc: "Defines how your application should run - how many replicas, which image, etc.",
                  example: "oc get deployments"
                },
                {
                  concept: "Service",
                  desc: "Provides a stable network endpoint for your pods (like a load balancer).",
                  example: "oc get services"
                },
                {
                  concept: "Route",
                  desc: "Exposes your service to the internet with a URL (OpenShift-specific).",
                  example: "oc get routes"
                },
                {
                  concept: "BuildConfig",
                  desc: "Defines how to build your application from source code.",
                  example: "oc get bc"
                }
              ].map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <h4 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "0.75rem" }}>
                    {item.concept}
                  </h4>
                  <p style={{ margin: "0 0 1rem 0", color: "#525252", fontSize: "0.875rem" }}>
                    {item.desc}
                  </p>
                  <code style={{
                    backgroundColor: "#161616",
                    color: "#f4f4f4",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "4px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.875rem",
                    display: "inline-block"
                  }}>
                    {item.example}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Essential Commands */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Rocket size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0 }}>Essential OpenShift CLI Commands</h3>
            </div>

            <div style={{ display: "grid", gap: "2rem" }}>
              {/* Getting Started */}
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>🚀 Getting Started</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { cmd: "oc login", desc: "Log in to OpenShift cluster" },
                    { cmd: "oc whoami", desc: "Show current user" },
                    { cmd: "oc projects", desc: "List all your projects" },
                    { cmd: "oc project my-app", desc: "Switch to a specific project" },
                    { cmd: "oc new-project demo", desc: "Create a new project" },
                    { cmd: "oc status", desc: "Show overview of current project" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        minWidth: "220px"
                      }}>
                        {item.cmd}
                      </code>
                      <span style={{ color: "#525252" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deploying Applications */}
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>📦 Deploying Applications</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { cmd: "oc new-app nodejs~https://github.com/user/repo", desc: "Deploy from Git repo" },
                    { cmd: "oc new-app --docker-image=nginx", desc: "Deploy from Docker image" },
                    { cmd: "oc expose svc/my-app", desc: "Create a route (make app public)" },
                    { cmd: "oc scale dc/my-app --replicas=3", desc: "Scale to 3 replicas" },
                    { cmd: "oc delete all -l app=my-app", desc: "Delete all resources for an app" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        minWidth: "220px",
                        fontSize: "0.75rem"
                      }}>
                        {item.cmd}
                      </code>
                      <span style={{ color: "#525252", fontSize: "0.875rem" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monitoring & Debugging */}
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>🔍 Monitoring & Debugging</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { cmd: "oc get pods", desc: "List all pods in current project" },
                    { cmd: "oc get pods -w", desc: "Watch pods in real-time" },
                    { cmd: "oc describe pod my-pod", desc: "Get detailed pod information" },
                    { cmd: "oc logs my-pod", desc: "View pod logs" },
                    { cmd: "oc logs -f my-pod", desc: "Follow pod logs in real-time" },
                    { cmd: "oc exec -it my-pod -- /bin/bash", desc: "Open shell in pod" },
                    { cmd: "oc get events", desc: "View cluster events" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        minWidth: "220px",
                        fontSize: "0.75rem"
                      }}>
                        {item.cmd}
                      </code>
                      <span style={{ color: "#525252", fontSize: "0.875rem" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div>
                <h4 style={{ color: "#0f62fe", marginBottom: "1rem" }}>⚙️ Configuration</h4>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {[
                    { cmd: "oc create configmap my-config --from-file=config.json", desc: "Create config map" },
                    { cmd: "oc create secret generic my-secret --from-literal=password=secret", desc: "Create secret" },
                    { cmd: "oc set env dc/my-app KEY=value", desc: "Set environment variable" },
                    { cmd: "oc get configmaps", desc: "List config maps" },
                    { cmd: "oc get secrets", desc: "List secrets" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                      <code style={{
                        backgroundColor: "#161616",
                        color: "#f4f4f4",
                        padding: "0.5rem 0.75rem",
                        borderRadius: "4px",
                        fontFamily: "'IBM Plex Mono', monospace",
                        minWidth: "220px",
                        fontSize: "0.7rem"
                      }}>
                        {item.cmd}
                      </code>
                      <span style={{ color: "#525252", fontSize: "0.875rem" }}>{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Best Practices */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#fff3e0", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #ff832b"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <Security size={24} style={{ color: "#ff832b" }} />
              <h3 style={{ margin: 0, color: "#ff832b" }}>Best Practices for Tech Sellers</h3>
            </div>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li><strong>Use Projects:</strong> Always create a new project for demos - keeps things organized</li>
              <li><strong>Check Status:</strong> Use `oc status` before demos to verify everything is running</li>
              <li><strong>Watch Logs:</strong> Use `oc logs -f` during demos to show real-time activity</li>
              <li><strong>Clean Up:</strong> Delete demo projects after presentations: `oc delete project demo`</li>
              <li><strong>Use Labels:</strong> Tag resources with labels for easy management: `-l app=demo`</li>
              <li><strong>Security First:</strong> Never commit secrets to Git - use OpenShift secrets</li>
              <li><strong>Resource Limits:</strong> Set CPU/memory limits to prevent resource hogging</li>
              <li><strong>Health Checks:</strong> Configure liveness and readiness probes for production apps</li>
            </ul>
          </div>
        </Section>

        {/* Common Demo Scenarios */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px"
          }}>
            <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1.5rem" }}>
              Common Demo Scenarios
            </h3>
            
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {[
                {
                  scenario: "Quick App Deployment Demo",
                  steps: [
                    "1. Create project: oc new-project demo-app",
                    "2. Deploy app: oc new-app nodejs~https://github.com/sclorg/nodejs-ex",
                    "3. Watch build: oc logs -f bc/nodejs-ex",
                    "4. Expose app: oc expose svc/nodejs-ex",
                    "5. Get URL: oc get route",
                    "6. Show in browser"
                  ]
                },
                {
                  scenario: "Scaling Demo",
                  steps: [
                    "1. Show current pods: oc get pods",
                    "2. Scale up: oc scale dc/my-app --replicas=5",
                    "3. Watch scaling: oc get pods -w",
                    "4. Show load balancing across pods",
                    "5. Scale down: oc scale dc/my-app --replicas=2"
                  ]
                },
                {
                  scenario: "Troubleshooting Demo",
                  steps: [
                    "1. Check pod status: oc get pods",
                    "2. Describe problem pod: oc describe pod <pod-name>",
                    "3. Check logs: oc logs <pod-name>",
                    "4. Check events: oc get events",
                    "5. Fix issue and redeploy"
                  ]
                }
              ].map((item, i) => (
                <div 
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: "1px solid #0f62fe"
                  }}
                >
                  <h4 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>
                    {item.scenario}
                  </h4>
                  <div style={{ 
                    backgroundColor: "#f4f4f4", 
                    padding: "1rem", 
                    borderRadius: "4px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "0.875rem"
                  }}>
                    {item.steps.map((step, j) => (
                      <div key={j} style={{ marginBottom: j < item.steps.length - 1 ? "0.5rem" : 0 }}>
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* OpenShift vs Kubernetes */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>OpenShift vs Kubernetes</h3>
            <p style={{ color: "#525252", marginBottom: "1rem" }}>
              When talking to clients, here's how to explain the difference:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "4px" }}>
                <h4 style={{ color: "#0f62fe", marginTop: 0 }}>Kubernetes</h4>
                <ul style={{ paddingLeft: "1.5rem", color: "#525252", lineHeight: 1.8 }}>
                  <li>Open source container orchestration</li>
                  <li>Requires additional tools for production</li>
                  <li>More configuration needed</li>
                  <li>DIY security and networking</li>
                </ul>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "4px" }}>
                <h4 style={{ color: "#24a148", marginTop: 0 }}>OpenShift</h4>
                <ul style={{ paddingLeft: "1.5rem", color: "#525252", lineHeight: 1.8 }}>
                  <li>Enterprise Kubernetes platform</li>
                  <li>Production-ready out of the box</li>
                  <li>Integrated CI/CD and developer tools</li>
                  <li>Built-in security and compliance</li>
                </ul>
              </div>
            </div>
          </div>
        </Section>

        {/* Practice */}
        <Section level={3} style={{ padding: "2rem", backgroundColor: "#24a148", borderRadius: "8px", color: "white" }}>
          <h3 style={{ marginTop: 0, color: "white" }}>🎯 Ready to Practice?</h3>
          <p style={{ lineHeight: 1.8, margin: 0 }}>
            Head to the <strong>Interactive Terminal</strong> and try OpenShift commands!
            Type <code style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: "3px" }}>oc help</code> to see all available commands.
          </p>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
