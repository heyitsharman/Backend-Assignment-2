document.addEventListener("DOMContentLoaded", () => {
    const taskContainer = document.getElementById("task-container");

    // Delete Task
    taskContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const taskId = event.target.dataset.id;
            
            fetch("/delete-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: taskId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    event.target.closest("li").remove();
                } else {
                    alert("Error deleting task");
                }
            });
        }
    });

    // Toggle Task Completion
    taskContainer.addEventListener("click", (event) => {
        if (event.target.classList.contains("toggle-btn")) {
            const taskId = event.target.dataset.id;
            
            fetch("/toggle-task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: taskId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    event.target.closest("li").classList.toggle("completed");
                } else {
                    alert("Error updating task");
                }
            });
        }
    });
});
