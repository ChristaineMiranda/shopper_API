import { Router } from "express";
import updateProducts from "../controllers";

const route = Router();

route.post("/validate", updateProducts);
export default route;

