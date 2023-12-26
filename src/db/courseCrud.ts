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

export const insertNewCourse = async (req: NewCourseDetails) => {
    const client = await pool.connect();
    try {
        const course_uniqueId = genUniqueIdFunc()
        const query = 'INSERT INTO course_details (course_id, course_name, createdby_updatedby, createdat_updatedat, description, duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        const values: string[] = [course_uniqueId, req.courseName, req.createdBy_updatedBy, req.createdAt_updatedAt, req.description, req.courseDuration]
        const result = await client.query(query, values)
        if (result.rows.length > 0) {
            return result.rows[0]
        }
    } catch (error) {
        throw error
    } finally {
        client.release();
    }
}

export const getAllCourses = async () => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM course_details')
        if (result) {
            return result.rows;
        }
    } catch (error) {
        throw error;
    } finally {
        client.release();
    }
}


export const editCourse = async (req: any) => {
    const client = await pool.connect();
    try {
        const { courseName, courseDuration, description, course_id } = req?.apiData;
        const conditions = [];
        const values = [];
        if (!courseName && !courseDuration && !description) {
            return false;
        }
        if (courseName) {
            conditions.push(`course_name = $${values.length + 1}`)
            values.push(courseName);
        }
        if (courseDuration) {
            conditions.push(`duration = $${values.length + 1}`)
            values.push(courseDuration)
        }
        if (description) {
            conditions.push(`description = $${values.length + 1}`)
            values.push(description)
        }
        values.push(course_id)
        const query = `UPDATE course_details SET ${conditions.join(", ")} WHERE course_id = $${values.length}`
        try {
            const result = await client.query(query, values)
            if (result) {
                return true;
            }
        } catch (err) {
            return false;
        }
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

export const removeCourse = async (courseId: any) => {
    const client = await pool.connect();
    try {
        const result = await client.query(`DELETE FROM course_details WHERE course_id = $1`, [courseId])
        if (result.rowCount === 1) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        return false;
    } finally {
        client.release();
    }
}