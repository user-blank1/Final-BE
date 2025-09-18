import User from "../Models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const createToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: "3d" });
};
export async function signup_post(req, res) {
    const { username, email, password } = req.body;
    try {
        const user = await User.create({ email, username, password });
        let token;
        try {
            token = createToken(user._id);
        } catch (tokenError) {
            await User.findByIdAndDelete(user._id);
            throw new Error("Token generation failed");
        }
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(201).json({ user: userWithoutPassword, token });
    } catch (error) {
        const msg = error.message;
        res.status(500).json({ error: msg });
    }
}

export async function login_post(req, res) {
    const { username, password } = req.body;
    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        const { password: _, ...userWithoutPassword } = user.toObject();
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
        const msg = error.message;

        res.status(500).json({ error: msg });
    }
}

export async function logout_get(req, res) {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "Logged out successfully" });
}

export async function get_user_products(req, res) {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("rentedProducts");
    const products = user.rentedProducts;
    res.status(200).json({ products });
}
