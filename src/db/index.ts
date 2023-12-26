import bcrypt from "bcrypt";
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config();


const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB
});

const passwordHasing = (password: string) => {
  const saltRounds = 5;
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err: any, hash: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(hash);
      }
    });
  })
}



export const checkCredentials = async (req: LoginCredentials) => {
  const client = await pool.connect();
  try {
    const dbResult = await client.query(
      `SELECT * FROM login_credentials WHERE email_id = $1`,
      [req.userEmailId]
    );

    if (dbResult.rows.length === 0) {
      return {
        authentication: false,
        message: "Not a valid user"
      };
    }
    const storedHashedPass = dbResult.rows[0].password;
    const isPasswordMatch = await bcrypt.compare(req.password as string, storedHashedPass);
    if (!isPasswordMatch) {
      return {
        authentication: false,
        message: 'Incorrect password'
      };
    }
    return {
      authentication: true,
      result: {
        user_id: dbResult.rows[0].unique_id,
        user_name: dbResult.rows[0].user_name,
        first_name: dbResult.rows[0].first_name,
        last_name: dbResult.rows[0].last_name,
        user_emailId: dbResult.rows[0].email_id,
        is_admin: dbResult.rows[0].is_admin
      }
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export async function fetchAllUsers() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT unique_id, user_name, first_name, last_name, email_id, is_admin FROM login_credentials')
    if (result) {
      return result?.rows;
    }
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function fetchSelectedUserBatches(emailId: string) {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM batch_details WHERE email_id = $1', [emailId])
    if (result) {
      return result?.rows;
    }
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

export async function fetchAllTasks() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM task_credentials');
    if (result) {
      return result.rows;
    }
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}