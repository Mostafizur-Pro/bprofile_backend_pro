import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; // for generating JWT tokens
import { pool } from "../../config";
const bcrypt = require('bcryptjs');

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

    const [usersData] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    const users = usersData as User[];

    const [clientData] = await connection.query(
      "SELECT * FROM client_data WHERE email = ?",
      [email]
    );
    const clients = clientData as User[];
    

    // console.log('clientData', users[0])

    if (clients[0]) {
    

      connection.release();
      // Check if the password matches
      const isMatch = password === clients[0].password;
      // console.log('user', isMatch)
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials." });
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { clientId: clients[0].id, email: clients[0].email },
        "secret",
        { expiresIn: "1h" }
      );

      // Return success response with token
      res.status(200).json({ success: true, accessToken, clients });
    }
    if (users[0]) {
      

       console.log('user', users)
      // if (!users) {
      //   return res
      //     .status(404)
      //     .json({ success: false, message: "User not found." });
      // }

      connection.release();
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
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};
const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const connection = await pool.getConnection();

    const [adminData] = await connection.query(
      "SELECT * FROM admin_info WHERE admin_email = ?",
      [email]
    );

    // console.log('data', adminData)

    if (adminData) {
      const admins = adminData as User[];

      console.log('admin', admins[0].password, bcrypt.compare(password))
      connection.release();
      // Check if the password matches
      const isMatch = bcrypt.compare(password === admins[0].password);

      // console.log('user', isMatch)
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials." });
      }

      // Generate JWT token
      const accessToken = jwt.sign(
        { clientId: admins[0].id, email: admins[0].email },
        "secret",
        { expiresIn: "1h" }
      );

      // Return success response with token
      res.status(200).json({ success: true, accessToken, admins });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

export const authController = {
  login,
  adminLogin,
  // changePassword,
};
