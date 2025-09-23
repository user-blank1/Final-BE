import { Router } from "express";
import { product_post } from "../controller/productController.js";
import { product_popular_get } from "../controller/productController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { product_get } from "../controller/productController.js";
import { product_rent_post } from "../controller/productController.js";
import { product_all_get } from "../controller/productController.js";
import { product_delete } from "../controller/productController.js";
import { admin_delete } from "../controller/productController.js";
import { edit_product_title } from "../controller/productController.js";
import { edit_product_description } from "../controller/productController.js";
import { edit_product_price } from "../controller/productController.js";
import { edit_product_draft } from "../controller/productController.js";
import { product_all_get_admin } from "../controller/productController.js";
import { get_rezervations } from "../controller/productController.js";
import { edit_product_return_date } from "../controller/productController.js";
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
productRouter.get("/all/admin", requireAuth, product_all_get_admin);
productRouter.delete("/admin/:id", requireAuth, admin_delete);
productRouter.delete("/:id", requireAuth, product_delete);
productRouter.put("/edit/title/:id", requireAuth, edit_product_title);
productRouter.put("/edit/description/:id", requireAuth, edit_product_description);
productRouter.put("/edit/price/:id", requireAuth, edit_product_price);
productRouter.put("/edit/draft/:id", requireAuth, edit_product_draft);
productRouter.get("/rezervations", requireAuth, get_rezervations);
productRouter.put("/edit/returndate/:id", requireAuth, edit_product_return_date);
export default productRouter;
