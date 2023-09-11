import { Router } from "express";
import controller from "../controllers";
const route = Router();

route.post("/validate", controller.validateChanges);
route.post("/update", controller.updateProducts);
export default route;

