const Task = require('../model/tasks.model');

// [GET] /api/v1/tasks/
module.exports.index = async (req, res) => {
  try {
    const criterias = {
      deleted: false
    }
  
    if (req.query.status) {
      criterias.status = req.query.status
    }
  
    const tasks = await Task.find(criterias) 
  
    res.json(tasks)
  } catch (error) {
    console.log('Error occured:', error);
    res.json('Not found');
  }
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      deleted: false
    })
  
    res.json(task);
  } catch (error) {
    console.log('Error occured:', error);
    res.json('Not found');
  }
}

