// Import the Express.js framework
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
const port = 3000;

//set EJS as the view engine
app.set('view engine', 'ejs');
// In-memory data for task entries
let tasks = [
                {
                    id: 1,
                    taskName: "CA1 Submission",
                    deadline: "2025-05-20",
                    module: "C237",
                    condition: "Pending"
                },
                {
                    id: 2,
                    taskName: "Presentation Preparation",
                    deadline: "2026-05-21",
                    module: "C237",
                    condition: "In Progress"
                },
                {
                    id: 3,
                    taskName: "CA1 Reflection journal",
                    deadline: "2026-05-27",
                    module: "C237",
                    condition: "Completed"
                }
];

// Routes for CRUD operations
// Route to retrieve and display all task entries
app.get('/', function(req, res) {
    //render a view called "index" and pass the variable 'tasks' to the view for rendering
    res.render('index', { tasks: tasks });
});
app.get('/task/:id', function(req, res) {
    // Extracting the 'id' parameter from the request parameters and converting it to an integer
    const taskId = parseInt(req.params.id);  
    // Searching for a task entry in the 'tasks' array with a matching 'id'
    const selectedTask = tasks.find((item) => item.id === taskId);  
    // Checking if a task entry with the specified 'id' was found
    if (selectedTask) {
    res.render('taskInfo', { task: selectedTask });
    }               
}); 
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
    res.render('summary', { summary });
});

app.get('/summary/:deadline', function(req, res) {
    const selectedDeadline = req.params.deadline;
    const itemsByDeadline = tasks.filter(function(item) {
        return item.deadline === selectedDeadline;
    });
    res.render('summaryDetails', {
        selectedDeadline: selectedDeadline,
        itemsByDeadline: itemsByDeadline
    });
});

//const exercise = req.body.exercise || 0;
// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully started
  console.log(`Server is running at http://localhost:${port}`);
});
