import { Subtask } from '../types';

export const countSubtasks = (tasks: Subtask[]): number => {
  return tasks.reduce(
    (count, task) => count + 1 + countSubtasks(task.children || []),
    0
  );
};

export const flattenUnexpanded = (tasks: Subtask[]): Subtask[] => {
  const result: Subtask[] = [];
  const flatten = (tasks: Subtask[]) => {
    tasks.forEach((task) => {
      if (!task.expanded) result.push(task);
      if (task.children) flatten(task.children);
    });
  };
  flatten(tasks);
  return result;
};

export const mutateTaskTitles = (
  tasks: Subtask[],
  mutations: Record<string, string[]>
): Subtask[] => {
  return tasks.map((task) => {
    const mutationList = mutations[task.title];
    if (mutationList && Math.random() > 0.7) {
      const currentIndex = mutationList.indexOf(task.title);
      const nextIndex = Math.min(currentIndex + 1, mutationList.length - 1);
      return {
        ...task,
        title: mutationList[nextIndex] || task.title,
        children: task.children ? mutateTaskTitles(task.children, mutations) : [],
      };
    }
    return {
      ...task,
      children: task.children ? mutateTaskTitles(task.children, mutations) : [],
    };
  });
};

export const updateSubtaskById = (
  tasks: Subtask[],
  targetId: string,
  updater: (task: Subtask) => Subtask
): Subtask[] => {
  return tasks.map((task) => {
    if (task.id === targetId) {
      return updater(task);
    }
    if (task.children && task.children.length > 0) {
      return {
        ...task,
        children: updateSubtaskById(task.children, targetId, updater),
      };
    }
    return task;
  });
};
