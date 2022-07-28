"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var user_module_1 = require("./user/user.module");
var typeorm_1 = require("@nestjs/typeorm");
var channel_module_1 = require("./channel/channel.module");
var auth_module_1 = require("./auth/auth.module");
var game_module_1 = require("./game/game.module");
var friendships_module_1 = require("./friendships/friendships.module");
var wsserver_module_1 = require("./websocket/wsserver.module");
var achievements_module_1 = require("./achievements/achievements.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    envFilePath: '.env'
                }),
                user_module_1.UserModule,
                channel_module_1.ChannelModule,
                wsserver_module_1.WSServerModule,
                game_module_1.GameModule,
                achievements_module_1.AchievementsModule,
                typeorm_1.TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'db',
                    port: 5432,
                    username: process.env.POSTGRES_USER,
                    password: process.env.POSTGRES_PASSWORD,
                    database: process.env.POSTGRES_DB,
                    autoLoadEntities: true,
                    // entities: //[User, Channel, privateMessage, channelMessage, MatchHistory, UserActivity], /* Create tables according to prototype in entities */
                    //entities: [ './car/*.entity.{js,ts}'],
                    synchronize: true,
                    logging: false
                }),
                auth_module_1.AuthModule,
                friendships_module_1.FriendshipsModule
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
