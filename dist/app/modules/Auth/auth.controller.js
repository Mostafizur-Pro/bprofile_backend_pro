"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // for generating JWT tokens
const config_1 = require("../../config");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ success: false, message: "Email and password are required." });
    }
    try {
        const connection = yield config_1.pool.getConnection();
        const [rows] = yield connection.query("SELECT * FROM users WHERE email = ?", [email]);
        const users = rows;
        connection.release();
        if (!users) {
            return res
                .status(404)
                .json({ success: false, message: "User not found." });
        }
        // Check if the password matches
        const isMatch = password === users[0].password;
        // console.log('user', isMatch)
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials." });
        }
        // Generate JWT token
        const accessToken = jsonwebtoken_1.default.sign({ userId: users[0].id, email: users[0].email }, "secret", { expiresIn: "1h" });
        // Return success response with token
        res.status(200).json({ success: true, accessToken, users });
    }
    catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ success: false, message: "Internal Server Error." });
    }
});
exports.authController = {
    login,
    // adminLogin,
    // changePassword,
};
