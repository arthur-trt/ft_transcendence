"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WSServerModule = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var channel_module_1 = require("../channel/channel.module");
var friendships_module_1 = require("../friendships/friendships.module");
var message_module_1 = require("../message/message.module");
var user_module_1 = require("../user/user.module");
var chat_service_1 = require("./chat.service");
var connect_service_1 = require("./connect.service");
var wsserver_gateway_1 = require("./wsserver.gateway");
var game_module_1 = require("../game/game.module");
//import { ChatGateway } from './chat.gateway';
var WSServerModule = /** @class */ (function () {
    function WSServerModule() {
    }
    WSServerModule = __decorate([
        (0, common_1.Module)({
            imports: [user_module_1.UserModule, message_module_1.MessageModule, jwt_1.JwtModule, channel_module_1.ChannelModule, friendships_module_1.FriendshipsModule, game_module_1.GameModule],
            providers: [wsserver_gateway_1.WSServer, chat_service_1.ChatService, connect_service_1.ConnectService]
        })
    ], WSServerModule);
    return WSServerModule;
}());
exports.WSServerModule = WSServerModule;
