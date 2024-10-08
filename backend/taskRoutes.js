import { Router } from "express";
import "dotenv/config";
import database from "./database.js";

const router = Router();

router.get("/api/tasks", (req, res) => {
  res.send("ITS WORKING!!!");
});

export default router;
