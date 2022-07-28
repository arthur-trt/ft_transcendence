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
exports.MessageService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var channel_entity_1 = require("../channel/channel.entity");
var channel_service_1 = require("../channel/channel.service");
var user_entity_1 = require("../user/user.entity");
var user_service_1 = require("../user/user.service");
var typeorm_2 = require("typeorm");
var channelMessage_entity_1 = require("./channelMessage.entity");
var privateMessage_entity_1 = require("./privateMessage.entity");
var MessageService = /** @class */ (function () {
    function MessageService(pmRepo, chatRepo, chanRepo, userRepo, userService, chanService) {
        this.pmRepo = pmRepo;
        this.chatRepo = chatRepo;
        this.chanRepo = chanRepo;
        this.userRepo = userRepo;
        this.userService = userService;
        this.chanService = chanService;
    }
    /*
    **	CHANNEL MESSAGES
    */
    /**
     * @brief Send a message to channel
     * @param chanIdentifier
     * @param sender
     * @param msg
     * @returns the Channel object containing its new message in its messages relationship
     */
    MessageService.prototype.sendMessageToChannel = function (chanIdentifier, user, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var channel, newMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanService.getChannelByIdentifier(chanIdentifier)];
                    case 1:
                        channel = _a.sent();
                        if (channel.mutedId.includes(user.id))
                            throw (new common_1.HttpException('You are mute and cannot send message to channel.', common_1.HttpStatus.FORBIDDEN));
                        return [4 /*yield*/, this.chatRepo.save({
                                sender: user,
                                message: msg
                            })];
                    case 2:
                        newMessage = _a.sent();
                        channel.messages = __spreadArray(__spreadArray([], channel.messages, true), [newMessage], false); /* if pb of is not iterable, it is because we did not get the
                         ealtions in the find one */
                        return [4 /*yield*/, channel.save()];
                    case 3: /* if pb of is not iterable, it is because we did not get the
                     ealtions in the find one */ return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @brief get messages from a specific channel
     * @param chanIdentifier
     * @returns the Channel with relation to its message
     */
    MessageService.prototype.getMessage = function (chanIdentifier, user) {
        return __awaiter(this, void 0, void 0, function () {
            var chan, msgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanService.getChannelByIdentifier(chanIdentifier)];
                    case 1:
                        chan = _a.sent();
                        if (!(user.blocked != null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.chanRepo.createQueryBuilder("chan").where("chan.name = :chanName", { chanName: chanIdentifier })
                                .leftJoinAndSelect("chan.messages", "messages")
                                .leftJoinAndSelect("messages.sender", "sender")
                                .where(new typeorm_2.Brackets(function (qb) {
                                qb.where("sender.id NOT IN (:...blocked)", { blocked: user.blocked });
                            }))
                                .getOne()];
                    case 2:
                        msgs = _a.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.chanRepo.createQueryBuilder("chan").where("chan.name = :chanName", { chanName: chanIdentifier })
                            .leftJoinAndSelect("chan.messages", "messages")
                            .leftJoinAndSelect("messages.sender", "sender")
                            .getOne()];
                    case 4:
                        msgs = _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/, msgs];
                }
            });
        });
    };
    /**
     * @brief get all messages a user sent on a particular channel
     * @param chanIdentifier
     * @param user the user we wanr to see messages of
     * @returns the Channel with relation to its message
     */
    MessageService.prototype.getChannelMessagesOfUser = function (chanIdentifier, user) {
        return __awaiter(this, void 0, void 0, function () {
            var chan, msgs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.chanService.getChannelByIdentifier(chanIdentifier)];
                    case 1:
                        chan = _a.sent();
                        msgs = this.chatRepo.createQueryBuilder("msg")
                            .where("msg.sender = :sendername", { sendername: user.id })
                            .leftJoinAndSelect("msg.sender", "sender")
                            .getMany();
                        return [2 /*return*/, msgs];
                }
            });
        });
    };
    /*
    **	PRIVATE MESSAGES
    */
    /**
     * @brief send private message to a target
     * @param req the request containing user id
     * @param target
     * @param msg
     * @returns array of all private messages
     */
    MessageService.prototype.sendPrivateMessage = function (src, target, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var user2, newMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.getUserByIdentifier(target.name)];
                    case 1:
                        user2 = _a.sent();
                        return [4 /*yield*/, this.pmRepo.save({
                                sender: src.id,
                                target: user2.id,
                                message: msg
                            })];
                    case 2:
                        newMessage = _a.sent();
                        return [4 /*yield*/, this.pmRepo.find()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * @brief get Private messages between two users
     * @param req the request containing user id
     * @param target
     * @returns private messages between two users
     */
    MessageService.prototype.getPrivateMessage = function (user1, user2) {
        return __awaiter(this, void 0, void 0, function () {
            var msgs;
            return __generator(this, function (_a) {
                if (user1.blocked.includes(user2.id))
                    throw new common_1.HttpException('Cannot get messages with a blocked user', common_1.HttpStatus.OK);
                msgs = this.pmRepo.createQueryBuilder("PM")
                    .leftJoinAndMapOne("PM.sender", user_entity_1.User, 'users', 'users.id = PM.sender')
                    .leftJoinAndMapOne("PM.target", user_entity_1.User, 'usert', 'usert.id = PM.target')
                    .where(new typeorm_2.Brackets(function (qb) {
                    qb.where("PM.sender = :dst", { dst: user1.id })
                        .orWhere("PM.sender = :dst1", { dst1: user2.id });
                }))
                    .andWhere(new typeorm_2.Brackets(function (qb) {
                    qb.where("PM.target = :dst", { dst: user1.id })
                        .orWhere("PM.target = :dst1", { dst1: user2.id });
                }))
                    .select(['PM.message'])
                    .addSelect([
                    'PM.sent_at',
                    'PM.sender',
                    'PM.target',
                    'PM.message',
                    'users.name',
                    'users.avatar_url',
                    'usert.name',
                    'usert.avatar_url',
                    'users.id',
                    'usert.id'
                ])
                    .getMany();
                return [2 /*return*/, msgs];
            });
        });
    };
    MessageService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(privateMessage_entity_1.privateMessage)),
        __param(1, (0, typeorm_1.InjectRepository)(channelMessage_entity_1.channelMessage)),
        __param(2, (0, typeorm_1.InjectRepository)(channel_entity_1.Channel)),
        __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
        __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return user_service_1.UserService; }))),
        __param(5, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return channel_service_1.ChannelService; })))
    ], MessageService);
    return MessageService;
}());
exports.MessageService = MessageService;
