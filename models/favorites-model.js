const pool = require("../database")

/* Add a vehicle to favorites */
async function addFavorite(account_id, inv_id) {
  const sql = `
    INSERT INTO favorites (account_id, inv_id)
    VALUES ($1, $2)
    ON CONFLICT (account_id, inv_id) DO NOTHING
    RETURNING *
  `
  return pool.query(sql, [account_id, inv_id])
}

/* Get all favorites for one account */
async function getFavoritesByAccount(account_id) {
  const sql = `
    SELECT f.favorite_id, i.*
    FROM favorites f
    JOIN inventory i ON f.inv_id = i.inv_id
    WHERE f.account_id = $1
    ORDER BY f.created_at DESC
  `
  const data = await pool.query(sql, [account_id])
  return data.rows
}

/* Remove a favorite */
async function deleteFavorite(favorite_id) {
  const sql = `
    DELETE FROM favorites
    WHERE favorite_id = $1
  `
  return pool.query(sql, [favorite_id])
}

module.exports = {
  addFavorite,
  getFavoritesByAccount,
  deleteFavorite,
}