
import { Pool } from "pg";
import dotenv from 'dotenv';
import { genUniqueIdFunc } from "../controller/helper";
dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB
});



export const addTask = async (newTasks: NewTaskDetails) => {
    const client = await pool.connect();
    try {
        const task_uniqueId = genUniqueIdFunc()
        const query = `INSERT INTO task_credentials 
            (course_id, task_unique_id, 
                task_name, description, 
                createdby_updatedby, createdat_updatedat,
                solution, language_type, image_list
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`
        const values: string[] = [
            newTasks.course_id,
            task_uniqueId,
            newTasks.taskName,
            newTasks.taskDescription.toString(),
            newTasks.createdBy_updatedBy,
            newTasks.createdAt_updatedAt,
            newTasks.solution.toString(),
            newTasks.languageType,
            JSON.stringify(newTasks.imageList)
        ]
        const result = await client.query(query, values);
        if (result.rows.length > 0) {
            return result.rows[0]
        }
    } catch (error) {
        console.log("rrr errorrrrr", error)
        throw error
    } finally {
        client.release();
    }
}

export const fetchTasks = async (offset: any, maxResults: any, course_id: any) => {
    const client = await pool.connect();
    try {
        const query = `SELECT * FROM task_credentials WHERE course_id = $1 LIMIT $2 OFFSET $3`
        const values = [course_id, maxResults, offset]
        const result = await client.query(query, values);
        if (result?.rows) {
            return result.rows
        }
    } catch (error) {
        throw error
    } finally {
        client.release()
    }
}

export async function modifyTask(task_id: string, editedTask: any) {
    const client = await pool.connect();
    try {
        const query = `UPDATE task_credentials SET course_id = $1, task_name = $2, description = $3, solution = $4, language_type = $5, image_list = $6  WHERE task_unique_id = $7`
        const values = [editedTask.course_id, editedTask.taskName, editedTask.taskDescription, editedTask.solution, editedTask.languageType, JSON.stringify(editedTask.imageList), task_id]
        const result = await client.query(query, values);
        if (result.rows) {
            return result.rows
        }
    } catch (error) {
        console.log("error", error)
        return error
    };
}

export async function deleteTask(task_id: string) {
    const client = await pool.connect();
    try {
        const result = await client.query(`DELETE FROM task_credentials WHERE task_unique_id = $1 RETURNING *`, [task_id])
        if (result.rows) {
            return result.rows
        }
    } catch (error) {
        console.error("error", error)
        return error;
    } finally {
        client.release();
    }
}