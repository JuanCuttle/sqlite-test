import { Router, Request, Response } from "express";
import routesCategory from "./routes-category";
//import user from "./user";
//import user from "../controllers/UserController"

const routes = Router();

routes.use("/categories", routesCategory);
//routes.use("/user", routesCategory);
//routes.use('/auth', routesCategory);

export default routes;
