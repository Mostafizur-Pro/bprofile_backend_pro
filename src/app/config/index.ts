const mysql = require("mysql2");
import mysql1 from "mysql2/promise";

export const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bprofile",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


export const pool = mysql1.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "bprofile",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});




export const config = {
  node_env: 'production',
  port: 5000,  
  bycrypt_salt_round: 12,
  jwt_secret: "secret", // Ensure jwt_secret is of type string
  jwt_expires_in: "3d",
  jwt_refresh_token: "very very secret", // Ensure jwt_refresh_token is of type string
  jwt_refresh_expires_in: "750d",
};


