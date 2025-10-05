module.exports = {
    db: {
        mongo:{
            uri: process.env.MONGO_URI
        },
        redis: {
            uri: process.env.REDIS_URI
        }
    },
    port: process.env.PORT,
    otp: {
        email: {
            user: process.env.OTP_EMAIL_USER,
            password: process.env.OTP_EMAIL_PASSWORD,
            from: process.env.OTP_EMAIL_FROM,
        }
    },
    auth: {
        token: {
            accessToken: {
                secretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
                expire: process.env.ACCESS_TOKEN_EXPIRES_IN,
            },
            refreshToken: {
                secretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
                expire: process.env.REFRESH_TOKEN_EXPIRES_IN,
            },
        },
        google: {
            clientId:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET
        }
    },
    domain:process.env.DOMAIN
}