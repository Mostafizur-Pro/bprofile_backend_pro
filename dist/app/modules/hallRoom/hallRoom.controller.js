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
exports.hallRoomController = void 0;
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const config_1 = require("../../config");
const getAllHallRooms = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const searchTerm = req.query.searchTerm; // Search term from query parameter
    const startIndex = (page - 1) * limit;
    let query = `SELECT * FROM hall_room_post`;
    if (searchTerm) {
        query += ` WHERE category LIKE '%${searchTerm}%'`; // Adjust this according to your database schema
    }
    let grandTotalQuery = `SELECT COUNT(*) AS count FROM hall_room_post`;
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
                console.error("Error fetching post:", error);
                return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    message: "Internal Server Error",
                    errorMessages: [
                        {
                            path: req.originalUrl,
                            message: "Error fetching post",
                        },
                    ],
                });
            }
            const totalCount = results.length; // Total count of records for the current page
            const dataToShow = results;
            const response = {
                statusCode: http_status_1.default.CREATED,
                success: true,
                message: "Post fetched successfully",
                totalCount: totalCount,
                grandTotal: grandTotal, // Including the grand total in the response
                data: dataToShow,
            };
            return res.status(response.statusCode).json(response);
        });
    });
}));
// const getAllHallRooms = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     connection.query(
//       "SELECT * FROM hall_room_post",
//       (error: any, results: any, fields: any) => {
//         // console.log("results", results);
//         if (error) {
//           console.error("Error fetching post:", error);
//           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Internal Server Error",
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: "Error fetching post",
//               },
//             ],
//           });
//         }
//         sendResponse(res, {
//           statusCode: httpStatus.CREATED,
//           success: true,
//           message: "Post fetched successfully",
//           data: results,
//         });
//       }
//     );
//   }
// );
const getHallRoomById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id; // Assuming postId is passed as a route parameter
    // console.log("id", postId);
    config_1.connection.query("SELECT * FROM hall_room_post WHERE id = ?", [postId], (error, results, fields) => {
        if (error) {
            console.error("Error fetching post:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error fetching post",
                    },
                ],
            });
        }
        if (results.length === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Post not found",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Post not found with given ID",
                    },
                ],
            });
        }
        const post = results[0];
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Post fetched successfully",
            data: post,
        });
    });
}));
const createHallRoom = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const formattedDate = moment_timezone_1.default.tz("Asia/Dhaka").format();
    const newPost = {
        title: req.body.title,
        post: req.body.post,
        image: req.body.image || null,
        division: req.body.division,
        district: req.body.district,
        thana: req.body.thana,
        ward: req.body.ward,
        localArea: req.body.localArea,
        road: req.body.road,
        category: req.body.category,
        subcategories: req.body.subcategories,
        client_id: req.body.client_id,
        created_at: formattedDate,
        updated_at: formattedDate,
    };
    config_1.connection.query("INSERT INTO hall_room_post SET ?", newPost, (error, results, fields) => {
        if (error) {
            console.error("Error creating newPost:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error creating newPost",
                    },
                ],
            });
        }
        const createdPostId = results.insertId;
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.CREATED,
            success: true,
            message: "Post created successfully",
            data: { id: createdPostId },
        });
    });
}));
const updateHallRoom = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    const { title, post, category, subcategories, division, district, thana, ward, localArea, road, } = req.body;
    // Create an object to hold the fields to be updated
    const updatedFields = {};
    // Check which fields are provided in the request body and add them to the updatedFields object
    if (title !== undefined) {
        updatedFields.title = title;
    }
    if (post !== undefined) {
        updatedFields.post = post;
    }
    if (category !== undefined) {
        updatedFields.category = category;
    }
    if (subcategories !== undefined) {
        updatedFields.subcategories = subcategories;
    }
    if (division !== undefined) {
        updatedFields.division = division;
    }
    if (district !== undefined) {
        updatedFields.district = district;
    }
    if (thana !== undefined) {
        updatedFields.thana = thana;
    }
    if (ward !== undefined) {
        updatedFields.ward = ward;
    }
    if (localArea !== undefined) {
        updatedFields.localArea = localArea;
    }
    if (road !== undefined) {
        updatedFields.road = road;
    }
    // If no fields to update are provided, send a bad request response
    if (Object.keys(updatedFields).length === 0) {
        return res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: "No fields to update provided",
        });
    }
    config_1.connection.query("UPDATE hall_room_post SET ? WHERE id = ?", [updatedFields, postId], (error, results, fields) => {
        if (error) {
            console.error("Error updating hall room post:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error updating hall room post",
                    },
                ],
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Hall room post updated successfully",
        });
    });
}));
const deleteHallRoom = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    config_1.connection.query("DELETE FROM hall_room_post WHERE id = ?", [postId], (error, results, fields) => {
        if (error) {
            console.error("Error deleting post:", error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Internal Server Error",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Error deleting post",
                    },
                ],
            });
        }
        if (results.affectedRows === 0) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                success: false,
                message: "Post not found",
                errorMessages: [
                    {
                        path: req.originalUrl,
                        message: "Post not found with given profile ID",
                    },
                ],
            });
        }
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Post deleted successfully",
        });
    });
}));
exports.hallRoomController = {
    createHallRoom,
    getHallRoomById,
    deleteHallRoom,
    updateHallRoom,
    getAllHallRooms,
};
