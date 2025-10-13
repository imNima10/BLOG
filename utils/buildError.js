module.exports = (message, status, data="") => {
    const error = new Error(message);
    error.status = status;
    error.data = data;
    return error;
};