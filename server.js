import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./controller/userRoutes.js";
import User from "./Models/User.js";
import productRouter from "./controller/productRoutes.js";
import { checkExpiredRentals } from "./controller/productController.js";
import Product from "./Models/Product.js";
import fs from "fs";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/uploads", express.static("uploads"));
app.use(
    cors({
        origin: ["https://final-fe-production.up.railway.app"],
        credentials: true,
    })
);
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
    console.log("Admin user created!!");
}

async function seedProducts() {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
        console.log("Products already exist.");
        return;
    }

    const sampleProducts = [
        {
            name: "Dehumidifier 3000",
            description: "Professional dehumidifier with multiple speed settings",
            price: 25,
            imageUrl: "uploads/img1.png",
            available: true,
            popularity: 15,
        },
        {
            name: "Foundation forming machine",
            description: "Makes the ground even and ready for construction.",
            price: 40,
            imageUrl: "uploads/img2.png",
            available: true,
            popularity: 22,
        },
        {
            name: "toolset 1",
            description: "Many tools in one for all manual work needs.",
            price: 35,
            imageUrl: "uploads/img3.png",
            available: true,
            popularity: 18,
        },
        {
            name: "Excavator 5000",
            description: "A heavy-duty excavator for large construction projects.",
            price: 30,
            imageUrl: "uploads/img4.png",
            available: true,
            popularity: 12,
        },
        {
            name: "Fridge",
            description: "A large fridge for storing food and drinks.",
            price: 60,
            imageUrl: "uploads/img5.png",
            available: true,
            rentedBy: null,
            popularity: 25,
        },
        {
            name: "Air Conditioner Pro",
            description: "A powerful air conditioner for professional cooling.",
            price: 60,
            imageUrl: "uploads/img6.png",
            available: true,
            rentedBy: null,
            popularity: 15,
        },
        {
            name: "Tower",
            description: "This tower lifts people to great heights.",
            price: 60,
            imageUrl: "uploads/img7.png",
            available: true,
            rentedBy: null,
            popularity: 15,
        },
        {
            name: "Generator X100",
            description: "A premium generator for backup power.",
            price: 60,
            imageUrl: "uploads/img8.png",
            available: true,
            rentedBy: null,
            popularity: 15,
        },
        {
            name: "Wood chopper 2000",
            description: "A powerful wood chopper for professional use.",
            price: 60,
            imageUrl: "uploads/img9.png",
            available: true,
            rentedBy: null,
            popularity: 15,
        },
    ];

    try {
        await Product.insertMany(sampleProducts);
        console.log("Sample products created!");
    } catch (error) {
        console.error("Error seeding products:", error);
    }
}
mongoose
    .connect(process.env.DB_URI)
    .then(async (result) => {
        await seedAdmin();
        await seedProducts();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
        setInterval(checkExpiredRentals, 60 * 1000);
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });
