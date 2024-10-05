import express from "express";
import 'dotenv/config';
import mysql2 from "mysql2";
import cors from "cors";

const app = express();
const database = mysql2.createConnection({
    host: "localhost",
    user: "root",
    database: process.env.DATA_BASE_NAME,
    password: process.env.DATA_BASE_PASSWORD
});

database.connect((error) => {
    if(error){
        console.log(error);
        return;
    }
    console.log("Sucessfully connected to database");
});

app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sever is running at http://localhost:${PORT}`);
});