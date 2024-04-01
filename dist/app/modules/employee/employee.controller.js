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
exports.employeeController = void 0;
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const generateId_1 = require("../../../utils/generateId");
const config_1 = require("../../config");
const getAllEmployees = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    config_1.connection.query("SELECT * FROM employee_info", (error, results, fields) => {
        // console.log("resu", results);
        if (error) {
            console.error("Error fetching employees:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
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
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Employee fetched successfully",
            data: results,
        });
    });
}));
const getEmployeeById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeId = req.params.id; // Assuming employeeId is passed as a route parameter
    // console.log("id", employeeId);
    config_1.connection.query("SELECT * FROM employee_info WHERE profile_id = ?", [employeeId], (error, results, fields) => {
        if (error) {
            console.error("Error fetching employee:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
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
            return res.status(http_status_1.default.NOT_FOUND).json({
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
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Employee fetched successfully",
            data: employee,
        });
    });
}));
const createEmployee = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const { name, number, role, admin_email, password } = req.body;
    // console.log("admin", name);
    const generateId = yield (0, generateId_1.generateNextEmployeeProfileId)();
    // const providedDate = moment('2024-01-14 12:42:59');
    const formattedDate = moment_timezone_1.default.tz("Asia/Dhaka").format();
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
        image: req.body.image ||
            "https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png",
        created_at: formattedDate,
        updated_at: formattedDate,
    };
    config_1.connection.query("INSERT INTO employee_info SET ?", newAdmin, (error, results, fields) => {
        if (error) {
            console.error("Error creating admin:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
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
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Admin created successfully",
            data: { id: createdAdminId },
        });
    });
}));
const updateEmployee = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeId = req.params.id; // Assuming employeeId is passed as a route parameter
    const { name, emp_number, email, password, emp_role } = req.body;
    // Create an object to hold the fields to be updated
    const updatedFields = {};
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
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "No fields to update provided",
        });
    }
    // console.log('data', updatedFields, employeeId)
    config_1.connection.query("UPDATE employee_info SET ? WHERE profile_id = ?", [updatedFields, employeeId], (error, results, fields) => {
        if (error) {
            console.error("Error updating employee:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
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
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Employee updated successfully",
        });
    });
}));
const deleteEmployee = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const employeeId = req.params.id; // Assuming employeeId is passed as a route parameter
    config_1.connection.query("DELETE FROM employee_info WHERE profile_id = ?", [employeeId], (error, results, fields) => {
        if (error) {
            console.error("Error deleting employee:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
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
            return res.status(http_status_1.default.NOT_FOUND).json({
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
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Employee deleted successfully",
        });
    });
}));
exports.employeeController = {
    createEmployee,
    getEmployeeById,
    deleteEmployee,
    updateEmployee,
    getAllEmployees,
};
