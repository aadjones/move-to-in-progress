export interface Task {
  id: string;
  title: string;
  column: 'todo' | 'inProgress';
  assignee?: string;
  tags?: string[];
  timestamp?: string;
}

export interface Subtask {
  id: string;
  title: string;
  status: string;
  children?: Subtask[];
  expanded?: boolean;
}

export type Phase = 'board' | 'falling' | 'ground' | 'nightmare' | 'ending';
