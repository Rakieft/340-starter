const pool = require("../database/")

async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  )
}

async function getInventoryByClassificationId(classification_id) {
  const data = await pool.query(
    `SELECT * FROM public.inventory AS i
     JOIN public.classification AS c
     ON i.classification_id = c.classification_id
     WHERE i.classification_id = $1`,
    [classification_id]
  )
  return data.rows
}

async function getInventoryById(invId) {
  const data = await pool.query(
    "SELECT * FROM public.inventory WHERE inv_id = $1",
    [invId]
  )
  return data.rows[0]
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryById
}