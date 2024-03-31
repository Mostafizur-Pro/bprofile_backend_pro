import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

import moment from "moment-timezone";
import { generateNextEmployeeProfileId } from "../../../utils/generateId";
import { connection } from "../../config";

const getAllEmployees = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    connection.query(
      "SELECT * FROM employee_info",
      (error: any, results: any, fields: any) => {
        // console.log("resu", results);
        if (error) {
          console.error("Error fetching employees:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error fetching employees",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Employee fetched successfully",
          data: results,
        });
      }
    );
  }
);

const getEmployeeById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.params.id; // Assuming employeeId is passed as a route parameter
    // console.log("id", employeeId);
    connection.query(
      "SELECT * FROM employee_info WHERE profile_id = ?",
      [employeeId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error fetching employee:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error fetching employee",
              },
            ],
          });
        }

        if (results.length === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "Employee not found",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Employee not found with given ID",
              },
            ],
          });
        }

        // Assuming results contains the Employee data
        const employee = results[0];

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Employee fetched successfully",
          data: employee,
        });
      }
    );
  }
);

const createEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { name, number, role, admin_email, password } = req.body;

    // console.log("admin", name);

    const generateId = await generateNextEmployeeProfileId();
    // const providedDate = moment('2024-01-14 12:42:59');
    const formattedDate = moment.tz("Asia/Dhaka").format();

    const newAdmin = {
      name: req.body.name,
      profile_id: generateId,
      birthday: req.body.birthday,
      emp_number: req.body.emp_number,
      emp_nid: req.body.emp_nid,
      emp_address: req.body.emp_address,
      emp_email: req.body.emp_email,
      password: req.body.password,
      emp_role: req.body.emp_role,
      supperAdmin_id: req.body.supperAdmin_id || null,
      supperAdmin_name: req.body.supperAdmin_name || null,

      image:
        req.body.image ||
        "https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png",
      created_at: formattedDate,
      updated_at: formattedDate,
    };

    connection.query(
      "INSERT INTO employee_info SET ?",
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

const updateEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.params.id; // Assuming employeeId is passed as a route parameter
    const { name, emp_number, email, password, emp_role } = req.body;

    // Create an object to hold the fields to be updated
    const updatedFields: { [key: string]: any } = {};

    // Check which fields are provided in the request body and add them to the updatedFields object
    if (name !== undefined) {
      updatedFields.name = name;
    }
    if (emp_number !== undefined) {
      updatedFields.number = emp_number;
    }
    if (email !== undefined) {
      updatedFields.email = email;
    }
    if (password !== undefined) {
      updatedFields.password = password;
    }
    if (emp_role !== undefined) {
      updatedFields.password = emp_role;
    }

    // If no fields to update are provided, send a bad request response
    if (Object.keys(updatedFields).length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "No fields to update provided",
      });
    }

    // console.log('data', updatedFields, employeeId)
    connection.query(
      "UPDATE employee_info SET ? WHERE profile_id = ?",
      [updatedFields, employeeId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error updating employee:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error updating employee",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Employee updated successfully",
        });
      }
    );
  }
);

const deleteEmployee = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const employeeId = req.params.id; // Assuming employeeId is passed as a route parameter

    connection.query(
      "DELETE FROM employee_info WHERE profile_id = ?",
      [employeeId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error deleting employee:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Error deleting employee",
              },
            ],
          });
        }

        // Check if any employee was deleted
        if (results.affectedRows === 0) {
          return res.status(httpStatus.NOT_FOUND).json({
            success: false,
            message: "Employee not found",
            errorMessages: [
              {
                path: req.originalUrl,
                message: "Employee not found with given profile ID",
              },
            ],
          });
        }

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Employee deleted successfully",
        });
      }
    );
  }
);

export const employeeController = {
  createEmployee,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
  getAllEmployees,
};
