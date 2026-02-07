const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash("notice", "Registration successful. Please log in.")
    res.render("account/login", { title: "Login", nav, errors: null })
  } else {
    req.flash("error", "Registration failed.")
    res.render("account/register", { title: "Register", nav, errors: null })
  }
}

/* ****************************************
 *  Process login
 * *************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData || account_password !== accountData.account_password) {
    req.flash("error", "Invalid login credentials.")
    return res.render("account/login", {
      title: "Login",
      nav,
      account_email,
      errors: null,
    })
  }

  delete accountData.account_password

  const token = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  })

  res.cookie("jwt", token, { httpOnly: true })
  res.redirect("/account/")
}

/* ****************************************
 *  Account management view
 * *************************************** */
async function buildAccount(req, res) {
  let nav = await utilities.getNav()
  res.render("account/manage", {
    title: "Account Management",
    nav,
    account: res.locals.accountData,
    errors: null,
  })
}

/* ****************************************
 *  Build update account view
 * *************************************** */
async function buildAccountUpdate(req, res) {
  const nav = await utilities.getNav()
  const account = await accountModel.getAccountById(req.params.account_id)

  res.render("account/update", {
    title: "Update Account",
    nav,
    account,
    errors: null,
  })
}

/* ****************************************
 *  Update account info
 * *************************************** */
async function updateAccountInfo(req, res) {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  req.flash("notice", "Account updated.")
  res.redirect("/account/")
}

/* ****************************************
 *  Update password
 * *************************************** */
async function updatePassword(req, res) {
  const { account_id, account_password } = req.body
  const hashed = await bcrypt.hash(account_password, 10)
  await accountModel.updatePassword(account_id, hashed)

  req.flash("notice", "Password updated.")
  res.redirect("/account/")
}

/* ****************************************
 *  Logout
 * *************************************** */
function logout(req, res) {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  buildAccountUpdate,
  updateAccountInfo,
  updatePassword,
  logout,
}