"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.sendPrivateMessageDto = void 0;
var openapi = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var class_validator_2 = require("class-validator");
var sendPrivateMessageDto = /** @class */ (function () {
    function sendPrivateMessageDto() {
    }
    sendPrivateMessageDto._OPENAPI_METADATA_FACTORY = function () {
        return { to: { required: true, type: function () { return Object; } }, msg: { required: true, type: function () { return String; }, minLength: 1, maxLength: 250 } };
    };
    __decorate([
        (0, class_validator_2.IsNotEmpty)()
    ], sendPrivateMessageDto.prototype, "to");
    __decorate([
        (0, class_validator_2.IsNotEmpty)(),
        (0, class_validator_1.Length)(1, 250)
    ], sendPrivateMessageDto.prototype, "msg");
    return sendPrivateMessageDto;
}());
exports.sendPrivateMessageDto = sendPrivateMessageDto;
