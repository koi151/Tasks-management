import { Router } from 'express';
import * as controller from '../controllers/tasks.controller';

const router: Router = Router();

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

router.patch('/change-status/:id', controller.changeStatus);

router.patch('/change-multi', controller.changeMulti);

router.patch('/edit/:id', controller.editPatch);

router.post('/create', controller.create);

router.delete('/delete/:id', controller.deleteTask);

// module.exports = router;
export const taskRoutes: Router = router; 