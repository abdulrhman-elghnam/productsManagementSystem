import dotenv from "dotenv";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;

dotenv.config({
  path: envFile,
});

const config = {
  PORT: Number(process.env.PORT),

  BACKEND_URL: process.env.BACKEND_URL,
  BACKEND_PROTOCOL: process.env.BACKEND_PROTOCOL,
  BACKEND_PORT: Number(process.env.BACKEND_PORT),

  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,

  FRONTEND_URL: process.env.FRONTEND_URL,
};

export default config;
