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
exports.ChatService = void 0;
var common_1 = require("@nestjs/common");
var wsserver_gateway_1 = require("./wsserver.gateway");
var ChatService = /** @class */ (function () {
    function ChatService(jwtService, userService, channelService, messageService, friendService, gateway) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.channelService = channelService;
        this.messageService = messageService;
        this.friendService = friendService;
        this.gateway = gateway;
    }
    ChatService.prototype.findSocketId = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, allUsers, socket;
            return __generator(this, function (_c) {
                for (_i = 0, _a = this.gateway.activeUsers.entries(); _i < _a.length; _i++) {
                    _b = _a[_i], allUsers = _b[0], socket = _b[1];
                    if (allUsers.id == user.id)
                        return [2 /*return*/, socket];
                }
                return [2 /*return*/];
            });
        });
    };
    ChatService.prototype.findUserbySocket = function (askedsocket) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, allUsers, socket;
            return __generator(this, function (_c) {
                for (_i = 0, _a = this.gateway.activeUsers.entries(); _i < _a.length; _i++) {
                    _b = _a[_i], allUsers = _b[0], socket = _b[1];
                    if (socket.id == askedsocket)
                        return [2 /*return*/, allUsers];
                }
                return [2 /*return*/];
            });
        });
    };
    ChatService.prototype.getRooms = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, allUsers, socket, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _i = 0, _a = this.gateway.activeUsers.entries();
                        _f.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        _b = _a[_i], allUsers = _b[0], socket = _b[1];
                        _d = (_c = this.gateway.server.to(socket.id)).emit;
                        _e = ['rooms', " get rooms "];
                        return [4 /*yield*/, this.channelService.getChannelsForUser(allUsers)];
                    case 2:
                        _d.apply(_c, _e.concat([_f.sent()]));
                        _f.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.createRoom = function (client, channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.createChannel(channel.chanName, client.data.user, channel.password, channel.private)];
                    case 1:
                        _a.sent();
                        client.join(channel.chanName);
                        return [4 /*yield*/, this.getRooms()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.joinRoom = function (client, joinRoom) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.joinChannel(client.data.user, joinRoom.chanName, joinRoom.password)
                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        client.join(joinRoom.chanName);
                                        return [4 /*yield*/, this.getRooms()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.deleteRoom = function (client, channel) {
        return __awaiter(this, void 0, void 0, function () {
            var chan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.getChannelByIdentifier(channel)];
                    case 1:
                        chan = _a.sent();
                        return [4 /*yield*/, this.channelService.deleteChannel(client.data.user, chan)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getRooms()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.leaveRoom = function (client, channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.leaveChannel(client.data.user, channel)];
                    case 1:
                        _a.sent();
                        client.leave(channel);
                        return [4 /*yield*/, this.getRooms()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.ban = function (client, channel, toBan) {
        return __awaiter(this, void 0, void 0, function () {
            var chan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.getChannelByIdentifier(channel)];
                    case 1:
                        chan = _a.sent();
                        return [4 /*yield*/, this.channelService.temporaryBanUser(client.data.user, chan, toBan)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getRooms()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.setAdmin = function (client, channel, toSetAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            var chan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.getChannelByIdentifier(channel)];
                    case 1:
                        chan = _a.sent();
                        return [4 /*yield*/, this.channelService.setNewAdmin(client.data.user, chan, toSetAdmin)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.getRooms()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.modifyChanSettings = function (client, changes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelService.updateChannelSettings(client.data.user, changes)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.getRooms()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /** 	Messages 	*/
    ChatService.prototype.sendPrivateMessage = function (client, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var friendSocket, conversation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findSocketId(msg.to)];
                    case 1:
                        friendSocket = _a.sent();
                        return [4 /*yield*/, this.messageService.sendPrivateMessage(client.data.user, msg.to, msg.msg)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.messageService.getPrivateMessage(client.data.user, msg.to)];
                    case 3:
                        conversation = _a.sent();
                        if (friendSocket)
                            this.gateway.server.to(friendSocket.id).emit('privateMessage', client.data.user.name + " " + msg.to.name, conversation);
                        this.gateway.server.to(client.id).emit('privateMessage', client.data.user.name + " " + msg.to.name, conversation);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.getPrivateMessages = function (client, user2) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.messageService.getPrivateMessage(client.data.user, user2)];
                    case 1:
                        msg = _a.sent();
                        this.gateway.server.to(client.id).emit('privateMessage', client.data.user.name + " " + user2.name, msg);
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.sendChannelMessage = function (client, data) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.messageService.sendMessageToChannel(data.chan, client.data.user, data.msg)];
                    case 1:
                        _d.sent();
                        _b = (_a = this.gateway.server.to(data.chan)).emit;
                        _c = ['channelMessage'];
                        return [4 /*yield*/, this.messageService.getMessage(data.chan, client.data.user)];
                    case 2:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.getChannelMessages = function (client, channelName) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.gateway.server.to(channelName)).emit;
                        _c = ['channelMessage'];
                        return [4 /*yield*/, this.messageService.getMessage(channelName, client.data.user)];
                    case 1:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    /** Friendships */
    ChatService.prototype.addFriend = function (client, friend) {
        return __awaiter(this, void 0, void 0, function () {
            var friendSocket, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.findSocketId(friend)];
                    case 1:
                        friendSocket = _d.sent();
                        return [4 /*yield*/, this.friendService.sendFriendRequest(client.data.user, friend)];
                    case 2:
                        _d.sent();
                        if (!friendSocket) return [3 /*break*/, 4];
                        _b = (_a = this.gateway.server.to(friendSocket.id)).emit;
                        _c = ['newFriendRequest', "You have a new friend request"];
                        return [4 /*yield*/, this.friendService.getFriendsRequests(friend)];
                    case 3:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        _d.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.acceptFriendRquest = function (client, friend) {
        return __awaiter(this, void 0, void 0, function () {
            var friendSocket, _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return __generator(this, function (_k) {
                switch (_k.label) {
                    case 0: return [4 /*yield*/, this.findSocketId(friend)];
                    case 1:
                        friendSocket = _k.sent();
                        return [4 /*yield*/, this.friendService.acceptFriendRequest(client.data.user, friend)];
                    case 2:
                        _k.sent();
                        _b = (_a = this.gateway.server.to(client.id)).emit;
                        _c = ['newFriendRequest', "You have a new friend request"];
                        return [4 /*yield*/, this.friendService.getFriendsRequests(client.data.user)];
                    case 3:
                        _b.apply(_a, _c.concat([_k.sent()]));
                        if (!friendSocket) return [3 /*break*/, 5];
                        _e = (_d = this.gateway.server.to(friendSocket.id)).emit;
                        _f = ['friendList', "Friend list"];
                        return [4 /*yield*/, this.friendService.getFriendsofUsers(friend)];
                    case 4:
                        _e.apply(_d, _f.concat([_k.sent()]));
                        _k.label = 5;
                    case 5:
                        _h = (_g = this.gateway.server.to(client.id)).emit;
                        _j = ['friendList', "Friend list"];
                        return [4 /*yield*/, this.friendService.getFriendsofUsers(client.data.user)];
                    case 6:
                        _h.apply(_g, _j.concat([_k.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.removeFriend = function (client, friend) {
        return __awaiter(this, void 0, void 0, function () {
            var friendSocket, _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0: return [4 /*yield*/, this.findSocketId(friend)];
                    case 1:
                        friendSocket = _g.sent();
                        return [4 /*yield*/, this.friendService.removeFriend(client.data.user, friend)];
                    case 2:
                        _g.sent();
                        if (!friendSocket) return [3 /*break*/, 4];
                        _b = (_a = this.gateway.server.to(friendSocket.id)).emit;
                        _c = ['friendList', "Friend list"];
                        return [4 /*yield*/, this.friendService.getFriendsofUsers(friend)];
                    case 3:
                        _b.apply(_a, _c.concat([_g.sent()]));
                        _g.label = 4;
                    case 4:
                        _e = (_d = this.gateway.server.to(client.id)).emit;
                        _f = ['friendList', "Friend list"];
                        return [4 /*yield*/, this.friendService.getFriendsofUsers(client.data.user)];
                    case 5:
                        _e.apply(_d, _f.concat([_g.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.getFriends = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.gateway.server.to(client.id)).emit;
                        _c = ['friendList', "Friend list"];
                        return [4 /*yield*/, this.friendService.getFriendsofUsers(client.data.user)];
                    case 1:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.getFriendRequests = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _b = (_a = this.gateway.server.to(client.id)).emit;
                        _c = ['newFriendRequest', "Friend requests list : you are target of"];
                        return [4 /*yield*/, this.friendService.getFriendsRequests(client.data.user)];
                    case 1:
                        _b.apply(_a, _c.concat([_d.sent()]));
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.block = function (client, toBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.block(client.data.user, toBlock)];
                    case 1:
                        _a.sent();
                        this.gateway.server.to(client.id).emit('blocked', toBlock.name + " has been blocked");
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService.prototype.unblock = function (client, toUnBlock) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.unblock(client.data.user, toUnBlock)];
                    case 1:
                        _a.sent();
                        this.gateway.server.to(client.id).emit('unblocked', toUnBlock.name + " has been unblocked");
                        return [2 /*return*/];
                }
            });
        });
    };
    ChatService = __decorate([
        (0, common_1.Injectable)(),
        __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return wsserver_gateway_1.WSServer; })))
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
