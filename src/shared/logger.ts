// import path from "path";
// import { createLogger, format, transports, LogEntry } from "winston";
// import DailyRotateFile from "winston-daily-rotate-file";

// // Destructure 'format' from 'winston'
// const { combine, timestamp, label, printf } = format;

// // Define the custom log format

// const myFormat = printf((info: LogEntry) => {
//   const { level, message, label, timestamp } = info;
//   const date = new Date(timestamp);
//   const hour = date.getHours();
//   const minutes = date.getMinutes();
//   const seconds = date.getSeconds();
//   return `${date.toDateString()} ${hour}:${minutes}:${seconds} } [${label}] ${level}: ${message}`;
// });
// // Create logger with 'createLogger' function
// const logger = createLogger({
//   level: "info",
//   format: combine(label({ label: "PH" }), timestamp(), myFormat),
//   transports: [
//     new transports.Console(),
//     new DailyRotateFile({
//       filename: path.join(
//         process.cwd(),
//         "logs",
//         "winston",
//         "successes",
//         "phu-%DATE%-success.log"
//       ),
//       datePattern: "YYYY-DD-MM-HH",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "14d",
//     }),
//   ],
// });

// // Create error logger
// const errorlogger = createLogger({
//   level: "error",
//   format: combine(label({ label: "PH" }), timestamp(), myFormat),
//   transports: [
//     new transports.Console(),
//     new DailyRotateFile({
//       filename: path.join(
//         process.cwd(),
//         "logs",
//         "winston",
//         "errors",
//         "phu-%DATE%-error.log"
//       ),
//       datePattern: "YYYY-DD-MM-HH",
//       zippedArchive: true,
//       maxSize: "20m",
//       maxFiles: "14d",
//     }),
//   ],
// });

// export { logger, errorlogger };
