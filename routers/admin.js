let express = require("express");
let router = express.Router();
let { authGuard, roleGuard } = require("../middlewares/guard");
let {
    getDashbord,
} = require("./../controllers/admin");

router.get("/", authGuard, roleGuard, getDashbord);

module.exports = router;