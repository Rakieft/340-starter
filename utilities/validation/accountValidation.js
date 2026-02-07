const { body, validationResult } = require("express-validator")

const validate = {}

/* *****************************
 * Login Validation Rules
 * ***************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .notEmpty()
      .withMessage("Password is required.")
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

module.exports = validate