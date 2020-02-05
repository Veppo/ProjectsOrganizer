const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
var requestCount = 0;

// Function: Create Console log with a count for the amount of calls
server.use((req, res, next) => {
  console.log(`Total Requests: ${++requestCount}`)
  return next();
});

// Function: Create Project Id Validation
function checkProjectExists(req, res, next){
  projectIndex = projects.findIndex((obj => obj.id == req.params.id))
  
  if(projectIndex < 0){
    return res.status(400).json({ Error: 'Project does not exists.'});
  }

  return next();
}

// Function: Create Project
// body params: { id: "1", title: 'Novo projeto' }
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  projects.push({
    id,
    title,
    tasks: []
  });
  return res.json({ Message: `Created the Project ${title}`});
});

// Function: list all projects
server.get('/projects', (req, res) => {
  return res.json(projects);
});

// Function: Update Project's title based on its ID
// Route params: id
// body params: { title: 'Novo titulo' }
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  
  projIndex = projects.findIndex((obj => obj.id == id));
  projects[projIndex].title = title;
  
  return res.json({ Message: `Updated the Project ${title}`});
});

// Function: Delete Project based on its ID
// Route params: id
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  projIndex = projects.findIndex((obj => obj.id == id));

  projects.splice(projIndex, 1);
  return res.send();
});

// Function: Add one task for one project by Id
// Route params: id
// body params: { title: 'Create CRUD' }
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  projIndex = projects.findIndex((obj => obj.id == id));
  projects[projIndex].tasks.push(title);

  return res.json({ Message: `Added Task ${title}`});
});

server.listen('3000');