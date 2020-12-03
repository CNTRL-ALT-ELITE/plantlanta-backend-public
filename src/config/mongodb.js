require("dotenv/config");

const resolveURI = () => {
  const env = process.env.APP_ENV || "test";
  switch (env) {
    case "dev":
      return process.env.MONGODB_URL;
    case "prod":
      return process.env.MONGODB_PROD;
    default:
      return process.env.MONGODB_URL;
  }
};
export const MongoConnectionURI = resolveURI();
