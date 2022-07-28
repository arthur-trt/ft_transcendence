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
exports.ChannelService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var user_service_1 = require("../user/user.service");
var uuid_1 = require("uuid");
var channel_entity_1 = require("./channel.entity");
var ChannelService = /** @class */ (function () {
    function ChannelService(channelsRepo, userService) {
        this.channelsRepo = channelsRepo;
        this.userService = userService;
    }
    /**
     * @brief Create channel
     * @param name the name of the channel
     * @param req the request containing user id
     * @returns
     */
    ChannelService.prototype.createChannel = function (name, user, password, privacy) {
        if (password === void 0) { password = null; }
        if (privacy === void 0) { privacy = false; }
        return __awaiter(this, void 0, void 0, function () {
            var chan, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chan = new channel_entity_1.Channel();
                        chan.name = name;
                        chan.owner = user;
                        chan.admins = [];
                        chan.muted = [];
                        chan.banned = [];
                        chan.admins = __spreadArray(__spreadArray([], chan.admins, true), [user], false);
                        chan.private = privacy;
                        if (!password) return [3 /*break*/, 2];
                        chan.password_protected = true;
                        _a = chan;
                        return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 1:
                        _a.password = _b.sent();
                        _b.label = 2;
                    case 2: return [4 /*yield*/, this.channelsRepo.save(chan)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.userService.joinChannel(user, name, password)];
                    case 4:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ChannelService.prototype.setNewAdmin = function (user, channel, toBeAdmin) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!channel.adminsId.includes(user.id))
                            throw new common_1.HttpException("You must be admin to name another admin.", common_1.HttpStatus.FORBIDDEN);
                        channel.admins = __spreadArray(__spreadArray([], channel.admins, true), [toBeAdmin], false);
                        return [4 /*yield*/, channel.save()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @brief Returns all users of all existing channels
     * @returns
     */
    ChannelService.prototype.getUsersOfChannels = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelsRepo.createQueryBuilder('Channel')
                            .orderBy("Channel.name")
                            .leftJoinAndSelect("Channel.users", "Users")
                            .leftJoinAndSelect("Channel.banned", "b")
                            .leftJoinAndSelect("Channel.owner", "o")
                            .getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @brief Returns all users of all existing channels
     * @returns
     */
    ChannelService.prototype.getChannelsForUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelsRepo.createQueryBuilder('channel')
                            .orderBy("channel.name")
                            .leftJoinAndSelect("channel.users", "Users")
                            .leftJoinAndSelect("channel.banned", "b")
                            .leftJoinAndSelect("channel.owner", "o")
                            .leftJoinAndSelect("channel.admins", "a")
                            .where('channel.private = false')
                            .orWhere("Users.id = :id", { id: user.id })
                            .getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @brief Find a channel by its name or its id
     * @param channelIdentifier (id or name)
     * @returns Channel object corresponding
     */
    ChannelService.prototype.getChannelByIdentifier = function (channelIdentifier) {
        return __awaiter(this, void 0, void 0, function () {
            var chan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelsRepo.findOne({ where: { name: channelIdentifier }, relations: ['messages', 'banned'] })];
                    case 1:
                        chan = _a.sent();
                        if (!(!chan && (0, uuid_1.validate)(channelIdentifier))) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.channelsRepo.findOne({ where: { id: channelIdentifier }, relations: ['messages', 'banned'] })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (!chan)
                            throw new common_1.HttpException('Channel ' + channelIdentifier + ' not found (id or name)', common_1.HttpStatus.NOT_FOUND);
                        return [2 /*return*/, chan];
                }
            });
        });
    };
    ChannelService.prototype.getChannelPasswordHash = function (channelId) {
        return __awaiter(this, void 0, void 0, function () {
            var chan;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.channelsRepo.createQueryBuilder('Channel')
                            .select(["Channel.password"])
                            .where({ "id": channelId })
                            .getOne()];
                    case 1:
                        chan = _a.sent();
                        return [2 /*return*/, chan.password];
                }
            });
        });
    };
    /**
    * @brief updateChannelSettings -- can only be performed by owner.
    * @param user User requesting changes
    * @param changes changes to be performed - chanName or ownership
    * @returns Repository modified
    */
    ChannelService.prototype.updateChannelSettings = function (user, changes) {
        return __awaiter(this, void 0, void 0, function () {
            var chan, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getChannelByIdentifier(changes.chanName)];
                    case 1:
                        chan = _b.sent();
                        if (chan.ownerId != user.id)
                            throw new common_1.HttpException("You must be owner to change chan settings.", common_1.HttpStatus.FORBIDDEN);
                        if (!changes.password) return [3 /*break*/, 3];
                        chan.password_protected = true;
                        _a = chan;
                        return [4 /*yield*/, bcrypt.hash(changes.password, 10)];
                    case 2:
                        _a.password = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        chan.password_protected = false;
                        _b.label = 4;
                    case 4: return [2 /*return*/, this.channelsRepo.save(chan)];
                }
            });
        });
    };
    /**
    * @brief deleteChannel -- performed by owner
    * @param user User requesting changes
    * @param changes changes to be performed - chanName or ownership
    * @returns All channels after deletion
    */
    ChannelService.prototype.deleteChannel = function (user, channel) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!channel.adminsId.includes(user.id))
                            throw new common_1.HttpException("You must be admin to delete chan.", common_1.HttpStatus.FORBIDDEN);
                        return [4 /*yield*/, this.channelsRepo
                                .createQueryBuilder()["delete"]()
                                .from(channel_entity_1.Channel)
                                .where("name = :channame", { channame: channel.name })
                                .execute()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
    *
    * @param user
    * @param toBan
    * @returns
    */
    ChannelService.prototype.deleteUserFromChannel = function (user, channel, toBan) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!channel.adminsId.includes(user.id))
                            throw new common_1.HttpException("You must be admin to delete an user from chan.", common_1.HttpStatus.FORBIDDEN);
                        return [4 /*yield*/, this.channelsRepo.createQueryBuilder()
                                .relation(channel_entity_1.Channel, "users")
                                .of({ id: toBan.id })
                                .remove({ id: channel.id })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.getUsersOfChannels()];
                }
            });
        });
    };
    ChannelService.prototype.unban = function (channel, toUnBan) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                channel.banned = channel.banned.filter(function (banned) {
                    return banned.id !== toUnBan.id;
                });
                channel.save();
                return [2 /*return*/, channel];
            });
        });
    };
    ChannelService.prototype.unmute = function (channel, toUnMute) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Un Mute");
                channel.muted = channel.muted.filter(function (muted) {
                    return muted.id !== toUnMute.id;
                });
                channel.mutedId = channel.mutedId.filter(function (muted) {
                    return muted !== toUnMute.id;
                }); // See how it is possible that relationId are not updated automatically and i have to do it manually;
                channel.save();
                console.log("Muted" + channel.muted);
                console.log("Id " + channel.mutedId);
                return [2 /*return*/, channel];
            });
        });
    };
    ChannelService.prototype.temporaryBanUser = function (user, channel, toBan) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!channel.adminsId.includes(user.id))
                            throw new common_1.HttpException("You must be admin to ban an user from chan.", common_1.HttpStatus.FORBIDDEN);
                        console.log("Bannishement");
                        /** Step one : Deleting user from channel */
                        return [4 /*yield*/, this.deleteUserFromChannel(user, channel, toBan)];
                    case 1:
                        /** Step one : Deleting user from channel */
                        _a.sent();
                        /** Step two : add it to ban list  */
                        console.log(channel.banned);
                        channel.banned = __spreadArray(__spreadArray([], channel.banned, true), [toBan], false);
                        return [4 /*yield*/, channel.save()];
                    case 2:
                        _a.sent();
                        /** Step three : set timeout to remove from ban list */
                        setTimeout(function () { _this.unban(channel, toBan); }, 30000);
                        return [2 /*return*/, channel];
                }
            });
        });
    };
    ChannelService.prototype.temporaryMuteUser = function (user, channel, toMute) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!channel.adminsId.includes(user.id))
                            throw new common_1.HttpException("You must be admin to mute an user from chan.", common_1.HttpStatus.FORBIDDEN);
                        console.log("Mute");
                        channel.muted = __spreadArray(__spreadArray([], channel.muted, true), [toMute], false);
                        return [4 /*yield*/, channel.save()];
                    case 1:
                        _a.sent();
                        console.log("Muted" + channel.muted);
                        console.log("Id " + channel.mutedId);
                        setTimeout(function () { _this.unmute(channel, toMute); }, 30000);
                        return [2 /*return*/, channel];
                }
            });
        });
    };
    ChannelService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
        __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return user_service_1.UserService; })))
    ], ChannelService);
    return ChannelService;
}());
exports.ChannelService = ChannelService;
