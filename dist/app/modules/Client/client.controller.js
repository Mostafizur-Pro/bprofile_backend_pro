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
exports.clientController = void 0;
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const generateId_1 = require("../../../utils/generateId");
const config_1 = require("../../config");
const getAllClients = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const searchTerm = req.query.searchTerm; // Search term from query parameter
    const startIndex = (page - 1) * limit;
    let query = `SELECT * FROM client_data`;
    if (searchTerm) {
        query += ` WHERE category LIKE '%${searchTerm}%'`; // Adjust this according to your database schema
    }
    let grandTotalQuery = `SELECT COUNT(*) AS count FROM client_data`;
    if (searchTerm) {
        grandTotalQuery += ` WHERE category LIKE '%${searchTerm}%'`; // Adjust this according to your database schema
    }
    config_1.connection.query(grandTotalQuery, (error, grandTotalResult, fields) => {
        if (error) {
            console.error("Error fetching grand total:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error fetching grand total",
                    },
                ],
            });
        }
        const grandTotal = grandTotalResult[0].count;
        query += ` ORDER BY id DESC LIMIT ${startIndex}, ${limit}`; // Ordering by id in descending order and limiting the results for pagination
        config_1.connection.query(query, (error, results, fields) => {
            if (error) {
                console.error("Error fetching clients:", error);
                return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal Server Error",
                    errorMessages: [
                        {
                            path: req.originalUrl,
                            message: "Error fetching clients",
                        },
                    ],
                });
            }
            const totalCount = results.length; // Total count of records for the current page
            const dataToShow = results;
            const response = {
                statusCode: http_status_1.default.CREATED,
                success: true,
                message: "Clients fetched successfully",
                totalCount: totalCount,
                grandTotal: grandTotal, // Including the grand total in the response
                data: dataToShow,
            };
            return res.status(response.statusCode).json(response);
        });
    });
}));
// const getAllClients = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     connection.query(
//       "SELECT * FROM client_data",
//       (error: any, results: any, fields: any) => {
//         // console.log("resu", results);
//         if (error) {
//           console.error("Error fetching client:", error);
//           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Internal Server Error",
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: "Error fetching client",
//               },
//             ],
//           });
//         }
//         sendResponse(res, {
//           statusCode: httpStatus.CREATED,
//           success: true,
//           message: "Client fetched successfully",
//           data: results,
//         });
//       }
//     );
//   }
// );
const getClientById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.id; // Assuming clientId is passed as a route parameter
    // console.log("id", clientId);
    config_1.connection.query("SELECT * FROM client_data WHERE profile_id = ?", [clientId], (error, results, fields) => {
        if (error) {
            console.error("Error fetching client:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error fetching client",
                    },
                ],
            });
        }
        if (results.length === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Client not found",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Client not found with given ID",
                    },
                ],
            });
        }
        // Assuming results contains the client data
        const client = results[0];
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Client fetched successfully",
            data: client,
        });
    });
}));
const createClient = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const generateId = yield (0, generateId_1.generateNextClientProfileId)();
    // const providedDate = moment('2024-01-14 12:42:59');
    const formattedDate = moment_timezone_1.default.tz("Asia/Dhaka").format();
    const newClient = {
        name: req.body.name,
        profile_id: generateId,
        birthday: req.body.birthday,
        organization_name: req.body.organization_name,
        image: "https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png",
        number: req.body.number,
        division: req.body.division,
        district: req.body.district,
        thana: req.body.thana,
        ward: req.body.ward,
        localArea: req.body.localArea,
        road: req.body.road,
        category: req.body.category,
        subcategories: req.body.subcategories,
        gender: req.body.gender,
        data: req.body.data,
        email: req.body.email,
        password: req.body.password,
        role: "normal",
        action: "publish",
        emp_id: req.body.emp_id || null,
        emp_name: req.body.emp_name || null,
        admin_id: req.body.admin_id || null,
        admin_name: req.body.admin_name || null,
        adminTime: req.body.adminTime || null,
        supperAdmin_id: req.body.supperAdmin_id || null,
        supperAdmin_name: req.body.supperAdmin_name || null,
        SupperAdminTime: req.body.SupperAdminTime || null,
        created_at: formattedDate,
        updated_at: formattedDate,
    };
    console.log("client", newClient);
    config_1.connection.query("INSERT INTO client_data SET ?", newClient, (error, results, fields) => {
        if (error) {
            console.error("Error creating newClient:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error creating newClient",
                    },
                ],
            });
        }
        const createdClientId = results.insertId;
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Client created successfully",
            data: { id: createdClientId },
        });
    });
}));
const updateClient = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.id;
    const { name, organization_name, number, email, password } = req.body;
    // Create an object to hold the fields to be updated
    const updatedFields = {};
    // Check which fields are provided in the request body and add them to the updatedFields object
    if (name !== undefined) {
        updatedFields.name = name;
    }
    if (organization_name !== undefined) {
        updatedFields.organization_name = organization_name;
    }
    if (number !== undefined) {
        updatedFields.number = number;
    }
    if (password !== undefined) {
        updatedFields.password = password;
    }
    // If no fields to update are provided, send a bad request response
    if (Object.keys(updatedFields).length === 0) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "No fields to update provided",
        });
    }
    // console.log('data', updatedFields, clientId)
    config_1.connection.query("UPDATE client_data SET ? WHERE profile_id = ?", [updatedFields, clientId], (error, results, fields) => {
        if (error) {
            console.error("Error updating client:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error updating client",
                    },
                ],
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Client updated successfully",
        });
    });
}));
const deleteClient = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const clientId = req.params.id;
    config_1.connection.query("DELETE FROM client_data WHERE profile_id = ?", [clientId], (error, results, fields) => {
        if (error) {
            console.error("Error deleting client:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error deleting client",
                    },
                ],
            });
        }
        // Check if any client was deleted
        if (results.affectedRows === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Client not found",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Client not found with given profile ID",
                    },
                ],
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Client deleted successfully",
        });
    });
}));
exports.clientController = {
    createClient,
    getClientById,
    deleteClient,
    updateClient,
    getAllClients,
};
