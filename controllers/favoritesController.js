const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities/")

/* Add favorite */
async function addToFavorites(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    const account_id = res.locals.accountData?.account_id

    console.log("DEBUG ADD FAVORITE:", { account_id, inv_id })

    await favoritesModel.addFavorite(account_id, inv_id)

    
    req.flash("notice", "Vehicle added to favorites ❤️")
    res.redirect(req.get('referer') || `/inv/detail/${inv_id}`)
  } catch (error) {
    console.error("ERROR addToFavorites:", error)
    next(error)
  }
}

/* Build favorites view */
async function buildFavorites(req, res, next) {
  try {
    const nav = await utilities.getNav()
    const account_id = res.locals.accountData.account_id
    const favorites = await favoritesModel.getFavoritesByAccount(account_id)

    res.render("account/favorites", {
      title: "My Favorites",
      nav,
      favorites,
    })
  } catch (error) {
    next(error)
  }
}

/* Delete favorite */
async function deleteFavorite(req, res, next) {
  try {
    const favorite_id = parseInt(req.params.favorite_id)
    await favoritesModel.removeFavorite(favorite_id)
    req.flash("success", "Favorite removed")
    res.redirect("/account/favorites")
  } catch (error) {
    console.error("ERROR removeFavorite:", error)
    req.flash("error", "Unable to remove favorite")
    res.redirect("/account/favorites")
  }
}

module.exports = {
  addToFavorites,
  buildFavorites,
  deleteFavorite,
}