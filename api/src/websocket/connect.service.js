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
exports.ConnectService = void 0;
var common_1 = require("@nestjs/common");
var jwt_constants_1 = require("../auth/jwt/jwt.constants");
var wsserver_gateway_1 = require("./wsserver.gateway");
var ConnectService = /** @class */ (function () {
    function ConnectService(jwtService, userService, channelService, messageService, friendService, gateway) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.channelService = channelService;
        this.messageService = messageService;
        this.friendService = friendService;
        this.gateway = gateway;
    }
    ConnectService.prototype.validateConnection = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var authCookies, authCookie, authToken, jwtOptions, jwtPayload, user, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        authCookies = client.handshake.headers.cookie.split('; ');
                        authCookie = authCookies.filter(function (s) { return s.includes('Authentication='); });
                        authToken = authCookie[0].substring(15, authCookie[0].length);
                        jwtOptions = {
                            secret: jwt_constants_1.jwtConstants.secret
                        };
                        return [4 /*yield*/, this.jwtService.verify(authToken, jwtOptions)];
                    case 1:
                        jwtPayload = _a.sent();
                        return [4 /*yield*/, this.userService.getUserByIdentifierLight(jwtPayload.sub)];
                    case 2:
                        user = _a.sent();
                        return [2 /*return*/, user];
                    case 3:
                        err_1 = _a.sent();
                        console.log("Guard error :");
                        console.log(err_1.message);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    ConnectService.prototype.handleConnection = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var user, _a, chan, _i, chan_1, c;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.validateConnection(client)];
                    case 1:
                        user = _b.sent();
                        if (!user)
                            return [2 /*return*/, this.handleDisconnect(client)];
                        client.data.user = user;
                        _a = this;
                        return [4 /*yield*/, this.userService.getUsers()];
                    case 2:
                        _a.all_users = _b.sent();
                        if (!this.gateway.activeUsers.has(user)) {
                            console.log("Add : " + user.name);
                            this.gateway.activeUsers.set(user, client);
                        }
                        this.gateway.activeUsers.forEach(function (socket, user) {
                            _this.gateway.server.to(socket.id).emit('listUsers', _this.listConnectedUser(socket, _this.all_users, _this.gateway.activeUsers, false));
                        });
                        return [4 /*yield*/, this.userService.getChannelsForUser(user)];
                    case 3:
                        chan = _b.sent();
                        for (_i = 0, chan_1 = chan; _i < chan_1.length; _i++) {
                            c = chan_1[_i];
                            client.join(c.name);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    ConnectService.prototype.handleDisconnect = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, _b, entries, socket;
            var _this = this;
            return __generator(this, function (_c) {
                try {
                    for (_i = 0, _a = this.gateway.activeUsers.entries(); _i < _a.length; _i++) {
                        _b = _a[_i], entries = _b[0], socket = _b[1];
                        if (entries.id == client.data.user.id) {
                            this.gateway.activeUsers["delete"](entries);
                            break;
                        }
                    }
                }
                catch (err) {
                    console.log("Don't know what happened");
                }
                this.gateway.activeUsers.forEach(function (socket, user) {
                    _this.gateway.server.to(socket.id).emit('listUsers', _this.listConnectedUser(socket, _this.all_users, _this.gateway.activeUsers, false));
                });
                client.emit('bye');
                client.disconnect(true);
                return [2 /*return*/];
            });
        });
    };
    ConnectService.prototype.listConnectedUser = function (client, all_users, active_user, withCurrentUser) {
        if (withCurrentUser === void 0) { withCurrentUser = true; }
        var data = [];
        var i = 0;
        for (var _i = 0, _a = active_user.keys(); _i < _a.length; _i++) {
            var user = _a[_i];
            user.status = "online";
            if (client.data.user.id == user.id && withCurrentUser) {
                data[i] = user;
                i++;
            }
            else if (client.data.user.id != user.id) {
                data[i] = user;
                i++;
            }
        }
        if (all_users) {
            var _loop_1 = function (user) {
                if (!data.find(function (element) { return element.id == user.id; }) && client.data.user.id != user.id) {
                    user.status = "offline";
                    data[i] = user;
                    i++;
                }
            };
            for (var _b = 0, all_users_1 = all_users; _b < all_users_1.length; _b++) {
                var user = all_users_1[_b];
                _loop_1(user);
            }
        }
        return (data);
    };
    ConnectService.prototype.getUserList = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.gateway.server.to(client.id).emit('listUsers', this.listConnectedUser(client, this.all_users, this.gateway.activeUsers, false));
                return [2 /*return*/];
            });
        });
    };
    ConnectService = __decorate([
        (0, common_1.Injectable)(),
        __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return wsserver_gateway_1.WSServer; })))
    ], ConnectService);
    return ConnectService;
}());
exports.ConnectService = ConnectService;
