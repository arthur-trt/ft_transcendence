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
exports.GameRelayService = void 0;
var wsserver_gateway_1 = require("./wsserver.gateway");
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var ws_auth_guard_1 = require("../auth/guards/ws-auth.guard");
var GameRelayService = /** @class */ (function () {
    function GameRelayService(jwtService, userService, gameService, gateway) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.gameService = gameService;
        this.gateway = gateway;
        this.players = new Set();
        this.MatchRooms = [];
    }
    GameRelayService.prototype.getInQueue = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            var Match;
            return __generator(this, function (_a) {
                console.log("coucou");
                client.join('queue');
                this.players.add(client);
                if (this.players.size == 2) {
                    Match = this.startMatch(this.players);
                    delete this.players;
                }
                return [2 /*return*/];
            });
        });
    };
    GameRelayService.prototype.startMatch = function (players) {
        return __awaiter(this, void 0, void 0, function () {
            var first, second, Match, _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        first = players[0];
                        second = players[1];
                        console.log("starting match");
                        Match = this.gameService.createMatch(first.data.user, second.data.user);
                        _b = (_a = first).join;
                        return [4 /*yield*/, Match];
                    case 1:
                        _b.apply(_a, [(_j.sent()).id]);
                        _d = (_c = second).join;
                        return [4 /*yield*/, Match];
                    case 2:
                        _d.apply(_c, [(_j.sent()).id]);
                        _f = (_e = this.MatchRooms).push;
                        return [4 /*yield*/, Match];
                    case 3:
                        _f.apply(_e, [(_j.sent()).id]);
                        _h = (_g = this.gateway.server).to;
                        return [4 /*yield*/, Match];
                    case 4:
                        _h.apply(_g, [(_j.sent()).id]).emit('game_countdownStart');
                        this.gateway.server["in"]('queue').socketsLeave('queue');
                        return [2 /*return*/];
                }
            });
        });
    };
    GameRelayService.prototype.updateCanvas = function (client) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    GameRelayService.nb_room = 0;
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, common_1.UsePipes)(common_1.ValidationPipe)
    ], GameRelayService.prototype, "getInQueue");
    __decorate([
        (0, common_1.UseGuards)(ws_auth_guard_1.WsJwtAuthGuard),
        (0, common_1.UsePipes)(common_1.ValidationPipe),
        (0, websockets_1.SubscribeMessage)('game_settings')
    ], GameRelayService.prototype, "updateCanvas");
    GameRelayService = __decorate([
        (0, common_1.Injectable)(),
        __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(function () { return wsserver_gateway_1.WSServer; })))
    ], GameRelayService);
    return GameRelayService;
}());
exports.GameRelayService = GameRelayService;
