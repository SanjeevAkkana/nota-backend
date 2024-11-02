import Note from "../models/Note.js";
import User from "../models/User.js";

export const getNotesByUser = async (req, res) => {
    const { userId } = req.params;

    try {
        let user;
        if (userId) {
            // Find user by ID
            user = await User.findById(userId);
        }

        // If no user found, send an error response
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Retrieve notes associated with the found user's ID
        const notes = await Note.find({ userId: user._id });
        res.json(notes);
    } catch (error) {
        console.error("Error retrieving notes:", error);
        res.status(500).json({ error: "Failed to retrieve notes" });
    }
};

export const createNote = async (req, res) => {
    const { title, content, userId, isFavourite } = req.body;

    // Ensure title and userId are provided
    if (!title || !userId) {
        return res.status(400).json({ error: "Title and userId are required" });
    }

    try {
        // Create a new note instance
        const note = new Note({
            title,
            content: content || "", // Default content to an empty string if not provided
            userId,
            isFavourite: isFavourite || false, // Default to false if not provided
        });

        // Save note to the database
        await note.save();

        res.status(201).json({ msg: "Note created successfully", note });
    } catch (error) {
        console.error("Error creating note:", error);
        res.status(500).json({ error: "Failed to create note" });
    }
};

// Update Note
export const updateNote = async (req, res) => {
    const { noteId } = req.params;
    const { title, content, isFavourite } = req.body;

    try {
        // Find and update note if it belongs to the user
        const note = await Note.findOneAndUpdate(
            { _id: noteId }, // Ensure note belongs to the user
            { title, content, isFavourite },
            { new: true, runValidators: true }
        );

        if (!note) {
            return res.status(404).json({ error: "Note not found or unauthorized" });
        }

        res.status(200).json({ msg: "Note updated successfully", note });
    } catch (error) {
        console.error("Error updating note:", error);
        res.status(500).json({ error: "Failed to update note" });
    }
};

// Delete Note
export const deleteNote = async (req, res) => {
    const { noteId } = req.params;

    try {
        // Find and delete note if it belongs to the user
        const note = await Note.findOneAndDelete({ _id: noteId });

        if (!note) {
            return res.status(404).json({ error: "Note not found or unauthorized" });
        }

        res.status(200).json({ msg: "Note deleted successfully" });
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ error: "Failed to delete note" });
    }
};