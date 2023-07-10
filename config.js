require('dotenv').config();

const { PORT = 3000 } = process.env;
const { DB_URI = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { JWT_SECRET } = process.env;
const { NODE_ENV } = process.env;

module.exports = {
  PORT,
  DB_URI,
  JWT_SECRET,
  NODE_ENV,
};
