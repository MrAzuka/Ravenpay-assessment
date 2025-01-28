
// Update with your config settings.
require("dotenv").config();

module.exports = {
    development: {
        client: 'mysql',
        connection: {
          host: '127.0.0.1',
          port: 3306,
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        },
        migrations: {
          tableName: 'migrations',
        },
    }
};
