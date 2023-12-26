import cors from 'cors';
import dotenv from 'dotenv';
import winston from "winston";
import express from "express";
import {authorize} from "./controller/auth";
import { authentication, getAllTasks, getUsers, get_selectedUser_batches } from './functions';
import expressWinston from "express-winston";
import { addNewTask, editTask, handleDeleteTask, viewTasks } from './functions/taskFuncs';
import { addNewCourse, deleteCourse, updateCourse, viewCourses } from './functions/courseFuncs';
import { addNewBatch, deleteBatch, getAllBatches, scheduleTask, updateBatch, updateBatchStatus } from './functions/batchFuncs';


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

app.post("/addNew-course", authorize, addNewCourse)
app.get("/view-courses", authorize, viewCourses)
app.put("/update-course", authorize, updateCourse)
app.delete("/delete-course", deleteCourse)
// ---------------------------------------------------------------||

app.post("/addNew-task", authorize, addNewTask)
app.get("/view-tasks/:course_id", authorize, viewTasks)
app.put("/edit-task/:task_id", authorize, editTask)
app.delete('/delete-task/:task_id', authorize, handleDeleteTask)
// ----------------------------------------------------------------||

app.post('/addNew-batch', authorize, addNewBatch)
app.get('/userId/:email_id/getBatches', authorize, getAllBatches)
app.put('/edit-batch', authorize, updateBatch)  
app.delete('/delete-batch', deleteBatch)
app.post('/scheduleTask', authorize, scheduleTask)
app.put('/batch/change-status', authorize, updateBatchStatus)
// ----------------------------------------------------------------||

app.get('/getAll-users', authorize, getUsers)
app.get('/selectedUser/batches/:email_id', authorize, get_selectedUser_batches)
app.get('/getAll-tasks', authorize, getAllTasks)

// ----------------------------------------------------------------||
app.listen(process.env.PORT || 5001, () => {
    console.log("universe listening on port ",process.env.PORT || 5001);
})