import type { Task } from "./model.js";

export interface TaskCardProps {
  task: Task;
  statusLabel: string;
  actionLabel: string;
  completedLabel: string;
}

export function createTaskCard({
  task,
  statusLabel,
  actionLabel,
  completedLabel,
}: TaskCardProps): HTMLLIElement {
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
  status.textContent = statusLabel;

  const advanceButton = document.createElement("button");
  advanceButton.className = "advance-button";
  advanceButton.type = "button";
  advanceButton.dataset.taskId = task.id;
  advanceButton.textContent = actionLabel;
  advanceButton.disabled = task.status === "done";
  advanceButton.setAttribute(
    "aria-label",
    task.status === "done" ? `${task.title} ${completedLabel}` : `${actionLabel}: ${task.title}`,
  );

  content.append(title, status);
  item.append(marker, content, advanceButton);
  return item;
}
