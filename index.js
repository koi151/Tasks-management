const express = require('express');
const bodyParser = require('body-parser');
const database = require('./config/database');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const routesApiVer1 = require('./api/v1/routes/index.route')

const app = express();
const port = process.env.PORT;

app.use(cors());

database.connect();

app.use(cookieParser());

// parse application/json - bf routes 
app.use(bodyParser.json())

// Routes Version 1
routesApiVer1(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});