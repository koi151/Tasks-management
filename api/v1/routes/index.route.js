const taskRoutes = require("./tasks.route")

module.exports = (app) => {  
  const version = "/api/v1"; 

  app.use(version + "/tasks", taskRoutes);
}