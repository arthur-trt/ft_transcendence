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
exports.Friendships = void 0;
var openapi = require("@nestjs/swagger");
var typeorm_1 = require("typeorm");
var Friendships = /** @class */ (function (_super) {
    __extends(Friendships, _super);
    function Friendships() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Friendships._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, sender: { required: true, type: function () { return String; } }, target: { required: true, type: function () { return String; } }, status: { required: true, type: function () { return String; } } };
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid") // id du match
    ], Friendships.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)("uuid")
    ], Friendships.prototype, "sender");
    __decorate([
        (0, typeorm_1.Column)("uuid")
    ], Friendships.prototype, "target");
    __decorate([
        (0, typeorm_1.Column)()
    ], Friendships.prototype, "status");
    Friendships = __decorate([
        (0, typeorm_1.Entity)('Friendships') /** table name */
    ], Friendships);
    return Friendships;
}(typeorm_1.BaseEntity));
exports.Friendships = Friendships;
