const PORT: number = parseInt(<string>process.env.PORT) || 3000;
const BASE_URL: string = process.env.BASE_URL;
const DB_NAME: string = process.env.DB_NAME;
const Mongoose_URL: string = process.env.DB_URL;
const environment: string = process.env.NODE_ENV;

export default {
  PORT,
  DB_NAME,
  BASE_URL,
  Mongoose_URL,
  environment,
};
