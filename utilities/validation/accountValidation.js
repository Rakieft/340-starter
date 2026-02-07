const { body, validationResult } = require("express-validator")

// Objet principal pour login
const validate = {}

/* *****************************
 * Login Validation Rules
 * ***************************** */
validate.loginRules = () => {
  return [
    body("account_email").isEmail().withMessage("A valid email is required."),
    body("account_password").notEmpty().withMessage("Password is required."),
  ]
}

/* *****************************
 * Check Login Data
 * ***************************** */
validate.checkLoginData = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render("account/login", {
      title: "Login",
      errors,
      account_email: req.body.account_email,
    })
  }
  next()
}

/* *****************************
 * Update Account Rules
 * ***************************** */
function updateAccountRules() {
  return [
    body("account_firstname").trim().notEmpty().withMessage("First name required"),
    body("account_lastname").trim().notEmpty().withMessage("Last name required"),
    body("account_email").trim().isEmail().withMessage("Valid email required"),
  ]
}

/* *****************************
 * Update Password Rules
 * ***************************** */
function updatePasswordRules() {
  return [
    body("account_password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/\d/)
      .withMessage("Password must contain at least one number"),
  ]
}

/* *****************************
 * Check update data
 * ***************************** */
function checkUpdateData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // On renvoie à la page update avec les erreurs
    return res.render("account/update", {
      title: "Update Account",
      account: req.body,
      errors,
    })
  }
  next()
}

module.exports = {
  validate,
  updateAccountRules,
  updatePasswordRules,
  checkUpdateData,
}