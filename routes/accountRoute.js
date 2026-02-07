const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")

// Validation
const { validate, updateAccountRules, updatePasswordRules, checkUpdateData } = require("../utilities/validation/accountValidation")
const { checkLogin } = require("../utilities/validation/account-middleware")

// Build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Process login
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post(
  "/register",
  validate.registerRules ? validate.registerRules() : [],
  validate.checkLoginData,
  utilities.handleErrors(accountController.registerAccount)
)

// View update account
router.get("/update/:account_id", checkLogin, utilities.handleErrors(accountController.buildAccountUpdate))

// Process account info update
router.post(
  "/update",
  checkLogin,
  updateAccountRules(),
  checkUpdateData,
  utilities.handleErrors(accountController.updateAccountInfo)
)

// Process password update
router.post(
  "/update-password",
  checkLogin,
  updatePasswordRules(),
  checkUpdateData,
  utilities.handleErrors(accountController.updatePassword)
)

// Logout
router.get("/logout", accountController.logout)

// Account management
router.get("/", checkLogin, utilities.handleErrors(accountController.buildAccount))

module.exports = router