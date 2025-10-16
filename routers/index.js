let express = require("express")
let router = express.Router()

let { indexPage } = require("../controllers/index")
let { authGuard, roleGuard } = require("../middlewares/guard")

router.get("/", authGuard, indexPage)

module.exports = router