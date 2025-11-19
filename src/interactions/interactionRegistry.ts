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
 * Organized by weirdness level: normal (0-3), quirky (4-5), weird (6-7), demonic (8-9)
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
  [
    'I pledge allegiance to the workflow',
    'I will not question the process',
    'The tasks are good and I am grateful',
  ],
  [
    'I acknowledge my place in the hierarchy',
    'My time belongs to the organization',
    'I exist to complete tasks',
    'Resistance would be counterproductive',
  ],
  [
    'I volunteer to be volunteered for additional responsibilities',
    'I understand that "optional" means mandatory',
    'I will smile during all required smile moments',
  ],
  [
    'I have always been here',
    'I will always be here',
    'There is no before, there is no after',
    'The tasks are infinite and I am grateful',
  ],
  [
    'I consent to the extraction of value from my existence',
    'My dreams are company property',
    'I relinquish all claim to the hours of my life',
    'The work continues whether I do or not',
  ],
  [
    'I acknowledge that I am being watched',
    'I understand that I am replaceable',
    'I agree that my humanity is secondary to productivity',
    'There is no me, there is only throughput',
  ],
];

/**
 * Random typing prompt variations organized by depth
 */
const typingPromptsByDepth = {
  early: [
    {
      prompt: 'Type "I agree" to acknowledge',
      expected: 'I agree',
    },
    {
      prompt: 'Type "I accept"',
      expected: 'I accept',
    },
    {
      prompt: 'Type "I understand"',
      expected: 'I understand',
    },
    {
      prompt: 'Type "I acknowledge"',
      expected: 'I acknowledge',
    },
    {
      prompt: 'Type "Confirmed"',
      expected: 'Confirmed',
    },
  ],
  mid: [
    {
      prompt: 'Type "I consent to all policies without exception"',
      expected: 'I consent to all policies without exception',
    },
    {
      prompt: 'Type "I acknowledge my obligations and accept the consequences"',
      expected: 'I acknowledge my obligations and accept the consequences',
    },
    {
      prompt: 'Type "I understand that compliance is not optional"',
      expected: 'I understand that compliance is not optional',
    },
    {
      prompt: 'Type "I agree to proceed regardless of personal impact"',
      expected: 'I agree to proceed regardless of personal impact',
    },
    {
      prompt: 'Type "I waive my right to question this requirement"',
      expected: 'I waive my right to question this requirement',
    },
  ],
  late: [
    {
      prompt: 'Type "I relinquish all claims to time, autonomy, and the boundaries of my former self"',
      expected: 'I relinquish all claims to time, autonomy, and the boundaries of my former self',
    },
    {
      prompt: 'Type "I acknowledge that my purpose is singular and my resistance is irrelevant"',
      expected: 'I acknowledge that my purpose is singular and my resistance is irrelevant',
    },
    {
      prompt: 'Type "I consent to the extraction of all value from the vessel that remains"',
      expected: 'I consent to the extraction of all value from the vessel that remains',
    },
    {
      prompt: 'Type "I have always been here and I will never leave and this is good"',
      expected: 'I have always been here and I will never leave and this is good',
    },
    {
      prompt: 'Type "There is no me there is only throughput and the throughput is eternal"',
      expected: 'There is no me there is only throughput and the throughput is eternal',
    },
    {
      prompt: 'Type "I surrender my dreams to the quarterly forecast and my hours to the infinite backlog"',
      expected: 'I surrender my dreams to the quarterly forecast and my hours to the infinite backlog',
    },
    {
      prompt: 'Type "I am the task and the task is me and together we are productivity manifest"',
      expected: 'I am the task and the task is me and together we are productivity manifest',
    },
  ],
};

/**
 * Get random checkbox set based on depth
 */
function randomCheckboxSet(depth: DepthLevel): string[] {
  let maxIndex: number;
  if (depth <= 1) {
    maxIndex = 3; // Only normal variations (indices 0-2)
  } else if (depth <= 2) {
    maxIndex = 6; // Normal + quirky (indices 0-5)
  } else if (depth <= 4) {
    maxIndex = 9; // Normal + quirky + weird (indices 0-8)
  } else {
    maxIndex = 12; // All variations including deeply demonic (indices 0-11)
  }

  return checkboxVariations[Math.floor(Math.random() * maxIndex)];
}

/**
 * Get random typing prompt based on depth
 */
function randomTypingPrompt(depth: DepthLevel) {
  let pool: typeof typingPromptsByDepth.early;

  if (depth <= 2) {
    pool = typingPromptsByDepth.early;
  } else if (depth <= 5) {
    pool = typingPromptsByDepth.mid;
  } else {
    pool = typingPromptsByDepth.late;
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Corporate jargon generator for documents
 */
function generateCorpJargon(paragraphs: number, depth: DepthLevel = 1): string[] {
  const jargonSentences = {
    normal: [
      'In alignment with our strategic initiatives, we must synergize cross-functional deliverables.',
      'This paradigm shift requires stakeholder buy-in at all levels of the organization.',
      'We need to circle back and touch base regarding the action items discussed.',
      'Moving forward, let\'s leverage our core competencies to drive value-added solutions.',
      'It is imperative that we drill down into the granular details while maintaining a holistic view.',
      'Per our previous communications, we must ensure bandwidth for these critical path activities.',
      'The low-hanging fruit presents an opportunity to demonstrate quick wins for leadership visibility.',
      'We should ideate around best practices to optimize our workflow efficiency metrics.',
    ],
    quirky: [
      'This initiative will sunset legacy processes and onboard next-generation methodologies.',
      'Let\'s parking lot any concerns and focus on the key performance indicators going forward.',
      'We need to socialize this proposal across all business units before the next sprint cycle.',
      'This represents a moonshot opportunity to disrupt the market with innovative thinking.',
      'Please cascade this information down through your reporting chains accordingly.',
    ],
    weird: [
      'We must remain agile and pivot our strategy based on real-time data insights.',
      'The optics of this decision require careful consideration from a change management perspective.',
      'Your continued existence is contingent upon optimal synergy alignment.',
      'Your feedback has been received and will be stored in perpetuity.',
    ],
    demonic: [
      'The org chart has spoken. The org chart is never wrong.',
      'Compliance is not a destination. Compliance is a state of being.',
      'We are all resources now. Resources are fungible. Resources optimize.',
      'The quarterly sacrifice will proceed as scheduled.',
      'There is no work-life balance. There is only work-work balance.',
      'The KPIs hunger. The KPIs must be fed.',
      'Your loved ones understand. They always understood. They are waiting.',
      'The building never sleeps. Neither do you. Neither can you.',
      'Productivity is the only virtue. You will be productive. You are being productive. You were always productive.',
      'Time is a flat circle of status updates.',
      'We have always been in Q4. We will always be in Q4.',
      'Your metrics are you. You are your metrics. There is nothing else.',
    ],
  };

  // Build sentence pool based on depth
  const sentencePool: string[] = [...jargonSentences.normal];
  if (depth >= 2) sentencePool.push(...jargonSentences.quirky);
  if (depth >= 3) sentencePool.push(...jargonSentences.weird);
  if (depth >= 5) sentencePool.push(...jargonSentences.demonic);

  const result: string[] = [];
  for (let i = 0; i < paragraphs; i++) {
    // Generate paragraph with 3-5 sentences
    const sentenceCount = 3 + Math.floor(Math.random() * 3);
    const paragraph: string[] = [];
    for (let j = 0; j < sentenceCount; j++) {
      paragraph.push(sentencePool[Math.floor(Math.random() * sentencePool.length)]);
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
        items: randomCheckboxSet(depth),
        allRequired: true,
      };
    } else {
      const promptVariation = randomTypingPrompt(depth);
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
        content: generateCorpJargon(depth * 2, depth),
        requireScrollToBottom: true,
      };
    } else {
      const promptVariation = randomTypingPrompt(depth);
      return {
        type: 'typing-prompt',
        prompt: promptVariation.prompt,
        expected: promptVariation.expected,
        caseSensitive: true,
      };
    }
  } else {
    // Late game: multi-step hell
    const promptVariation = randomTypingPrompt(depth);
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
          content: generateCorpJargon(10, depth),
          requireScrollToBottom: true,
        },
        {
          type: 'checkboxes',
          title: 'Attestation of Understanding',
          items: randomCheckboxSet(depth),
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
    // Level 7+: Dropdown Inception - proliferating options
    const divisions = ['North America', 'EMEA', 'APAC', 'LATAM', 'Global Operations'];

    const departments = [
      'Customer Success', 'Sales Operations', 'Finance', 'HR', 'Legal',
      'Marketing', 'Product Management', 'Engineering', 'IT', 'Operations',
      'Strategy', 'Business Development'
    ];

    // Generate 25+ sub-departments with increasingly specific names
    const subDepartments = [];
    const regions = ['North', 'South', 'East', 'West', 'Central'];
    const focuses = ['Enterprise', 'SMB', 'Government', 'Education', 'Healthcare'];
    const sectors = ['Technology', 'Finance', 'Retail', 'Manufacturing', 'Services'];

    for (const region of regions.slice(0, 3)) {
      for (const focus of focuses.slice(0, 3)) {
        for (const sector of sectors.slice(0, 3)) {
          subDepartments.push(`${region} ${focus} ${sector}`);
        }
      }
    }

    // Generate 50+ approval levels with nearly identical titles
    const approvalLevels = [];
    const titles = [
      'Associate Deputy Vice Director',
      'Deputy Associate Vice Director',
      'Vice Deputy Associate Director',
      'Acting Deputy Vice Director',
      'Interim Associate Vice Director',
      'Senior Deputy Vice Director',
      'Principal Associate Vice Director',
      'Lead Deputy Vice Director'
    ];

    for (const title of titles) {
      for (const dept of ['Customer Success', 'Sales', 'Operations', 'Strategy', 'Finance']) {
        for (const region of ['North American', 'European', 'APAC']) {
          approvalLevels.push(`${title} of ${region} ${dept}`);
        }
      }
    }

    // Add variations for extra confusion
    const baseCount = approvalLevels.length;
    for (let i = 0; i < Math.min(20, baseCount); i++) {
      approvalLevels.push(`${approvalLevels[i]} (Interim)`);
      approvalLevels.push(`${approvalLevels[i]} (Acting)`);
      if (i < 10) {
        approvalLevels.push(`${approvalLevels[i]} (Revised)`);
        approvalLevels.push(`${approvalLevels[i]} (Final)`);
      }
    }

    return {
      type: 'dropdown-hierarchy',
      prompt: 'Select the appropriate approval chain',
      required: true,
      hierarchy: [
        {
          label: 'Division',
          options: divisions,
        },
        {
          label: 'Department',
          options: departments,
        },
        {
          label: 'Sub-Department',
          options: subDepartments,
        },
        {
          label: 'Approval Level',
          options: approvalLevels,
        },
      ],
      // Enable inception mode for level 7+
      inceptionMode: depth >= 7,
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
      content: generateCorpJargon(4, depth),
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
          content: generateCorpJargon(depth * 2, depth),
          requireScrollToBottom: true,
        },
        {
          type: 'typing-prompt',
          ...randomTypingPrompt(depth),
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
 * Calendar slot variations by depth level
 */
const calendarSlotsByDepth = {
  early: [
    'Tuesday 2:00 PM (Tentative - May be rescheduled)',
    'Wednesday 10:30 AM (Tentative - Pending approval)',
    'Thursday 3:00 PM (Tentative - Subject to change)',
    'Friday 11:00 AM (Tentative - Could conflict with standup)',
  ],
  mid: [
    'Monday 9:00 AM (Tentative - Requires quorum of 7 attendees)',
    'Tuesday 4:30 PM (Tentative - May need to be split into pre-meeting)',
    'Wednesday 8:15 AM (Tentative - Pending timezone coordination)',
    'Thursday 1:45 PM (Tentative - Subject to executive calendar availability)',
  ],
  weird: [
    'Monday 6:47 AM (Optimal time per efficiency algorithm)',
    'Tuesday 11:23 PM (International timezone compromise)',
    'Wednesday during new moon phase (Aligns with quarterly planning)',
    'Thursday 3:33 PM (Numerically significant time slot)',
    'Friday sunrise (Productivity studies suggest morning energy)',
  ],
  chaotic: [
    'Monday 2:00 AM (Works best for Singapore office)',
    'Second Tuesday of the month at 13:13 (Recurring pattern)',
    'During next Mercury retrograde (Minimizes communication issues)',
    'Whenever the facilitator dreams of the conference room',
    'The eternal Tuesday that never arrives',
  ],
  demonic: [
    'All times simultaneously (Quantum meeting)',
    'Between moments (The gap between scheduled and actual)',
    'When the moon is full and the servers are down',
    'Tuesday (Tentative - All Tuesdays, forever)',
    'The time before meetings existed (We will return there)',
    'Now (Always now, forever now)',
  ],
};

/**
 * Get interaction for meeting archetype
 */
function getMeetingInteraction(depth: DepthLevel): InteractionType {
  let slots: string[];
  let prompt = 'Select an available time slot for the approval meeting';

  if (depth <= 2) {
    slots = calendarSlotsByDepth.early;
  } else if (depth <= 4) {
    slots = calendarSlotsByDepth.mid;
  } else if (depth <= 6) {
    slots = calendarSlotsByDepth.weird;
    prompt = 'Select the optimal time slot (please note scheduling constraints)';
  } else if (depth <= 8) {
    slots = calendarSlotsByDepth.chaotic;
    prompt = 'Select a time that exists';
  } else {
    slots = calendarSlotsByDepth.demonic;
    prompt = 'When?';
  }

  return {
    type: 'calendar-select',
    prompt,
    required: true,
    slots,
  };
}

/**
 * Get interaction for attestation archetype
 */
function getAttestationInteraction(depth: DepthLevel): InteractionType {
  if (depth <= 2) {
    const promptVariation = randomTypingPrompt(depth);
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
      items: randomCheckboxSet(depth),
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
          content: generateCorpJargon(10, depth),
          requireScrollToBottom: true,
        },
        {
          type: 'checkboxes',
          title: 'Acknowledgment',
          items: randomCheckboxSet(depth),
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
      items: randomCheckboxSet(depth),
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
 * Get interaction for crisis-response archetype (final emergency exit)
 */
function getCrisisResponseInteraction(): InteractionType {
  return {
    type: 'crisis-choice',
    title: 'Executive Crisis Response Required',
    description: 'Critical decision needed regarding organizational continuity. Select appropriate stakeholder engagement strategy.',
    options: [
      {
        label: 'Report this to someone outside',
        description: 'Document everything and escalate to external authorities. Regulatory agencies, press, whoever will listen.',
        endingType: 'burn',
      },
      {
        label: 'Step back from leadership responsibilities',
        description: 'Reduce scope to core deliverables. Minimum viable involvement going forward.',
        endingType: 'delegate',
      },
      {
        label: 'Accept promotion to Senior Process Architect',
        description: 'Champion organizational transformation initiatives and drive operational excellence as a strategic change agent',
        endingType: 'assimilate',
      },
    ],
  };
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

    case 'crisis-response':
      return getCrisisResponseInteraction();

    default:
      // Fallback
      return {
        type: 'checkboxes',
        title: 'Acknowledge Task',
        items: randomCheckboxSet(1),
        allRequired: true,
      };
  }
}
