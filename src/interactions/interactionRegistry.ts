/**
 * Interaction Registry
 *
 * Maps task archetypes + depth to appropriate interaction types.
 * This is where we define what "mini-game" the user plays for each task.
 */

import type { InteractionType } from './types';
import type { TaskArchetype, DepthLevel } from '../taskGraph/types';

/**
 * Random checkbox acknowledgment sets for variety
 */
const checkboxVariations = [
  [
    'I understand the importance of this training',
    'I will apply these learnings to my daily work',
    'I acknowledge that completion of this training is mandatory',
  ],
  [
    'I acknowledge receipt of this acknowledgment',
    'I confirm my understanding of my confirmation',
    'I attest to having attested to the above',
  ],
  [
    'I have reviewed the materials I was required to review',
    'I understand that understanding is required',
    'I will remember to remember these requirements',
    'I acknowledge the necessity of this acknowledgment',
  ],
  [
    'I certify my certification of the above',
    'I validate this validation process',
    'I approve of needing approval for this',
  ],
  [
    'I recognize that I must recognize these policies',
    'I consent to consenting to these terms',
    'I agree to the agreement above',
  ],
  [
    'I have been informed that I am now informed',
    'I understand this is for compliance with compliance requirements',
    'I accept the acceptance criteria outlined',
  ],
];

/**
 * Random typing prompt variations
 */
const typingPromptVariations = [
  {
    prompt: 'Type "I agree" to acknowledge',
    expected: 'I agree',
  },
  {
    prompt: 'Type "I acknowledge and accept all terms and conditions without reservation" exactly as shown',
    expected: 'I acknowledge and accept all terms and conditions without reservation',
  },
  {
    prompt: 'Type "I understand that failure to comply may result in immediate consequences"',
    expected: 'I understand that failure to comply may result in immediate consequences',
  },
  {
    prompt: 'Type "I have read and agree to the terms of service, privacy policy, and acceptable use policy"',
    expected: 'I have read and agree to the terms of service, privacy policy, and acceptable use policy',
  },
  {
    prompt: 'Type "I certify under penalty of policy violation that the above is true and correct"',
    expected: 'I certify under penalty of policy violation that the above is true and correct',
  },
];

/**
 * Get random checkbox set
 */
function randomCheckboxSet(): string[] {
  return checkboxVariations[Math.floor(Math.random() * checkboxVariations.length)];
}

/**
 * Get random typing prompt
 */
function randomTypingPrompt() {
  return typingPromptVariations[Math.floor(Math.random() * typingPromptVariations.length)];
}

/**
 * Corporate jargon generator for documents
 */
function generateCorpJargon(paragraphs: number): string[] {
  const jargonSentences = [
    'In alignment with our strategic initiatives, we must synergize cross-functional deliverables.',
    'This paradigm shift requires stakeholder buy-in at all levels of the organization.',
    'We need to circle back and touch base regarding the action items discussed.',
    'Moving forward, let\'s leverage our core competencies to drive value-added solutions.',
    'It is imperative that we drill down into the granular details while maintaining a holistic view.',
    'Per our previous communications, we must ensure bandwidth for these critical path activities.',
    'The low-hanging fruit presents an opportunity to demonstrate quick wins for leadership visibility.',
    'We should ideate around best practices to optimize our workflow efficiency metrics.',
    'This initiative will sunset legacy processes and onboard next-generation methodologies.',
    'Let\'s parking lot any concerns and focus on the key performance indicators going forward.',
    'We need to socialize this proposal across all business units before the next sprint cycle.',
    'This represents a moonshot opportunity to disrupt the market with innovative thinking.',
    'Please cascade this information down through your reporting chains accordingly.',
    'We must remain agile and pivot our strategy based on real-time data insights.',
    'The optics of this decision require careful consideration from a change management perspective.',
  ];

  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    // Generate paragraph with 3-5 sentences
    const sentenceCount = 3 + Math.floor(Math.random() * 3);
    const paragraph: string[] = [];
    for (let j = 0; j < sentenceCount; j++) {
      paragraph.push(jargonSentences[Math.floor(Math.random() * jargonSentences.length)]);
    }
    result.push(paragraph.join(' '));
  }

  return result;
}

/**
 * Get interaction for a training archetype
 */
function getTrainingInteraction(depth: DepthLevel): InteractionType {
  if (depth <= 2) {
    // Early game: video, checkboxes, or typing prompt
    const rand = Math.random();
    if (rand > 0.66) {
      return {
        type: 'video',
        title: 'Corporate Training Module',
        duration: 5 + depth * 2, // 5-9 seconds
        skippable: false,
      };
    } else if (rand > 0.33) {
      return {
        type: 'checkboxes',
        title: 'Training Acknowledgment',
        items: randomCheckboxSet(),
        allRequired: true,
      };
    } else {
      const promptVariation = randomTypingPrompt();
      return {
        type: 'typing-prompt',
        prompt: promptVariation.prompt,
        expected: promptVariation.expected,
        caseSensitive: true,
      };
    }
  } else if (depth <= 5) {
    // Mid game: videos, scroll documents, or typing prompts
    const rand = Math.random();
    if (rand > 0.66) {
      return {
        type: 'video',
        title: 'Advanced Training Module',
        duration: 10 + depth * 3, // 13-25 seconds
        skippable: false,
      };
    } else if (rand > 0.33) {
      return {
        type: 'scroll-document',
        title: 'Training Materials v' + (depth + 1) + '.0',
        pages: depth,
        content: generateCorpJargon(depth * 2),
        requireScrollToBottom: true,
      };
    } else {
      const promptVariation = randomTypingPrompt();
      return {
        type: 'typing-prompt',
        prompt: promptVariation.prompt,
        expected: promptVariation.expected,
        caseSensitive: true,
      };
    }
  } else {
    // Late game: multi-step hell
    const promptVariation = randomTypingPrompt();
    return {
      type: 'multi-step',
      title: 'Comprehensive Training Certification Process',
      showStepIndicator: true,
      steps: [
        {
          type: 'video',
          title: 'Introduction to Advanced Training Concepts',
          duration: 15,
          skippable: false,
        },
        {
          type: 'scroll-document',
          title: 'Required Reading Materials',
          pages: 5,
          content: generateCorpJargon(10),
          requireScrollToBottom: true,
        },
        {
          type: 'checkboxes',
          title: 'Attestation of Understanding',
          items: randomCheckboxSet(),
          allRequired: true,
        },
        {
          type: 'typing-prompt',
          prompt: promptVariation.prompt,
          expected: promptVariation.expected,
          caseSensitive: true,
        },
      ],
    };
  }
}

/**
 * Get interaction for an approval request archetype
 */
function getApprovalRequestInteraction(depth: DepthLevel): InteractionType {
  if (depth <= 2) {
    // Mix between form and calendar for variety
    return Math.random() > 0.5
      ? {
          type: 'form',
          title: 'Approval Request Form',
          fields: [
            {
              id: 'employee_id',
              label: 'Employee ID',
              type: 'text',
              required: true,
              placeholder: 'Enter your employee ID',
            },
            {
              id: 'justification',
              label: 'Justification',
              type: 'textarea',
              required: true,
              minLength: 50,
              helperText: 'Please provide detailed justification (minimum 50 characters)',
            },
          ],
          submitText: 'Submit Request',
        }
      : {
          type: 'calendar-select',
          prompt: 'Select an available time slot for the approval meeting',
          required: true,
          slots: [
            'Monday 9:00 AM (Tentative - May conflict with standup)',
            'Tuesday 2:00 PM (Tentative - May be rescheduled)',
            'Wednesday 10:30 AM (Tentative - Pending approval)',
            'Thursday 3:00 PM (Tentative - Subject to change)',
          ],
        };
  } else if (depth <= 5) {
    return {
      type: 'form',
      title: 'Enhanced Approval Request Form',
      fields: [
        {
          id: 'employee_id',
          label: 'Employee ID',
          type: 'text',
          required: true,
        },
        {
          id: 'employee_number',
          label: 'Employee Number',
          type: 'text',
          required: true,
          helperText: 'Note: This is different from Employee ID',
        },
        {
          id: 'department',
          label: 'Department Code',
          type: 'select',
          required: true,
          options: ['ENG', 'PROD', 'OPS', 'ADMIN', 'OTHER'],
        },
        {
          id: 'manager_email',
          label: 'Manager Email Address',
          type: 'text',
          required: true,
        },
        {
          id: 'justification',
          label: 'Business Justification',
          type: 'textarea',
          required: true,
          minLength: 100,
          helperText: 'Minimum 100 characters required',
        },
        {
          id: 'impact',
          label: 'Impact Assessment',
          type: 'textarea',
          required: true,
          minLength: 50,
        },
      ],
      submitText: 'Submit for Approval',
      vagueValidation: true,
    };
  } else {
    return {
      type: 'dropdown-hierarchy',
      prompt: 'Select the appropriate approval chain',
      required: true,
      hierarchy: [
        {
          label: 'Division',
          options: ['North America', 'EMEA', 'APAC', 'LATAM'],
        },
        {
          label: 'Department',
          options: ['Engineering', 'Product', 'Operations', 'Sales', 'Marketing'],
        },
        {
          label: 'Sub-Department',
          options: ['Team A', 'Team B', 'Team C', 'Cross-Functional'],
        },
        {
          label: 'Approval Level',
          options: ['Manager', 'Director', 'VP', 'SVP', 'C-Level'],
        },
      ],
    };
  }
}

/**
 * Get interaction for a form submission archetype
 */
function getFormSubmissionInteraction(depth: DepthLevel): InteractionType {
  const baseFields = [
    {
      id: 'status',
      label: 'Current Status',
      type: 'select' as const,
      required: true,
      options: ['Not Started', 'In Progress', 'Blocked', 'Complete'],
    },
    {
      id: 'notes',
      label: 'Status Notes',
      type: 'textarea' as const,
      required: true,
      minLength: 30,
    },
  ];

  const redundantFields = [
    {
      id: 'staff_id',
      label: 'Staff ID',
      type: 'text' as const,
      required: true,
      helperText: 'Different from Employee ID and Employee Number',
    },
    {
      id: 'project_code',
      label: 'Project Code',
      type: 'text' as const,
      required: true,
    },
    {
      id: 'task_category',
      label: 'Task Category',
      type: 'select' as const,
      required: true,
      options: ['Administrative', 'Technical', 'Strategic', 'Operational'],
    },
  ];

  if (depth <= 2) {
    return {
      type: 'form',
      title: 'Status Update Form',
      fields: baseFields,
      submitText: 'Submit',
    };
  } else {
    return {
      type: 'form',
      title: 'Comprehensive Status Report Form',
      fields: [...baseFields, ...redundantFields.slice(0, depth - 2)],
      submitText: 'Submit Report',
      vagueValidation: depth > 4,
    };
  }
}

/**
 * Get interaction for documentation archetype
 */
function getDocumentationInteraction(depth: DepthLevel): InteractionType {
  if (depth <= 2) {
    return {
      type: 'scroll-document',
      title: 'Policy Update v' + (depth + 1) + '.0',
      pages: 2,
      content: generateCorpJargon(4),
      requireScrollToBottom: true,
    };
  } else {
    return {
      type: 'multi-step',
      title: 'Documentation Review Process',
      showStepIndicator: true,
      steps: [
        {
          type: 'scroll-document',
          title: 'Updated Documentation',
          pages: depth,
          content: generateCorpJargon(depth * 2),
          requireScrollToBottom: true,
        },
        {
          type: 'typing-prompt',
          ...randomTypingPrompt(),
          caseSensitive: true,
        },
      ],
    };
  }
}

/**
 * Get interaction for system access archetype
 */
function getSystemAccessInteraction(depth: DepthLevel): InteractionType {
  if (depth <= 2) {
    return {
      type: 'loading-delay',
      message: 'Authenticating...',
      duration: 3,
      showProgress: true,
    };
  } else if (depth <= 5) {
    return {
      type: 'multi-step',
      title: 'System Access Request',
      showStepIndicator: true,
      steps: [
        {
          type: 'form',
          title: 'Access Request Details',
          fields: [
            {
              id: 'username',
              label: 'Username',
              type: 'text',
              required: true,
            },
            {
              id: 'system',
              label: 'System Name',
              type: 'select',
              required: true,
              options: ['HRMS Portal', 'Project Tracker', 'Document Repository', 'Approval System'],
            },
          ],
        },
        {
          type: 'loading-delay',
          message: 'Processing access request...',
          duration: 5,
          showProgress: true,
        },
      ],
    };
  } else {
    return {
      type: 'loading-delay',
      message: 'System is currently experiencing high load. Please wait...',
      duration: 8 + depth,
      showProgress: false,
    };
  }
}

/**
 * Get interaction for meeting archetype
 */
function getMeetingInteraction(_depth: DepthLevel): InteractionType {
  return {
    type: 'calendar-select',
    prompt: 'Select an available time slot for the approval meeting',
    required: true,
    slots: [
      'Tuesday 2:00 PM (Tentative - May be rescheduled)',
      'Wednesday 10:30 AM (Tentative - Pending approval)',
      'Thursday 3:00 PM (Tentative - Subject to change)',
    ],
  };
}

/**
 * Get interaction for attestation archetype
 */
function getAttestationInteraction(depth: DepthLevel): InteractionType {
  if (depth <= 2) {
    const promptVariation = randomTypingPrompt();
    return {
      type: 'typing-prompt',
      prompt: promptVariation.prompt,
      expected: promptVariation.expected,
      caseSensitive: true,
    };
  } else if (depth <= 5) {
    return {
      type: 'checkboxes',
      title: 'Attestation Required',
      items: randomCheckboxSet(),
      allRequired: true,
    };
  } else {
    return {
      type: 'multi-step',
      title: 'Formal Attestation Process',
      showStepIndicator: true,
      steps: [
        {
          type: 'scroll-document',
          title: 'Policy Document',
          pages: 5,
          content: generateCorpJargon(10),
          requireScrollToBottom: true,
        },
        {
          type: 'checkboxes',
          title: 'Acknowledgment',
          items: randomCheckboxSet(),
          allRequired: true,
        },
        {
          type: 'typing-prompt',
          prompt: 'Type your full name to digitally sign',
          expected: 'John Doe', // TODO: Use actual user name
          caseSensitive: false,
          placeholder: 'Enter your full name',
        },
      ],
    };
  }
}

/**
 * Get interaction for compliance archetype
 */
function getComplianceInteraction(depth: DepthLevel): InteractionType {
  if (depth <= 2) {
    return {
      type: 'checkboxes',
      title: 'Compliance Verification',
      items: randomCheckboxSet(),
      allRequired: true,
    };
  } else {
    return {
      type: 'video',
      title: 'Mandatory Compliance Training',
      duration: 10 + depth * 2,
      skippable: false,
    };
  }
}

/**
 * Main registry function - maps archetype to interaction
 */
export function getInteractionForTask(
  archetype: TaskArchetype,
  depth: DepthLevel
): InteractionType {
  switch (archetype) {
    case 'training':
      return getTrainingInteraction(depth);

    case 'approval-request':
      return getApprovalRequestInteraction(depth);

    case 'form-submission':
      return getFormSubmissionInteraction(depth);

    case 'documentation':
      return getDocumentationInteraction(depth);

    case 'system-access':
      return getSystemAccessInteraction(depth);

    case 'meeting':
      return getMeetingInteraction(depth);

    case 'attestation':
      return getAttestationInteraction(depth);

    case 'compliance':
      return getComplianceInteraction(depth);

    default:
      // Fallback
      return {
        type: 'checkboxes',
        title: 'Acknowledge Task',
        items: randomCheckboxSet(),
        allRequired: true,
      };
  }
}
