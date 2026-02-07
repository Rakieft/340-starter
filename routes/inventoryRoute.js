const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const classificationValidate = require("../utilities/validation/classification-validation")
const inventoryValidate = require("../utilities/validation/inventory-validation")
const { checkLogin, checkEmployee } = require("../utilities/validation/account-middleware")

// Public routes
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
)

router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildInventoryDetail)
)

router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

// Admin-only routes
router.get(
  "/add-classification",
  checkLogin,
  checkEmployee,
  utilities.handleErrors(invController.buildAddClassification)
)

router.post(
  "/add-classification",
  checkLogin,
  checkEmployee,
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

router.get(
  "/add-inventory",
  checkLogin,
  checkEmployee,
  utilities.handleErrors(invController.buildAddInventory)
)

router.post(
  "/add-inventory",
  checkLogin,
  checkEmployee,
  inventoryValidate.newInventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
)

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

router.get(
  "/edit/:inv_id",
  checkLogin,
  checkEmployee,
  utilities.handleErrors(invController.editInventoryView)
)

router.post(
  "/update/",
  checkLogin,
  checkEmployee,
  inventoryValidate.newInventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router