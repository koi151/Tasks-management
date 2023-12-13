const express = require('express');
const bodyParser = require('body-parser');
const database = require('./config/database');
require('dotenv').config();

const routesApiVer1 = require('./api/v1/routes/index.route')

const app = express();
const port = process.env.PORT;

database.connect();

// parse application/json - bf routes 
app.use(bodyParser.json())

// Routes Version 1
routesApiVer1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});