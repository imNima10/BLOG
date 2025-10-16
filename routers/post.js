let express = require("express")
let router = express.Router()

let { getOnePost } = require("../controllers/post")
let { authGuard, roleGuard } = require("../middlewares/guard")

router.get("/:slug", authGuard, getOnePost)

module.exports = router