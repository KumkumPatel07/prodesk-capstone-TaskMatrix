const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["Administrator", "Project Manager", "Team Member"],
          default: "Team Member",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workspace", workspaceSchema);