import { NextFunction, Request, Response } from "express";
import { generateToken } from "../controller/auth";
import { checkCredentials } from "../db";


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
        console.log("resultttt", result)
        res.json(result);
    } catch (err) {
        console.log("==========", err)
        res.status(500).json({
            authentication: false,
            message: "Internal Server Error"
        })
    }
}