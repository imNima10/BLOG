let Post = require("./../models/post")
let pagination = require("./../utils/pagination")
let summary = require("../utils/summary")
exports.indexPage = async (req, res, next) => {
    try {
        let { page = 1, limit = 4 } = req.query
        let posts = await Post.find()
            .populate("user", "username profile")
            .sort({ createdAt: "desc" })
            .lean()
            .limit(limit)
            .skip((page - 1) * limit)

        posts = posts.map(post => ({
            ...post,
            summary: summary(post)
        }));

        let postsCount = await Post.countDocuments()
        return res.render("index", {
            posts: posts || [],
            pagination: pagination(page, limit, postsCount, "post"),
            isAdmin: !!req.isAdmin
        })
    } catch (error) {
        next(error)
    }
}