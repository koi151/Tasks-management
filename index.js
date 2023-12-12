const express = require('express');
const database = require('./config/database');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

database.connect();

const Task = require('./model/tasks.model');

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({
    deleted: false
  }) 

  res.json(tasks)
});

app.get('/tasks/detail/:id', async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      deleted: false
    })
  
    res.json(task);
  } catch (error) {
    res.json('Not found');
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});