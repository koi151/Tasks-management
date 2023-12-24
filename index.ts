import express, { Express } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import * as database from './config/database';
import cors from 'cors';
import mainV1Routes from './api/v1/routes/index.route';

dotenv.config();

database.connect();

const app: Express = express();

const port: number | string = process.env.PORT || 3000;

app.use(cors());

// parse application/json - bf routes 
app.use(bodyParser.json());

// Routes Version 1
mainV1Routes(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});