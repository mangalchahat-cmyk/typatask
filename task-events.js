export function bindTaskEvents({ form, input, list, message, filterButtons, onAddTask, onAdvanceTask, onFilterChange, }) {
    form.addEventListener("submit", (event) => {
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
    list.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }
        const button = event.target.closest("[data-task-id]");
        const taskId = button?.dataset.taskId;
        if (taskId) {
            onAdvanceTask(taskId);
        }
    });
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            if (filter !== "all" &&
                filter !== "todo" &&
                filter !== "in-progress" &&
                filter !== "done") {
                throw new Error(`Unsupported task filter: ${filter ?? "(missing)"}`);
            }
            onFilterChange(filter);
        });
    });
}
