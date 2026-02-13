import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { Bot, Code, CheckmarkFilled, Information, Warning } from "@carbon/icons-react";
import VisualDiagram from "../components/VisualDiagram";

export default function AgenticToolsPage() {
  const agentArchitecture = `
┌─────────────────────────────────────────────────────┐
│         AI Agent Architecture                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│  User Input                                         │
│     ↓                                               │
│  Agent Orchestrator                                 │
│     ↓                                               │
│  ┌─────────────────────────────────────┐           │
│  │  Agent Components                   │           │
│  │  • Planning & Reasoning             │           │
│  │  • Tool Selection                   │           │
│  │  • Memory Management                │           │
│  │  • Context Awareness                │           │
│  └─────────────────────────────────────┘           │
│     ↓                                               │
│  Tool Execution                                     │
│  • API Calls                                        │
│  • Database Queries                                 │
│  • Code Execution                                   │
│  • External Services                                │
│     ↓                                               │
│  Response Generation                                │
│     ↓                                               │
│  User Output                                        │
│                                                     │
└─────────────────────────────────────────────────────┘`;

  const watsonxAgentExample = `# IBM watsonx.ai Agent Example

# 1. Define Agent Tools
tools = [
    {
        "name": "get_customer_data",
        "description": "Retrieve customer information from database",
        "parameters": {
            "customer_id": "string"
        }
    },
    {
        "name": "analyze_sentiment",
        "description": "Analyze sentiment of customer feedback",
        "parameters": {
            "text": "string"
        }
    },
    {
        "name": "generate_report",
        "description": "Generate customer insights report",
        "parameters": {
            "customer_id": "string",
            "report_type": "string"
        }
    }
]

# 2. Create Agent with watsonx.ai
from ibm_watsonx_ai import Agent

agent = Agent(
    model_id="meta-llama/llama-3-70b-instruct",
    tools=tools,
    instructions="You are a customer insights analyst. Use available tools to gather data and provide actionable insights."
)

# 3. Execute Agent Task
response = agent.run(
    "Analyze customer 12345 and generate a comprehensive report"
)

print(response)`;

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Bot size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>AI Assist / Agents</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "800px", lineHeight: 1.6 }}>
            Understand and leverage AI agents across IBM's ecosystem. Learn about watsonx.ai agents, 
            LangChain, AutoGen, and how to build intelligent automation for customer solutions.
          </p>
        </Section>

        {/* What are AI Agents */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#e8f4ff", 
            padding: "2rem", 
            borderRadius: "8px",
            marginBottom: "2rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <Information size={24} style={{ color: "#0f62fe" }} />
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "#0f62fe" }}>
                What are AI Agents?
              </h3>
            </div>
            <p style={{ margin: "0 0 1rem 0", color: "#161616", lineHeight: 1.8 }}>
              AI agents are autonomous systems that can perceive their environment, make decisions, and take 
              actions to achieve specific goals. Unlike traditional AI models that simply respond to prompts, 
              agents can:
            </p>
            <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#161616", lineHeight: 1.8 }}>
              <li><strong>Plan:</strong> Break down complex tasks into steps</li>
              <li><strong>Use Tools:</strong> Call APIs, query databases, execute code</li>
              <li><strong>Remember:</strong> Maintain context across interactions</li>
              <li><strong>Reason:</strong> Make decisions based on available information</li>
              <li><strong>Iterate:</strong> Refine approaches based on results</li>
              <li><strong>Collaborate:</strong> Work with other agents or humans</li>
            </ul>
          </div>

          <VisualDiagram 
            title="AI Agent Architecture" 
            content={agentArchitecture}
          />
        </Section>

        {/* Why Agents Matter for Sales */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#defbe6", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #24a148"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, color: "#24a148", marginBottom: "1rem" }}>
              Why AI Agents Matter for Sales Teams
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "#161616" }}>
                  🎯 Customer Solutions
                </h4>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#161616", lineHeight: 1.6 }}>
                  Demonstrate how agents can automate customer workflows, from data analysis to report generation
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "#161616" }}>
                  🚀 Competitive Edge
                </h4>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#161616", lineHeight: 1.6 }}>
                  Position IBM's agentic capabilities against competitors like OpenAI Assistants and Amazon Bedrock Agents
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "#161616" }}>
                  💡 Innovation Stories
                </h4>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#161616", lineHeight: 1.6 }}>
                  Share real-world examples of agents solving business problems across industries
                </p>
              </div>
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: "#161616" }}>
                  🔧 Technical Credibility
                </h4>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "#161616", lineHeight: 1.6 }}>
                  Understand the technology deeply enough to have meaningful technical discussions
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* IBM Agentic Tools */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              IBM Agentic Tools Ecosystem
            </h3>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              {[
                {
                  title: "watsonx.ai Agents",
                  description: "IBM's enterprise-grade agent framework built on watsonx.ai foundation models",
                  features: [
                    "Pre-built agent templates for common use cases",
                    "Integration with watsonx.governance for compliance",
                    "Enterprise security and data privacy",
                    "Support for custom tools and APIs",
                    "Multi-agent orchestration capabilities"
                  ],
                  useCase: "Enterprise AI applications requiring governance, security, and compliance"
                },
                {
                  title: "Watson Orchestrate",
                  description: "Low-code platform for building AI-powered automation workflows",
                  features: [
                    "Visual workflow builder",
                    "Pre-built skills library",
                    "Integration with enterprise systems (Salesforce, ServiceNow, etc.)",
                    "Natural language interface",
                    "Team collaboration features"
                  ],
                  useCase: "Business users automating repetitive tasks without coding"
                },
                {
                  title: "watsonx Assistant",
                  description: "Conversational AI platform with agentic capabilities",
                  features: [
                    "Multi-turn conversations with context",
                    "Action-based architecture",
                    "Integration with backend systems",
                    "Voice and text channels",
                    "Analytics and insights"
                  ],
                  useCase: "Customer service, IT helpdesk, employee support"
                },
                {
                  title: "IBM Granite Models",
                  description: "Foundation models optimized for agentic workflows",
                  features: [
                    "Function calling capabilities",
                    "Tool use optimization",
                    "Code generation and execution",
                    "Reasoning and planning",
                    "Enterprise-focused training data"
                  ],
                  useCase: "Building custom agents with IBM's foundation models"
                }
              ].map((tool, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                    <CheckmarkFilled size={20} style={{ color: "#24a148", marginTop: "2px", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                        {tool.title}
                      </h4>
                      <p style={{ margin: "0 0 1rem 0", color: "#525252", fontSize: "0.875rem" }}>
                        {tool.description}
                      </p>
                      <div style={{ marginBottom: "1rem" }}>
                        <strong style={{ fontSize: "0.875rem", color: "#161616" }}>Key Features:</strong>
                        <ul style={{ margin: "0.5rem 0 0 0", paddingLeft: "1.5rem", fontSize: "0.875rem", color: "#161616" }}>
                          {tool.features.map((feature, fIndex) => (
                            <li key={fIndex}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ 
                        backgroundColor: "#e8f4ff", 
                        padding: "0.75rem", 
                        borderRadius: "4px"
                      }}>
                        <strong style={{ fontSize: "0.75rem", color: "#0f62fe" }}>Best For:</strong>
                        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#161616" }}>
                          {tool.useCase}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Open Source Frameworks */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Popular Open Source Agent Frameworks
            </h3>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              {[
                {
                  title: "LangChain",
                  description: "Most popular framework for building LLM applications and agents",
                  pros: ["Large community", "Extensive documentation", "Many integrations", "Active development"],
                  cons: ["Can be complex", "Frequent breaking changes", "Performance overhead"],
                  ibmIntegration: "Works with watsonx.ai models via LangChain IBM integration"
                },
                {
                  title: "AutoGen (Microsoft)",
                  description: "Multi-agent conversation framework for complex workflows",
                  pros: ["Multi-agent collaboration", "Code execution", "Human-in-the-loop", "Research-backed"],
                  cons: ["Steeper learning curve", "Less mature ecosystem", "Limited tooling"],
                  ibmIntegration: "Can integrate with watsonx.ai through custom LLM wrappers"
                },
                {
                  title: "CrewAI",
                  description: "Framework for orchestrating role-playing autonomous AI agents",
                  pros: ["Simple API", "Role-based agents", "Task delegation", "Good for teams"],
                  cons: ["Newer framework", "Smaller community", "Limited enterprise features"],
                  ibmIntegration: "Compatible with watsonx.ai models"
                },
                {
                  title: "LlamaIndex",
                  description: "Data framework for LLM applications with agent capabilities",
                  pros: ["Excellent for RAG", "Data connectors", "Query engines", "Agent tools"],
                  cons: ["Focused on data retrieval", "Less general-purpose", "Learning curve"],
                  ibmIntegration: "Supports watsonx.ai models for RAG applications"
                }
              ].map((framework, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: 600, color: "#0f62fe" }}>
                    {framework.title}
                  </h4>
                  <p style={{ margin: "0 0 1rem 0", color: "#525252", fontSize: "0.875rem" }}>
                    {framework.description}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <strong style={{ fontSize: "0.75rem", color: "#24a148" }}>✓ Pros:</strong>
                      <ul style={{ margin: "0.25rem 0 0 0", paddingLeft: "1.5rem", fontSize: "0.75rem", color: "#161616" }}>
                        {framework.pros.map((pro, pIndex) => (
                          <li key={pIndex}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong style={{ fontSize: "0.75rem", color: "#da1e28" }}>✗ Cons:</strong>
                      <ul style={{ margin: "0.25rem 0 0 0", paddingLeft: "1.5rem", fontSize: "0.75rem", color: "#161616" }}>
                        {framework.cons.map((con, cIndex) => (
                          <li key={cIndex}>{con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div style={{ 
                    backgroundColor: "#e8f4ff", 
                    padding: "0.75rem", 
                    borderRadius: "4px"
                  }}>
                    <strong style={{ fontSize: "0.75rem", color: "#0f62fe" }}>IBM Integration:</strong>
                    <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#161616" }}>
                      {framework.ibmIntegration}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Code Example */}
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
                Building an Agent with watsonx.ai
              </h3>
            </div>

            <VisualDiagram 
              title="watsonx.ai Agent Example" 
              content={watsonxAgentExample}
            />
          </div>
        </Section>

        {/* Use Cases */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{ 
            backgroundColor: "#f4f4f4", 
            padding: "2rem", 
            borderRadius: "8px",
            border: "1px solid #e0e0e0"
          }}>
            <h3 style={{ marginTop: 0, fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>
              Real-World Agent Use Cases
            </h3>

            <div style={{ display: "grid", gap: "1rem" }}>
              {[
                {
                  industry: "Financial Services",
                  useCase: "Fraud Detection Agent",
                  description: "Monitors transactions, analyzes patterns, flags suspicious activity, and generates investigation reports"
                },
                {
                  industry: "Healthcare",
                  useCase: "Clinical Documentation Agent",
                  description: "Transcribes doctor-patient conversations, extracts key information, updates EHR systems, and suggests billing codes"
                },
                {
                  industry: "Retail",
                  useCase: "Inventory Optimization Agent",
                  description: "Analyzes sales data, predicts demand, optimizes stock levels, and automatically places orders with suppliers"
                },
                {
                  industry: "Manufacturing",
                  useCase: "Predictive Maintenance Agent",
                  description: "Monitors equipment sensors, predicts failures, schedules maintenance, and orders replacement parts"
                },
                {
                  industry: "Customer Service",
                  useCase: "Support Ticket Agent",
                  description: "Triages tickets, searches knowledge base, suggests solutions, escalates complex issues, and follows up"
                },
                {
                  industry: "HR",
                  useCase: "Recruitment Agent",
                  description: "Screens resumes, schedules interviews, answers candidate questions, and provides hiring recommendations"
                }
              ].map((example, index) => (
                <div 
                  key={index}
                  style={{
                    backgroundColor: "#ffffff",
                    padding: "1rem",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    display: "grid",
                    gridTemplateColumns: "150px 200px 1fr",
                    gap: "1rem",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "0.875rem", color: "#0f62fe" }}>{example.industry}</strong>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.875rem", color: "#161616" }}>{example.useCase}</strong>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "#525252" }}>
                      {example.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Best Practices */}
        <Section level={3} style={{ marginTop: "3rem", padding: "2rem", backgroundColor: "#e8f4ff", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#0f62fe" }}>💡 Best Practices for Agent Development</h3>
          <ul style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
            <li><strong>Start Simple:</strong> Begin with single-agent, single-tool scenarios before adding complexity</li>
            <li><strong>Clear Instructions:</strong> Provide detailed system prompts that define agent behavior and constraints</li>
            <li><strong>Tool Design:</strong> Create focused tools that do one thing well rather than complex multi-purpose tools</li>
            <li><strong>Error Handling:</strong> Implement robust error handling and fallback mechanisms</li>
            <li><strong>Human-in-the-Loop:</strong> Include human oversight for critical decisions</li>
            <li><strong>Monitoring:</strong> Track agent performance, tool usage, and failure rates</li>
            <li><strong>Testing:</strong> Thoroughly test agents with edge cases and unexpected inputs</li>
            <li><strong>Governance:</strong> Implement guardrails to prevent harmful or unintended actions</li>
          </ul>
        </Section>

        {/* Cautions */}
        <Section level={3} style={{ marginTop: "2rem", padding: "2rem", backgroundColor: "#fff3e0", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
            <Warning size={24} style={{ color: "#ff832b", marginTop: "2px", flexShrink: 0 }} />
            <div>
              <h3 style={{ marginTop: 0, color: "#ff832b" }}>Important Considerations</h3>
              <ul style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
                <li><strong>Cost Management:</strong> Agents can make many LLM calls - monitor and optimize costs</li>
                <li><strong>Latency:</strong> Multi-step agent workflows can be slow - set appropriate expectations</li>
                <li><strong>Reliability:</strong> LLMs can be unpredictable - implement validation and retry logic</li>
                <li><strong>Security:</strong> Agents with tool access need proper authentication and authorization</li>
                <li><strong>Data Privacy:</strong> Ensure agents handle sensitive data according to regulations</li>
                <li><strong>Explainability:</strong> Document agent decision-making for audit and compliance</li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Resources */}
        <Section level={3} style={{ marginTop: "2rem", padding: "2rem", backgroundColor: "#defbe6", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, color: "#24a148" }}>📚 Learning Resources</h3>
          <ul style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
            <li><strong>IBM watsonx.ai Documentation:</strong> Official docs for building agents with watsonx</li>
            <li><strong>LangChain Documentation:</strong> Comprehensive guides and examples</li>
            <li><strong>AutoGen Examples:</strong> Microsoft's agent framework tutorials</li>
            <li><strong>IBM TechZone:</strong> Hands-on labs and demo environments</li>
            <li><strong>GitHub Repositories:</strong> Open source agent examples and templates</li>
            <li><strong>IBM Developer:</strong> Articles, tutorials, and code patterns</li>
          </ul>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
