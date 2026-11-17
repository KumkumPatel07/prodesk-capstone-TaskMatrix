const express = require("express");
const router = express.Router();

const Workspace = require("../models/Workspace");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE WORKSPACE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Workspace name is required" });
    }

    const workspace = await Workspace.create({
      name,
      ownerId: req.user.id,
      members: [
        {
          userId: req.user.id,
          role: "Administrator",
        },
      ],
    });

    res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET MY WORKSPACES
router.get("/", authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.userId": req.user.id,
    });

    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;