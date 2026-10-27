import { addTask, advanceTask, filterTasks, type Task, type TaskFilter, type TaskStatus } from "./model.js";

function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) {
    throw new Error(`The task tracker could not find ${selector}.`);
  }
  return element;
}

const form = requiredElement<HTMLFormElement>("#task-form");
const input = requiredElement<HTMLInputElement>("#task-input");
const list = requiredElement<HTMLUListElement>("#task-list");
const emptyState = requiredElement<HTMLDivElement>("#empty-state");
const summary = requiredElement<HTMLParagraphElement>("#task-summary");
const message = requiredElement<HTMLParagraphElement>("#form-message");
const filterButtons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");

let tasks: Task[] = [];
let activeFilter: TaskFilter = "all";

const statusLabel: Record<TaskStatus, string> = {
  todo: "To do",
  "in-progress": "In progress",
  done: "Done",
};

const nextAction: Record<TaskStatus, string> = {
  todo: "Start task",
  "in-progress": "Mark done",
  done: "Completed",
};

function renderTasks(): void {
  const visibleTasks = filterTasks(tasks, activeFilter);
  list.replaceChildren();

  for (const task of visibleTasks) {
    const item = document.createElement("li");
    item.className = "task-item";
    item.dataset.status = task.status;

    const marker = document.createElement("span");
    marker.className = "task-marker";
    marker.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("p");
    title.className = "task-title";
    title.textContent = task.title;

    const status = document.createElement("span");
    status.className = "task-status";
    status.textContent = statusLabel[task.status];

    const advanceButton = document.createElement("button");
    advanceButton.className = "advance-button";
    advanceButton.type = "button";
    advanceButton.dataset.taskId = task.id;
    advanceButton.textContent = nextAction[task.status];
    advanceButton.disabled = task.status === "done";
    advanceButton.setAttribute(
      "aria-label",
      task.status === "done" ? `${task.title} is completed` : `${nextAction[task.status]}: ${task.title}`,
    );

    content.append(title, status);
    item.append(marker, content, advanceButton);
    list.append(item);
  }

  emptyState.hidden = visibleTasks.length > 0;
  const remaining = tasks.filter((task) => task.status !== "done").length;
  summary.textContent =
    tasks.length === 0
      ? "A fresh start is a good start."
      : `${remaining} ${remaining === 1 ? "task" : "tasks"} left · ${tasks.length} total`;
}

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const title = input.value.trim();
  if (title.length === 0) {
    message.textContent = "Give your task a name before adding it.";
    input.focus();
    return;
  }

  tasks = addTask(tasks, title);
  input.value = "";
  message.textContent = "";
  renderTasks();
  input.focus();
});

list.addEventListener("click", (event: MouseEvent) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  const button = event.target.closest<HTMLButtonElement>("[data-task-id]");
  const taskId = button?.dataset.taskId;
  if (!taskId) {
    return;
  }

  tasks = advanceTask(tasks, taskId);
  renderTasks();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    if (
      filter !== "all" &&
      filter !== "todo" &&
      filter !== "in-progress" &&
      filter !== "done"
    ) {
      throw new Error(`Unsupported task filter: ${filter ?? "(missing)"}`);
    }

    activeFilter = filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTasks();
  });
});

renderTasks();
