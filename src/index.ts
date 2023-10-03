import cors from 'cors';
import express from "express";
import winston from "winston";
import expressWinston from "express-winston";
import {authorize, generateToken} from "./controller/auth";
import { authentication } from './functions';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
app.use(cors());

// logging all the requests //

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: false,
  msg: "HTTP  ",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

// fixing "413 Request Entity Too Large" errors
app.use(express.json({limit: "10mb"}))
app.use(express.urlencoded({limit: "10mb", extended: true, parameterLimit: 50000}))

// ---------------------------------------------------------------||

app.post("/authentication", authentication);
app.post("/register_new_user", authorize, () => {})

// ----------------------------------------------------------------||
app.listen(process.env.PORT || 5001, () => {
    console.log("universe listening on port ",process.env.PORT || 5001);
})