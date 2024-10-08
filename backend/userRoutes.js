import "dotenv/config";
import express, { Router } from "express";
import database from "./database.js";
import argon2 from "argon2";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const router = Router();

// Generate random salt value
function getSalt(length) {
  return crypto.randomBytes(length).toString("hex");
}

// POST: Signup
router.post("/api/users/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const query = "INSERT INTO users(username, email, password) VALUES(?, ?, ?)";

  try {
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

// POST: Login
router.post("/api/users/login", (req, res) => {
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
        } else {
          // JWT token creation
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "3d",
          });

          res.status(201).json({
            message: "User logged in successfully",
            token,
          });
        }
      } catch (error) {
        console.error("Password verification error:", error);
        return res.status(500).json({
          Error: "Internal server error during password verification",
        });
      }
    }
  );
});

// DELETE: Remove user by ID
router.delete("/api/users/id/:id", (req, res) => {
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

// Export the router
export default router;
