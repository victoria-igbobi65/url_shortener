const PORT: number = parseInt(<string>process.env.PORT);
const DB_NAME: string = process.env.DB_NAME;
const Mongoose_URL: string = process.env.DB_URL;
const environment: string = process.env.NODE_ENV;

export default {
  PORT,
  DB_NAME,
  Mongoose_URL,
  environment,
};
