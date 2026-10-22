const nextStatus = {
    todo: "in-progress",
    "in-progress": "done",
    done: "done",
};
export function createTask(title, id = crypto.randomUUID()) {
    const normalizedTitle = title.trim();
    if (normalizedTitle.length === 0) {
        throw new Error("A task title cannot be empty.");
    }
    return { id, title: normalizedTitle, status: "todo" };
}
export function addTask(tasks, title) {
    return [...tasks, createTask(title)];
}
export function advanceTask(tasks, taskId) {
    return tasks.map((task) => task.id === taskId
        ? { ...task, status: nextStatus[task.status] }
        : task);
}
export function filterTasks(tasks, filter) {
    return filter === "all"
        ? [...tasks]
        : tasks.filter((task) => task.status === filter);
}
