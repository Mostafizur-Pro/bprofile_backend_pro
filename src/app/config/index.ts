const mysql = require("mysql2");

export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bprofile",
});








