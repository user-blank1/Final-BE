import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./controller/userRoutes.js";
import User from "./Models/User.js";
import productRouter from "./controller/productRoutes.js";
import { checkExpiredRentals } from "./controller/productController.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/uploads", express.static("uploads"));
async function seedAdmin() {
    const adminExists = await User.findOne({ username: "admin" });
    if (adminExists) {
        console.log("Admin user already exists.");
        return;
    }

    const admin = new User({
        email: "admin@example.com",
        username: "admin",
        password: "Password@123",
        role: "admin",
    });

    await admin.save();
    console.log("Admin user created!");
}

mongoose
    .connect(process.env.DB_URI)
    .then(async (result) => {
        await seedAdmin();
        app.listen(3000);
        console.log("http://localhost:3000");
        setInterval(checkExpiredRentals, 60 * 60 * 1000);
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
