import { Express } from 'express'; 
import { taskRoutes } from './tasks.route.js';
import { userRoutes } from './user.route.js';

import authMiddleware from '../../../middlewares/auth.middleware';

const mainV1Routes = (app: Express): void => {
  const version: string = "/api/v1"; 

  app.use( 
    version + "/tasks", 
    authMiddleware.authRequire,
    taskRoutes
  );

  app.use(version + "/users", userRoutes); 
}

export default mainV1Routes;