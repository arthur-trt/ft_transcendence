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
exports.TwoFAAuthController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var common_2 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
var TwoFAAuthController = /** @class */ (function () {
    function TwoFAAuthController(userService, twoFaService) {
        this.userService = userService;
        this.twoFaService = twoFaService;
    }
    /**
     * Generate a secret key for user
     * @param req Request sent by nav containing user object
     * @returns secret and base64 encoded qrcode
     */
    TwoFAAuthController.prototype.generate = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, secret, optAuthUrl, qrcode;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1: return [4 /*yield*/, (_b.sent())];
                    case 2:
                        user = _b.sent();
                        return [4 /*yield*/, this.twoFaService.generateTwoFactorAuthtificationSecret(user)];
                    case 3:
                        _a = _b.sent(), secret = _a.secret, optAuthUrl = _a.optAuthUrl;
                        return [4 /*yield*/, this.twoFaService.pipeQrCodeURL(optAuthUrl)];
                    case 4:
                        qrcode = _b.sent();
                        return [2 /*return*/, {
                                qrcode: qrcode,
                                secret: secret
                            }];
                }
            });
        });
    };
    TwoFAAuthController.prototype.turnOnTwoFA = function (req, res, twofa_token) {
        return __awaiter(this, void 0, void 0, function () {
            var isValidCode, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.twoFaService.isTwoFactorCodeValid(twofa_token.token, req)];
                    case 1:
                        isValidCode = _c.sent();
                        if (!isValidCode)
                            throw new common_1.HttpException('Wrong 2FA', common_1.HttpStatus.UNAUTHORIZED);
                        return [4 /*yield*/, this.userService.turnOnTwoFactorAuthentication(req)];
                    case 2:
                        _c.sent();
                        _b = (_a = this.twoFaService).twofa_login;
                        return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 3:
                        _b.apply(_a, [_c.sent(), res]);
                        return [2 /*return*/];
                }
            });
        });
    };
    TwoFAAuthController.prototype.validateTwoFa = function (req, res, twofa_token) {
        return __awaiter(this, void 0, void 0, function () {
            var isValidCode, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.twoFaService.isTwoFactorCodeValid(twofa_token.token, req)];
                    case 1:
                        isValidCode = _c.sent();
                        if (!isValidCode)
                            throw new common_1.HttpException('Wrong 2FA', common_1.HttpStatus.UNAUTHORIZED);
                        _b = (_a = this.twoFaService).twofa_login;
                        return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 2:
                        _b.apply(_a, [_c.sent(), res]);
                        return [2 /*return*/];
                }
            });
        });
    };
    TwoFAAuthController.prototype.deactivateTwoFa = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.twoFaService.deactivateTwoFa(user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        (0, common_2.Get)('generate'),
        (0, swagger_1.ApiOperation)({ summary: "Generate a QRCode use by application for turn-on 2fa" }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: "QRCode have been generated",
            content: {
                'application/json': {
                    example: {
                        "qrcode": "<base64_qrcode>",
                        "secret": "<string_secret>"
                    }
                }
            }
        }),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_2.Req)())
    ], TwoFAAuthController.prototype, "generate");
    __decorate([
        (0, common_2.Post)('turn-on'),
        (0, swagger_1.ApiOperation)({ summary: "Turn On TwoFA for the connected user if validation code is correct" }),
        (0, swagger_1.ApiResponse)({ status: 201, description: "TwoFA have been enable on user account" }),
        (0, swagger_1.ApiResponse)({ status: 401, description: "Unvalid token sent" }),
        (0, swagger_1.ApiResponse)({ status: 403, description: "User is not logged in" }),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.UsePipes)(common_1.ValidationPipe),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, common_2.Req)()),
        __param(1, (0, common_2.Res)()),
        __param(2, (0, common_2.Body)())
    ], TwoFAAuthController.prototype, "turnOnTwoFA");
    __decorate([
        (0, common_2.Post)('validate'),
        (0, swagger_1.ApiOperation)({ summary: "Validate twoFa code" }),
        (0, swagger_1.ApiResponse)({ status: 201, description: "TwoFa token is valid" }),
        (0, swagger_1.ApiResponse)({ status: 401, description: "Unvalid token sent" }),
        (0, swagger_1.ApiResponse)({ status: 403, description: "User is not logged in" }),
        (0, swagger_1.ApiCookieAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, common_1.UsePipes)(common_1.ValidationPipe),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, common_2.Req)()),
        __param(1, (0, common_2.Res)()),
        __param(2, (0, common_2.Body)())
    ], TwoFAAuthController.prototype, "validateTwoFa");
    __decorate([
        (0, common_2.Post)('deactivate'),
        (0, swagger_1.ApiOperation)({ summary: "Deactivate twofa for current user" }),
        (0, swagger_1.ApiResponse)({ status: 201, description: "TwoFa is deactivate for current user" }),
        (0, swagger_1.ApiResponse)({ status: 403, description: "User is not logged in" }),
        (0, swagger_1.ApiCookieAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 201, type: Object }),
        __param(0, (0, common_2.Req)())
    ], TwoFAAuthController.prototype, "deactivateTwoFa");
    TwoFAAuthController = __decorate([
        (0, swagger_1.ApiTags)('auth'),
        (0, common_1.Controller)('auth/2fa')
    ], TwoFAAuthController);
    return TwoFAAuthController;
}());
exports.TwoFAAuthController = TwoFAAuthController;
