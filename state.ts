import { addTask, advanceTask, filterTasks, type Task, type TaskFilter } from "./model.js";

export interface TaskTrackerState {
  tasks: Task[];
  filter: TaskFilter;
}

export type StateListener = (state: Readonly<TaskTrackerState>) => void;

export class TaskStore {
  private state: TaskTrackerState = { tasks: [], filter: "all" };
  private readonly listeners = new Set<StateListener>();

  getSnapshot(): Readonly<TaskTrackerState> {
    return this.state;
  }

  subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  add(title: string): void {
    this.update({ tasks: addTask(this.state.tasks, title) });
  }

  advance(taskId: string): void {
    this.update({ tasks: advanceTask(this.state.tasks, taskId) });
  }

  setFilter(filter: TaskFilter): void {
    if (this.state.filter !== filter) {
      this.update({ filter });
    }
  }

  private update(change: Partial<TaskTrackerState>): void {
    this.state = { ...this.state, ...change };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}
