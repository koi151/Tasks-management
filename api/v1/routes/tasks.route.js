const express = require('express');
const router = express.Router();

const controller = require('../controllers/tasks.controller')

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

router.patch('/change-status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.patch('/edit/:id', controller.editPatch);

router.post('/create', controller.create);

router.delete('/delete/:id', controller.deleteTask);

module.exports = router;