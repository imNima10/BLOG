let express = require("express");
let router = express.Router();
let { authGuard, roleGuard } = require("../middlewares/guard");
let {
    getDashbord,
    getAdminPosts,
    getAdminUsers,
    deletePost,
    changeRole
} = require("./../controllers/admin");

router.get("/", authGuard, roleGuard, getDashbord);
router.get("/posts", authGuard, roleGuard, getAdminPosts);
router.post("/post/:id/delete", authGuard, roleGuard, deletePost);
router.get("/users", authGuard, roleGuard, getAdminUsers);
router.post("/users/:id/change-role", authGuard, roleGuard, changeRole);

module.exports = router;