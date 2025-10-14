const yup = require("yup");

exports.verify = yup.object({
    userKey: yup.string().required("userKey is required"),
    otp: yup
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .required("OTP is required")
});
exports.send = yup.object({
    email: yup
        .string()
        .trim()
        .lowercase()
        .matches(
            /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
            "Invalid email format"
        )
});
