import { Router } from "express";
import { product_post } from "../controller/productController.js";
import { product_popular_get } from "../controller/productController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import multer from "multer";

const productRouter = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

productRouter.post("/", requireAuth, upload.single("productImage"), product_post);
productRouter.get("/popular", requireAuth, product_popular_get);
export default productRouter;
