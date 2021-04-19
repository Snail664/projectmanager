const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = {
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DB,
};

const productionConfig = {
  connectionString: process.env.DATABASE_URL, // provided by heroku addon
};

const pool = new Pool(
  process.env.NODE_ENV === "production" ? productionConfig : devConfig
);

module.exports = pool;
