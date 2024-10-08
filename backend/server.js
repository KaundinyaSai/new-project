import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./userRoutes.js";
import taskRoutes from "./taskRoutes.js";

const app = express();
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON bodies

// Use user routes
app.use(userRoutes);
app.use(taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
