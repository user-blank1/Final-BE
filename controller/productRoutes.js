import { Router } from "express";
import { product_post } from "../controller/productController.js";
import { product_popular_get } from "../controller/productController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { product_get } from "../controller/productController.js";
import { product_rent_post } from "../controller/productController.js";
import { product_all_get } from "../controller/productController.js";
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

productRouter.get("/popular", requireAuth, product_popular_get);
productRouter.get("/single/:title", requireAuth, product_get);
productRouter.post("/", requireAuth, upload.single("productImage"), product_post);
productRouter.post("/rent", requireAuth, product_rent_post);
productRouter.get("/all", requireAuth, product_all_get);

export default productRouter;
