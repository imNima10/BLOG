const yup = require("yup");

exports.verify = yup.object({
    userKey: yup.string().required("userKey is required"),
    otp: yup
        .string()
        .length(6, "OTP must be exactly 6 digits")
        .required("OTP is required")
});

exports.page = yup.object({
    userKey: yup.string().required("userKey is required")
});

exports.send = yup.object({
    email: yup
        .string()
        .matches(
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            "Invalid email format"
        )
        .required("Email is required"),
});
