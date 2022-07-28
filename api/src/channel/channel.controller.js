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
exports.ChannelController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var ChannelController = /** @class */ (function () {
    function ChannelController(chanService, userService) {
        this.chanService = chanService;
        this.userService = userService;
    }
    /**
     * Get all users of all channels.
     * @returns
     */
    ChannelController.prototype.getChans = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanService.getUsersOfChannels()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Create a new channel specifying channel name from a user.
     * The requesting user will own the channel.
     *
     * @param req containing id user that will be
     * @param query
     * @returns
     */
    ChannelController.prototype.newChannel = function (req, query) {
        return __awaiter(this, void 0, void 0, function () {
            var chanName, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chanName = query.chanName;
                        return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.chanService.createChannel(chanName, user)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Create a new channel specifying channel name from a user.
     * The requesting user will own the channel.
     *
     * @param req containing id user that will be
     * @param query
     * @returns
     */
    ChannelController.prototype.updateChannelSettings = function (req, changes) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.chanService.updateChannelSettings(user, changes)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChannelController.prototype.deleteChannel = function (req, channelToDelete) {
        return __awaiter(this, void 0, void 0, function () {
            var user, channel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.chanService.getChannelByIdentifier(channelToDelete.chanName)];
                    case 2:
                        channel = _a.sent();
                        return [4 /*yield*/, this.chanService.deleteChannel(user, channel)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChannelController.prototype.deleteUserFromChannel = function (req, deleteUser) {
        return __awaiter(this, void 0, void 0, function () {
            var user, channel, toBan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.chanService.getChannelByIdentifier(deleteUser.chanName)];
                    case 2:
                        channel = _a.sent();
                        return [4 /*yield*/, this.userService.getUserByIdentifier(deleteUser.userToDelete)];
                    case 3:
                        toBan = _a.sent();
                        return [4 /*yield*/, this.chanService.deleteUserFromChannel(user, channel, toBan)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ChannelController.prototype.temporaryBanUser = function (req, deleteUser) {
        return __awaiter(this, void 0, void 0, function () {
            var user, channel, toBan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.chanService.getChannelByIdentifier(deleteUser.chanName)];
                    case 2:
                        channel = _a.sent();
                        return [4 /*yield*/, this.userService.getUserByIdentifier(deleteUser.userToDelete)];
                    case 3:
                        toBan = _a.sent();
                        return [4 /*yield*/, this.chanService.temporaryBanUser(user, channel, toBan)];
                    case 4: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, swagger_1.ApiOperation)({ summary: "Get all users of all channels" }),
        openapi.ApiResponse({ status: 200, type: [require("./channel.entity").Channel] })
    ], ChannelController.prototype, "getChans");
    __decorate([
        (0, common_1.Post)('new'),
        (0, swagger_1.ApiOperation)({ summary: "Create a new Channel" }),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], ChannelController.prototype, "newChannel");
    __decorate([
        (0, common_1.Patch)('update'),
        (0, swagger_1.ApiOperation)({ summary: "Create a new Channel" }),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)
        // Ajouter Role Guards pour
        ,
        openapi.ApiResponse({ status: 200, type: require("./channel.entity").Channel }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], ChannelController.prototype, "updateChannelSettings");
    __decorate([
        (0, common_1.Delete)('delete'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiOperation)({ summary: "Delete channel" }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], ChannelController.prototype, "deleteChannel");
    __decorate([
        (0, common_1.Delete)('deleteUser'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiOperation)({ summary: "Delete user from channel" }),
        openapi.ApiResponse({ status: 200, type: [require("./channel.entity").Channel] }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], ChannelController.prototype, "deleteUserFromChannel");
    __decorate([
        (0, common_1.Post)('banUser'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiOperation)({ summary: "Delete user from channel" }),
        openapi.ApiResponse({ status: 201, type: require("./channel.entity").Channel }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], ChannelController.prototype, "temporaryBanUser");
    ChannelController = __decorate([
        (0, swagger_1.ApiTags)('Channel'),
        (0, common_1.Controller)('channel')
    ], ChannelController);
    return ChannelController;
}());
exports.ChannelController = ChannelController;
