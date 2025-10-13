let { errorResponse } = require("./../helpers/responses")

module.exports = async (err, req, res, next) => {
    if (err.name === "ValidationError") {
        const errorList = Array.isArray(err.inner) && err.inner.length
            ? err.inner.map(e => ({
                field: e.path,
                message: e.message
            }))
            : [{ field: "", message: err.message }];

        console.log({
            success: false,
            error: "Validation Error",
            data: errorList
        });

        return errorResponse(res, 422, {
            msg: "Validation Error",
            data: errorList
        });
    }
    if (err.status == 401) {
        console.log({
            success: false,
            error: "Unauthorized Access",
            data: err.message || "User is not authenticated"
        });
        return res.status(401).render("401");
    }
    if (err.status == 403) {
        console.log({
            success: false,
            error: "Forbidden Access",
            data: err.message || "User tried to access a protected route"
        });
        return res.status(403).render("403");
    }
    if (!err.status || err.status == 500) {
        console.log({
            success: false,
            error: "Internal Server Error",
            data: err.message || err
        });
        return res.status(500).render("500")
    }
    let msg = err.message || "Internal Server Error"
    let status = err.status || 500
    let data = err.data || ""
    return errorResponse(res, status, { msg, data })
}