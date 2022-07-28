"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.endMatchDto = exports.CreateMatchDto = void 0;
var openapi = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateMatchDto = /** @class */ (function () {
    function CreateMatchDto() {
    }
    CreateMatchDto._OPENAPI_METADATA_FACTORY = function () {
        return { user1: { required: false, type: function () { return String; } }, user2: { required: false, type: function () { return String; } } };
    };
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateMatchDto.prototype, "user1");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], CreateMatchDto.prototype, "user2");
    return CreateMatchDto;
}());
exports.CreateMatchDto = CreateMatchDto;
var endMatchDto = /** @class */ (function () {
    function endMatchDto() {
    }
    endMatchDto._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, scoreUser1: { required: true, type: function () { return Number; } }, scoreUser2: { required: true, type: function () { return Number; } } };
    };
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], endMatchDto.prototype, "id");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], endMatchDto.prototype, "scoreUser1");
    __decorate([
        (0, class_validator_1.IsNotEmpty)()
    ], endMatchDto.prototype, "scoreUser2");
    return endMatchDto;
}());
exports.endMatchDto = endMatchDto;
