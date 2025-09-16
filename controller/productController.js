import Product from "../Models/Product.js";
const handleErrors = (err) => {
    if (err.includes("E11000")) {
        return "product name already exists";
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
    const products = await Product.find().sort({ popularity: -1 }).limit(3);
    console.log(products);
}
