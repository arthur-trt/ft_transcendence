"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.achievementDto = void 0;
var openapi = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var achievements_entity_1 = require("../achievements/achievements.entity");
var achievementDto = /** @class */ (function () {
    function achievementDto() {
    }
    achievementDto._OPENAPI_METADATA_FACTORY = function () {
        return { achievement_name: { required: true, type: function () { return Object; } } };
    };
    __decorate([
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.IsEnum)(achievements_entity_1.Achievements_types)
    ], achievementDto.prototype, "achievement_name");
    return achievementDto;
}());
exports.achievementDto = achievementDto;
