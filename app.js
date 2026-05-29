// Import Express.js
const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine and use current folder for .ejs files
app.set('view engine', 'ejs');
app.set('views', __dirname);

// In-memory data for task entries
let tasks = [
    {
        id: 1,
        taskName: 'CA1 Submission',
        deadline: '2026-05-20',
        module: 'C237',
        condition: 'Pending',
        priority: 'High',
        sleepHours: 6.5
    },
    {
        id: 2,
        taskName: 'Presentation Preparation',
        deadline: '2026-05-21',
        module: 'C237',
        condition: 'In Progress',
        priority: 'Medium',
        sleepHours: 6.5
    },
    {
        id: 3,
        taskName: 'CA1 Reflection Journal',
        deadline: '2026-05-27',
        module: 'C237',
        condition: 'Completed',
        priority: 'Low',
        sleepHours: 6.5
    }
];

// Home page
app.get('/', function(req, res) {
    res.render('index', { tasks: tasks });
});

// Add task form
app.get('/task/add', function(req, res) {
    res.render('taskForm', { task: null });
});

// Add task POST
app.post('/task/add', function(req, res) {
    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        taskName: req.body.taskName,
        deadline: req.body.deadline,
        module: req.body.module,
        condition: req.body.condition,
        priority: req.body.priority,
        sleepHours: Number(req.body.sleepHours) || 0
    };

    tasks.push(newTask);
    res.redirect('/');
});

// Task details page
app.get('/task/:id', function(req, res) {
    const taskId = parseInt(req.params.id);
    const selectedTask = tasks.find(item => item.id === taskId);

    if (selectedTask) {
        res.render('taskInfo', { task: selectedTask });
    } else {
        res.status(404).send('Task not found');
    }
});

// Update task form
app.get('/task/:id/update', function(req, res) {
    const taskId = parseInt(req.params.id);
    const selectedTask = tasks.find(item => item.id === taskId);

    if (selectedTask) {
        res.render('taskForm', { task: selectedTask });
    } else {
        res.status(404).send('Task not found');
    }
});

// Update task POST
app.post('/task/:id/update', function(req, res) {
    const taskId = parseInt(req.params.id);
    const selectedTask = tasks.find(item => item.id === taskId);

    if (selectedTask) {
        selectedTask.taskName = req.body.taskName;
        selectedTask.deadline = req.body.deadline;
        selectedTask.module = req.body.module;
        selectedTask.condition = req.body.condition;
        selectedTask.priority = req.body.priority;
        selectedTask.sleepHours = Number(req.body.sleepHours) || 0;
        res.redirect('/');
    } else {
        res.status(404).send('Task not found');
    }
});

// Delete task
app.get('/task/:id/delete', function(req, res) {
    const taskId = parseInt(req.params.id);
    tasks = tasks.filter(item => item.id !== taskId);
    res.redirect('/');
});

// Summary page
app.get('/summary', function(req, res) {
    let summary = [];

    for (let i = 0; i < tasks.length; i++) {
        let found = summary.find(item => item.deadline === tasks[i].deadline);

        if (found) {
            found.totalTasks++;
        } else {
            summary.push({
                deadline: tasks[i].deadline,
                totalTasks: 1
            });
        }
    }

    res.render('summary', { summary: summary });
});

// Summary details page
app.get('/summary/:deadline', function(req, res) {
    const selectedDeadline = req.params.deadline;
    const itemsByDeadline = tasks.filter(item => item.deadline === selectedDeadline);

    res.render('summaryDetails', {
        selectedDeadline: selectedDeadline,
        itemsByDeadline: itemsByDeadline
    });
});

// Start server
app.listen(port, function() {
    console.log(`Server is running at http://localhost:${port}`);
});
