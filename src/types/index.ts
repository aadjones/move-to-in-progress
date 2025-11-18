export interface BoardTask {
  id: string;
  title: string;
  column: 'todo' | 'inProgress' | 'done';
  assignee?: string;
  tags?: string[];
  timestamp?: string;
  description?: string;
}

export interface TaskComment {
  author: string;
  text: string;
  timestamp: string;
  isAuto?: boolean;
}

export interface Subtask {
  id: string;
  title: string;
  status: string;
  children?: Subtask[];
  expanded?: boolean;
  revealed?: boolean; // Whether blocker text has been shown
  resolved?: boolean; // Whether user clicked "resolve" (shows checkmark)
  isAcceptanceCriteria?: boolean; // Top-level acceptance criteria vs spawned subtasks
  contentKey?: string; // Key to lookup full content in taskContent
  comments?: TaskComment[]; // Dynamic comments added during chaos
}

export type Phase = 'board' | 'falling' | 'ground' | 'nightmare' | 'ending';
