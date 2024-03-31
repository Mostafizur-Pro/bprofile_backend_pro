import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import moment from "moment-timezone";
import { generateNextUserProfileId } from "../../../utils/generateId";
import { connection } from "../../config";

export const userFilterableFields = ["searchTerm", "title", "syncId"];

const getAllClients = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    connection.query(
      "SELECT * FROM users",
      (error: any, results: any, fields: any) => {
        // console.log("resu", results);
        if (error) {
          console.error("Error fetching users:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error fetching users",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "User fetched successfully",
          data: results,
        });
      }
    );
  }
);

const getClientById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id; // Assuming userId is passed as a route parameter
    // console.log("id", userId);
    connection.query(
      "SELECT * FROM users WHERE profile_id = ?",
      [userId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error fetching user:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error fetching user",
              },
            ],
          });
        }

        if (results.length === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "User not found",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "User not found with given ID",
              },
            ],
          });
        }

        // Assuming results contains the user data
        const user = results[0];

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "User fetched successfully",
          data: user,
        });
      }
    );
  }
);

const createClient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, number, email, password } = req.body;

    const generateId = await generateNextUserProfileId();
    // const providedDate = moment('2024-01-14 12:42:59');
    const formattedDate = moment.tz("Asia/Dhaka").format();

    const newUser = {
      name,
      number,
      email,
      password,
      profile_id: generateId,
      image:
        "https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png",
      created_at: formattedDate,
      updated_at: formattedDate,
    };

    connection.query(
      "INSERT INTO users SET ?",
      newUser,
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error creating user:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error creating user",
              },
            ],
          });
        }

        const createdUserId = results.insertId;

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "User created successfully",
          data: { id: createdUserId },
        });
      }
    );
  }
);

const updateClient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id; // Assuming userId is passed as a route parameter
    const { name, number, email, password } = req.body;

    // Create an object to hold the fields to be updated
    const updatedFields: { [key: string]: any } = {};

    // Check which fields are provided in the request body and add them to the updatedFields object
    if (name !== undefined) {
      updatedFields.name = name;
    }
    if (number !== undefined) {
      updatedFields.number = number;
    }
    if (email !== undefined) {
      updatedFields.email = email;
    }
    if (password !== undefined) {
      updatedFields.password = password;
    }

    // If no fields to update are provided, send a bad request response
    if (Object.keys(updatedFields).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "No fields to update provided",
      });
    }

    // console.log('data', updatedFields, userId)
    connection.query(
      "UPDATE users SET ? WHERE profile_id = ?",
      [updatedFields, userId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error updating user:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error updating user",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "User updated successfully",
        });
      }
    );
  }
);

const deleteClient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id; // Assuming userId is passed as a route parameter

    connection.query(
      "DELETE FROM users WHERE profile_id = ?",
      [userId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error deleting user:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error deleting user",
              },
            ],
          });
        }

        // Check if any user was deleted
        if (results.affectedRows === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "User not found",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "User not found with given profile ID",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "User deleted successfully",
        });
      }
    );
  }
);


export const clientController = {
  createClient,
  getClientById,
  deleteClient,
  updateClient,
  getAllClients,
};
