const errorController = {}

errorController.triggerError = async function (req, res, next) {
  throw new Error("Intentional Server Error for Task 3")
}

module.exports = errorController