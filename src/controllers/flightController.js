import { asyncHandler } from "../utils/asyncHandler.js";
import {
  fetchDestinationId,
  searchFlightsOffers,
  getFlightDetailsByToken,
  extractFlightData,
} from "../services/flightService.js";
import { insertFlight } from "../models/flightModel.js";

export const fetchFlightDetails = asyncHandler(async (req, res) => {
  // manually add location  
  const fromLocation = "Amsterdam"; 
  const fromId = await fetchDestinationId(fromLocation);
  const toId = await fetchDestinationId("Dubai");

  const departDateISO = "2026-01-13"; 

  const offers = await searchFlightsOffers({ fromId, toId, departDateISO });

  const MAX = 5;
  const savedFlights = [];
  const tokensUsed = [];

  for (const offer of offers.slice(0, MAX)) {
    const token = offer?.token;
    if (!token) continue;

    tokensUsed.push(token);

    const detailsResult = await getFlightDetailsByToken(token);
    const flightData = extractFlightData(detailsResult, fromLocation);

    const values = [
      flightData.flight_name,
      flightData.arrival_airport,
      flightData.departure_airport,
      flightData.arrival_time,
      flightData.departure_time,
      flightData.flight_logo,
      flightData.fare,
      flightData.country,
      flightData.location,
    ];

    const saved = await insertFlight(values);
    savedFlights.push(saved);
  }

  res.json({
    status: true,
    fromId,
    toId,
    departDate: departDateISO,
    totalTokens: tokensUsed.length,
    tokens: tokensUsed,
    saved: savedFlights,
  });
});
