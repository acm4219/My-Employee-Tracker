const util = require("util");
const mysql = require("mysql");
const { user, password } = require("../My-Employee-Tracker/config");
const connection = mysql.createConnection({
  host: "localhost",
  user: user,
  password: password,
  database: "employees",
});

connection.connect();

connection.query = util.promisify(connection.query);

module.exports = connection;
