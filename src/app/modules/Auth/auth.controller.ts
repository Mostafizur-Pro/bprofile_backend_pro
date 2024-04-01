import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; // for generating JWT tokens
import { pool } from "../../config";


interface User {
    id: number;
    email: string;
    password: string;
    // Add other properties if needed
  }

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    
    const users = (rows as User[]);

   

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
    const accessToken = jwt.sign(
      { userId: users[0].id, email: users[0].email },
      "secret",
      { expiresIn: "1h" }
    );

    // Return success response with token
    res.status(200).json({ success: true, accessToken, users });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export const authController = {
  login,
  // adminLogin,
  // changePassword,
};
