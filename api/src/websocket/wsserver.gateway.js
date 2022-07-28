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
exports.WSServer = void 0;
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var ws_auth_guard_1 = require("../auth/guards/ws-auth.guard");
var chat_service_1 = require("./chat.service");
var connect_service_1 = require("./connect.service");
var exception_filter_1 = require("./exception.filter");
var WSServer = /** @class */ (function () {
    function WSServer(jwtService, userService, channelService, messageService, friendService, gameService, gameRelayService, chatService, connectService) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.channelService = channelService;
        this.messageService = messageService;
        this.friendService = friendService;
        this.gameService = gameService;
        this.gameRelayService = gameRelayService;
        this.chatService = chatService;
        this.connectService = connectService;
        this.logger = new common_1.Logger('WebSocketServer');
        this.active_users = new Map();
        this.users = [];
    }
    Object.defineProperty(WSServer.prototype, "server", {
        get: function () {
            return this._server;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WSServer.prototype, "activeUsers", {
        get: function () {
            return this.active_users;
        },
        enumerable: false,
        configurable: true
    });
    /*
    **
    ** 	 ██████  ██████  ███    ██ ███    ██ ███████  ██████ ████████
    ** 	██      ██    ██ ████   ██ ████   ██ ██      ██         ██
    ** 	██      ██    ██ ██ ██  ██ ██ ██  ██ █████   ██         ██
    ** 	██      ██    ██ ██  ██ ██ ██  ██ ██ ██      ██         ██
    ** 	 ██████  ██████  ██   ████ ██   ████ ███████  ██████    ██
    **
    */
    WSServer.prototype.validateConnection = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.connectService.validateConnection(client)];
            });
        });
    };
    /**
     * Handle first connection from WebSocket. Can't use Guard on this
     * So we validate directly on the function
     * @param client Socket initialized by client
     * @returns Nothing, but handle disconnection if problems occurs
     */
    WSServer.prototype.handleConnection = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.connectService.handleConnection(client);
                return [2 /*return*/];
            });
        });
    };
    WSServer.prototype.afterInit = function (server) {
        this.logger.log("Start listenning");
    };
    /**
     * Handle Socket disconnection.
     * @param client Socket received from client
     */
    WSServer.prototype.handleDisconnect = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.connectService.handleDisconnect(client);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Return a JSON object with all active user. With or without the user who made the request
     * regarding of `withCurrentUser` parameters
     * @param client user who made the request
     * @param active_user map of active user
     * @param withCurrentUser if true user who made the request will be included
     * @returns
     */
    WSServer.prototype.listConnectedUser = function (client, all_users, active_user, withCurrentUser) {
        if (withCurrentUser === void 0) { withCurrentUser = true; }
        this.connectService.listConnectedUser(client, all_users, active_user, withCurrentUser);
    };
    /**
     * @brief get all users
     * @param client
     */
    WSServer.prototype.get_users_list = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.connectService.getUserList(client);
                return [2 /*return*/];
            });
        });
    };
    /*
    ** 		_____ _    _       _______    _____       _______ ________          __ __     __
    ** 	  / ____| |  | |   /\|__   __|  / ____|   /\|__   __|  ____\ \        / /\\ \   / /
    ** 	 | |    | |__| |  /  \  | |    | |  __   /  \  | |  | |__   \ \  /\  / /  \\ \_/ /
    ** 	 | |    |  __  | / /\ \ | |    | | |_ | / /\ \ | |  |  __|   \ \/  \/ / /\ \\   /
    ** 	 | |____| |  | |/ ____ \| |    | |__| |/ ____ \| |  | |____   \  /\  / ____ \| |
    ** 	  \_____|_|  |_/_/    \_\_|     \_____/_/    \_\_|  |______|   \/  \/_/    \_\_|
    **
    */
    /*
    **
    ** ██████   ██████   ██████  ███    ███ ███████
    ** ██   ██ ██    ██ ██    ██ ████  ████ ██
    ** ██████  ██    ██ ██    ██ ██ ████ ██ ███████
    ** ██   ██ ██    ██ ██    ██ ██  ██  ██      ██
    ** ██   ██  ██████   ██████  ██      ██ ███████
    **
    **
    ** Rooms (by event name)
    ** ├─ getRooms
    ** ├─ createRooms
    ** ├─ joinRoom
    ** ├─ deleteRoom
    ** ├─ leaveRoom
    ** ├─ banUser
    ** ├─ setAdmin
    ** ├─ modifyChanSettings
    */
    WSServer.prototype.getRooms = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.getRooms()["catch"](function (err) { throw new websockets_1.WsException('puree'); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param client
     * @param channel
     * @returns
     */
    WSServer.prototype.createRoom = function (client, channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.createRoom(client, channel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param client
     * @param channel
     * @returns
     */
    WSServer.prototype.onJoinRoom = function (client, joinRoom) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.joinRoom(client, joinRoom)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief delete room for current user : check if channel owner
     * @param client
     * @param channel
     * @returns
     */
    WSServer.prototype.onDeletedRoom = function (client, channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.deleteRoom(client, channel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief leave room for current user
     * @param client
     * @param channel by string
     * @returns
     */
    WSServer.prototype.onLeaveRoom = function (client, channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.leaveRoom(client, channel)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WSServer.prototype.onBanUser = function (client, channel, toBan) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.ban(client, channel, toBan)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WSServer.prototype.onSetAdmin = function (client, channel, toBeAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.setAdmin(client, channel, toBeAdmin)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WSServer.prototype.onsetOrUnsetPass = function (client, channelSettings) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.modifyChanSettings(client, channelSettings)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
    **
    ** ███    ███ ███████  ██████  ███████
    ** ████  ████ ██      ██       ██
    ** ██ ████ ██ ███████ ██   ███ ███████
    ** ██  ██  ██      ██ ██    ██      ██
    ** ██      ██ ███████  ██████  ███████
    **
    **
    ** Messages
    ** ├─ [ Private messages ]
    ** │  ├─ privateMessage (send private message)
    ** │  ├─ getPrivateMessage
    ** ├─ [ Channel messages ]
    ** │  ├─ sendChannelMessages
    ** │  ├─ getChannelMessages
    */
    /**
     * Each time someone want to emit/receive a private message, this function is called
     *
     * @brief emit the PM to both the sender and emitter
     * @param client
     * @param msg
     * @returns
     */
    WSServer.prototype.onPrivateMessage = function (client, msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.sendPrivateMessage(client, msg)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Get Private Messages between two users
     * @param client
     * @param user2
     * @returns
     */
    WSServer.prototype.onGetPrivateMessage = function (client, user2) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.getPrivateMessages(client, user2)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Send Channel Messages
     * @param client
     * @param data an object containing : chan (string) and msg (string)
     */
    WSServer.prototype.onSendChannelMessages = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.sendChannelMessage(client, data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief get Channel Messages
     * @param client
     * @param channelName
     * @returns
     */
    WSServer.prototype.onGetChannelMessages = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.getChannelMessages(client, channelName)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
    **
    ** ███████ ██████  ██ ███████ ███    ██ ██████  ███████
    ** ██      ██   ██ ██ ██      ████   ██ ██   ██ ██
    ** █████   ██████  ██ █████   ██ ██  ██ ██   ██ ███████
    ** ██      ██   ██ ██ ██      ██  ██ ██ ██   ██      ██
    ** ██      ██   ██ ██ ███████ ██   ████ ██████  ███████
    **
    **
    ** Friends
    ** ├─ addFriend
    ** ├─ acceptFriend
    ** ├─ removeFriend
    ** ├─ getFriends
    ** ├─ getFriendRequests
    */
    /**
     * @brief add friend
     * @param client
     * @param friend
     */
    WSServer.prototype.addFriend = function (client, friend) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.addFriend(client, friend)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Accept friendship - status goes from "pending" to "accepted"
     * @param client
     * @param friend
     */
    WSServer.prototype.acceptFriendRequest = function (client, friend) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.acceptFriendRquest(client, friend)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Remove a friend
     * @param client
     * @param friend
     */
    WSServer.prototype.removeFriend = function (client, friend) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.removeFriend(client, friend)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Get friends of the client
     * @param client
     */
    WSServer.prototype.getFriends = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.getFriends(client)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WSServer.prototype.getFriendRequests = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.getFriendRequests(client)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
    **
    ** ██████  ██       ██████   ██████ ██   ██
    ** ██   ██ ██      ██    ██ ██      ██  ██
    ** ██████  ██      ██    ██ ██      █████
    ** ██   ██ ██      ██    ██ ██      ██  ██
    ** ██████  ███████  ██████   ██████ ██   ██
    **
    **
    ** Block
    **	├─ block
    **	├─ unblock
    **
    */
    WSServer.prototype.block = function (client, toBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.block(client, toBlock)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    WSServer.prototype.unblock = function (client, toUnBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chatService.unblock(client, toUnBlock)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
    **  ██████   █████  ███    ███ ███████      ██████   █████  ████████ ███████ ██     ██  █████  ██    ██
    **██       ██   ██ ████  ████ ██          ██       ██   ██    ██    ██      ██     ██ ██   ██  ██  ██
    **██   ███ ███████ ██ ████ ██ █████       ██   ███ ███████    ██    █████   ██  █  ██ ███████   ████
    **██    ██ ██   ██ ██  ██  ██ ██          ██    ██ ██   ██    ██    ██      ██ ███ ██ ██   ██    ██
    ** ██████  ██   ██ ██      ██ ███████      ██████  ██   ██    ██    ███████  ███ ███  ██   ██    ██
    **
    **
    **	Game
    **	├─ getInQueue
    **
    /**
     * @param client Socket
     * @returns
     */
    WSServer.prototype.getInQueue = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.gameRelayService.getInQueue(client)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        (0, websockets_1.WebSocketServer)()
    ], WSServer.prototype, "_server");
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, websockets_1.SubscribeMessage)('getUsers')
    ], WSServer.prototype, "get_users_list");
    __decorate([
        (0, websockets_1.SubscribeMessage)('getRooms'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard)
    ], WSServer.prototype, "getRooms");
    __decorate([
        (0, websockets_1.SubscribeMessage)('createRoom'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, common_1.UsePipes)(common_1.ValidationPipe)
    ], WSServer.prototype, "createRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)('joinRoom'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, common_1.UsePipes)(common_1.ValidationPipe)
    ], WSServer.prototype, "onJoinRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)('deleteRoom'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard)
    ], WSServer.prototype, "onDeletedRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)('leaveRoom'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard)
    ], WSServer.prototype, "onLeaveRoom");
    __decorate([
        (0, websockets_1.SubscribeMessage)('banUser')
    ], WSServer.prototype, "onBanUser");
    __decorate([
        (0, websockets_1.SubscribeMessage)('setAdmin')
    ], WSServer.prototype, "onSetAdmin");
    __decorate([
        (0, websockets_1.SubscribeMessage)('modifyChanSettings')
    ], WSServer.prototype, "onsetOrUnsetPass");
    __decorate([
        (0, websockets_1.SubscribeMessage)('privateMessage'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, common_1.UsePipes)(common_1.ValidationPipe)
    ], WSServer.prototype, "onPrivateMessage");
    __decorate([
        (0, websockets_1.SubscribeMessage)('getPrivateMessage'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard)
    ], WSServer.prototype, "onGetPrivateMessage");
    __decorate([
        (0, websockets_1.SubscribeMessage)('sendChannelMessages'),
        (0, common_1.UsePipes)(common_1.ValidationPipe),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard)
    ], WSServer.prototype, "onSendChannelMessages");
    __decorate([
        (0, websockets_1.SubscribeMessage)('getChannelMessages'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard)
    ], WSServer.prototype, "onGetChannelMessages");
    __decorate([
        (0, websockets_1.SubscribeMessage)('addFriend'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard)
    ], WSServer.prototype, "addFriend");
    __decorate([
        (0, websockets_1.SubscribeMessage)('acceptFriend'),
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard)
    ], WSServer.prototype, "acceptFriendRequest");
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, websockets_1.SubscribeMessage)('removeFriend')
    ], WSServer.prototype, "removeFriend");
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, websockets_1.SubscribeMessage)('getFriends')
    ], WSServer.prototype, "getFriends");
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, websockets_1.SubscribeMessage)('getFriendRequests')
    ], WSServer.prototype, "getFriendRequests");
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, websockets_1.SubscribeMessage)('block')
    ], WSServer.prototype, "block");
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, websockets_1.SubscribeMessage)('unblock')
    ], WSServer.prototype, "unblock");
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, common_1.UsePipes)(common_1.ValidationPipe),
        (0, websockets_1.SubscribeMessage)('game_inQueue')
    ], WSServer.prototype, "getInQueue");
    WSServer = __decorate([
        (0, common_1.Injectable)(),
        (0, common_1.UseFilters)(new exception_filter_1.WebsocketExceptionsFilter()),
        (0, websockets_1.WebSocketGateway)(),
        __param(7, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return chat_service_1.ChatService; }))),
        __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return connect_service_1.ConnectService; })))
    ], WSServer);
    return WSServer;
}());
exports.WSServer = WSServer;
