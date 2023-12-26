import { Request, Response } from "express"
import { addTask, deleteTask, fetchTasks, modifyTask } from "../db/tasksCrud"


export const addNewTask = async (req: Request, res: Response) => {
    try {
        const result = await addTask(req.body)
        if (result) {
            res.json(result)
        }
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        })
    }
}

export const viewTasks = async (req: Request, res: Response) => {
    try {
        const { offset, maxResults } = req?.query;
        const { course_id } = req.params;
        const result = await fetchTasks(offset, maxResults, course_id)
        if (result) {
            res.json(result)
        }
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        })
    }
}

export const editTask = async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;
        const result = await modifyTask(task_id, req.body);
        if (result) {
            return res.json(result)
        }
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        })
    }
}

export const handleDeleteTask = async (req: Request, res: Response) => {
    try {
        const { task_id } = req.params;
        const result = await deleteTask(task_id);
        if (result) {
            return res.status(200).json({
                message: 'Task deleted successfully'
            })
        }
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: err
        })
    }
}