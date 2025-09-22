import Product from "../Models/Product.js";
import User from "../Models/User.js";
const handleErrors = (err) => {
    if (err.includes("E11000")) {
        return "product name already exists";
    } else {
        return "something went wrong";
    }
};
export async function product_post(req, res) {
    const { productName, productDescription, productPrice, available, popularity } = req.body;

    const productImage = req.file.path;

    try {
        const product = await Product.create({
            name: productName,
            description: productDescription,
            price: productPrice,
            imageUrl: productImage,
            available,
            popularity,
        });
        res.status(201).json({ product });
    } catch (error) {
        console.log(error.message);
        const msg = handleErrors(error.message);
        res.status(500).json({ error: msg });
    }
}

export async function product_popular_get(req, res) {
    try {
        const products = await Product.find().sort({ popularity: -1 }).limit(3);
        res.status(200).json({ products });
    } catch (err) {
        res.status(500).json({ err });
    }
}

export async function product_get(req, res) {
    const title = req.params.title;
    try {
        const product = await Product.findOne({ name: title });
        res.status(200).json({ product });
    } catch (error) {
        const msg = handleErrors(error.message);
        res.status(500).json({ error: msg });
    }
}

export async function product_rent_post(req, res) {
    const { productTitle, days, minutes, userId } = req.body;
    if (!productTitle || (!days && days !== 0) || !userId) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const product = await Product.findOne({ name: productTitle });
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        if (product.rentedBy) {
            return res.status(400).json({ error: "Product is already rented" });
        }
        const returnDate = new Date();
        returnDate.setDate(returnDate.getDate() + parseInt(days));
        returnDate.setMinutes(returnDate.getMinutes() + parseInt(minutes));
        product.returnDate = returnDate;
        product.popularity += 1;
        product.available = false;
        product.rentedBy = userId;
        product.rentedFor = days;
        await product.save();
        const user = await User.findById(userId);
        user.rentedProducts.push(product._id);
        await user.save();
        res.status(200).json({ product });
    } catch (error) {
        const msg = handleErrors(error.message);
        res.status(500).json({ error: msg });
    }
}
export async function checkExpiredRentals() {
    try {
        const expiredProducts = await Product.find({
            available: false,
            returnDate: { $lte: new Date() },
        });

        for (const product of expiredProducts) {
            product.available = true;
            product.rentedBy = null;
            product.rentedFor = 0;
            product.returnDate = null;
            await product.save();
            const user = await User.findOne({ rentedProducts: product._id });
            if (user) {
                user.rentedProducts = user.rentedProducts.filter((prodId) => !prodId.equals(product._id));
                await user.save();
            }
        }

        console.log(`Checked ${expiredProducts.length} expired rentals`);
    } catch (error) {
        console.error("Error checking expired rentals:", error);
    }
}

export async function product_all_get(req, res) {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        const msg = handleErrors(error.message);
        res.status(500).json({ error: msg });
    }
}

export async function product_delete(req, res) {
    const productId = req.params.id;

    try {
        const product = await Product.findById(productId);
        product.rentedBy = null;
        product.available = true;
        product.rentedFor = 0;
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        const msg = handleErrors(error.message);
        res.status(500).json({ error: msg });
    }
    try {
        const user = await User.findOne({
            rentedProducts: { $in: [productId] },
        });
        user.rentedProducts = user.rentedProducts.filter((prodId) => !prodId.equals(productId));
        await user.save();
    } catch (error) {
        res.status(500).json({ error: "Failed to update user rented products" });
    }
}
