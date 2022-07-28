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
exports.GameService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("../user/user.entity");
var game_entity_1 = require("./game.entity");
var GameService = /** @class */ (function () {
    function GameService(MatchRepo, UserRepo, userService) {
        this.MatchRepo = MatchRepo;
        this.UserRepo = UserRepo;
        this.userService = userService;
    }
    /**
     *
     *
     * @returns All the matches with details (joining users tab)
     */
    GameService.prototype.getCompleteMatchHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.MatchRepo.createQueryBuilder("Match")
                        .leftJoinAndMapOne("Match.user1", user_entity_1.User, 'users', 'users.id = Match.user1')
                        .leftJoinAndMapOne("Match.user2", user_entity_1.User, 'usert', 'usert.id = Match.user2')
                        .select(['Match.id', 'Match.startTime', 'Match.stopTime', 'Match.scoreUser1', 'Match.scoreUser2', 'Match.finished'])
                        .addSelect([
                        "users.name",
                        "users.avatar_url",
                        "users.wonMatches",
                        "usert.name",
                        "usert.avatar_url",
                        "usert.wonMatches"
                    ])
                        .getMany()];
            });
        });
    };
    /**
     *
     * @param user1
     * @param user2
     * @returns
     */
    GameService.prototype.createMatch = function (user1, user2) {
        return __awaiter(this, void 0, void 0, function () {
            var newMatch;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.MatchRepo.save({
                            user1: user1.id,
                            user2: user2.id
                        })];
                    case 1:
                        newMatch = _a.sent();
                        return [4 /*yield*/, this.MatchRepo.save(newMatch)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, newMatch]; /* Comme ca le front peut stock l'id ? */
                }
            });
        });
    };
    /**
     * At the end of match, we can now add :
     * - stop Time
     * - ScoreUser1
     * - ScoreUser2
     * @param match
     * @returns
     */
    GameService.prototype.endMatch = function (match) {
        return __awaiter(this, void 0, void 0, function () {
            var endedMatch, winner, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.findMatchById(match.id)];
                    case 1:
                        endedMatch = _b.sent();
                        if (!endedMatch)
                            throw new common_1.HttpException('Match not found', common_1.HttpStatus.NOT_FOUND);
                        if (endedMatch.finished == true)
                            return [2 /*return*/, ({ "msg": "Match is already finished man!", "match": endedMatch })];
                        endedMatch.scoreUser1 = match.scoreUser1;
                        endedMatch.scoreUser2 = match.scoreUser2;
                        endedMatch.stopTime = new Date();
                        endedMatch.finished = true;
                        if (!(match.scoreUser1 > match.scoreUser2)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.userService.getUserByIdentifier(endedMatch.user1)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.userService.getUserByIdentifier(endedMatch.user2)];
                    case 4:
                        _a = _b.sent();
                        _b.label = 5;
                    case 5:
                        winner = _a;
                        winner.wonMatches += 1;
                        return [4 /*yield*/, this.UserRepo.save(winner)];
                    case 6:
                        _b.sent();
                        return [4 /*yield*/, this.MatchRepo.save(endedMatch)];
                    case 7:
                        _b.sent();
                        return [4 /*yield*/, this.getCompleteMatchHistory()];
                    case 8: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    GameService.prototype.ladder = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.UserRepo.createQueryBuilder('user')
                        .orderBy('user.wonMatches', 'ASC')
                        .getMany()];
            });
        });
    };
    GameService.prototype.findMatchById = function (matchId) {
        return __awaiter(this, void 0, void 0, function () {
            var match;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.MatchRepo.findOne({
                            where: { id: matchId }
                        })];
                    case 1:
                        match = _a.sent();
                        return [2 /*return*/, match];
                }
            });
        });
    };
    GameService = __decorate([
        (0, common_1.Injectable)(),
        __param(0, (0, typeorm_1.InjectRepository)(game_entity_1.MatchHistory)),
        __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User))
    ], GameService);
    return GameService;
}());
exports.GameService = GameService;
