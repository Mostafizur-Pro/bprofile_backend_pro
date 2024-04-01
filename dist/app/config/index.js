"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.pool = exports.connection = void 0;
const mysql = require("mysql2");
const promise_1 = __importDefault(require("mysql2/promise"));
exports.connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "bprofile",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
exports.pool = promise_1.default.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "bprofile",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
exports.config = {
    node_env: 'production',
    port: 5000,
    bycrypt_salt_round: 12,
    jwt_secret: "secret", // Ensure jwt_secret is of type string
    jwt_expires_in: "3d",
    jwt_refresh_token: "very very secret", // Ensure jwt_refresh_token is of type string
    jwt_refresh_expires_in: "750d",
};
