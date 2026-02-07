const jwt = require("jsonwebtoken")

function checkLogin(req, res, next) {
  const token = req.cookies.jwt
  if (!token) return res.redirect("/account/login")

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.accountData = payload
    next()
  } catch (err) {
    return res.redirect("/account/login")
  }
}

function checkEmployee(req, res, next) {
  const account = res.locals.accountData
  if (!account || (account.account_type !== "Employee" && account.account_type !== "Admin")) {
    req.flash("error", "You do not have permission")
    return res.redirect("/account/login")
  }
  next()
}

module.exports = { checkLogin, checkEmployee }