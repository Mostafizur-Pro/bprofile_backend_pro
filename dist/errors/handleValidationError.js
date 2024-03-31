"use strict";
// import { PrismaClient, PrismaClientKnownRequestError } from '@prisma/client';
// // Instantiate PrismaClient
// const prisma = new PrismaClient();
// // Define interfaces for error response
// interface IGenericErrorResponse {
//   statusCode: number;
//   message: string;
//   errorMessages: IGenericErrorMessage[];
// }
// interface IGenericErrorMessage {
//   path: string | undefined;
//   message: string | undefined;
// }
// // Define function to handle validation errors
// const handleValidationError = (
//   error: Error
// ): IGenericErrorResponse => {
//   let statusCode = 400;
//   let message = 'Validation Error';
//   let errorMessages: IGenericErrorMessage[] = [];
//   // Check if the error is a known Prisma request error
//   if (error instanceof PrismaClientKnownRequestError) {
//     errorMessages = error.errorData?.map((errorData: { path: any; message: any; }) => ({
//       path: errorData.path,
//       message: errorData.message,
//     })) || [];
//     // Adjust status code and message if needed
//     if (error.code === 'P2000') {
//       statusCode = 404;
//       message = 'Not Found'; // Example message, adjust as needed
//     }
//     // Add more conditions as per your application's needs
//   }
//   return {
//     statusCode,
//     message,
//     errorMessages,
//   };
// };
// export default handleValidationError;
