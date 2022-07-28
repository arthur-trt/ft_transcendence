"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MessageModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var channel_entity_1 = require("../channel/channel.entity");
var channel_module_1 = require("../channel/channel.module");
var user_entity_1 = require("../user/user.entity");
var user_module_1 = require("../user/user.module");
var channelMessage_entity_1 = require("./channelMessage.entity");
var message_controller_1 = require("./message.controller");
var message_service_1 = require("./message.service");
var privateMessage_entity_1 = require("./privateMessage.entity");
var MessageModule = /** @class */ (function () {
    function MessageModule() {
    }
    MessageModule = __decorate([
        (0, common_1.Module)({
            controllers: [message_controller_1.MessageController],
            exports: [message_service_1.MessageService],
            providers: [message_service_1.MessageService],
            imports: [typeorm_1.TypeOrmModule.forFeature([privateMessage_entity_1.privateMessage, channelMessage_entity_1.channelMessage, channel_entity_1.Channel, user_entity_1.User]), (0, common_1.forwardRef)(function () { return channel_module_1.ChannelModule; }), (0, common_1.forwardRef)(function () { return user_module_1.UserModule; })]
        })
    ], MessageModule);
    return MessageModule;
}());
exports.MessageModule = MessageModule;
