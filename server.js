import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
import authRouter from "./routes/UserRoute.js";
import noteRouter from "./routes/NoteRoute.js";
import taskRouter from "./routes/TaskRoute.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Working..")
})

app.use("/auth", authRouter);
app.use("/note", noteRouter);
app.use("/task", taskRouter);

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.on("error", err => {
    console.log("err", err)
})

mongoose.connection.on("connected", (err, res) => {
    app.listen(8080, () => {
        console.log(`API is listening on port 8080`);
    });
})