import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    available: { type: Boolean, default: true },
    rentedFor: { type: Number, default: 0 }, //number is number of days
    popularity: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema, "products");
export default Product;
