const { body, validationResult } = require("express-validator")
const utilities = require("../index")

const validate = {}

validate.newInventoryRules = () => {
  return [
    body("inv_make").trim().notEmpty(),
    body("inv_model").trim().notEmpty(),
    body("inv_year").isInt({ min: 1900 }),
    body("inv_price").isFloat({ min: 0 }),
    body("inv_miles").isInt({ min: 0 }),
    body("inv_color").trim().notEmpty(),
    body("classification_id").notEmpty(),
  ]
}

validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    )

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors,
      ...req.body,
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(
      req.body.classification_id
    )

    res.render("inventory/edit-inventory", {
      title: "Edit Inventory",
      nav,
      classificationList,
      errors,
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_description: req.body.inv_description,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      classification_id: req.body.classification_id,
    })
    return
  }
  next()
}

module.exports = validate