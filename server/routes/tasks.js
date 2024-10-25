// server/routes/tasks.js
import express from "express";
import Task from "../models/task.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware para verificar o token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send("Token required");
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

router.use(verifyToken);

// Operações CRUD para tarefas
router.post("/", async (req, res) => {
  const task = new Task({ ...req.body, userId: req.user.id });
  await task.save();
  res.status(201).send(task);
});

router.get("/", async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.send(tasks);
});

export default router;
