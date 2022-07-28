"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserModule = void 0;
var common_1 = require("@nestjs/common");
var user_service_1 = require("./user.service");
var user_controller_1 = require("./user.controller");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("./user.entity");
var channel_entity_1 = require("../channel/channel.entity");
var channel_module_1 = require("../channel/channel.module");
var privateMessage_entity_1 = require("../message/privateMessage.entity");
var message_module_1 = require("../message/message.module");
var user_activity_entity_1 = require("./user_activity.entity");
var UserModule = /** @class */ (function () {
    function UserModule() {
    }
    UserModule = __decorate([
        (0, common_1.Module)({
            imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, channel_entity_1.Channel, privateMessage_entity_1.privateMessage, user_activity_entity_1.UserActivity]), (0, common_1.forwardRef)(function () { return message_module_1.MessageModule; }), (0, common_1.forwardRef)(function () { return channel_module_1.ChannelModule; })],
            providers: [user_service_1.UserService],
            controllers: [user_controller_1.UserController],
            exports: [user_service_1.UserService]
        })
    ], UserModule);
    return UserModule;
}());
exports.UserModule = UserModule;
