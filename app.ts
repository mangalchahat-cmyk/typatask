import { filterTasks, type TaskStatus } from "./model.js";
import { createTaskCard } from "./task-card.js";
import { TaskStore } from "./state.js";

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

const taskStore = new TaskStore();

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
  const { tasks, filter } = taskStore.getSnapshot();
  const visibleTasks = filterTasks(tasks, filter);
  list.replaceChildren();

  for (const task of visibleTasks) {
    list.append(
      createTaskCard({
        task,
        statusLabel: statusLabel[task.status],
        actionLabel: nextAction[task.status],
        completedLabel: "is completed",
      }),
    );
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

  taskStore.add(title);
  input.value = "";
  message.textContent = "";
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

  taskStore.advance(taskId);
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

    taskStore.setFilter(filter);
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
  });
});

taskStore.subscribe(renderTasks);
