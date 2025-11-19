/**
 * Task Interaction System - Types
 *
 * Defines the "minigames" that users must complete for tasks.
 * Each interaction type maps to specific task archetypes.
 */

/**
 * Form field types for bureaucratic forms
 */
export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number';
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  options?: string[]; // for select fields
  helperText?: string; // Confusing or redundant helper text
  validationMessage?: string; // Vague error message
}

/**
 * Quiz question for training/compliance tasks
 */
export interface QuizQuestion {
  question: string;
  options: string[]; // All should sound plausible
  correctIndex: number;
  explanation?: string; // Shown after answering
}

/**
 * Discriminated union of all interaction types
 */
export type InteractionType =
  | {
      type: 'video';
      /** Duration in seconds */
      duration: number;
      /** Video "title" */
      title: string;
      /** Can the user skip? */
      skippable: false; // Always false for maximum frustration
    }
  | {
      type: 'scroll-document';
      /** Number of "pages" to scroll through */
      pages: number;
      /** Document title */
      title: string;
      /** Generated lorem ipsum or corporate jargon */
      content: string[];
      /** Require scrolling to bottom before continue is enabled */
      requireScrollToBottom: true;
    }
  | {
      type: 'form';
      /** Form title */
      title: string;
      /** Array of fields (can have redundant/confusing fields) */
      fields: FormField[];
      /** Submission button text */
      submitText?: string;
      /** Show vague validation errors? */
      vagueValidation?: boolean;
    }
  | {
      type: 'typing-prompt';
      /** What to display to user */
      prompt: string;
      /** Exact string they must type (case-sensitive?) */
      expected: string;
      /** Is matching case-sensitive? */
      caseSensitive?: boolean;
      /** Placeholder text */
      placeholder?: string;
    }
  | {
      type: 'quiz';
      /** Quiz title */
      title: string;
      /** Questions to answer (all must be correct) */
      questions: QuizQuestion[];
      /** Can retry on wrong answer? */
      allowRetry: boolean;
    }
  | {
      type: 'checkboxes';
      /** Title/prompt */
      title: string;
      /** Items to acknowledge */
      items: string[];
      /** All checkboxes required? */
      allRequired: true;
      /** Continue button text */
      continueText?: string;
    }
  | {
      type: 'loading-delay';
      /** What is "loading"? */
      message: string;
      /** Duration in seconds */
      duration: number;
      /** Show fake progress bar? */
      showProgress: boolean;
    }
  | {
      type: 'multi-step';
      /** Title for the overall process */
      title: string;
      /** Sequential steps (each is an interaction) */
      steps: InteractionType[];
      /** Show step progress? */
      showStepIndicator: boolean;
    }
  | {
      type: 'calendar-select';
      /** Prompt for meeting scheduling */
      prompt: string;
      /** Available time slots (all say "Tentative" or similar) */
      slots: string[];
      /** Must select one */
      required: true;
    }
  | {
      type: 'dropdown-hierarchy';
      /** Prompt */
      prompt: string;
      /** Nested dropdown selections (each unlocks the next) */
      hierarchy: {
        label: string;
        options: string[];
      }[];
      /** Final selection required */
      required: true;
      /** Enable inception mode - additional dropdowns appear after completion */
      inceptionMode?: boolean;
    };

/**
 * Result of completing an interaction
 */
export interface InteractionResult {
  completed: boolean;
  /** Time spent on interaction (seconds) */
  duration: number;
  /** Any data collected from the interaction */
  data?: Record<string, unknown>;
}

/**
 * Maps task archetypes to appropriate interaction types
 */
export type ArchetypeInteractionMap = {
  training: Array<'video' | 'scroll-document' | 'quiz' | 'checkboxes'>;
  'approval-request': Array<'form' | 'typing-prompt' | 'dropdown-hierarchy'>;
  'form-submission': Array<'form' | 'multi-step'>;
  documentation: Array<'scroll-document' | 'form' | 'typing-prompt'>;
  'system-access': Array<'loading-delay' | 'form' | 'typing-prompt'>;
  meeting: Array<'calendar-select' | 'form' | 'checkboxes'>;
  attestation: Array<'typing-prompt' | 'checkboxes' | 'scroll-document'>;
  compliance: Array<'quiz' | 'checkboxes' | 'video' | 'scroll-document'>;
};
