import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import moment from "moment-timezone";
import { generateNextClientProfileId } from "../../../utils/generateId";
import { connection } from "../../config";

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any[];
  totalCount: number;
  grandTotal: number;
}

const getAllClients = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.query.page as string) || 1; // Default page is 1
    const limit = parseInt(req.query.limit as string) || 20; // Default limit is 10
    const searchTerm = req.query.searchTerm as string; // Search term from query parameter

    const startIndex = (page - 1) * limit;

    let query = `SELECT * FROM client_data`;

    if (searchTerm) {
      query += ` WHERE category LIKE '%${searchTerm}%'`; // Adjust this according to your database schema
    }

    let grandTotalQuery = `SELECT COUNT(*) AS count FROM client_data`;
    if (searchTerm) {
      grandTotalQuery += ` WHERE category LIKE '%${searchTerm}%'`; // Adjust this according to your database schema
    }

    connection.query(
      grandTotalQuery,
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

        query += ` ORDER BY id DESC LIMIT ${startIndex}, ${limit}`; // Ordering by id in descending order and limiting the results for pagination

        connection.query(
          query,
          (error: any, results: any, fields: any) => {
            if (error) {
              console.error("Error fetching clients:", error);
              return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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

            const response: ApiResponse = {
              statusCode: httpStatus.CREATED,
              success: true,
              message: "Clients fetched successfully",
              totalCount: totalCount,
              grandTotal: grandTotal, // Including the grand total in the response
              data: dataToShow,
            };

            return res.status(response.statusCode).json(response);
          }
        );
      }
    );
  }
);

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

const getClientById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.params.id; // Assuming clientId is passed as a route parameter
    // console.log("id", clientId);
    connection.query(
      "SELECT * FROM client_data WHERE profile_id = ?",
      [clientId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error fetching client:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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
          return res.status(httpStatus.NOT_FOUND).json({
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

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Client fetched successfully",
          data: client,
        });
      }
    );
  }
);

const createClient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const generateId = await generateNextClientProfileId();
    // const providedDate = moment('2024-01-14 12:42:59');
    const formattedDate = moment.tz("Asia/Dhaka").format();

    const newClient = {
      name: req.body.name,
      profile_id: generateId,
      birthday: req.body.birthday,
      organization_name: req.body.organization_name,
      image:
        "https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png",
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
    connection.query(
      "INSERT INTO client_data SET ?",
      newClient,
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error creating newClient:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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

        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Client created successfully",
          data: { id: createdClientId },
        });
      }
    );
  }
);

const updateClient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.params.id;
    const { name,organization_name, number, email, password } = req.body;

    // Create an object to hold the fields to be updated
    const updatedFields: { [key: string]: any } = {};

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
      return res.status(httpStatus.BAD_REQUEST).json({
        success: false,
        message: "No fields to update provided",
      });
    }

    // console.log('data', updatedFields, clientId)
    connection.query(
      "UPDATE client_data SET ? WHERE profile_id = ?",
      [updatedFields, clientId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error updating client:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Client updated successfully",
        });
      }
    );
  }
);

const deleteClient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.params.id;

    connection.query(
      "DELETE FROM client_data WHERE profile_id = ?",
      [clientId],
      (error: any, results: any, fields: any) => {
        if (error) {
          console.error("Error deleting client:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
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
          return res.status(httpStatus.NOT_FOUND).json({
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

        sendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "Client deleted successfully",
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
