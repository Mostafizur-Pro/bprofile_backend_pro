"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const employee_controller_1 = require("./employee.controller");
const router = express_1.default.Router();
router.get("/", employee_controller_1.employeeController.getAllEmployees);
router.get("/:id", employee_controller_1.employeeController.getEmployeeById);
router.post("/", employee_controller_1.employeeController.createEmployee);
router.put("/:id", employee_controller_1.employeeController.updateEmployee);
router.delete("/:id", employee_controller_1.employeeController.deleteEmployee);
exports.employeeRoutes = router;
