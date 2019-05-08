import { Router } from "express";
import handlerCategory from "../controllers/handler-category";
//import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";
//import UserController from "../controllers/UserController";

const router = Router();
//Login route
//router.post("/login", AuthController.login);

//Change my password
//router.post("/change-password", [checkJwt], AuthController.changePassword);

router.get('/', handlerCategory.allCategories);

router.get('/:id', handlerCategory.getCategory);

router.post('/', handlerCategory.addCategory);

router.delete('/:id', handlerCategory.deleteCategory);

export default router;