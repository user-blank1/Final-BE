import { Router } from "express";
import { signup_post } from "./userController.js";
import { login_post } from "./userController.js";
import { logout_get } from "./userController.js";
const router = Router();

router.post("/signup", signup_post);
router.post("/login", login_post);
router.get("/logout", logout_get);
export default router;
