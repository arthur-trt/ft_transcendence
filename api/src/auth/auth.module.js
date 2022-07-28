"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./auth.service");
var auth_controller_1 = require("./auth.controller");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("../user/user.entity");
var user_module_1 = require("../user/user.module");
var fortyTwo_strategy_1 = require("./fortyTwo/fortyTwo.strategy");
var passport_1 = require("@nestjs/passport");
var jwt_1 = require("@nestjs/jwt");
var jwt_constants_1 = require("./jwt/jwt.constants");
var jwt_strategy_1 = require("./jwt/jwt.strategy");
var axios_1 = require("@nestjs/axios");
var _2fa_service_1 = require("./2fa/2fa.service");
var fortyTwo_service_1 = require("./fortyTwo/fortyTwo.service");
var fortyTwo_controller_1 = require("./fortyTwo/fortyTwo.controller");
var _2fa_controller_1 = require("./2fa/2fa.controller");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        (0, common_1.Module)({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
                passport_1.PassportModule.register({ property: 'user' }),
                (0, common_1.forwardRef)(function () { return user_module_1.UserModule; }),
                jwt_1.JwtModule.register({
                    secret: jwt_constants_1.jwtConstants.secret,
                    signOptions: { expiresIn: jwt_constants_1.jwtConstants.expire_time }
                }),
                axios_1.HttpModule
            ],
            providers: [auth_service_1.AuthService, fortyTwo_strategy_1.FortyTwoAuthStrategy, jwt_strategy_1.JwtStrategy, _2fa_service_1.TwoFaService, fortyTwo_service_1.FortyTwoService],
            controllers: [fortyTwo_controller_1.FortyTwoAuthController, auth_controller_1.CheatAuthController, _2fa_controller_1.TwoFAAuthController, auth_controller_1.AuthController]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
