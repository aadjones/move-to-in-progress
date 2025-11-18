export interface TaskComment {
  author: string; // key from characters
  text: string;
  timestamp: string;
  isAuto?: boolean; // Auto-generated during chaos
}

export interface TaskContent {
  title: string;
  description: string;
  descriptionMutations?: string[]; // Progressive corruption
  initialComments: TaskComment[];
  linkedIssues?: string[];
}

// Main task content
export const mainTaskContent: TaskContent = {
  title: 'Refactor Notifications System',
  description: `Refactor the push notification service to support real-time delivery requirements from the Q3 roadmap. Should be straightforward—the architecture is already documented.

Estimated: 3 story points
Sprint goal: Complete before Friday standup

**Priority:** High
**Target Sprint:** Sprint 14`,

  descriptionMutations: [
    // Stage 5: Slight corruption
    `Update our notification system to support the new real-time requirements discussed in Q3 planning. This will improve user engagement and reduce notification latency.

See Confluence documentation for full technical specifications and architecture diagrams.

**Priority:** URGENT
**Target Sprint:** Q4 Sprint 3 Q4 Sprint 3`,

    // Stage 6: Getting weird
    `Update our notification system to support the new real-time requirements discussed in Q3 planning Q2 planning Q1 planning. This will improve user engagement and reduce notification latency and increase latency.

See Confluence documentation for full ERROR 404 NOT FOUND

**Priority:** CRITICAL URGENT HIGH
**Target Sprint:** YESTERDAY`,

    // Stage 7: Full corruption
    `U̸P̷D̶A̵T̸E̷ ̵N̴O̷T̸I̵F̶I̸C̷A̶T̴I̷O̸N̸S̶ ̴S̸Y̵S̶T̸E̴M̷

COMPLETE THE TASK COMPLETE THE TASK COMPLETE THE TASK

**Priority:** ∞
**Target Sprint:** N̶O̸W̷ ̵N̸O̶W̴ ̶N̸O̷W̸`,
  ],

  initialComments: [
    {
      author: 'sarah',
      text: 'This is high priority for the Q4 roadmap. Let me know if you need any clarification on requirements.',
      timestamp: '3 days ago',
    },
    {
      author: 'jerry',
      text: 'Happy to help unblock this. The architecture doc is here: https://confluence.company.com/notifications-v2',
      timestamp: '3 days ago',
    },
    {
      author: 'chad',
      text: 'FYI the old notification queue is being deprecated next month, so this is time-sensitive.',
      timestamp: '2 days ago',
    },
  ],

  linkedIssues: ['PROJ-1847', 'PROJ-1923', 'PROJ-2156'],
};

// Acceptance criteria content
export const acceptanceCriteriaContent: Record<string, TaskContent> = {
  'Update notification types': {
    title: 'Update notification types',
    description: `Extend the notification type system to support the new categories:
- Real-time alerts
- Digest notifications
- System notifications
- Marketing notifications (requires legal approval)

This requires updating the NotificationService interface and all implementing classes.`,

    descriptionMutations: [
      `Extend the notification type system to support the new categories:
- Real-time alerts
- Digest notifications
- System notifications
- Marketing notifications (requires legal approval legal approval legal approval)

This requires updating the NotificationService interface and all implementing classes and deleting classes.`,

      `E̸X̷T̸E̵N̷D̶ ̴T̸H̸E̷ ̵N̶O̴T̷I̸F̷I̸C̶A̸T̴I̷O̸N̶ ̸T̴Y̷P̶E̸ ̵S̶Y̷S̸T̵E̶M̴

ALL TYPES ALL TYPES ALL TYPES
INFINITE NOTIFICATIONS

R̶E̸Q̷U̸I̶R̸E̷S̴ ̵U̶P̸D̵A̷T̶I̸N̴G̷ ̶E̸V̸E̴R̶Y̷T̸H̵I̷N̴G̸`,
    ],

    initialComments: [
      {
        author: 'sarah',
        text: 'Needs approval from PM (Sarah on PTO)',
        timestamp: '2 days ago',
      },
      {
        author: 'legal',
        text: 'Adding legal for compliance review. Marketing notifications need GDPR assessment.',
        timestamp: '2 days ago',
      },
      {
        author: 'priya',
        text: 'What do these look like in the UI? Do we have designs?',
        timestamp: '1 day ago',
      },
    ],
  },

  'Migrate legacy handlers': {
    title: 'Migrate legacy handlers',
    description: `Migrate all legacy notification handlers from the old queue system to the new event-driven architecture.

Reference the migration guide in Confluence:
https://confluence.company.com/notification-migration

**Estimated effort:** 5 story points
**Risk:** Medium - legacy code has poor test coverage`,

    descriptionMutations: [
      `Migrate all legacy notification handlers from the old queue system to the new event-driven architecture to the old system.

Reference the migration guide in Confluence:
https://confluence.company.com/ERROR_404_NOT_FOUND

**Estimated effort:** 13 story points 21 story points
**Risk:** HIGH CRITICAL`,

      `M̶I̷G̸R̵A̸T̷E̴ ̵E̸V̶E̴R̷Y̸T̶H̸I̷N̴G̷

LEGACY HANDLERS CANNOT BE FOUND
QUEUE SYSTEM DOES NOT EXIST
CONFLUENCE IS A LIE

**Estimated effort:** ∞
**Risk:** C̶A̴T̷A̸S̵T̶R̷O̸P̷H̸I̶C̴`,
    ],

    initialComments: [
      {
        author: 'steve',
        text: 'I wrote the original implementation. Happy to answer questions if needed.',
        timestamp: '5 days ago',
      },
      {
        author: 'chad',
        text: 'Steve left the company last week, but the code should be self-documenting.',
        timestamp: '4 days ago',
      },
      {
        author: 'jerry',
        text: 'The Confluence link returns 404 for me. Does anyone have the doc?',
        timestamp: '3 days ago',
      },
    ],
  },

  'Update test coverage': {
    title: 'Update test coverage',
    description: `Add comprehensive test coverage for the new notification system:

- Unit tests for NotificationService
- Integration tests for queue handlers
- E2E tests for notification delivery
- Performance tests for high-volume scenarios

Target: 85% code coverage

CI pipeline must pass before merge.`,

    descriptionMutations: [
      `Add comprehensive test coverage for the new notification system:

- Unit tests for NotificationService
- Integration tests for queue handlers
- E2E tests for notification delivery
- Performance tests for high-volume scenarios
- Tests for the tests

Target: 85% code coverage 95% coverage 100% coverage

CI pipeline must pass before merge. CI is down. CI does not exist.`,

      `A̸D̶D̷ ̴T̷E̴S̸T̵S̶ ̶F̸O̸R̴ ̶E̴V̷E̸R̴Y̷T̵H̶I̴N̸G̶

INFINITE TESTS
TEST THE TESTS
TEST THE TEST TESTS
TESTS ALL THE WAY DOWN

Target: ∞% coverage

T̸H̸E̵ ̶C̸I̸ ̴P̴I̶P̷E̶L̸I̸N̷E̴ ̸I̶S̷ ̵A̸ ̷L̸I̶E̸`,
    ],

    initialComments: [
      {
        author: 'jerry',
        text: 'Great idea to prioritize test coverage. This will give us confidence in the refactor.',
        timestamp: '2 days ago',
      },
      {
        author: 'chad',
        text: 'The CI pipeline is down again. DevOps is looking into it.',
        timestamp: '1 day ago',
      },
      {
        author: 'bot',
        text: 'CI Status: ❌ Failed - Pipeline configuration error',
        timestamp: '18 hours ago',
        isAuto: true,
      },
    ],
  },
};

// Subtask content templates
export const subtaskContent: Record<string, TaskContent> = {
  "Find Sarah's backup contact": {
    title: "Find Sarah's backup contact",
    description: `Sarah (PM) is on PTO until next week. Need to find her backup contact to get approval on the marketing notification requirements.

Check the team directory or ask Jerry.`,
    descriptionMutations: [
      `Sarah is on PTO until next week next month next year forever.

Check the team directory (access denied) or ask Jerry (Jerry is unavailable).`,

      `S̶A̸R̷A̸H̴ ̵I̶S̷ ̴G̷O̸N̵E̶

FIND HER FIND HER FIND HER
THE DIRECTORY LIES
JERRY CANNOT HELP YOU`,
    ],
    initialComments: [
      {
        author: 'jerry',
        text: 'I can help with this, but I need to check with Sarah first.',
        timestamp: '1 day ago',
      },
    ],
  },

  "Locate documentation in Confluence": {
    title: "Locate documentation in Confluence",
    description: `The migration guide link returns 404. Try searching Confluence for "notification migration" or check with the team who wrote it originally.

Steve might have written it.`,
    descriptionMutations: [
      `The migration guide link returns 404 403 500 ERROR.

Search Confluence (Confluence is down) or check with Steve (Steve does not exist).`,

      `T̷H̸E̴ ̶D̸O̵C̸U̴M̷E̶N̸T̶A̵T̷I̴O̷N̶ ̵I̶S̸ ̴L̴O̶S̷T̸

STEVE STEVE STEVE STEVE
HE LEFT HE LEFT HE LEFT
THE KNOWLEDGE IS GONE`,
    ],
    initialComments: [],
  },

  "Check CI pipeline status": {
    title: "Check CI pipeline status",
    description: `The CI pipeline has been failing intermittently. Check the DevOps Slack channel for updates or create a ticket.

Tests need to pass before we can proceed.`,
    descriptionMutations: [
      `The CI pipeline has been failing constantly always forever.

DevOps is in an offsite (offsite never ends).

Tests cannot pass. Tests will never pass.`,

      `C̵I̸ ̴P̶I̸P̶E̷L̶I̸N̴E̷ ̵S̵T̷A̶T̸U̶S̴:̵ ̶D̸E̴A̷D̸

TESTS FAIL FOREVER
DEVOPS CANNOT SAVE YOU
THE PIPELINE IS A PRISON`,
    ],
    initialComments: [
      {
        author: 'bot',
        text: 'CI Status: ❌ Failed - 247 tests failing',
        timestamp: '3 hours ago',
        isAuto: true,
      },
    ],
  },

  "Contact IT about permissions": {
    title: "Contact IT about permissions",
    description: `You don't have access to the team directory. Submit an IT ticket to request access.

Ticket system: https://it.company.com/tickets`,
    descriptionMutations: [
      `You don't have access to the team directory or anything else.

Ticket system: ERROR 503 SERVICE UNAVAILABLE

IT is not responding.`,

      `Y̴O̸U̶ ̵H̷A̶V̸E̵ ̶N̷O̷ ̸P̴E̷R̶M̶I̵S̴S̸I̷O̴N̶S̸

IT CANNOT HELP
THE SYSTEM REJECTS YOU
ACCESS DENIED FOREVER`,
    ],
    initialComments: [],
  },

  "Ask in #engineering Slack": {
    title: "Ask in #engineering Slack",
    description: `Post a message in the #engineering Slack channel asking if anyone knows where the migration docs are.

Channel: #engineering`,
    descriptionMutations: [
      `Post a message in #engineering (847 unread messages) (2,394 unread messages).

No one is responding. Everyone is busy.`,

      `#̶E̸N̴G̷I̶N̴E̷E̵R̶I̷N̸G̴ ̵I̶S̶ ̴C̴H̸A̶O̸S̷

INFINITE MESSAGES
NO ANSWERS
ONLY NOISE`,
    ],
    initialComments: [],
  },

  "Review onboarding docs": {
    title: "Review onboarding docs",
    description: `Check the onboarding documentation for information about the notification system architecture and team contacts.

Location: https://wiki.company.com/onboarding`,
    descriptionMutations: [
      `Check the onboarding documentation (last updated 3 years ago) (links are broken).

Location: https://wiki.company.com/404`,

      `O̸N̷B̴O̶A̸R̵D̶I̸N̴G̷ ̵D̶O̸C̴S̷ ̴A̸R̵E̷ ̶A̸N̸C̶I̷E̵N̸T̴

KNOWLEDGE HAS DECAYED
NOTHING IS DOCUMENTED
THE PAST IS LOST`,
    ],
    initialComments: [
      {
        author: 'chad',
        text: 'These docs are super outdated. Half the team members listed don\'t work here anymore.',
        timestamp: '2 weeks ago',
      },
    ],
  },

  "Schedule meeting with Steve": {
    title: "Schedule meeting with Steve",
    description: `Steve was the tech lead on the original notification system. Schedule a meeting to get context on the architecture.

Calendar: steve.wilson@company.com`,
    descriptionMutations: [
      `Steve was the tech lead (Steve has left the company).

Calendar: steve.wilson@company.com (account deactivated)`,

      `S̶T̸E̵V̷E̴ ̶I̸S̷ ̵G̴O̶N̵E̸

THE KNOWLEDGE WALKED OUT THE DOOR
NO ONE KNOWS HOW IT WORKS
STEVE STEVE STEVE`,
    ],
    initialComments: [
      {
        author: 'jerry',
        text: 'Steve left last week for a startup. His exit interview notes might be in HR docs?',
        timestamp: '4 days ago',
      },
    ],
  },

  "Check legacy codebase": {
    title: "Check legacy codebase",
    description: `Review the legacy notification handlers in the old repository to understand the migration requirements.

Repository: https://github.com/company/legacy-notifications`,
    descriptionMutations: [
      `Review the legacy codebase (repository was archived 6 months ago) (no README).

Repository: https://github.com/company/ARCHIVED`,

      `L̷E̸G̶A̴C̸Y̵ ̶C̵O̷D̸E̶ ̸I̴S̶ ̵F̴O̶R̵G̷O̵T̶T̸E̶N̸

NO COMMENTS
NO DOCUMENTATION
ONLY MYSTERIES`,
    ],
    initialComments: [
      {
        author: 'steve',
        text: 'The old repo has some quirks. DM me if you hit any issues.',
        timestamp: '2 weeks ago',
      },
    ],
  },

  "Verify with QA team": {
    title: "Verify with QA team",
    description: `Check with QA to understand the test environment setup and get access credentials.

Contact: qa-team@company.com`,
    descriptionMutations: [
      `Check with QA (QA environment hasn't been updated in 8 months) (credentials expired).

Contact: qa-team@company.com (mailbox full)`,

      `Q̶A̸ ̵E̴N̵V̷I̶R̸O̵N̷M̴E̶N̸T̷ ̸I̴S̶ ̵D̷E̴A̸D̸

TESTS MEAN NOTHING
STAGING IS A LIE
PRODUCTION IS THE ONLY TRUTH`,
    ],
    initialComments: [
      {
        author: 'bot',
        text: 'QA Environment Status: ⚠️ Stale - Last deployment: 247 days ago',
        timestamp: '1 day ago',
        isAuto: true,
      },
    ],
  },

  "Update Jira ticket": {
    title: "Update Jira ticket",
    description: `Update the Jira ticket with current progress and blockers so stakeholders have visibility.

Ticket: PROJ-2847`,
    descriptionMutations: [
      `Update the Jira ticket (Jira is in read-only mode during migration) (migration has no ETA).

Ticket: PROJ-2847 (or was it PROJ-2748?)`,

      `J̵I̷R̸A̴ ̶I̸S̵ ̴A̷ ̶P̸R̶I̸S̴O̷N̸

TICKETS MULTIPLY FOREVER
PROGRESS CANNOT BE TRACKED
THE BACKLOG CONSUMES ALL`,
    ],
    initialComments: [
      {
        author: 'sarah',
        text: 'Please keep this ticket updated so I can report to leadership.',
        timestamp: '3 days ago',
      },
    ],
  },

  "Get design approval": {
    title: "Get design approval",
    description: `Get design team approval for the notification UI changes before implementation.

Designer: Priya Kapoor
Figma: https://figma.com/notifications-redesign`,
    descriptionMutations: [
      `Get design approval (Priya is on parental leave for 3 months) (design system changed yesterday).

Figma: https://figma.com/404`,

      `D̶E̵S̷I̸G̵N̴ ̵A̸P̶P̴R̸O̶V̶A̵L̷ ̴I̶S̷ ̵I̸M̶P̷O̴S̶S̵I̴B̸L̶E̸

THE MOCKUPS CONTRADICT THEMSELVES
BRAND GUIDELINES CHANGE DAILY
DESIGN IS CHAOS`,
    ],
    initialComments: [
      {
        author: 'priya',
        text: 'OOO: On parental leave until March. For urgent requests, contact the design team lead.',
        timestamp: '1 week ago',
      },
    ],
  },

  "Run local tests": {
    title: "Run local tests",
    description: `Run the test suite locally to verify your changes before pushing.

Command: npm test`,
    descriptionMutations: [
      `Run tests locally (tests are flaky) (12 tests pass, 8 fail, 4 timeout randomly).

Command: npm test (maybe try npm test -- --force?)`,

      `T̸E̴S̷T̶S̸ ̵A̵R̶E̷ ̶F̴L̷A̸K̴Y̵

PASSING BECOMES FAILING
FAILING BECOMES PASSING
REALITY IS UNSTABLE`,
    ],
    initialComments: [
      {
        author: 'chad',
        text: 'The tests pass on my machine 🤷',
        timestamp: '2 days ago',
      },
    ],
  },

  "Deploy to staging": {
    title: "Deploy to staging",
    description: `Deploy the changes to the staging environment to test in a production-like setting.

Deployment: Run ./scripts/deploy-staging.sh`,
    descriptionMutations: [
      `Deploy to staging (staging environment uses production database) (no rollback plan).

Deployment: ./scripts/deploy-staging.sh (script missing sudo permissions)`,

      `S̷T̶A̴G̸I̵N̸G̶ ̵I̴S̷ ̶P̸R̴O̷D̸

THERE IS NO SAFETY NET
DEPLOY MEANS DISASTER
ROLLBACK IS IMPOSSIBLE`,
    ],
    initialComments: [
      {
        author: 'jerry',
        text: 'Heads up: staging accidentally points to prod DB. Deploy with caution.',
        timestamp: '1 week ago',
      },
      {
        author: 'chad',
        text: 'We\'ve been meaning to fix that for months...',
        timestamp: '1 week ago',
      },
    ],
  },

  "Review security checklist": {
    title: "Review security checklist",
    description: `Complete the security checklist before deploying notification changes.

Checklist: https://wiki.company.com/security/checklist`,
    descriptionMutations: [
      `Complete security checklist (link returns 404) (InfoSec team dissolved last quarter).

Checklist: https://wiki.company.com/security/MISSING`,

      `S̸E̶C̷U̸R̶I̵T̴Y̸ ̶I̷S̴ ̵A̶N̸ ̴I̶L̸L̷U̵S̶I̴O̸N̷

THE CHECKLIST PROTECTS NOTHING
VULNERABILITIES ARE INFINITE
HOPE IS NOT A STRATEGY`,
    ],
    initialComments: [
      {
        author: 'legal',
        text: 'Please ensure all security requirements are met before launch.',
        timestamp: '5 days ago',
      },
    ],
  },

  "Merge dependency updates": {
    title: "Merge dependency updates",
    description: `Merge the dependency updates from Dependabot to fix security vulnerabilities.

PR: #2891 - Update @notifications/core to v4.2.1`,
    descriptionMutations: [
      `Merge dependency updates (273 merge conflicts) (breaking changes in v4.0.0).

PR: #2891 - Update @notifications/core to v4.2.1 (or v5.0.0?) (changelog missing)`,

      `D̷E̶P̷E̸N̴D̷E̵N̸C̵I̷E̶S̶ ̸A̴R̶E̵ ̶C̸U̵R̷S̶E̴D̸

EVERY UPDATE BREAKS EVERYTHING
MERGE CONFLICTS SPAWN INFINITELY
THE PACKAGE TREE IS CORRUPTED`,
    ],
    initialComments: [
      {
        author: 'bot',
        text: '⚠️ Security Alert: 14 vulnerabilities found in dependencies',
        timestamp: '2 days ago',
        isAuto: true,
      },
      {
        author: 'chad',
        text: 'I tried merging this. Good luck.',
        timestamp: '1 day ago',
      },
    ],
  },
};
