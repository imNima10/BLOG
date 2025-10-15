let { successResponse, errorResponse } = require("../helpers/responses")
let { verifyRefreshToken } = require("../utils/token")
let redis = require("../db/redis")
let buildError = require("../utils/buildError")

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
