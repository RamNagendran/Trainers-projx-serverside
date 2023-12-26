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

export async function createNewBatch(req: BatchDetails) {
    const { userId, batchName, startDate, courseId, timings, students } = req;
    const client = await pool.connect();
    const currentDate = new Date();
    try {
        const batch_uniqueId = genUniqueIdFunc()
        const query = 'INSERT INTO batch_details (batch_unique_id, email_id, batch_name, start_date, course_id, timings, students, scheduled_tasks, createdat_updatedat, batch_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
        const values: any[] = [batch_uniqueId, userId, batchName, startDate, courseId, timings, JSON.stringify(students), '{}', currentDate, 'Active']
        const result = await client.query(query, values)
        if (result.rows.length > 0) {
            return result.rows[0]
        }
    } catch (error: any) {
        return error;
    } finally {
        client.release();
    }
}

export const getDBatches = async (email_id: string) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM batch_details WHERE email_id = $1', [email_id]);
        if (result) {
            return result.rows;
        }
    } catch (error) {
        return error;
    } finally {
        client.release();
    }
}

export const editBatch = async (req: BatchDetails) => {
    const client = await pool.connect();
    const currentDate = new Date();
    try {
        const { batchUniqueId, batchName, startDate, timings, courseId, students } = req
        const query = `UPDATE batch_details 
            SET 
                batch_name = $1, 
                start_date = $2, 
                timings = $3, 
                course_id = $4, 
                students = $5,
                createdat_updatedat = $6
            WHERE 
                batch_unique_id = $7`
        const values: any = [batchName, startDate, timings, courseId, JSON.stringify(students), currentDate, batchUniqueId]
        try {
            const result = await client.query(query, values)
            if (result) {
                return true;
            }
        } catch (err) {
            console.log("errrrr", err)
            return false;
        }
    } catch (err) {
        console.log(err);
        return err;
    } finally {
        client.release();
    }
}

export const changeBthStatus = async (data: StatusDetails) => {
    const client = await pool.connect();
    try {
        const query = `UPDATE batch_details SET batch_status = $1 WHERE batch_unique_id = $2 RETURNING *`
        const values = [data.status, data.batchId]
        const result = await client.query(query, values);
        if (result.rowCount) {
            return result.rows
        }
    } catch (err:any) {
        throw new Error(err);
    } finally {
        client.release();
    }
}

export const removeBatch = async (batchId: any) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`DELETE FROM batch_details WHERE batch_unique_id = $1`, [batchId])
        if (result.rowCount === 1) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err)
        return false;
    } finally {
        client.release();
    }
}

async function checkTaskExists(client: any, task: any, batchId: string) {
    return new Promise(async (resolve, reject) => {
        const response = await client.query(`SELECT scheduled_tasks from batch_details WHERE batch_unique_id = $1`, [batchId])
        if (response.rows[0]?.scheduled_tasks?.length > 0) {
            const scheduledTask = response.rows[0]?.scheduled_tasks;
            const sameTask = [];
            scheduledTask?.map((items: any) => {
                const parsed = JSON.parse(items)
                if (parsed.taskId === task.taskId) {
                    sameTask.push(parsed)
                }
            })
            if (sameTask.length > 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        } else {
            resolve(false);
        }
    })
}

export const insertTask = async (data: any) => {
    const client = await pool.connect();
    const taskExist = await checkTaskExists(client, data.task, data.batchId)
    if (!taskExist) {
        const query = `UPDATE batch_details
                SET scheduled_tasks = array_append(scheduled_tasks, $1)
                WHERE batch_unique_id = $2
                AND NOT EXISTS (
                    SELECT 1
                    FROM batch_details
                    WHERE batch_unique_id = $2
                    AND $1 = ANY (scheduled_tasks)
                ) RETURNING *`
        const values = [JSON.stringify(data.task), data.batchId]
        const result = await client.query(query, values);
        return result.rowCount;
    }
    client.release();
}