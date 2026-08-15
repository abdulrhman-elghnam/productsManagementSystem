import mysql from "mysql2/promise";
import config from "#/config/config.js";

const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USERNAME,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,

  waitForConnections: true,
  connectionLimit: 4,
  queueLimit: 0,
});

export default pool;
