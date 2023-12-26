import { Request, Response } from "express"
import { changeBthStatus, createNewBatch, editBatch, getDBatches, insertTask, removeBatch } from "../db/batchCrud"


export const addNewBatch = async (req: Request, res: Response) => {
    try {
        const result = await createNewBatch(req.body)
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

export const getAllBatches = async (req: Request, res: Response) => {
    try {
        const { email_id } = req.params;
        const result = await getDBatches(email_id);
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

export const updateBatch = async (req: Request, res: Response) => {
    try {
        const result = await editBatch(req.body)
        if (result) {
            res.json({
                code: 200,
                message: "Batch updated successfully!"
            })
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal Server Error"
            })
        }
    } catch (err:any) {
        res.status(500).json({
            code: 500,
            message: err.message || "Internal Server Error"
        })
    }
}

export const updateBatchStatus = async(req: Request, res: Response) => {
    try {
        const result = await changeBthStatus(req.body);
        if (result) {
            res.json({
                code: 200,
                data: result
            })
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal Server Error"
            })
        }
    } catch (err:any) {
        res.status(500).json({
            code: 500,
            message: err.message || "Internal Server Error"
        })
    }
}

export const deleteBatch = async (req: Request, res: Response) => {
    try {
        const result = await removeBatch(req.query.batchId)
        if (result) {
            res.json({
                message: "Batch deleted successfully"
            })
        } else {
            res.status(500).json({
                code: 500,
                message: "Internal Server Error"
            })
        }
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: "Internal Server Error"
        })
    }
}

export const scheduleTask = async(req: Request, res: Response) => {
    try {
        const response:any = await insertTask(req.body);
        if (response > 0) {
            res.json({
                status: "success",
                message: "Task scheduled successfully!!"
            })
        } else {
            res.json({
                status: "warning",
                message: "Task is already scheduled!!"
            })
        }
    } catch (err) {
        res.status(500).json({
            code: 500,
            message: err
        })
    }
}