const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const Workspace = require("../models/Workspace");
const authMiddleware = require("../middleware/authMiddleware");

// CREATE PROJECT
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { workspaceId, name, description } = req.body;

    if (!workspaceId || !name) {
      return res.status(400).json({
        message: "Workspace ID and project name are required",
      });
    }

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.userId": req.user.id,
    });

    if (!workspace) {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.create({
      workspaceId,
      name,
      description,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET PROJECTS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.userId": req.user.id,
    }).select("_id");

    const workspaceIds = workspaces.map((workspace) => workspace._id);

    const projects = await Project.find({
      workspaceId: { $in: workspaceIds },
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE PROJECT
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const workspace = await Workspace.findOne({
      _id: project.workspaceId,
      "members.userId": req.user.id,
    });

    if (!workspace) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    ["name", "description", "status"].forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE PROJECT
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const workspace = await Workspace.findOne({
      _id: project.workspaceId,
      "members.userId": req.user.id,
    });

    if (!workspace) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await project.deleteOne();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;