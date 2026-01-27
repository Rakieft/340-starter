/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const utilities = require("./utilities/")
const errorRoute = require("./routes/errorRoute")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config()
const app = express()
const staticRoutes = require("./routes/static")
const path = require("path")


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
 * Middleware
 *************************/
app.use(express.static(path.join(__dirname, "public")))

/* ***********************
 * Routes
 *************************/

// index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// Inventory routes
app.use("/inv", inventoryRoute)

// static routes
app.use(staticRoutes)

// error route
app.use("/error", errorRoute)

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)

  let message
  if (err.status == 404) {
    message = err.message
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }

  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Server Information
 *************************/
const port = process.env.PORT || 3000

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
