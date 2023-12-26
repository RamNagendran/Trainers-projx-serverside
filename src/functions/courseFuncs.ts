import { Request, Response } from "express"
import { editCourse, getAllCourses, insertNewCourse, removeCourse } from "../db/courseCrud"



export const addNewCourse = async (req: Request, res: Response) => {
    try {
        const result = await insertNewCourse(req.body)
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

export const viewCourses = async (req: Request, res: Response) => {
    try {
        const result = await getAllCourses();
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

export const updateCourse = async (req: Request, res: Response) => {
    try {
        const result = await editCourse(req.body)
        if (result) {
            res.json({
                code: 200,
                message: "Course updated successfully!"
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

export const deleteCourse = async (req: Request, res: Response) => {
    try {
        const result = await removeCourse(req.query.courseId)
        if (result) {
            res.json({
                message: "Course deleted successfully"
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