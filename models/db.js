const Knex = require("knex");
const knexConfig = require("../knexfile");

const environment = "development";
const db = Knex(knexConfig[environment]);

module.exports = db;
