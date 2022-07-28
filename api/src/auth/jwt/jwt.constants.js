"use strict";
exports.__esModule = true;
exports.jwtConstants = void 0;
exports.jwtConstants = {
    secret: process.env.JWT_SECRET,
    expire_time: "300m"
};
