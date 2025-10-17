let User = require("./../models/user")
let Post = require("./../models/post")
const time = require("../utils/time")
let pagination = require("./../utils/pagination")
exports.getDashbord = async (req, res, next) => {
    try {
        let usersCount = await User.countDocuments()
        let postsCount = await Post.countDocuments()

        let lastUsers = await User.find()
            .limit(3)
        let posts = await Post.find()
            .limit(3)
            .sort({ createdAt: "desc" })
            .populate("user", "username")
        let lastPosts = posts.map(post => {
            return {
                ...post.toObject(),
                updatedAt: time(post.updatedAt)
            };
        });
        return res.render("admin/dashbord", {
            usersCount,
            postsCount,
            lastUsers: lastUsers || [],
            lastPosts: lastPosts || []
        })
    } catch (error) {
        next(error)
    }
}
exports.getAdminPosts = async (req, res, next) => {
    try {
        let { page = 1, limit = 4 } = req.query
        let posts = await Post.find()
            .populate("user", "username profile")
            .sort({ createdAt: "desc" })
            .lean()
            .limit(limit)
            .skip((page - 1) * limit)
        posts = posts.map(post => {
            return {
                ...post,
                updatedAt: time(post.updatedAt)
            };
        });
        posts
        let postsCount = await Post.countDocuments()
        return res.render("admin/posts", {
            posts,
            pagination: pagination(page, limit, postsCount, "post")
        })
    } catch (error) {
        next(error)
    }
}