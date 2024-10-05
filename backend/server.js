import express from "express";
import 'dotenv/config';
import mysql2 from "mysql2";
import cors from "cors";
import  argon2  from "argon2";
import crypto from "crypto"

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

function getSalt(length) {
    return crypto.randomBytes(length).toString("hex");
}

app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    const query = "INSERT INTO users(username, email, password) VALUES(?, ?, ?)";

    try {
        // Generate a new salt for each signup attempt
        const salt = getSalt(16);
        const hashedPass = await argon2.hash(password, { salt: Buffer.from(salt, "hex") });

        database.query(query, [username, email, hashedPass], (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                res.status(500).json({ Error: "Could not add user" });
                return;
            }
            res.json({
                message: "User added successfully",
                User: {
                    username: username,
                    email: email,
                    id: result.insertId
                }
            });
        });
    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ Error: "An error occurred during signup" });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sever is running at http://localhost:${PORT}`);
});