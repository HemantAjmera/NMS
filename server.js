import express from "express";
import dotenv from "dotenv";
dotenv.config();

import { dirname } from 'path'
import { fileURLToPath } from "url";
import path from "path";

//db
import connectDB from "./db/connect.js";

//routers
import authRouter from "./routes/authRoutes.js";
import nurseryRouter from "./routes/nurseryRoutes.js";
import staffAuthRouter from "./routes/staffAuthRoutes.js";
import staffRouter from './routes/staffRoutes.js'

//middleware
import errorHanlerMiddleware from "./middleware/error-handler.js";
import notFoundMiddleware from "./middleware/not-found.js";
import authenticateUser from "./middleware/auth.js";
import activeUserMiddleware from "./middleware/active-user.js";
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname, './client/build')))
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ msg: "Start" });
});

app.get("/api/v1", (req, res) => {
    res.json({ msg: "Welcome" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/nursery",[authenticateUser, activeUserMiddleware], nurseryRouter);
app.use("/api/v1/staffAuth", staffAuthRouter);
app.use("/api/v1/staff",[authenticateUser, activeUserMiddleware], staffRouter);

app.use("*",(req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})

app.use(notFoundMiddleware);
app.use(errorHanlerMiddleware);
const PORT = process.env.PORT || 5000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(PORT, () => {
            console.log(`Server is listning at ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};

start();
