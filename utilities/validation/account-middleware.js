const jwt = require("jsonwebtoken")

function checkLogin(req, res, next) {
  if (res.locals.loggedin) {
    next();
  } else {
    req.session.returnTo = req.originalUrl; 
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
}

function checkEmployee(req, res, next) {
  if (res.locals.accountData &&
      (res.locals.accountData.account_type === "Employee" ||
       res.locals.accountData.account_type === "Admin")) {
    return next()
  }

  
  req.session.returnTo = req.originalUrl
  req.flash("error", "You do not have permission")
  return res.redirect("/account/login")
  
}

module.exports = { checkLogin, checkEmployee }