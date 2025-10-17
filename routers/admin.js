let express = require("express");
let router = express.Router();
let { authGuard, roleGuard } = require("../middlewares/guard");
let {
    getDashbord,
    getAdminPosts,
    getAdminUsers
} = require("./../controllers/admin");

router.get("/", authGuard, roleGuard, getDashbord);
router.get("/posts", authGuard, roleGuard, getAdminPosts);
router.get("/users", authGuard, roleGuard, getAdminUsers);

module.exports = router;