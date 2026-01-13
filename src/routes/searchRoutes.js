import { Router } from "express";
import { searchByLocation, detailsById } from "../controllers/searchController.js";

const router = Router();

// Search flights & attractions by location name
router.get("/search/:locationname", searchByLocation);

// Get single flight or attraction details by id

router.get("/details/:id", detailsById);

export default router;
