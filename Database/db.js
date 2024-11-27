const mysql = require("mysql");


// Create a connection to the database
const connection = mysql.createConnection({
  host: "sql7.freemysqlhosting.net",
  user: "sql7746347",
  password: "72gjwXK48L",
  database: "sql7746347"
});

// open the MySQL connection
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion :', err.stack);
    return;
  }
  console.log('Connecté à la base de données avec ID :', connection.threadId);
});

module.exports = connection;
