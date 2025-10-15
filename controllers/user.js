let { successResponse, errorResponse } = require("../helpers/responses")
let { verifyRefreshToken } = require("../utils/token")
let User = require("../models/user")
let redis = require("../db/redis")
let buildError = require("../utils/buildError")
let path = require("path")
let fs = require("fs")

exports.logout = async (req, res, next) => {
    try {
        let user = req.user
        let refreshToken = await redis.get(`refresh-token:${user._id}`)
        if (refreshToken) {
            let result = await verifyRefreshToken(refreshToken)
            if (!result.success) {
                throw buildError(result.message, result.status, result.data)
            }
            await redis.del(`refresh-token:${user._id}`)
        }
        res.clearCookie("access-token", {
            httpOnly: true,
            sameSite: "strict",
        })
        return successResponse(res, 200, { msg: "Logout successful" })
    } catch (error) {
        next(error)
    }
}
exports.getMe = async (req, res, next) => {
    try {
        let user = req.user
        return res.render("profile", {
            user
        })
    } catch (error) {
        next(error)
    }
}
exports.updateProfile = async (req, res, next) => {
    try {
        let user = req.user;
        let { username } = req.body;
        let profile = req.file;
        let filePath = user.profile
        if (profile) {
            filePath = `/images/profiles/${profile.filename}`
            if (!user.profile.includes("default_profile.png")) {
                let thePath = path.join(__dirname, "..", "public", user.profile)
                if (fs.existsSync(thePath)) {
                    fs.unlink(thePath, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
                }
            }
        }

        let isUserNameExists = await User.findOne({
            username
        })

        if (isUserNameExists && isUserNameExists.email != user.email) {
            req.flash("validationError", true);
            return res.redirect("/user/me");
        }

        let updateUser = await User.findByIdAndUpdate(
            user._id,
            {
                profile: filePath,
                username: username,
            },
            { new: true }
        );

        if (!updateUser) {
            throw buildError("user not found", 500);
        }

        req.flash("success", "update successfully");
        return res.redirect("/user/me");
    } catch (error) {
        next(error);
    }
};