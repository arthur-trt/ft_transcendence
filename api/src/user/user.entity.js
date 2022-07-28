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
exports.User = void 0;
var openapi = require("@nestjs/swagger");
var channelMessage_entity_1 = require("../message/channelMessage.entity");
var typeorm_1 = require("typeorm");
var channel_entity_1 = require("../channel/channel.entity");
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    User_1 = User;
    User._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, name: { required: true, type: function () { return String; } }, fullname: { required: true, type: function () { return String; } }, mail: { required: true, type: function () { return String; } }, intra_id: { required: true, type: function () { return Number; } }, avatar_url: { required: true, type: function () { return String; } }, wonMatches: { required: true, type: function () { return Number; } }, TwoFA_secret: { required: true, type: function () { return String; } }, TwoFA_enable: { required: true, type: function () { return Boolean; } }, status: { required: true, type: function () { return String; } }, channels: { required: true, type: function () { return [require("../channel/channel.entity").Channel]; } }, channelMessages: { required: true, type: function () { return [Object]; } }, friends: { required: true, type: function () { return [require("./user.entity").User]; } }, blocked: { required: true, type: function () { return [String]; } } };
    };
    var User_1;
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
    ], User.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar',
            unique: true
        })
    ], User.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar'
        })
    ], User.prototype, "fullname");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar'
        })
    ], User.prototype, "mail");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'int',
            unique: true
        })
    ], User.prototype, "intra_id");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar'
        })
    ], User.prototype, "avatar_url");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'int',
            "default": 0
        })
    ], User.prototype, "wonMatches");
    __decorate([
        (0, typeorm_1.Column)({
            nullable: true,
            select: false
        })
    ], User.prototype, "TwoFA_secret");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'boolean',
            "default": false
        })
    ], User.prototype, "TwoFA_enable");
    __decorate([
        (0, typeorm_1.Column)({
            nullable: true,
            "default": true,
            select: false,
            type: 'varchar'
        })
    ], User.prototype, "status");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return channel_entity_1.Channel; }, function (channel) { return channel.users; }),
        (0, typeorm_1.JoinTable)()
    ], User.prototype, "channels");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return channelMessage_entity_1.channelMessage; }, function (channelMessage) { return channelMessage.sender; })
    ], User.prototype, "channelMessages");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return User_1; }, function (user) { return user.friends; }),
        (0, typeorm_1.JoinTable)()
    ], User.prototype, "friends");
    __decorate([
        (0, typeorm_1.Column)('varchar', { array: true, nullable: true })
    ], User.prototype, "blocked");
    User = User_1 = __decorate([
        (0, typeorm_1.Entity)('Users') /** table name */
    ], User);
    return User;
}(typeorm_1.BaseEntity));
exports.User = User;
