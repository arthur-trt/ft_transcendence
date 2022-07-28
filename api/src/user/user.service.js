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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("./user.entity");
var channel_entity_1 = require("../channel/channel.entity");
var channel_service_1 = require("../channel/channel.service");
var uuid_1 = require("uuid");
var user_activity_entity_1 = require("./user_activity.entity");
var bcrypt = require("bcrypt");
var UserService = /** @class */ (function () {
    function UserService(userRepo, userActivityRepo, channelsRepo, chanService) {
        this.userRepo = userRepo;
        this.userActivityRepo = userActivityRepo;
        this.channelsRepo = channelsRepo;
        this.chanService = chanService;
    }
    UserService.prototype.getUserByRequest = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserByIdentifier(JSON.parse(JSON.stringify(req.user)).userId)];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
                        return [2 /*return*/, (user)];
                }
            });
        });
    };
    UserService.prototype.getTwoFASecret = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user_id, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user_id = JSON.parse(JSON.stringify(req.user)).userId;
                        return [4 /*yield*/, this.userRepo.createQueryBuilder('User')
                                .select(["User.TwoFA_secret"])
                                .where({ "id": user_id })
                                .getOne()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.HttpException("User not found", common_1.HttpStatus.NOT_FOUND);
                        return [2 /*return*/, user.TwoFA_secret];
                }
            });
        });
    };
    /**
     * Obtain a list of all user in system
     * @returns all user id, name and mail
     */
    UserService.prototype.getUsers = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepo.createQueryBuilder('User')
                            .select(["User.id", "User.name", "User.mail", "User.avatar_url", "User.blocked"])
                            .getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.getUserByIdentifierLight = function (user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepo.createQueryBuilder('User')
                            .select(["User.id", "User.name", "User.mail", "User.avatar_url"])
                            .where({ id: user_id })
                            .getOne()];
                    case 1:
                        user = _a.sent();
                        if (!user)
                            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
                        return [2 /*return*/, (user)];
                }
            });
        });
    };
    /**
     *
     * @param intra_id 42 intranet identifiant
     * @returns user if found, null otherwise
     */
    UserService.prototype.getUserByIntraId = function (intra_id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepo.findOne({
                            where: { intra_id: intra_id }
                        })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, user];
                }
            });
        });
    };
    UserService.prototype.findOrCreateUser = function (intra_id, fullname, username, avatar, mail) {
        return __awaiter(this, void 0, void 0, function () {
            var user, new_user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserByIntraId(intra_id)];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 2];
                        return [2 /*return*/, (user)];
                    case 2:
                        new_user = {
                            intra_id: intra_id,
                            name: username,
                            fullname: fullname,
                            avatar_url: avatar,
                            mail: mail
                        };
                        return [4 /*yield*/, this.userRepo.save(new_user)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     *
     * @param uuid Uuid of the user
     * @returns user data
     */
    UserService.prototype.getUserByIdentifier = function (userIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepo.findOne({ where: { name: userIdentifier }, relations: ['channels', 'friends'] })];
                    case 1:
                        user = _a.sent();
                        if (!(!user && (0, uuid_1.validate)(userIdentifier))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.userRepo.findOne({
                                where: { id: userIdentifier },
                                relations: ['channels', 'friends']
                            })];
                    case 2:
                        user = _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!user)
                            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
                        return [2 /*return*/, user];
                }
            });
        });
    };
    /**
     * Update user profile
     * @param user the user we want to update
     * @param changes containing potential modified fields : mail, name, fullname and avatar
     * @returns the updated user
     */
    UserService.prototype.updateUser = function (user, changes) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                user.mail = changes.mail;
                user.name = changes.name;
                user.avatar_url = changes.avatar_url;
                user.fullname = changes.fullname;
                return [2 /*return*/, this.userRepo.save(user)];
            });
        });
    };
    UserService.prototype.setTwoFactorAuthenticationSecret = function (user, secret) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                user.TwoFA_secret = secret;
                return [2 /*return*/, this.userRepo.save(user)];
            });
        });
    };
    UserService.prototype.turnOnTwoFactorAuthentication = function (req) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getUserByRequest(req)];
                    case 1:
                        user = _a.sent();
                        user.TwoFA_enable = true;
                        return [2 /*return*/, this.userRepo.save(user)];
                }
            });
        });
    };
    UserService.prototype.joinChannel = function (user, channelname, password) {
        if (password === void 0) { password = null; }
        return __awaiter(this, void 0, void 0, function () {
            var channel, _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.chanService.getChannelByIdentifier(channelname)];
                    case 1:
                        channel = _e.sent();
                        if (channel.banned.includes(user))
                            throw new common_1.HttpException('You are banned', common_1.HttpStatus.FORBIDDEN);
                        if (!channel.password_protected) return [3 /*break*/, 5];
                        _a = !password;
                        if (_a) return [3 /*break*/, 4];
                        _c = (_b = bcrypt).compare;
                        _d = [password];
                        return [4 /*yield*/, this.chanService.getChannelPasswordHash(channel.id)];
                    case 2: return [4 /*yield*/, _c.apply(_b, _d.concat([_e.sent()]))];
                    case 3:
                        _a = !(_e.sent());
                        _e.label = 4;
                    case 4:
                        if (_a) {
                            throw new common_1.HttpException('Bad Password', common_1.HttpStatus.FORBIDDEN);
                        }
                        _e.label = 5;
                    case 5:
                        user.channels = __spreadArray(__spreadArray([], user.channels, true), [channel], false); /* if pb of is not iterable, it is because we did not get the realtions in the find one */
                        return [4 /*yield*/, user.save()];
                    case 6:
                        _e.sent();
                        return [2 /*return*/, (true)];
                }
            });
        });
    };
    UserService.prototype.leaveChannel = function (user, channel) {
        return __awaiter(this, void 0, void 0, function () {
            var chan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanService.getChannelByIdentifier(channel)];
                    case 1:
                        chan = _a.sent();
                        return [4 /*yield*/, this.channelsRepo
                                .createQueryBuilder()
                                .relation(channel_entity_1.Channel, "users")
                                .of(user)
                                .remove(chan)];
                    case 2:
                        _a.sent();
                        if (!(chan.ownerId == user.id)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.channelsRepo
                                .createQueryBuilder()
                                .relation(channel_entity_1.Channel, "owner")
                                .of(chan)
                                .set(null)];
                    case 3:
                        _a.sent();
                        chan.ownerId = ""; // See how possible to not do it manually
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.chanService.getUsersOfChannels()];
                    case 5: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.getChannelsForUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var chans;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelsRepo.find({
                            where: {
                                users: { id: user.id }
                            }
                        })];
                    case 1:
                        chans = _a.sent();
                        return [2 /*return*/, chans];
                }
            });
        });
    };
    UserService.prototype.block = function (user, toBan) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (user.blocked == null)
                    user.blocked = [];
                user.blocked.push(toBan.id);
                user.save();
                return [2 /*return*/, user];
            });
        });
    };
    UserService.prototype.unblock = function (user, toUnBan) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                index = user.blocked.indexOf(toUnBan.id);
                if (index > -1) {
                    user.blocked.splice(index, 1);
                }
                user.save();
                return [2 /*return*/, user];
            });
        });
    };
    UserService.prototype.setUserActive = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            conflictPaths: ['user'],
                            skipUpdateIfNoValuesChanged: true
                        };
                        return [4 /*yield*/, this.userActivityRepo.upsert({ user: user }, options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.unsetUserActive = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var found;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userActivityRepo.findOneOrFail({
                            where: {
                                user: { id: user.id }
                            }
                        })];
                    case 1:
                        found = _a.sent();
                        this.userActivityRepo["delete"](found.id);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
        __param(1, (0, typeorm_1.InjectRepository)(user_activity_entity_1.UserActivity)),
        __param(2, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
        __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return channel_service_1.ChannelService; })))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
