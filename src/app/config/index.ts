const mysql = require("mysql2");

export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bprofile",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
});
// export const connection = mysql.createConnection({
//   host: "localhost",
//   user: "nedujbgc_admin_bprofile_test",
//   password: "bprofile123321",
//   database: "nedujbgc_bprofile_test",
//   // waitForConnections: true,
//   // connectionLimit: 10,
//   // queueLimit: 0,
// });
