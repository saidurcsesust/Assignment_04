import { asyncHandler } from "../utils/asyncHandler.js";
import {
  searchAttractionLocation,
  getAttractionDetails,
  extractAttractionData,
} from "../services/attractionService.js";
import { insertAttraction } from "../models/attractionModel.js";

export const fetchAttractions = asyncHandler(async (req, res) => {
  const searchLocation = "Amsterdam"; 

  const slugs = await searchAttractionLocation(searchLocation);

  const savedAttractions = [];
  for (const slug of slugs.slice(0, 5)) {
    const details = await getAttractionDetails(slug);
    const attractionDetails = extractAttractionData(details, slug);

    const values = [
      attractionDetails.attraction_name,
      attractionDetails.attraction_slug,
      attractionDetails.additional_info,
      attractionDetails.cancellation_policy,
      attractionDetails.images,
      attractionDetails.price,
      attractionDetails.whats_included,
      attractionDetails.country,
      attractionDetails.city,
    ];

    const saved = await insertAttraction(values);
    if (saved) savedAttractions.push(saved);
  }

  res.json({
    status: true,
    location: searchLocation,
    total: savedAttractions.length,
    attractions: savedAttractions,
  });
});
