import Task from "../models/Task.js";

// Controller to get tasks by user
export const getTasksByUser = async (req, res) => {
    const { userId } = req.params; // Assuming the user ID is passed as a URL parameter

    try {
        const tasks = await Task.find({ userId }); // Fetch tasks for the given user ID

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ msg: "No tasks found for this user." });
        }

        res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve tasks for this user" });
    }
};

// Controller to create a new task associated with a user
export const createTask = async (req, res) => {
    const { title, description, subtasks } = req.body; // Only title is mandatory
    const { userId } = req.params; // Assuming the user ID is passed as a URL parameter

    if (!title) {
        return res.status(400).json({ msg: "Title is required" });
    }

    try {
        // Create a new task associated with the user
        const task = new Task({
            title,
            description,
            subtasks,
            userId, // Associate task with the user
        });

        await task.save();

        res.status(201).json({ msg: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ error: "Failed to create task" });
    }
};

export const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { title, description, subtasks, status } = req.body;

    try {
        // Find the task by taskId and userId
        const task = await Task.findOneAndUpdate(
            { _id: taskId },
            { title, description, subtasks, status },
            { new: true } // Returns the updated document
        );

        if (!task) {
            return res.status(404).json({ msg: "Task not found or you don't have permission to update this task" });
        }

        res.json({ msg: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }
};

// Controller to delete a task by userId and taskId
export const deleteTask = async (req, res) => {
    const { userId, taskId } = req.params;

    try {
        // Find and delete the task by taskId and userId
        const task = await Task.findOneAndDelete({ _id: taskId, userId });

        if (!task) {
            return res.status(404).json({ msg: "Task not found or you don't have permission to delete this task" });
        }

        res.json({ msg: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" });
    }
};
