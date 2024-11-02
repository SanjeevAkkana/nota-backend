import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isFavourite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
