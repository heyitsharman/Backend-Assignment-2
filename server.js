const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const tasksFile = path.join(__dirname, "tasks.json");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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


app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.render("index", { tasks });
});


app.get("/task", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find((t) => t.id == req.query.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});


app.post("/add-task", (req, res) => {
  const tasks = readTasks();
  const newTask = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title: req.body.title,
    completed: false,
  };
  tasks.push(newTask);
  writeTasks(tasks);
  res.redirect("/tasks");
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
