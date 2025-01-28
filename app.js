require("dotenv").config();
// server
const express = require("express");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT;
const knexConfig = require("./knexfile");
const Knex = require("knex");
const { routes } = require('./routes')

//middleware
app.use(express.json());
app.use(morgan("dev"));

// Initialize knex with the development configuration
const knex = Knex(knexConfig["development"]);
// Attach knex to the app for global use
app.set("knex", knex);


app.use('/api', routes)



knex
  .raw("SELECT 1")
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
