import { addTask, advanceTask } from "./model.js";
export class TaskStore {
    constructor() {
        this.state = { tasks: [], filter: "all" };
        this.listeners = new Set();
    }
    getSnapshot() {
        return this.state;
    }
    subscribe(listener) {
        this.listeners.add(listener);
        listener(this.state);
        return () => this.listeners.delete(listener);
    }
    add(title) {
        this.update({ tasks: addTask(this.state.tasks, title) });
    }
    advance(taskId) {
        this.update({ tasks: advanceTask(this.state.tasks, taskId) });
    }
    setFilter(filter) {
        if (this.state.filter !== filter) {
            this.update({ filter });
        }
    }
    update(change) {
        this.state = { ...this.state, ...change };
        for (const listener of this.listeners) {
            listener(this.state);
        }
    }
}
