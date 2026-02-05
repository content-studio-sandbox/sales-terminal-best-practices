import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { trackOrchestrateInit, trackOrchestrateError, initInstanaRUM } from '../utils/instanaRUM';

// Watson Orchestrate configuration
declare global {
  interface Window {
    wxOConfiguration?: any;
    wxoLoader?: any;
  }
}

const WatsonOrchestrate = () => {
  const isInitialized = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    // Only initialize once
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initializeWatson = async () => {
      try {
        console.log('🚀 Initializing Watson Orchestrate...');
        
        // Initialize Instana RUM
        initInstanaRUM();
        
        // Get user email from SSO session
        const userEmail = user?.email;
        console.log('👤 User email from SSO:', userEmail || 'Not available');
        
        // Skip user context loading for now - API endpoint not accessible in production
        // The agent will work without personalization using knowledge base
        let userContext = null;
        console.log('ℹ️  User context disabled - agent will use knowledge base only');

        // Create dedicated container for Watson Orchestrate
        // This container will only be visible when the chat is open
        const chatContainer = document.createElement('div');
        chatContainer.id = 'watson-orchestrate-container';
        chatContainer.style.cssText = `
          position: fixed;
          bottom: 0;
          right: 0;
          z-index: 10000;
          pointer-events: auto;
        `;
        
        // Append to body to avoid React DOM conflicts
        document.body.appendChild(chatContainer);
        console.log('✅ Container created:', chatContainer.id);

        // Build context-aware system prompt
        let contextPrompt = '';
        if (userContext) {
          const role = userContext.user.access_role;
          const userName = userContext.user.full_name || userContext.user.email;
          
          contextPrompt = `You are a helpful assistant for ${userName}, who is a ${role} at IBM using the Your Projects platform.\n\n`;
          
          if (role === 'contributor') {
            contextPrompt += `CURRENT PROJECTS:\n`;
            if (userContext.my_projects?.length > 0) {
              userContext.my_projects.forEach((pm: any) => {
                contextPrompt += `- ${pm.projects.name} (${pm.role}): ${pm.projects.description}\n`;
              });
            } else {
              contextPrompt += `- No current projects\n`;
            }
            
            contextPrompt += `\nMY SKILLS:\n`;
            if (userContext.my_skills?.length > 0) {
              contextPrompt += userContext.my_skills.map((s: any) => `- ${s.skill_name} (${s.proficiency_level})`).join('\n') + '\n';
            } else {
              contextPrompt += `- No skills listed yet\n`;
            }
            
            contextPrompt += `\nAVAILABLE PROJECTS (Top matches):\n`;
            if (userContext.available_projects?.length > 0) {
              userContext.available_projects.slice(0, 5).forEach((p: any) => {
                contextPrompt += `- ${p.name} (${p.match_score}% match): ${p.description}\n`;
                contextPrompt += `  Required skills: ${p.required_skills?.join(', ')}\n`;
              });
            } else {
              contextPrompt += `- No available projects at this time\n`;
            }
            
            contextPrompt += `\nRECENT APPLICATIONS:\n`;
            if (userContext.my_applications?.length > 0) {
              userContext.my_applications.slice(0, 3).forEach((app: any) => {
                contextPrompt += `- ${app.projects.name} (${app.status})\n`;
              });
            } else {
              contextPrompt += `- No applications yet\n`;
            }
          } else if (role === 'leader') {
            contextPrompt += `PENDING APPLICATIONS:\n`;
            if (userContext.pending_applications?.length > 0) {
              userContext.pending_applications.slice(0, 10).forEach((app: any) => {
                contextPrompt += `- ${app.users.full_name || app.users.email} applied to ${app.projects.name}\n`;
              });
            } else {
              contextPrompt += `- No pending applications\n`;
            }
          } else if (role === 'executive') {
            contextPrompt += `PLATFORM ANALYTICS:\n`;
            if (userContext.analytics) {
              contextPrompt += `- Total Projects: ${userContext.analytics.total_projects}\n`;
              contextPrompt += `- Active Projects: ${userContext.analytics.active_projects}\n`;
              contextPrompt += `- Total Applications: ${userContext.analytics.total_applications}\n`;
              contextPrompt += `- Pending Applications: ${userContext.analytics.pending_applications}\n`;
            }
          }
          
          contextPrompt += `\nYou can help with questions about projects, applications, skills, and career development. Be concise and helpful.`;
        }

        // Watson Orchestrate configuration - Live Career Connect agent
        // Security disabled for public access (no authentication required)
        // Pass user email as session variable for API calls
        window.wxOConfiguration = {
          orchestrationID: "e493682d7d4a4ab084c852351ca85944_5f813e7d-73f3-4bcb-b3ca-82adf3c250ca",
          hostURL: "https://us-south.watson-orchestrate.cloud.ibm.com",
          rootElementID: "watson-orchestrate-container",
          deploymentPlatform: "ibmcloud",
          crn: "crn:v1:bluemix:public:watsonx-orchestrate:us-south:a/e493682d7d4a4ab084c852351ca85944:5f813e7d-73f3-4bcb-b3ca-82adf3c250ca::",
          chatOptions: {
            agentId: "70c88285-b580-4210-9398-8b2bb9d3e01e",
            agentEnvironmentId: "6af2d846-e7d5-4b59-bd76-fb9f26ca9407",
            ...(userEmail && {
              sessionVariables: {
                user: {
                  email: userEmail
                }
              }
            }),
            ...(contextPrompt && {
              context: {
                global: {
                  system: {
                    context: contextPrompt
                  }
                }
              }
            })
          }
        };
        
        console.log('✅ Watson Orchestrate Configuration (Live Career Connect):');
        console.log('  - Agent ID: 70c88285-b580-4210-9398-8b2bb9d3e01e');
        console.log('  - Environment: Live (6af2d846-e7d5-4b59-bd76-fb9f26ca9407)');
        console.log('  - Security: Disabled (public access)');
        console.log('  - User Email:', userEmail || 'Not available');

        // Load Watson Orchestrate script (simplified - no authentication needed)
        setTimeout(function () {
          const script = document.createElement('script');
          script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`;
          script.addEventListener('load', function () {
            console.log('✅ Watson Orchestrate script loaded');
            window.wxoLoader.init();
            console.log('✅ Watson Orchestrate initialized successfully');
            
            // Track successful initialization
            trackOrchestrateInit(
              window.wxOConfiguration.chatOptions.agentId,
              userEmail
            );
          });
          script.addEventListener('error', function(e) {
            console.error('❌ Failed to load Watson Orchestrate script:', e);
            trackOrchestrateError(
              `Failed to load Watson Orchestrate script: ${e}`,
              userEmail
            );
          });
          document.head.appendChild(script);
          console.log('📥 Script tag added to document');
        }, 0);

      } catch (error) {
        console.error('❌ Error initializing Watson Orchestrate:', error);
        trackOrchestrateError(
          `Error initializing Watson Orchestrate: ${error}`,
          user?.email
        );
      }
    };

    // Initialize immediately
    initializeWatson();

    // Cleanup function
    return () => {
      const container = document.getElementById('root');
      if (container) {
        container.remove();
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default WatsonOrchestrate;

// Made with Bob
