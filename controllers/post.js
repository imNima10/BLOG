const buildError = require("../utils/buildError")
let Post = require("./../models/post")
exports.getOnePost = async (req, res, next) => {
    try {
        let { slug } = req.params
        let post = await Post.findOne({ slug })
            .populate("user", "username profile")
            .lean()
        if (!post) {
            throw buildError("post not found", 404)
        }
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