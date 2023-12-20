const Task = require('../model/tasks.model');

const paginationHelper = require('../../../helpers/pagination');
const searchHelper = require('../../../helpers/search');

// [GET] /api/v1/tasks/
module.exports.index = async (req, res) => {
  try {
    const criterias = {
      deleted: false
    }

    // SORT
    const sort = {}

    if (req.query.status) {
      criterias.status = req.query.status
    }

    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    }
    // SEARCHING
    const searchObj = searchHelper(req.query);
    if (searchObj.keyword) {
      criterias.title = searchObj.regex; 
    }

    // PAGINATION
    let initPagination = {
      currentPage: 1,
      limitItems: 2
    }

    const tasksCount = await Task.countDocuments(criterias);
    const paginationObj = paginationHelper(initPagination, req.query, tasksCount);

    const tasks = await Task.find(criterias)
      .sort(sort)
      .limit(paginationObj.limitItems)
      .skip(paginationObj.skip);

    res.json({
      code: 200, 
      message: "Get tasks successful",
      tasks: tasks
    })

  } catch (error) {
    console.log('Error occured:', error);
    res.json({
      code: 400,
      massage: "Not existed"
    });
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
    res.json({
      code: 400,
      massage: "Not existed"
    });
  }
}

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne(
      { _id:  id}, 
      { 
        status: req.body.status
      }
    );

    res.json({
      code: 200,
      message: 'Update status successful!'
    });
  } catch (error) {
    console.log('Error occured:', error);
    res.json({
      code: 400,
      massage: "Not existed"
    });
  }
}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const {ids, key, value} = req.body; 

    switch(key) {
      case "status": 
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          status: value
        })

        res.json({
          code: 200,
          message: 'Update multiple status successful!'
        });
        break;
      
      case "delete":
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: Date()
        })
        
        res.json({
          code: 200,
          message: 'Multiple tasks deleted successfully!'
        });
        break;
      
      default: 
        res.json({
          code: 400,
          massage: "Not existed"
        });
        break;
    }

  } catch (error) {
    console.log('Error occured:', error);
    res.json({
      code: 400,
      massage: "Not existed"
    });
  }
}

// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body)
    await task.save();

    res.json({
      code: 200,
      message: 'Create task successful!'
    });
    
  } catch (error) {
    console.log('Error occured:', error);
    res.json({
      code: 400,
      massage: "Error occurred while creating task"
    });
  }
}

// [PATCH] /api/v1/tasks/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    await Task.updateOne(
      { _id: req.params.id }, 
      req.body
    )
     
    res.json({
      code: 200,
      massage: "Update task successfull!"
    });

  } catch (error) {
    console.log('Error occured:', error);
    res.json({
      code: 400,
      massage: "Not existed"
    });
  }
}

// [DELETE] /api/v1/tasks/delete/:id
module.exports.deleteTask = async (req, res) => {
  try {
    await Task.updateOne({
      _id: req.params.id
    }, {
      deleted: true,
      deletedAt: Date()
    })

    res.json({
      code: 200,
      message: 'Task deleted successful!'
    });
    
  } catch (error) {
    console.log('Error occured:', error);
    res.json({
      code: 400,
      massage: "Error occurred while creating task"
    });
  }
}