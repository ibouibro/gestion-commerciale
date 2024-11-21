const mysql = require("mysql");


// Create a connection to the database
const connection = mysql.createConnection({
  host: "sql7.freemysqlhosting.net",
  user: "sql7746347",
  password: "72gjwXK48L",
  database: "sql7746347"
});

// open the MySQL connection
connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = connection;
