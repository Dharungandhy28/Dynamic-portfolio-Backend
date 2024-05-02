const mongoose = require("mongoose");

mongoose.connect(process.env.mongo_url);

const connection = mongoose.connection;

connection.on("error", () => {});

connection.on("connected", () => {});

module.exports = connection;
