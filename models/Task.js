import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subtasks: [
      {
        title: { type: String},
        status: {
          type: String,
          enum: ['todo', 'completed'],
          default: 'todo'
        },
      }
    ],
    status: {
      type: String,
      enum: ['todo', 'completed'],
      default: 'todo'
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;