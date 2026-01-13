import { pool } from "../config/db.js";


// Insert a new attraction into the database
export async function insertAttraction(values) {
  const sql = `
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
  const result = await pool.query(sql, values);
  return result.rows[0] || null; 
}

// Search attractions by city, country, or attraction name
export async function searchAttractions(q) {
  const sql = `
    SELECT
      id, attraction_name, attraction_slug, additional_info,
      cancellation_policy, images, price, whats_included,
      country, city, created_at
    FROM attractions
    WHERE city ILIKE $1 OR country ILIKE $1 OR attraction_name ILIKE $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(sql, [q]);
  return result.rows;
}


// Get a single attraction by ID
export async function getAttractionById(id) {
  const sql = `
    SELECT
      id, attraction_name, attraction_slug, additional_info,
      cancellation_policy, images, price, whats_included,
      country, city, created_at
    FROM attractions
    WHERE id = $1;
  `;
  const result = await pool.query(sql, [id]);

  // Return null if attraction does not exist
  return result.rows[0] || null;
}
