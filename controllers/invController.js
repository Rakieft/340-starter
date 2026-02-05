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


/* ***************************
 *  Build inventory
 * ************************** */
invCont.buildManagement = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}



/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body
  const result = await invModel.addClassification(classification_name)
  const nav = await utilities.getNav()

  if (result) {
    req.flash("notice", "Classification added successfully.")
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Classification insertion failed.")
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      classification_name,
      errors: null,
    })
  }
}


/* ***************************
 * Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 * Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  const nav = await utilities.getNav()
  const result = await invModel.addInventory(req.body)

  if (result) {
    req.flash("notice", "Inventory item added successfully.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Failed to add inventory item.")
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      ...req.body,
    })
  }
}

module.exports = invCont