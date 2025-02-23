const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const tasksFile = path.join(__dirname, "tasks.json");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

const readTasks = () => {
    try {
        const data = fs.readFileSync(tasksFile, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2), "utf-8");
};

// Render Tasks
app.get("/tasks", (req, res) => {
    const tasks = readTasks();
    res.render("index", { tasks });
});

// Add Task
app.post("/add-task", (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title: req.body.title,
        completed: false
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.redirect("/tasks");
});

// Delete Task
app.post("/delete-task", (req, res) => {
    const tasks = readTasks();
    const updatedTasks = tasks.filter(task => task.id != req.body.id);
    writeTasks(updatedTasks);
    res.json({ success: true });
});

// Toggle Task Completion
app.post("/toggle-task", (req, res) => {
    const tasks = readTasks();
    const task = tasks.find(task => task.id == req.body.id);
    if (task) {
        task.completed = !task.completed;
        writeTasks(tasks);
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: "Task not found" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
