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
exports.FriendshipsService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("../user/user.entity");
var typeorm_2 = require("typeorm");
var frienship_entity_1 = require("./frienship.entity");
var FriendshipsService = /** @class */ (function () {
    function FriendshipsService(friendRepo, userRepo, userservice) {
        this.friendRepo = friendRepo;
        this.userRepo = userRepo;
        this.userservice = userservice;
    }
    FriendshipsService.prototype.sendFriendRequest = function (sender, target) {
        return __awaiter(this, void 0, void 0, function () {
            var friendship;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.friendRepo
                            .createQueryBuilder('friend')
                            .where(new typeorm_2.Brackets(function (qb) {
                            qb.where("friend.sender = :sender", { sender: sender.id })
                                .orWhere("friend.sender = :sender2", { sender2: target.id });
                        }))
                            .andWhere(new typeorm_2.Brackets(function (qb) {
                            qb.where("friend.target = :dst", { dst: sender.id })
                                .orWhere("friend.target = :dst1", { dst1: target.id });
                        }))
                            .getOne()];
                    case 1:
                        friendship = _a.sent();
                        if (friendship) /** La relation existe deja */
                            return [2 /*return*/];
                        return [4 /*yield*/, this.friendRepo.save({
                                sender: sender.id,
                                target: target.id,
                                status: "pending"
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FriendshipsService.prototype.acceptFriendRequest = function (user1, user2) {
        return __awaiter(this, void 0, void 0, function () {
            var friendship, first, second;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('USER 1' + user1.id);
                        console.log('USER 2' + user2.id);
                        return [4 /*yield*/, this.friendRepo
                                .createQueryBuilder('friend')
                                //.leftJoinAndMapOne("friend.sender", User, 'users', 'users.id = friend.sender')
                                //.leftJoinAndMapOne("friend.target", User, 'usert', 'usert.id = friend.target')
                                .where(new typeorm_2.Brackets(function (qb) {
                                qb.where("friend.sender = :sender", { sender: user1.id })
                                    .orWhere("friend.sender = :sender2", { sender2: user2.id });
                            }))
                                .andWhere(new typeorm_2.Brackets(function (qb) {
                                qb.where("friend.target = :dst", { dst: user1.id })
                                    .orWhere("friend.target = :dst1", { dst1: user2.id });
                            }))
                                .getOne()];
                    case 1:
                        friendship = _a.sent();
                        console.log(friendship);
                        friendship.status = "accepted";
                        return [4 /*yield*/, this.friendRepo.save(friendship)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.userservice.getUserByIdentifier(user1.id)];
                    case 3:
                        first = _a.sent();
                        return [4 /*yield*/, this.userservice.getUserByIdentifier(user2.id)];
                    case 4:
                        second = _a.sent();
                        first.friends = __spreadArray(__spreadArray([], first.friends, true), [user2], false);
                        second.friends = __spreadArray(__spreadArray([], second.friends, true), [user1], false);
                        return [4 /*yield*/, first.save()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, second.save()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FriendshipsService.prototype.getFriendsRequests = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(" GET REQUEST !!!!!!!!! ");
                        return [4 /*yield*/, this.friendRepo
                                .createQueryBuilder('friend')
                                .leftJoinAndMapOne("friend.sender", user_entity_1.User, 'users', 'users.id = friend.sender')
                                .leftJoinAndMapOne("friend.target", user_entity_1.User, 'usert', 'usert.id = friend.target')
                                .where("friend.target = :target", { target: user.id })
                                .andWhere("friend.status = :ok", { ok: "pending" })
                                .select(['friend.sender'])
                                .addSelect([
                                'friend.target',
                                'friend.status',
                                'users.name',
                                'users.id',
                                'users.avatar_url',
                                'usert.name',
                                'usert.id',
                                'usert.avatar_url'
                            ])
                                .getMany()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FriendshipsService.prototype.getFriendsofUsers = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("get friends : ");
                        return [4 /*yield*/, this.userRepo.createQueryBuilder('user')
                                .leftJoinAndSelect('user.friends', "u")
                                .where('user.id = :id', { id: user.id })
                                .getOne()];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    FriendshipsService.prototype.removeFriend = function (user1, user2) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepo
                            .createQueryBuilder("user")
                            .relation(user_entity_1.User, "friends")
                            .of(user1)
                            .remove(user2)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userRepo
                                .createQueryBuilder("user")
                                .relation(user_entity_1.User, "friends")
                                .of(user2)
                                .remove(user1)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.friendRepo.createQueryBuilder()["delete"]()
                                .from(frienship_entity_1.Friendships)
                                .where(new typeorm_2.Brackets(function (qb) {
                                qb.where("sender = :sender", { sender: user1.id })
                                    .orWhere("sender = :sender2", { sender2: user2.id });
                            }))
                                .andWhere(new typeorm_2.Brackets(function (qb) {
                                qb.where("target = :dst", { dst: user1.id })
                                    .orWhere("target = :dst1", { dst1: user2.id });
                            }))
                                .execute()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    FriendshipsService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(frienship_entity_1.Friendships)),
        __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User))
    ], FriendshipsService);
    return FriendshipsService;
}());
exports.FriendshipsService = FriendshipsService;
