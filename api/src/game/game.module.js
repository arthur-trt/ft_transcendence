"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GameModule = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("../user/user.entity");
var user_module_1 = require("../user/user.module");
var game_controller_1 = require("./game.controller");
var game_entity_1 = require("./game.entity");
//import { GameGateway } from './game.gateway';
var game_service_1 = require("./game.service");
var GameModule = /** @class */ (function () {
    function GameModule() {
    }
    GameModule = __decorate([
        (0, common_1.Module)({
            controllers: [game_controller_1.GameController],
            providers: [game_service_1.GameService],
            imports: [user_module_1.UserModule, typeorm_1.TypeOrmModule.forFeature([game_entity_1.MatchHistory, user_entity_1.User]), jwt_1.JwtModule,],
            exports: [game_service_1.GameService]
        })
    ], GameModule);
    return GameModule;
}());
exports.GameModule = GameModule;
