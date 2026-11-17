const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE TASK
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { projectId, title, description, status, priority, assignedId, dueDate } = req.body;

    if (!projectId || !title) {
      return res.status(400).json({ message: "Project ID and title are required" });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      status,
      priority,
      assignedId,
      dueDate,
      authorId: req.user.id,
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET LOGGED-IN USER'S TASKS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ authorId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE TASK
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const allowedFields = ["title", "description", "status", "priority", "assignedId", "dueDate"];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    await task.save();

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;