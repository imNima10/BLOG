let nodemailer = require("nodemailer")
const configs = require("../configs")

module.exports = async ({ email, otp }) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: configs.otp.email.user,
                pass: configs.otp.email.password
            }
        })

        let mailOptions = {
            from: configs.otp.email.from,
            to: email,
            subject: "Otp For Login",
            text: `Hi👋, Welcome\nYour Otp Code For Login\n${otp}`
        }
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log("Otp Send Error => " + error.message);
        throw {
            message: "Failed to send OTP"
        }
    }
}