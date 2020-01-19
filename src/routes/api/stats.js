import { Pool } from "pg";
import config from "../../config";

let pool;

export async function get(req, res, next) {
    if (!pool) {
        pool = new Pool(config.db);
    }
    const response = await pool.query(
        "SELECT * FROM quizs WHERE active=true OR completed=3 OR wrong=5;"
    );
    const quizs = response.rows;
    res.end(
        JSON.stringify({
            completed: quizs.filter((q) => q.completed === 3).length,
            pending: quizs.filter((q) => q.completed < 3 && q.wrong < 5).length,
            failed: quizs.filter((q) => q.wrong === 5).length,
        })
    );
}
