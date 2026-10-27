import type { TaskFilter } from "./model.js";

export interface TaskEventElements {
  form: HTMLFormElement;
  input: HTMLInputElement;
  list: HTMLUListElement;
  message: HTMLParagraphElement;
  filterButtons: NodeListOf<HTMLButtonElement>;
  onAddTask: (title: string) => void;
  onAdvanceTask: (taskId: string) => void;
  onFilterChange: (filter: TaskFilter) => void;
}

export function bindTaskEvents({
  form,
  input,
  list,
  message,
  filterButtons,
  onAddTask,
  onAdvanceTask,
  onFilterChange,
}: TaskEventElements): void {
  form.addEventListener("submit", (event: SubmitEvent) => {
    event.preventDefault();
    const title = input.value.trim();
    if (title.length === 0) {
      message.textContent = "Give your task a name before adding it.";
      input.focus();
      return;
    }

    onAddTask(title);
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
    if (taskId) {
      onAdvanceTask(taskId);
    }
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

      onFilterChange(filter);
    });
  });
}
