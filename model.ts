export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskFilter = "all" | TaskStatus;

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

const nextStatus: Record<TaskStatus, TaskStatus> = {
  todo: "in-progress",
  "in-progress": "done",
  done: "done",
};

export function createTask(title: string, id: string = crypto.randomUUID()): Task {
  const normalizedTitle = title.trim();
  if (normalizedTitle.length === 0) {
    throw new Error("A task title cannot be empty.");
  }

  return { id, title: normalizedTitle, status: "todo" };
}

export function addTask(tasks: Task[], title: string): Task[] {
  return [...tasks, createTask(title)];
}

export function advanceTask(tasks: Task[], taskId: string): Task[] {
  return tasks.map((task) =>
    task.id === taskId
      ? { ...task, status: nextStatus[task.status] }
      : task,
  );
}

export function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return filter === "all"
    ? [...tasks]
    : tasks.filter((task) => task.status === filter);
}
