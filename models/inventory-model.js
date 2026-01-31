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

async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])
    return result.rows[0]
  } catch (error) {
    return null
  }
}


async function addInventory(data) {
  try {
    const sql = `
      INSERT INTO inventory (
        inv_make, inv_model, inv_year, inv_price,
        inv_miles, inv_color, inv_image,
        inv_thumbnail, inv_description, classification_id
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *
    `
    const result = await pool.query(sql, [
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_description,
      data.classification_id,
    ])
    return result.rows[0]
  } catch (error) {
    return null
  }
}


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  addClassification,
  addInventory,
  getInventoryById
}