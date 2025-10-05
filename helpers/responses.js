exports.successResponse = async (res, status = 200, { msg = "", data = null }) => {
    return res.status(status).send({
        status,
        msg,
        data
    })
}
exports.errorResponse = async (res, status = 400, { msg = "", data = null }) => {
    return res.status(status).send({
        status,
        msg,
        data
    })
}