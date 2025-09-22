import { Router } from "express";
import { signup_post } from "./userController.js";
import { login_post } from "./userController.js";
import { logout_get } from "./userController.js";
import { get_user_products } from "./userController.js";
import { get_all_users } from "./userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { get_user } from "./userController.js";
const router = Router();

router.post("/signup", signup_post);
router.post("/login", login_post);
router.get("/user/:userId", requireAuth, get_user_products);
router.get("/logout", logout_get);
router.get("/products/:userId", get_user_products);
router.get("/users", requireAuth, get_all_users);
router.get("/user/:userId", requireAuth, get_user);
export default router;
