const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities/")

async function buildFavorites(req, res) {
  let nav = await utilities.getNav()
  const account_id = req.session.accountData.account_id
  const favorites = await favoritesModel.getFavoritesByAccount(account_id)

  res.render("account/favorites", {
    title: "My Favorites",
    nav,
    favorites,
  })
}

async function addToFavorites(req, res) {
  const account_id = req.session.accountData.account_id
  const inv_id = parseInt(req.params.inv_id)

  await favoritesModel.addFavorite(account_id, inv_id)
  res.redirect("/favorites/")
}

async function deleteFavorite(req, res) {
  const favorite_id = parseInt(req.params.favorite_id)
  try {
    const result = await favoritesModel.deleteFavorite(favorite_id)

    // Vérifier si la ligne a été supprimée
    if (result.rowCount > 0) {
      req.flash("notice", "Favorite removed successfully.")
    } else {
      req.flash("error", "Unable to remove favorite.")
    }
    res.redirect("/favorites/")
  } catch (error) {
    console.error(error)
    req.flash("error", "Unable to remove favorite.")
    res.redirect("/favorites/")
  }
}

module.exports = {
  buildFavorites,
  addToFavorites,
  deleteFavorite,
}