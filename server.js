import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./controller/userRoutes.js";
import User from "./Models/User.js";
import productRouter from "./controller/productRoutes.js";
import { checkExpiredRentals } from "./controller/productController.js";
import Product from "./Models/Product.js";
import fs from "fs";

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

async function seedProducts() {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
        console.log("Products already exist.");
        return;
    }

    const sampleProducts = [
        {
            name: "Hammer small",
            description: "Professional chammer with multiple speed settings",
            price: 25,
            imageUrl: "uploads/hammer1.png",
            available: true,
            popularity: 15,
        },
        {
            name: "Lawn medium",
            description: "A large hammer specifically designed for BIG nails",
            price: 40,
            imageUrl: "uploads/hammer2.png",
            available: true,
            popularity: 22,
        },
        {
            name: "toolset 1",
            description: "Many tools in one for all manual work needs.",
            price: 35,
            imageUrl: "uploads/toolset1.png",
            available: true,
            popularity: 18,
        },
        {
            name: "toolset 2",
            description: "A complete set of tools for all your DIY projects.",
            price: 30,
            imageUrl: "uploads/toolset2.png",
            available: true,
            popularity: 12,
        },
        {
            name: "toolset 3",
            description: "A versatile toolset for all your home improvement needs.",
            price: 60,
            imageUrl: "uploads/toolset3.png",
            available: true,
            rentedBy: null,
            popularity: 25,
        },
        {
            name: "Lawnmower Pro X200",
            description: "A powerful lawnmower for professional landscaping.",
            price: 60,
            imageUrl: "uploads/lawnmower.png",
            available: true,
            rentedBy: null,
            popularity: 15,
        },
        {
            name: "Generator ZX500",
            description: "A powerful generator for backup power and outdoor events.",
            price: 60,
            imageUrl: "uploads/generator.png",
            available: true,
            rentedBy: null,
            popularity: 15,
        },
        {
            name: "Hose Reel Deluxe",
            description: "A premium hose reel for easy watering.",
            price: 60,
            imageUrl: "uploads/hose.png",
            available: true,
            rentedBy: null,
            popularity: 15,
        },
        {
            name: "Drill Master 3000",
            description: "A powerful drill for professional use.",
            price: 60,
            imageUrl: "uploads/drill.png",
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
