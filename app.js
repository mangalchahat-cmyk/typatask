import { filterTasks } from "./model.js";
import { createTaskCard } from "./task-card.js";
import { TaskStore } from "./state.js";
import { bindTaskEvents } from "./task-events.js";
function requiredElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`The task tracker could not find ${selector}.`);
    }
    return element;
}
const form = requiredElement("#task-form");
const input = requiredElement("#task-input");
const list = requiredElement("#task-list");
const emptyState = requiredElement("#empty-state");
const summary = requiredElement("#task-summary");
const message = requiredElement("#form-message");
const filterButtons = document.querySelectorAll("[data-filter]");
const taskStore = new TaskStore();
const statusLabel = {
    todo: "To do",
    "in-progress": "In progress",
    done: "Done",
};
const nextAction = {
    todo: "Start task",
    "in-progress": "Mark done",
    done: "Completed",
};
function renderTasks() {
    const { tasks, filter } = taskStore.getSnapshot();
    const visibleTasks = filterTasks(tasks, filter);
    list.replaceChildren();
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === filter;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
    for (const task of visibleTasks) {
        list.append(createTaskCard({
            task,
            statusLabel: statusLabel[task.status],
            actionLabel: nextAction[task.status],
            completedLabel: "is completed",
        }));
    }
    emptyState.hidden = visibleTasks.length > 0;
    const remaining = tasks.filter((task) => task.status !== "done").length;
    summary.textContent =
        tasks.length === 0
            ? "A fresh start is a good start."
            : `${remaining} ${remaining === 1 ? "task" : "tasks"} left · ${tasks.length} total`;
}
taskStore.subscribe(renderTasks);
bindTaskEvents({
    form,
    input,
    list,
    message,
    filterButtons,
    onAddTask: (title) => taskStore.add(title),
    onAdvanceTask: (taskId) => taskStore.advance(taskId),
    onFilterChange: (filter) => taskStore.setFilter(filter),
});
