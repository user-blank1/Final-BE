import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: [true, "Email already exists"] },
    username: { type: String, required: true, unique: [true, "Username already exists"] },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    rentedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
    ],
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ username });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("incorrect password entered");
    }
    throw Error("incorrect username entered");
};
const User = mongoose.model("User", userSchema, "users");

export default User;
