const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  const nav = await utilities.getNav()

  const className = data.length > 0
    ? data[0].classification_name
    : "Vehicles"

  res.render("inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildInventoryDetail = async function (req, res) {
  const invId = req.params.invId
  const vehicle = await invModel.getInventoryById(invId)
  const nav = await utilities.getNav()

  res.render("inventory/detail", {
    title: `${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicle,
  })
}

module.exports = invCont