import { asyncHandler } from "../utils/asyncHandler.js";
import { searchFlights, getFlightById } from "../models/flightModel.js";
import { searchAttractions, getAttractionById } from "../models/attractionModel.js";

export const searchByLocation = asyncHandler(async (req, res) => {
  const locationname = String(req.params.locationname || "").trim();
  const q = `%${locationname}%`;


  // Fetch data from models
  const Flights = await searchFlights(q);
  const Attractions = await searchAttractions(q);

  const GeoInfo =
    Flights.length > 0
      ? { location: locationname, country: Flights[0].country ?? null }
      : { location: locationname, country: null };

  res.json({ GeoInfo, Flights, Attractions });
});

export const detailsById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const searchtype = String(req.query.searchtype || "").toLowerCase();

  // Validate search type
  if (!["flight", "attraction"].includes(searchtype)) {
    return res.status(400).json({
      status: false,
      message: "Invalid searchtype. Use ?searchtype=flight or ?searchtype=attraction",
    });
  }

  // Flight details
  if (searchtype === "flight") {
    const Flight = await getFlightById(id);
    if (!Flight) return res.status(404).json({ status: false, message: "Flight not found" });

    return res.json({
      GeoInfo: { id: Flight.id, location: Flight.location, country: Flight.country },
      Flight,
    });
  }

  // Attraction details
  const Attraction = await getAttractionById(id);
  if (!Attraction) return res.status(404).json({ status: false, message: "Attraction not found" });

  return res.json({
    GeoInfo: { id: Attraction.id, location: Attraction.city, country: Attraction.country },
    Attraction,
  });
});
