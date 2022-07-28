"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.twoFaDto = void 0;
var openapi = require("@nestjs/swagger");
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var twoFaDto = /** @class */ (function () {
    function twoFaDto() {
    }
    twoFaDto._OPENAPI_METADATA_FACTORY = function () {
        return { token: { required: true, type: function () { return String; }, minLength: 6, maxLength: 6 } };
    };
    __decorate([
        (0, swagger_1.ApiProperty)({
            type: 'string',
            title: 'token',
            maxLength: 6,
            minLength: 6
        }),
        (0, class_validator_1.IsNotEmpty)(),
        (0, class_validator_1.Length)(6, 6),
        (0, class_validator_1.IsNumberString)()
    ], twoFaDto.prototype, "token");
    return twoFaDto;
}());
exports.twoFaDto = twoFaDto;
