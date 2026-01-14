import { defaultOptions } from "../config/rapidapi.js";

export async function fetchDestinationId(query) {
  const url =
    `https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination` +
    `?query=${query}`;

  const res = await fetch(url, defaultOptions);
  if (!res.ok) throw new Error(`API error ${res.status}`);

  const json = await res.json();
  if (!json?.data?.length) throw new Error("No data returned");

  return json.data[0].id;
}

export async function searchFlightsOffers({ fromId, toId, departDateISO }) {
  const searchUrl =
    "https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights" +
    `?fromId=${fromId}` +
    `&toId=${toId}` +
    `&departDate=${departDateISO}` +
    `&stops=none&pageNo=1&adults=1&children=0%2C17&sort=BEST&cabinClass=ECONOMY&currency_code=AED`;

  const res = await fetch(searchUrl, defaultOptions);
  const json = await res.json();

  const offers = json?.data?.flightOffers;
  if (!offers?.length) throw new Error("No flight offers found");

  return offers;
}

export async function getFlightDetailsByToken(token) {
  const url =
    "https://booking-com15.p.rapidapi.com/api/v1/flights/getFlightDetails" +
    `?token=${token}&currency_code=AED`;

  const res = await fetch(url, defaultOptions);
  const json = await res.json();
  return json;
}

export function extractFlightData(detailsResult, location) {
  return {
    flight_name:
      detailsResult?.data?.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.name || null,
    arrival_airport:
      detailsResult?.data?.segments?.[0]?.arrivalAirport?.name || null,
    departure_airport:
      detailsResult?.data?.segments?.[0]?.departureAirport?.name || null,
    arrival_time:
      detailsResult?.data?.segments?.[0]?.arrivalTime || null,
    departure_time:
      detailsResult?.data?.segments?.[0]?.departureTime || null,
    flight_logo:
      detailsResult?.data?.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.logo || null,
    fare:
      detailsResult?.data?.priceBreakdown?.total?.units || null,
    country:
      detailsResult?.data?.segments?.[0]?.departureAirport?.countryName || null,
    location,
  };
}
