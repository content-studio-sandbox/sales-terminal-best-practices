// Survey data from FSM Technical Best Practices interest survey
// Columns represent different topics of interest

export interface SurveyResponse {
  id: number;
  terminalBasics: string;
  gitWorkflows: string;
  sshBestPractices: string;
  openShiftDeployment: string;
  vimEditor: string;
  apiAuthentication: string;
  cpdCli: string;
  agenticTools: string;
  additionalComments?: string;
}

export const surveyResponses: SurveyResponse[] = [
  { id: 1, terminalBasics: "interested", gitWorkflows: "interested", sshBestPractices: "interested", openShiftDeployment: "some interest", vimEditor: "interested", apiAuthentication: "some interest", cpdCli: "some interest", agenticTools: "", additionalComments: "" },
  { id: 2, terminalBasics: "some interest", gitWorkflows: "interested", sshBestPractices: "interested", openShiftDeployment: "Most interested", vimEditor: "Most interested", apiAuthentication: "Most interested", cpdCli: "Most interested", agenticTools: "Most interested", additionalComments: "Curl commands and how to generate a Bearer token and how to use generate and use a ZenAPI key. A session on how to obtain and use cpd-cli with a corresponding cpd-cli command session." },
  { id: 3, terminalBasics: "interested", gitWorkflows: "interested", sshBestPractices: "some interest", openShiftDeployment: "Most interested", vimEditor: "Most interested", apiAuthentication: "interested", cpdCli: "interested", agenticTools: "interested", additionalComments: "Agnetic Tool useage (as this constantly evolves and we have agents all over IBM now that we could take advantage of)" },
  { id: 4, terminalBasics: "interested", gitWorkflows: "interested", sshBestPractices: "interested", openShiftDeployment: "interested", vimEditor: "interested", apiAuthentication: "interested", cpdCli: "interested", agenticTools: "interested", additionalComments: "" },
  { id: 5, terminalBasics: "some interest", gitWorkflows: "some interest", sshBestPractices: "some interest", openShiftDeployment: "interested", vimEditor: "interested", apiAuthentication: "some interest", cpdCli: "some interest", agenticTools: "some interest", additionalComments: "" },
  { id: 6, terminalBasics: "some interest", gitWorkflows: "some interest", sshBestPractices: "interested", openShiftDeployment: "interested", vimEditor: "Most interested", apiAuthentication: "interested", cpdCli: "interested", agenticTools: "interested", additionalComments: "" },
  { id: 7, terminalBasics: "Most interested", gitWorkflows: "Most interested", sshBestPractices: "Most interested", openShiftDeployment: "Most interested", vimEditor: "interested", apiAuthentication: "Most interested", cpdCli: "interested", agenticTools: "Most interested", additionalComments: "" },
  { id: 8, terminalBasics: "Most interested", gitWorkflows: "interested", sshBestPractices: "interested", openShiftDeployment: "Most interested", vimEditor: "Most interested", apiAuthentication: "some interest", cpdCli: "some interest", agenticTools: "some interest", additionalComments: "" },
  { id: 9, terminalBasics: "some interest", gitWorkflows: "some interest", sshBestPractices: "Most interested", openShiftDeployment: "some interest", vimEditor: "Most interested", apiAuthentication: "some interest", cpdCli: "some interest", agenticTools: "Most interested", additionalComments: "General best practices for getting a demo environment deployed for a customer engagement and ensuring that it's available long enough. The 4 day window and limits on extending environments make it reallly challenging when you have an early week meeting since you have to deploy/test over the weekened." },
  { id: 10, terminalBasics: "not interested", gitWorkflows: "not interested", sshBestPractices: "interested", openShiftDeployment: "some interest", vimEditor: "not interested", apiAuthentication: "interested", cpdCli: "some interest", agenticTools: "some interest", additionalComments: "" },
  { id: 11, terminalBasics: "interested", gitWorkflows: "some interest", sshBestPractices: "Most interested", openShiftDeployment: "interested", vimEditor: "Most interested", apiAuthentication: "some interest", cpdCli: "interested", agenticTools: "Most interested", additionalComments: "" },
  { id: 12, terminalBasics: "interested", gitWorkflows: "interested", sshBestPractices: "interested", openShiftDeployment: "interested", vimEditor: "interested", apiAuthentication: "interested", cpdCli: "interested", agenticTools: "interested", additionalComments: "" },
  { id: 13, terminalBasics: "Most interested", gitWorkflows: "Most interested", sshBestPractices: "Most interested", openShiftDeployment: "some interest", vimEditor: "some interest", apiAuthentication: "Most interested", cpdCli: "Most interested", agenticTools: "Most interested", additionalComments: "" },
  { id: 14, terminalBasics: "", gitWorkflows: "interested", sshBestPractices: "", openShiftDeployment: "", vimEditor: "Most interested", apiAuthentication: "Most interested", cpdCli: "Most interested", agenticTools: "", additionalComments: "" },
  { id: 15, terminalBasics: "interested", gitWorkflows: "interested", sshBestPractices: "Most interested", openShiftDeployment: "interested", vimEditor: "interested", apiAuthentication: "interested", cpdCli: "interested", agenticTools: "interested", additionalComments: "" },
  { id: 16, terminalBasics: "Most interested", gitWorkflows: "interested", sshBestPractices: "some interest", openShiftDeployment: "interested", vimEditor: "Most interested", apiAuthentication: "interested", cpdCli: "interested", agenticTools: "some interest", additionalComments: "" },
  { id: 17, terminalBasics: "interested", gitWorkflows: "interested", sshBestPractices: "Most interested", openShiftDeployment: "Most interested", vimEditor: "interested", apiAuthentication: "interested", cpdCli: "interested", agenticTools: "interested", additionalComments: "" },
  { id: 18, terminalBasics: "some interest", gitWorkflows: "some interest", sshBestPractices: "Most interested", openShiftDeployment: "interested", vimEditor: "interested", apiAuthentication: "some interest", cpdCli: "interested", agenticTools: "some interest", additionalComments: "" },
  { id: 19, terminalBasics: "not interested", gitWorkflows: "interested", sshBestPractices: "interested", openShiftDeployment: "", vimEditor: "some interest", apiAuthentication: "Most interested", cpdCli: "Most interested", agenticTools: "Most interested", additionalComments: "" }
];

export const topics = [
  { key: "terminalBasics", label: "Terminal Basics" },
  { key: "gitWorkflows", label: "Git Workflows" },
  { key: "sshBestPractices", label: "SSH Best Practices" },
  { key: "openShiftDeployment", label: "OpenShift Deployment" },
  { key: "vimEditor", label: "Vim Editor" },
  { key: "apiAuthentication", label: "API Authentication" },
  { key: "cpdCli", label: "CPD CLI" },
  { key: "agenticTools", label: "Agentic Tools" }
];

// Helper function to calculate interest levels
export const calculateInterestLevels = () => {
  const interestLevels = {
    "Most interested": 3,
    "interested": 2,
    "some interest": 1,
    "not interested": 0,
    "": 0
  };

  const results = topics.map(topic => {
    const counts = {
      "Most interested": 0,
      "interested": 0,
      "some interest": 0,
      "not interested": 0,
      "no response": 0
    };

    let totalScore = 0;
    let validResponses = 0;

    surveyResponses.forEach(response => {
      const value = response[topic.key as keyof SurveyResponse] as string;
      if (value === "") {
        counts["no response"]++;
      } else {
        counts[value as keyof typeof counts]++;
        totalScore += interestLevels[value as keyof typeof interestLevels];
        validResponses++;
      }
    });

    return {
      topic: topic.label,
      counts,
      averageScore: validResponses > 0 ? (totalScore / validResponses).toFixed(2) : "0",
      totalResponses: surveyResponses.length,
      validResponses
    };
  });

  return results;
};

// Made with Bob
