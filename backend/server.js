import "dotenv/config";
import express from "express";
import mysql2 from "mysql2";
import cors from "cors";
import argon2 from "argon2";
import crypto from "crypto";

const app = express();
const database = mysql2.createConnection({
  host: "localhost",
  user: "root",
  database: process.env.DATA_BASE_NAME,
  password: process.env.DATA_BASE_PASSWORD,
});

database.connect((error) => {
  if (error) {
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

app.post("/api/users/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const query = "INSERT INTO users(username, email, password) VALUES(?, ?, ?)";

  try {
    // Generate a new salt for each signup attempt
    const salt = getSalt(16);
    const hashedPass = await argon2.hash(password, {
      salt: Buffer.from(salt, "hex"),
    });

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
          id: result.insertId,
        },
      });
    });
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ Error: "An error occurred during signup" });
  }
});

app.post("/api/users/login", (req, res) => {
  const { emailORusername, password } = req.body;
  const query = "SELECT * FROM users WHERE email= ? OR username = ?";

  database.query(
    query,
    [emailORusername, emailORusername],
    async (err, result) => {
      if (err) {
        console.error("Database Error:", err);
        res.status(500).json({ Error: "Could not find user" });
        return;
      }

      if (result.length === 0) {
        return res
          .status(401)
          .json({ Error: "Invalid username or email or password" });
      }

      const user = result[0];
      try {
        const validPass = await argon2.verify(user.password, password);

        if (!validPass) {
          return res
            .status(401)
            .json({ Error: "Invalid username or email or password" });
        }

        return res.status(200).json({ Message: "Login successful" });
      } catch (error) {
        console.error("Password verification error:", error);
        return res.status(500).json({
          Error: "Internal server error during password verification",
        });
      }
    }
  );
});

app.delete("/api/users/id:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id= ?";

  if (!Number.isInteger(Number(id))) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  database.query(query, [id], (err, result) => {
    if (err) {
      console.error("Database Error:", err);
      res.status(500).json({ error: "Could not delete user" });
      return;
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "User not found" });
    }
    res.json({ Message: "User deleted successfully" });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sever is running at http://localhost:${PORT}`);
});
