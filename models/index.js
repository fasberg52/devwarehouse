const config = require("../config/config.json");
const { Sequelize } = require("sequelize");
const { applyExtraSetup } = require("./models/extra-setup.js");

const sequelize = new Sequelize({
  dialect: config.production.dialect, // Use the dialect of your database (e.g., 'mysql', 'postgres', 'sqlite', etc.)
  host: config.production.host, // Replace with your database host
  username: config.production.username, // Replace with your database username
  password: config.production.password, // Replace with your database password
  database: config.production.database, // Replace with your database name
  port: config.production.port, // Replace with your database port (default is 3306 for MySQL)
  pool: {
    max: 5,
    min: 0,
    acquire: 600000,
    idle: 300000,
  },

  dialectOptions: {
    options: {
      requestTimeout: 0,
    },
  },
});

const modelDefiners = [
  require("./models/Product.js"),
  require("./models/Stock.js"),
  require("./models/StockItem.js"),
  require("./models/User.js"),
  require("./models/Driver.js"),
  require("./models/Vehicle.js"),
  require("./models/locations.js"),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
