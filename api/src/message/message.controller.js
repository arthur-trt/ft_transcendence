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
exports.MessageController = void 0;
var openapi = require("@nestjs/swagger");
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var swagger_1 = require("@nestjs/swagger");
var MessageController = /** @class */ (function () {
    function MessageController(messageService, userService) {
        this.messageService = messageService;
        this.userService = userService;
    }
    /*
    ** CHANNEL
    */
    /**
     *	Send a message to a specific channel.
     *
     * @param chanIdentifier
     * @param req
     * @param message
     * @returns the Channel object containing its new message in its messages relationship
     */
    MessageController.prototype.sendMessage = function (chanIdentifier, req, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var message, sender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = msg.msg;
                        return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        sender = _a.sent();
                        return [4 /*yield*/, this.messageService.sendMessageToChannel(chanIdentifier, sender, message)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * Get all messages from a channel
     *
     * @param chanIdentifier
     * @returns all messages from a channel
     */
    MessageController.prototype.getMessages = function (req, chanIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var user, messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.messageService.getMessage(chanIdentifier, user)];
                    case 2:
                        messages = _a.sent();
                        return [2 /*return*/, messages];
                }
            });
        });
    };
    /**
     *
     * Get all messages from a channel FOR A PARTICULAR USER
     *
     * @param chanIdentifier
     * @returns all messages from a channel
     */
    MessageController.prototype.getChannelMessagesOfUser = function (chanIdentifier, req) {
        return __awaiter(this, void 0, void 0, function () {
            var sender, messages;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        sender = _a.sent();
                        return [4 /*yield*/, this.messageService.getChannelMessagesOfUser(chanIdentifier, sender)];
                    case 2:
                        messages = _a.sent();
                        return [2 /*return*/, messages];
                }
            });
        });
    };
    /*
    ** PRIVATE
    */
    /**
     * Send a private message from connected user to another user.
     *
     * @param req Request containing user id
     * @param message containing target and message
     * @returns array of all private messages
     */
    MessageController.prototype.privateMessage = function (req, message) {
        return __awaiter(this, void 0, void 0, function () {
            var target, msg, sender;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        target = message.to;
                        msg = message.msg;
                        return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 1:
                        sender = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *	Get private messages between connected users and another user.
     *
     * @param req
     * @param query
     * @returns
     */
    MessageController.prototype.getPrivateMessage = function (req, query) {
        return __awaiter(this, void 0, void 0, function () {
            var target, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByIdentifier(query.target)];
                    case 1:
                        target = _a.sent();
                        return [4 /*yield*/, this.userService.getUserByRequest(req)];
                    case 2:
                        user = _a.sent();
                        return [4 /*yield*/, this.messageService.getPrivateMessage(user, target)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    __decorate([
        (0, swagger_1.ApiTags)('Channel messages'),
        (0, swagger_1.ApiOperation)({ summary: "Send a message to a channel" }),
        (0, common_1.Post)('channel/sendMsg/:identifier'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 201, type: Object }),
        __param(0, (0, common_1.Param)('identifier')),
        __param(1, (0, common_1.Req)()),
        __param(2, (0, common_1.Body)())
    ], MessageController.prototype, "sendMessage");
    __decorate([
        (0, swagger_1.ApiTags)('Channel messages'),
        (0, swagger_1.ApiOperation)({ summary: "Get all messages from a channel" }),
        (0, common_1.Get)('channel/getMsg/:identifier'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Param)('identifier'))
    ], MessageController.prototype, "getMessages");
    __decorate([
        (0, swagger_1.ApiTags)('Channel messages'),
        (0, swagger_1.ApiOperation)({ summary: "Get all messages from a channel for a particular user" }),
        (0, common_1.Get)('channel/getMsgFromUser/:identifier'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 200, type: [require("./channelMessage.entity").channelMessage] }),
        __param(0, (0, common_1.Param)('identifier')),
        __param(1, (0, common_1.Req)())
    ], MessageController.prototype, "getChannelMessagesOfUser");
    __decorate([
        (0, swagger_1.ApiTags)('Private Messages'),
        (0, common_1.Post)('privateMessage/sendMsg'),
        (0, swagger_1.ApiOperation)({ summary: "Send private message to another user" }),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 201 }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], MessageController.prototype, "privateMessage");
    __decorate([
        (0, swagger_1.ApiTags)('Private Messages'),
        (0, common_1.Get)('privateMessage/'),
        (0, swagger_1.ApiOperation)({ summary: "Get private messages between two users" }),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        openapi.ApiResponse({ status: 200, type: [require("./privateMessage.entity").privateMessage] }),
        __param(0, (0, common_1.Req)()),
        __param(1, (0, common_1.Body)())
    ], MessageController.prototype, "getPrivateMessage");
    MessageController = __decorate([
        (0, common_1.Controller)('message')
    ], MessageController);
    return MessageController;
}());
exports.MessageController = MessageController;
