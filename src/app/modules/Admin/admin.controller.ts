import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

import moment from "moment-timezone";
import { generateNextAdminProfileId } from "../../../utils/generateId";
import { connection } from "../../config";

const getAllAdmins = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    connection.query(
      "SELECT * FROM admin_info",
      (error: any, results: any, fields: any) => {
        // console.log("resu", results);
        if (error) {
          console.error("Error fetching admins:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error fetching admins",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Admin fetched successfully",
          data: results,
        });
      }
    );
  }
);

const getAdminById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const adminId = req.params.id; // Assuming adminId is passed as a route parameter
    // console.log("id", adminId);
    connection.query(
      "SELECT * FROM admin_info WHERE profile_id = ?",
      [adminId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error fetching admin:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error fetching admin",
              },
            ],
          });
        }

        if (results.length === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "Admin not found",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Admin not found with given ID",
              },
            ],
          });
        }

        // Assuming results contains the admin data
        const admin = results[0];

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Admin fetched successfully",
          data: admin,
        });
      }
    );
  }
);

const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, number, role, admin_email, password } = req.body;

    console.log("admin", name);

    const generateId = await generateNextAdminProfileId();
    // const providedDate = moment('2024-01-14 12:42:59');
    const formattedDate = moment.tz("Asia/Dhaka").format();

    const newAdmin = {
      name,
      profile_id: generateId,
      number,
      admin_email,
      password,
      role,
      action: "approved",
      image:
        "https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png",
      created_at: formattedDate,
      updated_at: formattedDate,
    };

    connection.query(
      "INSERT INTO admin_info SET ?",
      newAdmin,
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error creating admin:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error creating admin",
              },
            ],
          });
        }

        const createdAdminId = results.insertId;

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Admin created successfully",
          data: { id: createdAdminId },
        });
      }
    );
  }
);

const updateAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const adminId = req.params.id; // Assuming adminId is passed as a route parameter
    const { name, number, email, password, role } = req.body;

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
    if (role !== undefined) {
      updatedFields.password = role;
    }

    // If no fields to update are provided, send a bad request response
    if (Object.keys(updatedFields).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "No fields to update provided",
      });
    }

    // console.log('data', updatedFields, adminId)
    connection.query(
      "UPDATE admin_info SET ? WHERE profile_id = ?",
      [updatedFields, adminId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error updating admin:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error updating admin",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Admin updated successfully",
        });
      }
    );
  }
);

const deleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const adminId = req.params.id; // Assuming adminId is passed as a route parameter

    connection.query(
      "DELETE FROM admin_info WHERE profile_id = ?",
      [adminId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error deleting admin:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error deleting admin",
              },
            ],
          });
        }

        // Check if any admin was deleted
        if (results.affectedRows === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "Admin not found",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Admin not found with given profile ID",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Admin deleted successfully",
        });
      }
    );
  }
);

export const adminController = {
  createAdmin,
  getAdminById,
  deleteAdmin,
  updateAdmin,
  getAllAdmins,
};
