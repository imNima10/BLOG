let User = require("./../models/user")
let Post = require("./../models/post")
let Ban = require("./../models/ban")
const time = require("../utils/time")
let pagination = require("./../utils/pagination")
const { isValidObjectId } = require("mongoose")
const buildError = require("../utils/buildError")
const fs = require("fs")
const path = require("path")
exports.getDashbord = async (req, res, next) => {
    try {
        let bansCount = await Ban.countDocuments()
        let usersCount = await User.aggregate([
            {
                $lookup: {
                    from: "bans",
                    localField: "_id",
                    foreignField: "user",
                    as: "banInfo"
                }
            },
            {
                $match: {
                    banInfo: { $eq: [] }
                }
            },
            {
                $count: "count"
            }
        ]);
        usersCount = usersCount[0]?.count || 0;

        let postsCount = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "bans",
                    localField: "user._id",
                    foreignField: "user",
                    as: "banInfo"
                }
            },
            {
                $match: {
                    banInfo: { $eq: [] }
                }
            },
            {
                $count: "count"
            }
        ]);
        postsCount = postsCount[0]?.count || 0;

        let lastUsers = await User.aggregate([
            {
                $lookup: {
                    from: "bans",
                    localField: "_id",
                    foreignField: "user",
                    as: "banInfo"
                }
            },
            {
                $match: {
                    banInfo: { $eq: [] }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 3
            }
        ]);
        let lastPosts = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "bans",
                    localField: "user._id",
                    foreignField: "user",
                    as: "banInfo"
                }
            },
            {
                $match: {
                    banInfo: { $eq: [] }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $limit: 3
            },
        ]);
        lastPosts = lastPosts.map(post => {
            return {
                ...post,
                updatedAt: time(post.updatedAt)
            };
        });
        return res.render("admin/dashbord", {
            usersCount,
            postsCount,
            bansCount,
            lastUsers: lastUsers || [],
            lastPosts: lastPosts || []
        })
    } catch (error) {
        next(error)
    }
}
exports.getAdminPosts = async (req, res, next) => {
    try {
        let { page = 1, limit = 7 } = req.query
        let posts = await Post.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"
            },
            {
                $lookup: {
                    from: "bans",
                    localField: "user._id",
                    foreignField: "user",
                    as: "banInfo"
                }
            },
            {
                $match: {
                    banInfo: { $eq: [] }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            },
        ]);

        posts = posts.map(post => {
            return {
                ...post,
                updatedAt: time(post.updatedAt)
            };
        });
        let postsCount = await Post.countDocuments()
        return res.render("admin/posts", {
            posts,
            pagination: pagination(page, limit, postsCount, "post")
        })
    } catch (error) {
        next(error)
    }
}
exports.deletePost = async (req, res, next) => {
    try {
        let { id } = req.params

        let isIdValid = isValidObjectId(id)
        if (!isIdValid) {
            throw buildError("post not found", 404)
        }

        let post = await Post.findByIdAndDelete(id)
        if (!post) {
            throw buildError("post not found", 404)
        }
        let thePath = path.join(__dirname, "..", "public", post.cover)
        if (fs.existsSync(thePath)) {
            fs.unlink(thePath, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
        req.flash("success", "delete successfully");
        return res.redirect(`/admin/posts`);
    } catch (error) {
        next(error)
    }
}
exports.getAdminUsers = async (req, res, next) => {
    try {
        let { page = 1, limit = 7 } = req.query
        let users = await User.aggregate([
            {
                $lookup: {
                    from: "bans",
                    localField: "_id",
                    foreignField: "user",
                    as: "banInfo"
                }
            },
            {
                $match: {
                    banInfo: { $eq: [] }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            }
        ]);
        let usersCount = await User.countDocuments()
        return res.render("admin/users", {
            users,
            pagination: pagination(page, limit, usersCount, "user")
        })
    } catch (error) {
        next(error)
    }
}
exports.changeRole = async (req, res, next) => {
    try {
        let { id } = req.params

        let isIdValid = isValidObjectId(id)
        if (!isIdValid) {
            throw buildError("user not found", 404)
        }

        let user = await User.findById(id)
        if (!user) {
            throw buildError("user not found", 404)
        }

        if (user._id.toString() === req.user._id.toString()) {
            req.flash("error", "you cant change your role");
            return res.redirect("/admin/users");
        }
        await User.findByIdAndUpdate(id, {
            role: user.role == "ADMIN" ? "USER" : "ADMIN"
        })
        req.flash("success", "Role changed successfully");
        return res.redirect(`/admin/users`);
    } catch (error) {
        next(error)
    }
}
exports.ban = async (req, res, next) => {
    try {
        let { id } = req.params

        let isIdValid = isValidObjectId(id)
        if (!isIdValid) {
            throw buildError("user not found", 404)
        }

        let user = await User.findById(id)
        if (!user) {
            throw buildError("user not found", 404)
        }
        if (user._id.toString() === req.user._id.toString()) {
            req.flash("error", "you cant ban yourself");
            return res.redirect("/admin/users");
        }
        if (user.role == "ADMIN") {
            req.flash("error", "you cant ban ban user");
            return res.redirect("/admin/users");
        }
        let isUserBaned = await Ban.findOne({ user: user._id })
        if (isUserBaned) {
            await Ban.deleteOne({ user: user._id })
            req.flash("success", `${user.username} UnBan successfully`);
            return res.redirect(`/admin/banned-users`);
        } else {
            await Ban.create({
                user: user._id,
                bannedBy: req.user._id
            })
            req.flash("success", `${user.username} Ban successfully`);
            return res.redirect(`/admin/users`);
        }
    } catch (error) {
        next(error)
    }
}
exports.getBannedUsers = async (req, res, next) => {
    try {
        let { page = 1, limit = 7 } = req.query
        let users = await Ban.find()
            .populate("user", "username profile")
            .populate("bannedBy", "username profile")
            .sort({ createdAt: "desc" })
            .lean()
            .limit(limit)
            .skip((page - 1) * limit)
        users = users.map(user => {
            return {
                ...user,
                updatedAt: time(user.updatedAt)
            };
        });
        
        let banUsersCount = await Ban.countDocuments()
        return res.render("admin/ban", {
            users,
            pagination: pagination(page, limit, banUsersCount, "banUser")
        })
    } catch (error) {
        next(error)
    }
}