import Product from "../Models/Product.js";
const handleErrors = (err) => {
    if (err.includes("E11000")) {
        return "product name already exists";
    } else {
        return "something went wrong";
    }
};
export async function product_post(req, res) {
    const { productName, productDescription, productPrice, available } = req.body;

    const productImage = req.file.path;

    try {
        const product = await Product.create({ name: productName, description: productDescription, price: productPrice, imageUrl: productImage, available });
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
        res.status(500), json({ err });
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
