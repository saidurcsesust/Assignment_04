import { Router } from "express";
import { fetchFlightDetails } from "../controllers/flightController.js";

const router = Router();

router.get("/fetch-flight-details", fetchFlightDetails);

export default router;
