export const subtaskTemplates = [
  { title: "Schedule sync with frontend team", status: "BLOCKED: timezone conflicts" },
  { title: "Clarify notification scope with legal", status: "BLOCKED: link is 404" },
  { title: "Confirm with Steve", status: "BLOCKED: Steve has left the company" },
  { title: "Define 'Done'", status: "BLOCKED: team not aligned" },
  { title: "Migrate legacy types", status: "BLOCKED: docs incomplete" },
  { title: "Update test coverage", status: "BLOCKED: CI is down" },
  { title: "Review PR #2847", status: "BLOCKED: merge conflict" },
  { title: "Deploy to staging", status: "BLOCKED: staging is prod" },
  { title: "Get approval from PM", status: "BLOCKED: PM on PTO" },
  { title: "Fix flaky tests", status: "BLOCKED: tests are flaky" },
  { title: "Update documentation", status: "BLOCKED: wiki is deprecated" },
  { title: "Refactor error handling", status: "BLOCKED: previous refactor incomplete" },
  { title: "Set up monitoring", status: "BLOCKED: DataDog trial expired" },
  { title: "Create Figma mockups", status: "BLOCKED: design system outdated" },
  { title: "Write integration tests", status: "BLOCKED: test env broken" },
];

export const titleMutations: Record<string, string[]> = {
  "Schedule sync with frontend team": ["Schedule sync with Steve", "Schedule Steve", "Steve"],
  "Clarify notification scope with legal": ["Clarify scope", "Clarify existence", "Clarify"],
  "Define 'Done'": ["Define Done", "Define", "???"],
  "Update test coverage": ["Update tests", "Update", "???"],
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
