"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const client_routes_1 = require("../modules/Client/client.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    // {
    //   path: "/",
    //   route: authRoutes,
    // },
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
    // {
    //   path: "/admin",
    //   route: adminRoutes,
    // },
    {
        path: "/user",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/client",
        route: client_routes_1.clientRoutes,
    },
    // {
    //   path: "/employee",
    //   route: employeeRoutes,
    // },
    // {
    //   path: "/hall_room_post",
    //   route: hallRoomPostRoutes,
    // },
    // {
    //   path: "/paid_image",
    //   route: paidImageRoutes,
    // },
    // {
    //   path: "/paid_video",
    //   route: paidVideoRoutes,
    // },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
