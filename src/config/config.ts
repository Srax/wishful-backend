import "dotenv/config";
export default {
  AUTH0: {
    BASE_URL: process.env.AUTH0_BASE_URL,
    ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
    AUDIENCE: process.env.AUTH0_AUDIENCE ?? "http://localhost:5000/",
  },
  DB: {
    HOST: process.env.PG_HOST,
    PORT:
      process.env.PG_PORT !== undefined
        ? parseInt(process.env.PG_PORT, 10)
        : 5432,
    USERNAME: process.env.PG_USERNAME,
    PASSWORD: process.env.PG_PASSWORD,
    DATABASE: process.env.PG_DATABASE,
    SYNCHRONIZED: process.env.PG_SYNCHRONIZED === "true" || false,
    LOGGING: process.env.PG_LOGGING_ENABLED === "true" || false,
  },
  JWT: {
    SECRET: {
      KEY: process.env.JWT_SECRET_TOKEN_KEY,
      EXPIRY: process.env.JWT_EXPIRY ?? "1h",
    },
    REFRESH: {
      KEY: process.env.JWT_REFRESH_TOKEN_KEY,
      EXPIRY: process.env.REFRESH_EXPIRY ?? "7d",
    },
  },
};
