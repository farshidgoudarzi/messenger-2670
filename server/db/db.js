const Sequelize = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();

const db = new Sequelize(process.env.DATABASE_name, process.env.DATABASE_username, process.env.DATABASE_password, {
  host: process.env.DATABASE_host,
  port: process.env.DATABASE_port,
  dialect: 'postgres',
  logging: false
});

module.exports = db;
