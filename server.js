import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;



const app = express();
const PORT = 3000;

app.use(express.static('public'));


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'postgres',
    port: 5432
});

/*
CREATE TABLE IF NOT EXISTS flights (
  id SERIAL PRIMARY KEY,
  flight_name TEXT,
  arrival_airport TEXT,
  departure_airport TEXT,
  arrival_time TIMESTAMP,
  departure_time TIMESTAMP,
  flight_logo TEXT,
  fare NUMERIC,
  country TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/


export let selectedFromAirportIds = [];
export let selectedToAirportIds = [];

const RAPIDAPI_KEY =
    process.env.RAPIDAPI_KEY || '5b72b57432msh20b34daec2968bap16f987jsncc0792fc26ea';

const RAPIDAPI_HOST = 'booking-com15.p.rapidapi.com';

const defaultOptions = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
    }
};


async function fetchDestination(query) {
    const url =
        `https://booking-com15.p.rapidapi.com/api/v1/flights/searchDestination` +
        `?query=${query}`;

    const res = await fetch(url, defaultOptions);
    if (!res.ok) throw new Error(`API error ${res.status}`);

    const json = await res.json();
    if (!json?.data?.length) {
        throw new Error('No data returned');
    }

    return json.data[0].id;
}




app.get('/fetch-flight-details', async (req, res) => {
    try {
        const fromLocation = "Amsterdam";
        const fromId = await fetchDestination('Amsterdam');
        const toId = await fetchDestination('Dubai');
        const departDate = '13-01-2026'; // DD-MM-YYYY

        const searchUrl =
            'https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights' +
            '?fromId=AMS.AIRPORT' +
            '&toId=DXB.AIRPORT' +
            '&departDate=2026-01-13' +
            '&stops=none' +
            '&pageNo=1' +
            '&adults=1' +
            '&children=0%2C17' +
            '&sort=BEST' +
            '&cabinClass=ECONOMY' +
            '&currency_code=AED';
        const searchResponse = await fetch(searchUrl, defaultOptions);
        const searchResult = await searchResponse.json();
        const offers = searchResult?.data?.flightOffers;

        console.log('offers exists:', Array.isArray(offers));
        console.log('offers length:', offers?.length);
        if (!offers?.length) {
            throw new Error("No flight offers found");
        }

        const savedFlights = [];
        const tokensUsed = [];

        const insertQuery = `
        INSERT INTO flights (
            flight_name,
            arrival_airport,
            departure_airport,
            arrival_time,
            departure_time,
            flight_logo,
            fare,
            country,
            location
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `;
        const MAX = 5;
        for (const offer of offers.slice(0, MAX)) {
            const token = offer?.token;
            if (!token) continue;

            console.log("TOKEN:", token);
            tokensUsed.push(token);

            // GET FLIGHT DETAILS USING TOKEN
            const detailsUrl =
                `https://booking-com15.p.rapidapi.com/api/v1/flights/getFlightDetails` +
                `?token=${token}&currency_code=AED`;

            const detailsResponse = await fetch(detailsUrl, defaultOptions);
            const detailsResult = await detailsResponse.json();

            // EXTRACT DATA
            const flightData = {
                flight_name: detailsResult?.data?.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.name || null,
                arrival_airport: detailsResult?.data?.segments?.[0]?.arrivalAirport?.name || null,
                departure_airport: detailsResult?.data?.segments?.[0]?.departureAirport?.name || null,
                arrival_time: detailsResult?.data?.segments?.[0]?.arrivalTime || null,
                departure_time: detailsResult?.data?.segments?.[0]?.departureTime || null,
                flight_logo: detailsResult?.data?.segments?.[0]?.legs?.[0]?.carriersData?.[0]?.logo || null,
                fare: detailsResult?.data?.priceBreakdown?.total?.units || null,
                country: detailsResult?.data?.segments?.[0]?.departureAirport?.countryName || null,
                location: fromLocation
            };

            const values = [
                flightData.flight_name,
                flightData.arrival_airport,
                flightData.departure_airport,
                flightData.arrival_time,
                flightData.departure_time,
                flightData.flight_logo,
                flightData.fare,
                flightData.country,
                flightData.location
            ];

            const saved = await pool.query(insertQuery, values);
            console.log("SAVED TO DB:", saved.rows[0]);

            savedFlights.push(saved.rows[0]);
        }

        res.json({
            status: true,
            fromId,
            toId,
            departDate,
            totalTokens: tokensUsed.length,
            tokens: tokensUsed,
            saved: savedFlights
        });


    } catch (err) {
        console.error('ERROR:', err);
        res.status(500).json({ status: false, message: err.message });
    }
});

async function searchAttractionLocation(query) {
    const url =
        `https://booking-com15.p.rapidapi.com/api/v1/attraction/searchLocation` +
        `?query=${query}&languagecode=en-us`;

    const response = await fetch(url, defaultOptions);
    const result = await response.json();

    console.log(JSON.stringify(result, null, 2));

    const products = result?.data?.products || [];

    if (!products.length) {
        throw new Error('No attractions found for this location');
    }

    //RETURN ALL SLUGS
    const slugs = products
        .map(p => p.productSlug)
        .filter(Boolean);

    console.log('ATTRACTION SLUGS:', slugs);
    return slugs;
}


async function getAttractionDetails(slug) {
    const url =
        `https://booking-com15.p.rapidapi.com/api/v1/attraction/getAttractionDetails` +
        `?slug=${slug}` +
        `&currency_code=USD`;

    const response = await fetch(url, defaultOptions);
    const result = await response.json();

    if (!result?.data) {
        throw new Error('No attraction details found');
    }

    return result.data;
}


function extractAttractionData(attractionData, slug) {
    return {
        attraction_name: attractionData.name,
        attraction_slug: slug,

        additional_info: attractionData.additionalInfo || null,

        cancellation_policy:
            attractionData.cancellationPolicy.hasFreeCancellation ?? false,

        images: attractionData.primaryPhoto.small || null,

        price:
            attractionData.representativePrice.chargeAmount ?? null,

        whats_included: attractionData.whatsIncluded || null,

        country:
            attractionData.addresses.arrival[0].country || null,

        city:
            attractionData.addresses.arrival[0].city || null
    };
}


app.get('/fetch-attraction', async (req, res) => {
    try {
        const searchLocation = 'Amsterdam';

        const slugs = await searchAttractionLocation(searchLocation);

        const savedAttractions = [];

        for(const slug of slugs.slice(0, 5)){

            // get details
            const details = await getAttractionDetails(slug);

            // extract required fields
            const attractionDetails = extractAttractionData(details, slug);

            console.log('ATTRACTION DATA:', attractionDetails);

            const insertAttractionQuery = `
                INSERT INTO attractions (
                    attraction_name,
                    attraction_slug,
                    additional_info,
                    cancellation_policy,
                    images,
                    price,
                    whats_included,
                    country,
                    city
                )
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                ON CONFLICT (attraction_slug) DO NOTHING
                RETURNING *;
            `;

            const values = [
                attractionDetails.attraction_name,
                attractionDetails.attraction_slug,
                attractionDetails.additional_info,
                attractionDetails.cancellation_policy,
                attractionDetails.images,
                attractionDetails.price,
                attractionDetails.whats_included,
                attractionDetails.country,
                attractionDetails.city
            ];

            const result = await pool.query(insertAttractionQuery, values);

            if (result.rows.length) {
                console.log('SAVED:', result.rows[0].id);
                savedAttractions.push(result.rows[0]);
            } else {
                console.log('DUPLICATE SLUG, SKIPPED:', slug);
            }
        }

        res.json({
            status: true,
            location: searchLocation,
            total: savedAttractions.length,
            attractions: savedAttractions
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});




app.get("/search/:locationname", async (req, res) => {
    try {
        const locationname = String(req.params.locationname || "").trim();
        const q = `%${locationname}%`;

        const flightsSql = `
            SELECT
                id,
                flight_name,
                arrival_airport,
                departure_airport,
                arrival_time,
                departure_time,
                flight_logo,
                fare,
                country,
                location,
                created_at
            FROM flights
            WHERE location ILIKE $1
                OR country ILIKE $1
            ORDER BY created_at DESC
            `;

        const flightsResult = await pool.query(flightsSql, [q]);
        const Flights = flightsResult.rows;

        const GeoInfo =
            Flights.length > 0
                ? {
                    location: locationname,
                    country: Flights[0].country ?? null,
                }
                : {
                    location: locationname,
                    country: null,
                };

        const attractionsSql = `
      SELECT
        id,
        attraction_name,
        attraction_slug,
        additional_info,
        cancellation_policy,
        images,
        price,
        whats_included,
        country,
        city,
        created_at
      FROM attractions
      WHERE city ILIKE $1
         OR country ILIKE $1
         OR attraction_name ILIKE $1
      ORDER BY created_at DESC
    `;
        const attractionsResult = await pool.query(attractionsSql, [q]);
        const Attractions = attractionsResult.rows;

        res.json({
            GeoInfo,
            Flights,
            Attractions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});



app.get("/details/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const searchtype = String(req.query.searchtype || "").toLowerCase();

        if (!["flight", "attraction"].includes(searchtype)) {
            return res.status(400).json({
                status: false,
                message: "Invalid searchtype. Use ?searchtype=flight or ?searchtype=attraction"
            });
        }

        if (searchtype === "flight") {
            const flightSql = `
        SELECT
          id,
          flight_name,
          arrival_airport,
          departure_airport,
          arrival_time,
          departure_time,
          flight_logo,
          fare,
          country,
          location,
          created_at
        FROM flights
        WHERE id = $1
      `;
            const result = await pool.query(flightSql, [id]);

            if (!result.rows.length) {
                return res.status(404).json({ status: false, message: "Flight not found" });
            }

            const Flight = result.rows[0];

            const GeoInfo = {
                id: Flight.id,
                location: Flight.location,
                country: Flight.country
            };

            return res.json({ GeoInfo, Flight });
        }

        const attractionSql = `
      SELECT
        id,
        attraction_name,
        attraction_slug,
        additional_info,
        cancellation_policy,
        images,
        price,
        whats_included,
        country,
        city,
        created_at
      FROM attractions
      WHERE id = $1
    `;
        const result = await pool.query(attractionSql, [id]);

        if (!result.rows.length) {
            return res.status(404).json({ status: false, message: "Attraction not found" });
        }

        const Attraction = result.rows[0];

        const GeoInfo = {
            id: Attraction.id,
            location: Attraction.city,
            country: Attraction.country
        };

        return res.json({ GeoInfo, Attraction });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: err.message
        });
    }
});




app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
