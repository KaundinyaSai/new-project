import { query, Router } from "express";
import "dotenv/config";
import database from "./database.js";
import jwt from "jsonwebtoken";

const router = Router();

//POST: create task
router.post("/api/tasks", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // Verify the token to get the user_id
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = decoded.id;

    const { title, status } = req.body;

    const query = "INSERT INTO tasks (title, status, user_id) VALUES (?, ?, ?)";

    database.query(query, [title, status, userId], (err, result) => {
      if (err) {
        console.error("ERROR:", err);
        return res
          .status(500)
          .json({ error: "An error occurred during task creation" });
      }

      res.status(201).json({
        message: "Task created successfully",
        taskId: result.insertId,
      });
    });
  });
});

router.get("/api/tasks/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  if (!user_id) {
    console.error("User ID is missing");
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = "SELECT * FROM tasks WHERE user_id = ?";
  database.query(query, [user_id], (err, result) => {
    if (err) {
      console.error("ERROR:", err);

      return res
        .status(500)
        .json({ error: "An error occurred during task retrieval" });
    }

    res.json(result);
  });
});

router.delete("/api/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  const query = "DELETE FROM tasks WHERE id =?";
  database.query(query, [taskId], (err, result) => {
    if (err) {
      console.error("ERROR:", err);
      return res
        .status(500)
        .json({ error: "An error occurred during task deletion" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted succesfully" });
  });
});

export default router;
