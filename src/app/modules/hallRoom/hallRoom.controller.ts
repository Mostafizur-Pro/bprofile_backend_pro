import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import moment from "moment-timezone";
import { connection } from "../../config";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any[];
  totalCount: number;
  grandTotal: number;
}
const getAllHallRooms = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1; // Default page is 1
    const limit = parseInt(req.query.limit as string) || 10; // Default limit is 10
    const searchTerm = req.query.searchTerm as string; // Search term from query parameter

    const startIndex = (page - 1) * limit;

    let query = `SELECT * FROM hall_room_post`;

    if (searchTerm) {
      query += ` WHERE category LIKE ? OR id LIKE ? OR subcategories LIKE ? OR division LIKE ? OR district LIKE ? OR thana LIKE ? OR ward LIKE ? OR client_id LIKE ?`; // Use placeholders for SQL injection prevention
    }

    let grandTotalQuery = `SELECT COUNT(*) AS count FROM hall_room_post`;

    if (searchTerm) {
      grandTotalQuery += ` WHERE category LIKE ? OR id LIKE ? OR subcategories LIKE ? OR division LIKE ? OR district LIKE ? OR thana LIKE ? OR ward LIKE ? OR client_id LIKE ?`;
    }

    connection.query(
      grandTotalQuery,
      [
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
        `%${searchTerm}%`,
      ],
      (error: any, grandTotalResult: any, fields: any) => {
        if (error) {
          console.error("Error fetching grand total:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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

        query += ` ORDER BY id DESC LIMIT ${startIndex}, ${limit}`;  // Use placeholders for SQL injection prevention

        connection.query(
          query,
          [
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            `%${searchTerm}%`,
            startIndex,
            limit,
          ],
          async (error: any, results: any, fields: any) => {
            if (error) {
              console.error("Error fetching post:", error);
              return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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

            // Fetch client details for each post
            for (let i = 0; i < results.length; i++) {
              const clientId = results[i].client_id;
              const client = await getClientById(clientId);
              results[i].client = client; // Add client details to the post object
            }

            const totalCount = results.length;

            const response: ApiResponse = {
              statusCode: httpStatus.CREATED,
              success: true,
              message: "Post fetched successfully",
              totalCount: totalCount,
              grandTotal: grandTotal, // Including the grand total in the response
              data: results,
            };

            return res.status(response.statusCode).json(response);
          }
        );
      }
    );
  }
);

// Function to fetch client details by client_id
async function getClientById(clientId: number) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM client_data WHERE id = ?`,
      [clientId],
      (error: any, results: any, fields: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(results[0]); // Return the first result
        }
      }
    );
  });
}

// const getAllHallRooms = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const page = parseInt(req.query.page as string) || 1; // Default page is 1
//     const limit = parseInt(req.query.limit as string) || 10; // Default limit is 10
//     const searchTerm = req.query.searchTerm as string; // Search term from query parameter

//     const startIndex = (page - 1) * limit;

//     let query = `SELECT * FROM hall_room_post`;

//     if (searchTerm) {
//       query += ` WHERE category LIKE ? OR id LIKE ? OR subcategories LIKE ? OR division LIKE ? OR district LIKE ? OR thana LIKE ? OR ward LIKE ? OR client_id LIKE ?`; // Use placeholders for SQL injection prevention
//     }

//     let grandTotalQuery = `SELECT COUNT(*) AS count FROM hall_room_post`;

//     if (searchTerm) {
//       grandTotalQuery += ` WHERE category LIKE ? OR id LIKE ? OR subcategories LIKE ? OR division LIKE ? OR district LIKE ? OR thana LIKE ? OR ward LIKE ? OR client_id LIKE ?`;
//     }
//     connection.query(
//       grandTotalQuery,
//       [
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//         `%${searchTerm}%`,
//       ],
//       (error: any, grandTotalResult: any, fields: any) => {
//         if (error) {
//           console.error("Error fetching grand total:", error);
//           return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             message: "Internal Server Error",
//             errorMessages: [
//               {
//                 path: req.originalUrl,
//                 message: "Error fetching grand total",
//               },
//             ],
//           });
//         }

//         const grandTotal = grandTotalResult[0].count;

//         query += ` ORDER BY id DESC LIMIT ${startIndex}, ${limit}`;  // Use placeholders for SQL injection prevention

//         connection.query(
//           query,
//           [
//             `%${searchTerm}%`,
//             `%${searchTerm}%`,
//             `%${searchTerm}%`,
//             `%${searchTerm}%`,
//             `%${searchTerm}%`,
//             `%${searchTerm}%`,
//             `%${searchTerm}%`,
//             `%${searchTerm}%`,
//             startIndex,
//             limit,
//           ],
//           (error: any, results: any, fields: any) => {
//             if (error) {
//               console.error("Error fetching post:", error);
//               return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//                 success: false,
//                 message: "Internal Server Error",
//                 errorMessages: [
//                   {
//                     path: req.originalUrl,
//                     message: "Error fetching post",
//                   },
//                 ],
//               });
//             }

//             const totalCount = results.length;

//             const response: ApiResponse = {
//               statusCode: httpStatus.CREATED,
//               success: true,
//               message: "Post fetched successfully",
//               totalCount: totalCount,
//               grandTotal: grandTotal, // Including the grand total in the response
//               data: results,
//             };

//             return res.status(response.statusCode).json(response);
//           }
//         );
//       }
//     );
//   }
// );

const getAllHallRoomData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    connection.query(
      "SELECT * FROM hall_room_post",
      (error: any, results: any, fields: any) => {
        // console.log("results", results);
        if (error) {
          console.error("Error fetching post:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Post fetched successfully",
          data: results,
        });
      }
    );
  }
);

const getHallRoomById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id; // Assuming postId is passed as a route parameter
    // console.log("id", postId);
    connection.query(
      "SELECT * FROM hall_room_post WHERE id = ?",
      [postId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error fetching post:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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
          return res.status(httpStatus.NOT_FOUND).json({
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

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Post fetched successfully",
          data: post,
        });
      }
    );
  }
);

const createHallRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const formattedDate = moment.tz("Asia/Dhaka").format();
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

    connection.query(
      "INSERT INTO hall_room_post SET ?",
      newPost,
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error creating newPost:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Post created successfully",
          data: { id: createdPostId },
        });
      }
    );
  }
);

const updateHallRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const {
      title,
      post,
      category,
      subcategories,
      division,
      district,
      thana,
      ward,
      localArea,
      road,
    } = req.body;

    // Create an object to hold the fields to be updated
    const updatedFields: { [key: string]: any } = {};

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
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "No fields to update provided",
      });
    }

    connection.query(
      "UPDATE hall_room_post SET ? WHERE id = ?",
      [updatedFields, postId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error updating hall room post:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Hall room post updated successfully",
        });
      }
    );
  }
);

const deleteHallRoom = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.id;

    connection.query(
      "DELETE FROM hall_room_post WHERE id = ?",
      [postId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error deleting post:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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
          return res.status(httpStatus.NOT_FOUND).json({
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

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Post deleted successfully",
        });
      }
    );
  }
);

export const hallRoomController = {
  createHallRoom,
  getHallRoomById,
  deleteHallRoom,
  updateHallRoom,
  getAllHallRooms,
  getAllHallRoomData
};
