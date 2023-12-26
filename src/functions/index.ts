import { Request, Response } from "express";
import { generateToken } from "../controller/auth";
import { checkCredentials, fetchAllTasks, fetchAllUsers, fetchSelectedUserBatches } from "../db";


export const authentication = async (req: Request, res: Response) => {
    try {
        let response = await checkCredentials(req.body)
        let result: any = {
            authentication: response.authentication
        }
        if (response.authentication === false) {
            result.message = response.message

        } else {
            let token = generateToken({ userId: req.body.userId })
            result.userDetails = response.result
            result.token = token
        }
        res.json(result);
    } catch (err) {
        console.log("====login error======", err)
        res.status(500).json({
            authentication: false,
            message: "Internal Server Error"
        })
    }
}

export async function getUsers(req: Request, res: Response) {
    try {
        const response = await fetchAllUsers();
        if (response) {
            res.json(response)
        }
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}

export async function get_selectedUser_batches (req: Request, res: Response) {
    try {
        const { email_id } = req.params;
        const response = await fetchSelectedUserBatches(email_id);
        if (response) {
            res.json(response)
        }
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
};

export async function getAllTasks(req: Request, res: Response) {
    try {
        const response = await fetchAllTasks();
        if (response) {
            res.json(response)
        }
    } catch (err) {
        res.status(500).json({
            message: err
        })
    }
}