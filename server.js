/* ******************************************
 * server.js
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const pool = require("./database/")
const path = require("path")
require("dotenv").config()

const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const errorRoute = require("./routes/errorRoute")
const staticRoutes = require("./routes/static")
const accountRoute = require("./routes/accountRoute")
const favoritesRoute = require("./routes/favoritesRoute")

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")

const app = express()

/* ***********************
 * View Engine and Layout
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Static Files Middleware
 *************************/
app.use(express.static("public"))

/* ***********************
 * Middleware (ORDER MATTERS)
 *************************/

// Parse cookies FIRST
app.use(cookieParser())

// Session middleware
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

// Flash messages
app.use(flash())
app.use((req, res, next) => {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

// Body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// JWT check AFTER cookies & session
app.use(utilities.checkJWTToken)


// Define global variables for all templates
app.use((req, res, next) => {
  res.locals.loggedin = req.session?.loggedin || false
  res.locals.accountData = req.session?.accountData || null
  next()
})

/* ***********************
 * Routes
 *************************/

// index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// inventory routes
app.use("/inv", inventoryRoute)

// static routes
app.use(staticRoutes)

// account routes
app.use("/account", accountRoute)

// error route
app.use("/error", errorRoute)

// favorite
app.use("/favorites", favoritesRoute)

// 404 handler (LAST ROUTE)
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ***********************
 * Start Server
 *************************/
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})