import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.json());

mongoose
    .connect(process.env.DB_URI)
    .then((result) => {
        app.listen(3000);
        console.log("http://localhost:3000");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
