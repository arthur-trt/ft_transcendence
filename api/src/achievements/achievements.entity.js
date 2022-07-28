"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Achievements = exports.Achievements_types = void 0;
var openapi = require("@nestjs/swagger");
var user_entity_1 = require("../user/user.entity");
var typeorm_1 = require("typeorm");
var Achievements_types;
(function (Achievements_types) {
    Achievements_types["TOP1"] = "Top 1";
    Achievements_types["TOP3"] = "Top 3";
    Achievements_types["TOP10"] = "Top 10";
    Achievements_types["WINNER"] = "Winner - Won all matches";
    Achievements_types["LOSER"] = "Loser - Lost all matches";
    Achievements_types["ROW3"] = "Row 3 - Won three times in a row";
    Achievements_types["ROW5"] = "Row 5 - Won five times in a row";
    Achievements_types["CHANNELLEADER"] = "Channel Leader - Is owner of at least three channels";
    Achievements_types["HALFHALF"] = "50/50 : Perfeect balance between loss and successds";
    Achievements_types["NOBODYLOVESYOU"] = "Nobody Loves You - Banned from a channel";
})(Achievements_types = exports.Achievements_types || (exports.Achievements_types = {}));
var Achievements = /** @class */ (function (_super) {
    __extends(Achievements, _super);
    function Achievements() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Achievements._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, user: { required: true, type: function () { return Object; } }, achievement_name: { required: true, "enum": require("./achievements.entity").Achievements_types } };
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)()
    ], Achievements.prototype, "id");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }),
        (0, typeorm_1.JoinColumn)()
    ], Achievements.prototype, "user");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'text'
        })
    ], Achievements.prototype, "achievement_name");
    Achievements = __decorate([
        (0, typeorm_1.Entity)('Achievements')
    ], Achievements);
    return Achievements;
}(typeorm_1.BaseEntity));
exports.Achievements = Achievements;
