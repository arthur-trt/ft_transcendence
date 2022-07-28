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
exports.UserController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var common_2 = require("@nestjs/common");
var user_entity_1 = require("./user.entity");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var platform_express_1 = require("@nestjs/platform-express");
var uuid_1 = require("uuid");
var multer_1 = require("multer");
var path_1 = require("path");
/** https://stackoverflow.com/questions/54958244/how-to-use-query-parameters-in-nest-js?answertab=trending#tab-top PARMAS AND TOUTES  */
var UserController = /** @class */ (function () {
    function UserController(userService) {
        this.userService = userService;
    }
    /**
     *
     * Returns an array of all users in database
     * @returns an array of users
     */
    UserController.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUsers()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.getMe = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, this.userService.getUserByIdentifier(user.id)];
                }
            });
        });
    };
    /**
     *
     * Get info about user identified by uuid (also works when providing
     * nickname)
     * @param uuid the id or nickname
     */
    UserController.prototype.getUser = function (uuid) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByIdentifier(uuid.uuid)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * Join channel from user.
     *
     * @param req the request containing user id
     * @param joinRequest the joinChannelDto containing the channel name
     */
    UserController.prototype.joinChannel = function (req, joinRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var channelname, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        channelname = joinRequest.chanName;
                        return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, this.userService.joinChannel(user, channelname)];
                }
            });
        });
    };
    /**
     * Update profile of the connected user.
     * @param req
     * @param mail
     * @returns
     */
    UserController.prototype.updateUser = function (req, changes) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, this.userService.updateUser(user, changes)];
                }
            });
        });
    };
    UserController.prototype.leaveChannel = function (req, chanName) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.userService.leaveChannel(user, chanName.chanName)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.blockUser = function (req, toBeBlocked) {
        return __awaiter(this, void 0, void 0, function () {
            var user, toBlock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(toBeBlocked);
                        return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.userService.getUserByIdentifier(toBeBlocked.username)];
                    case 2:
                        toBlock = _a.sent();
                        console.log(toBlock);
                        return [4 /*yield*/, this.userService.block(user, toBlock)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserController.prototype.uploadAvatar = function (req, file) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
                        user.avatar_url = "/public/" + file.filename;
                        user.save();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    __decorate([
        (0, swagger_1.ApiOperation)({ summary: "Get all users" }),
        (0, common_2.Get)('/'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 200, type: [require("./user.entity").User] })
    ], UserController.prototype, "getUsers");
    __decorate([
        (0, common_2.Get)('me'),
        (0, swagger_1.ApiOperation)({ summary: "Get information about current user with cookie" }),
        (0, swagger_1.ApiResponse)({ status: 200, description: "User is returned normally", type: user_entity_1.User }),
        (0, swagger_1.ApiResponse)({ status: 403, description: "User is not logged in" }),
        (0, swagger_1.ApiCookieAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 200, type: require("./user.entity").User }),
        __param(0, (0, common_1.Req)())
    ], UserController.prototype, "getMe");
    __decorate([
        (0, common_2.Get)(':uuid'),
        (0, swagger_1.ApiOperation)({ summary: "Get all info about a user identified by :uuid" }),
        (0, swagger_1.ApiResponse)({ status: 200, description: "User is returned normally" }),
        (0, swagger_1.ApiResponse)({ status: 404, description: "User is not found" }),
        openapi.ApiResponse({ status: 200, type: require("./user.entity").User }),
        __param(0, (0, common_2.Param)())
    ], UserController.prototype, "getUser");
    __decorate([
        (0, common_2.Post)('joinChannel'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiCookieAuth)(),
        (0, swagger_1.ApiOperation)({ summary: "Join a channel" }),
        (0, swagger_1.ApiResponse)({ status: 200, description: "User joined normally" }),
        (0, swagger_1.ApiResponse)({ status: 404, description: "User is not found/channel not created" }),
        openapi.ApiResponse({ status: 201, type: Boolean }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_2.Body)())
    ], UserController.prototype, "joinChannel");
    __decorate([
        (0, common_1.Patch)('userSettings'),
        (0, swagger_1.ApiOperation)({ summary: "Update user settings on connected account" }),
        (0, swagger_1.ApiResponse)({ status: 200, description: "Profile updated" }),
        (0, swagger_1.ApiResponse)({ status: 403, description: "You're not logged in" }),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiCookieAuth)(),
        openapi.ApiResponse({ status: 200, type: require("./user.entity").User }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_2.Body)())
    ], UserController.prototype, "updateUser");
    __decorate([
        (0, common_2.Post)('leaveChannel'),
        (0, swagger_1.ApiOperation)({ summary: "leave a channel" }),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiCookieAuth)(),
        openapi.ApiResponse({ status: 201, type: Object }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_2.Body)())
    ], UserController.prototype, "leaveChannel");
    __decorate([
        (0, common_2.Post)('blockUser'),
        (0, swagger_1.ApiOperation)({ summary: "Block a user" }),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiCookieAuth)(),
        openapi.ApiResponse({ status: 201, type: require("./user.entity").User }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_2.Body)())
    ], UserController.prototype, "blockUser");
    __decorate([
        (0, common_2.Post)('avatar'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiCookieAuth)(),
        (0, swagger_1.ApiOperation)({ summary: "Upload a new user avatar" }),
        (0, swagger_1.ApiResponse)({ status: 201, description: "Avatar uploaded and updated " }),
        (0, swagger_1.ApiResponse)({ status: 404, description: "User not found" }),
        (0, swagger_1.ApiResponse)({ status: 413, description: "File is too large" }),
        (0, swagger_1.ApiResponse)({ status: 415, description: "File uploaded is not an image" }),
        (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
            limits: {
                fileSize: 8000000
            },
            storage: (0, multer_1.diskStorage)({
                destination: function (req, file, cb) { return cb(null, (0, path_1.resolve)('/', 'api', 'public')); },
                filename: function (req, file, cb) { return cb(null, "".concat((0, uuid_1.v4)().replace(/-/g, ''), ".").concat((file.mimetype.split('/')[1]))); }
            }),
            fileFilter: function (req, file, cb) {
                if (file.mimetype.split('/')[0] !== "image")
                    return cb(new common_1.HttpException("Only upload image", common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE), false);
                return cb(null, true);
            }
        })),
        (0, swagger_1.ApiConsumes)('multipart/form-data'),
        (0, swagger_1.ApiBody)({
            schema: {
                type: 'object',
                properties: {
                    file: {
                        type: 'string',
                        format: 'binary'
                    }
                }
            }
        }),
        openapi.ApiResponse({ status: 201, type: require("./user.entity").User }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.UploadedFile)())
    ], UserController.prototype, "uploadAvatar");
    UserController = __decorate([
        (0, swagger_1.ApiTags)('User'),
        (0, common_1.Controller)('user')
    ], UserController);
    return UserController;
}());
exports.UserController = UserController;
