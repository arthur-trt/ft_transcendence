"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AuthController = exports.CheatAuthController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var common_2 = require("@nestjs/common");
var rxjs_1 = require("rxjs");
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
var CheatAuthController = /** @class */ (function () {
    function CheatAuthController(fortyTwoService, httpService, userService) {
        this.fortyTwoService = fortyTwoService;
        this.httpService = httpService;
        this.userService = userService;
    }
    CheatAuthController.prototype.login = function (res) {
        return __awaiter(this, void 0, void 0, function () {
            var data, fake, image, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(this.httpService.get("https://api.namefake.com/"))];
                    case 1:
                        data = (_a.sent()).data;
                        fake = JSON.parse(JSON.stringify(data));
                        image = [
                            "https://fr.web.img6.acsta.net/r_1920_1080/medias/nmedia/18/62/48/25/18645943.jpg",
                            "https://img.phonandroid.com/2018/11/xavier-niel-portrait.jpg",
                            "https://upload.wikimedia.org/wikipedia/commons/e/eb/Joseph_Stalin_at_the_Tehran_conference_on_1943.jpg",
                            "https://upload.wikimedia.org/wikipedia/commons/a/a6/Nicolas_Sarkozy_in_2010.jpg",
                            "https://upload.wikimedia.org/wikipedia/commons/d/de/Bernard_Arnault_%283%29_-_2017_%28cropped%29.jpg",
                            "https://www.challenges.fr/assets/img/2016/06/07/cover-r4x3w1000-59c3e4252e6e8-liliane-bettencourt.jpg",
                        ];
                        return [4 /*yield*/, this.userService.findOrCreateUser(Math.floor(100000 + Math.random() * 900000), fake.name, fake.username, image[Math.floor(Math.random() * image.length)], fake.email_u + "@" + fake.email_d)];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, this.fortyTwoService.login(user, res)];
                }
            });
        });
    };
    __decorate([
        (0, common_2.Get)('login'),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_2.Res)())
    ], CheatAuthController.prototype, "login");
    CheatAuthController = __decorate([
        (0, swagger_1.ApiTags)('auth'),
        (0, common_1.Controller)('auth/cheat')
    ], CheatAuthController);
    return CheatAuthController;
}());
exports.CheatAuthController = CheatAuthController;
var AuthController = /** @class */ (function () {
    function AuthController() {
    }
    AuthController.prototype.logout = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var cookie;
            return __generator(this, function (_a) {
                cookie = "Authentication=deleted; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                res.setHeader('Set-Cookie', cookie);
                res.send();
                return [2 /*return*/];
            });
        });
    };
    __decorate([
        (0, common_2.Get)('logout'),
        (0, swagger_1.ApiOperation)({ summary: "Disconnect user by deleting cookie" }),
        (0, swagger_1.ApiResponse)({ status: 200, description: "User succesfully disconnected" }),
        (0, swagger_1.ApiResponse)({ status: 403, description: "User is not logged in" }),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_2.Req)()),
        __param(1, (0, common_2.Res)())
    ], AuthController.prototype, "logout");
    AuthController = __decorate([
        (0, swagger_1.ApiTags)('auth'),
        (0, common_1.Controller)('auth')
    ], AuthController);
    return AuthController;
}());
exports.AuthController = AuthController;
