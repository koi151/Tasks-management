import Task from '../model/tasks.model';

import { Request, Response } from "express";
import { paginationHelper } from '../../../helpers/pagination';
import { searchHelper } from '../../../helpers/search';

// [GET] /api/v1/tasks/
export const index = async (req: Request, res: Response) => {
  try {

    // Find
    interface findCriterias {
      deleted: boolean,
      status?: string,
      title?: RegExp,
    }

    const find: findCriterias = {
      deleted: false
    }

    if (req.query.status) {
      find.status = req.query.status.toString();
    }

    // const criterias = {
    //   $or: [
    //     { createBy: req.user.id },
    //     { userList: req.user.id }
    //   ],
    //   deleted: false
    // }

    // SORT
    const sort = {}

    if (req.query.sortKey && req.query.sortValue) {
      const sortKey = req.query.sortKey.toString();
      sort[sortKey] = req.query.sortValue;
    }

    // SEARCHING
    const searchObj = searchHelper(req.query);
    if (searchObj.regex) {
      find.title = searchObj.regex; 
    }

    // PAGINATION
    let initPagination = {
      currentPage: 1,
      limitItems: 2
    }

    const taskCount = await Task.countDocuments(find);
    const paginationObj = paginationHelper(initPagination, req.query, taskCount);

    // END PAGINATION

    const tasks = await Task.find(find)
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
export const detail = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id; 

    const task = await Task.findOne({
      _id: id,
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
export const changeStatus = async (req: Request, res: Response) => {
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
export const changeMulti = async (req: Request, res: Response) => {
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
export const create = async (req: Request, res: Response) => {
  try {
    // req.body.createdBy = req.user.id;
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
export const editPatch = async (req: Request, res: Response) => {
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
export const deleteTask = async (req: Request, res: Response) => {
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