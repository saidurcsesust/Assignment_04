import { Router } from "express";
import { fetchAttractions } from "../controllers/attractionController.js";

const router = Router();

router.get("/fetch-attraction", fetchAttractions);

export default router;
