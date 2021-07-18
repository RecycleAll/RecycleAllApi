import {config} from "dotenv";
config();
import express, {Express} from "express";
import bodyParser from "body-parser";

import {buildRoutes} from "./src/routes";
import {SequelizeManager} from "./src/models";

import cors from 'cors';

const app: Express = express();

app.use(bodyParser.json());
app.use(cors())

buildRoutes(app);

SequelizeManager.getInstance();

const port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log(`Listening on ${port}...`);
});
