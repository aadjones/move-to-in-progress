// Stage 1: Initial acceptance criteria (look innocent)
export const acceptanceCriteria = [
  { title: "Update notification types", status: "Needs approval from PM (Sarah on PTO)" },
  { title: "Migrate legacy handlers", status: "Documentation link returns 404" },
  { title: "Update test coverage", status: "CI pipeline is down" },
];

// Stage 3+: Subtasks that spawn when trying to "resolve" blockers
export const subtaskTemplates = [
  { title: "Find Sarah's backup contact", status: "Team directory access denied" },
  { title: "Locate documentation in Confluence", status: "Confluence search is broken" },
  { title: "Check CI pipeline status", status: "DevOps team is in offsite" },
  { title: "Contact IT about permissions", status: "IT ticket system is down" },
  { title: "Ask in #engineering Slack", status: "Thread has 847 unread messages" },
  { title: "Review onboarding docs", status: "Last updated 3 years ago" },
  { title: "Schedule meeting with Steve", status: "Steve has left the company" },
  { title: "Check legacy codebase", status: "Repository was archived" },
  { title: "Verify with QA team", status: "QA environment is stale" },
  { title: "Update Jira ticket", status: "Jira is in read-only mode" },
  { title: "Get design approval", status: "Designer is on parental leave" },
  { title: "Run local tests", status: "Tests are flaky" },
  { title: "Deploy to staging", status: "Staging is prod" },
  { title: "Review security checklist", status: "Checklist link is 404" },
  { title: "Merge dependency updates", status: "273 merge conflicts" },
];

export const titleMutations: Record<string, string[]> = {
  // Acceptance criteria mutations
  "Update notification types": ["Update types", "Update", "???"],
  "Migrate legacy handlers": ["Migrate handlers", "Migrate", "???"],
  "Update test coverage": ["Update tests", "Update", "???"],

  // Subtask mutations
  "Find Sarah's backup contact": ["Find backup", "Find Sarah", "Find", "???"],
  "Locate documentation in Confluence": ["Locate docs", "Locate", "???"],
  "Check CI pipeline status": ["Check CI", "Check", "???"],
  "Contact IT about permissions": ["Contact IT", "Contact", "???"],
  "Schedule meeting with Steve": ["Schedule Steve", "Steve", "???"],
};

export const toastMessages = [
  "Just checking in on this 😅",
  "Can we get eyes on this today?",
  "Adding legal for visibility",
  "Quick question about the status",
  "Any updates on this?",
  "When can we expect this to be done?",
  "Bumping this thread",
  "cc @team for awareness",
  "Is this still on your radar?",
  "Friendly reminder!",
];
