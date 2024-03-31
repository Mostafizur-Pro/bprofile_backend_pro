"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql = require("mysql2");
exports.connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bprofile",
    // waitForConnections: true,
    // connectionLimit: 10,
    // queueLimit: 0,
});
// exports.connection = mysql.createConnection({
//     host: "localhost",
//     user: "nedujbgc_admin_bprofile_test",
//     password: "bprofile123321",
//     database: "nedujbgc_bprofile_test",
//     // waitForConnections: true,
//     // connectionLimit: 10,
//     // queueLimit: 0,
// });
