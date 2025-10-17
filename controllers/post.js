const buildError = require("../utils/buildError")
let Post = require("./../models/post")
let time = require("./../utils/time")
exports.getOnePost = async (req, res, next) => {
    try {
        let { slug } = req.params
        let post = await Post.findOne({ slug })
            .populate("user", "username profile")
            .lean()
        if (!post) {
            throw buildError("post not found", 404)
        }
        post.updatedAt = time(post.updatedAt)
        return res.render("post", {
            post
        })
    } catch (error) {
        next(error)
    }
}
exports.createPostPage = async (req, res, next) => {
    try {
        return res.render("createPost")
    } catch (error) {
        next(error)
    }
}
exports.createPost = async (req, res, next) => {
    try {
        let { title, description } = req.body
        let user = req.user;
        let cover = req.file;
        filePath = `/images/covers/${cover.filename}`

        let post = await Post.create({
            cover: filePath,
            description,
            title,
            user: user._id
        })
        if (!post) {
            req.flash("error", "post dont create");
            return res.redirect("/post/create");
        }
        req.flash("success", "create successfully");
        return res.redirect(`/post/${post.slug}`);
    } catch (error) {
        next(error)
    }
}
exports.myPostsPage = async (req, res, next) => {
    try {
        let user = req.user
        let posts = await Post.find({
            user: user._id
        })
            .populate("user", "username profile")
            .sort({ createdAt: "desc" })
            .lean()
        return res.render("myPosts", {
            posts: posts || []
        })
    } catch (error) {
        next(error)
    }
}
