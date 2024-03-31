import multer from 'multer';
import path from 'path';
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";

const app: Application = express();
app.use(cors());
// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  
  export const upload = multer({ storage });
  
  // Middleware for serving static files
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));