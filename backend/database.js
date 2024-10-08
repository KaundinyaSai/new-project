// database.js
import mysql2 from "mysql2";
import "dotenv/config";

const database = mysql2.createConnection({
  host: "localhost",
  user: "root",
  database: process.env.DATA_BASE_NAME,
  password: process.env.DATA_BASE_PASSWORD,
});

// Connect to the database
database.connect((error) => {
  if (error) {
    console.log("Database connection error:", error);
    return;
  }
  console.log("Successfully connected to the database");
});

export default database;
