import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";


const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

console.log({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

async function connectDB() {
    try {
        const client = await pool.connect();
        console.log("✅ PostgreSQL Connected Successfully");
        client.release();
    }
    catch(error){
        console.log("❌ PostgreSQL Connection Failed");
        console.log(error.message);
    }
}

export { pool, connectDB };