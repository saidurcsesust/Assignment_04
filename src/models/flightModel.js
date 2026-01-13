import { pool } from "../config/db.js";

// Insert flight into database
export async function insertFlight(values) {
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
    RETURNING *;
  `;
  const result = await pool.query(insertQuery, values);
  return result.rows[0];
}


// Search flights by location
export async function searchFlights(q) {
  const sql = `
    SELECT
      id, flight_name, arrival_airport, departure_airport,
      arrival_time, departure_time, flight_logo, fare,
      country, location, created_at
    FROM flights
    WHERE location ILIKE $1 OR country ILIKE $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(sql, [q]);
  return result.rows;
}


// Get single flight by ID
export async function getFlightById(id) {
  const sql = `
    SELECT
      id, flight_name, arrival_airport, departure_airport,
      arrival_time, departure_time, flight_logo, fare,
      country, location, created_at
    FROM flights
    WHERE id = $1;
  `;
  const result = await pool.query(sql, [id]);
  return result.rows[0] || null;
}
