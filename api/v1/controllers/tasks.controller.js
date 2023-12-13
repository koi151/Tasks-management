const Task = require('../model/tasks.model');

const paginationHelper = require('../../../helpers/pagination');

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

