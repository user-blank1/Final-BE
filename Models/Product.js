import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    available: { type: Boolean, default: true },
    rentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    rentedFor: { type: Number, default: 0 },
    popularity: { type: Number, default: 0 },
    returnDate: { type: Date, default: null },
    draft: { type: Boolean, default: false },
});

const Product = mongoose.model("Product", productSchema, "products");
export default Product;
