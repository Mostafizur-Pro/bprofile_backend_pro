"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const client_routes_1 = require("../modules/Client/client.routes");
const hallRoom_routes_1 = require("../modules/hallRoom/hallRoom.routes");
const paidImage_routes_1 = require("../modules/paidImage/paidImage.routes");
const paidVideo_routes_1 = require("../modules/paidVideo/paidVideo.routes");
const admin_routes_1 = require("../modules/Admin/admin.routes");
const employee_routes_1 = require("../modules/employee/employee.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: auth_routes_1.authRoutes,
    },
    // {
    //   path: "/locations",
    //   route: locationRoutes,
    // },
    // {
    //   path: "/images",
    //   route: imageRoutes,
    // },
    // {
    //   path: "/message",
    //   route: messageRoutes,
    // },
    // {
    //   path: "/question",
    //   route: questionRoutes,
    // },
    {
        path: "/admin",
        route: admin_routes_1.adminRoutes,
    },
    {
        path: "/user",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/client",
        route: client_routes_1.clientRoutes,
    },
    {
        path: "/employee",
        route: employee_routes_1.employeeRoutes,
    },
    {
        path: "/hall_room_post",
        route: hallRoom_routes_1.hallRoomPostRoutes,
    },
    {
        path: "/paid_image",
        route: paidImage_routes_1.paidImageRoutes,
    },
    {
        path: "/paid_video",
        route: paidVideo_routes_1.paidVideoRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
