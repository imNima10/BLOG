const Joi = require("joi");

const configSchema = Joi.object({
  db: Joi.object({
    mongo: Joi.object({
      uri: Joi.string().required(),
    }),
    redis: Joi.object({
      uri: Joi.string().required(),
    }).required(),
  }).required(),
  port: Joi.string().required(),
  otp: Joi.object({
    email: Joi.object({
      user: Joi.string().required(),
      password: Joi.string().required(),
      from: Joi.string().required(),
    }).required(),
  }).required(),
  auth: Joi.object({
    token: Joi.object({
      accessToken: Joi.object({
        secretKey: Joi.string().required(),
        expire: Joi.string().required(),
      }).required(),
      refreshToken: Joi.object({
        secretKey: Joi.string().required(),
        expire: Joi.string().required(),
      }).required(),
    }).required(),
    google: Joi.object({
      clientId: Joi.string().required(),
      clientSecret: Joi.string().required(),
    }).required(),
  }),
  domain: Joi.string().required(),
  session: Joi.string().required(),
}).required();

const config = {
  db: {
    mongo: {
      uri: process.env.MONGO_URI,
    },
    redis: {
      uri: process.env.REDIS_URI,
    },
  },
  port: process.env.PORT,
  otp: {
    email: {
      user: process.env.OTP_EMAIL_USER,
      password: process.env.OTP_EMAIL_PASSWORD,
      from: process.env.OTP_EMAIL_FROM,
    },
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
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  domain: process.env.DOMAIN,
  session: process.env.SESSION_SECRET,
};

const { error } = configSchema.validate(config);

if (error) throw new Error(`Invalid Configs : ${error}`);

module.exports = config;
