const mysql = require("mysql");


// Create a connection to the database
const connection = mysql.createPool({
  host: "sql7.freemysqlhosting.net",
  user: "sql7746347",
  password: "72gjwXK48L",
  database: "sql7746347",
  port: 3306,
  connectionLimit : 5
});

// open the MySQL connection


module.exports = connection;
