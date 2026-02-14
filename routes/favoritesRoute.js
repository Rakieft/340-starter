const express = require("express")
const router = new express.Router()
const favoritesController = require("../controllers/favoritesController")
const accountMiddleware = require("../utilities/validation/account-middleware")

router.get("/", accountMiddleware.checkLogin, favoritesController.buildFavorites)
router.get("/add/:inv_id", accountMiddleware.checkLogin, favoritesController.addToFavorites)
router.get("/delete/:favorite_id", accountMiddleware.checkLogin, favoritesController.deleteFavorite)

module.exports = router