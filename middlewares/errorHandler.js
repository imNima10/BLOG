let { errorResponse } = require("./../helpers/responses")

module.exports = async (err, req, res, next) => {
    if (err.name == "ValidationError") {
        if (err.inner) {
            let error = []
            err.inner.forEach(e => {
                let theError = {
                    field: e.path,
                    message: e.message
                }
                error.push(theError)
            });
            console.log({ success: false, error: "Validation Error", data: error });
            return errorResponse(res, 400, { msg: "Validation Error", data: error })
        } else {
            console.log({ success: false, error: "Validation Error", data: err.message });
            return errorResponse(res, 400, { msg: "Validation Error", data: err.message })
        }
    }
    let msg = err.message || "Internal Server Error"
    let status = err.status || 500
    return errorResponse(res, status, { msg })
}