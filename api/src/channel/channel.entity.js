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
exports.Channel = void 0;
var openapi = require("@nestjs/swagger");
var channelMessage_entity_1 = require("../message/channelMessage.entity");
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../user/user.entity");
var Channel = /** @class */ (function (_super) {
    __extends(Channel, _super);
    function Channel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Channel._OPENAPI_METADATA_FACTORY = function () {
        return { id: { required: true, type: function () { return String; } }, name: { required: true, type: function () { return String; } }, password_protected: { required: true, type: function () { return Boolean; } }, private: { required: true, type: function () { return Boolean; } }, password: { required: true, type: function () { return String; } }, owner: { required: true, type: function () { return require("../user/user.entity").User; } }, ownerId: { required: true, type: function () { return String; } }, admins: { required: true, type: function () { return [require("../user/user.entity").User]; } }, adminsId: { required: true, type: function () { return [String]; } }, muted: { required: true, type: function () { return [require("../user/user.entity").User]; } }, mutedId: { required: true, type: function () { return [String]; } }, users: { required: true, type: function () { return [require("../user/user.entity").User]; } }, messages: { required: true, type: function () { return [Object]; } }, banned: { required: true, type: function () { return [require("../user/user.entity").User]; } } };
    };
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid")
    ], Channel.prototype, "id");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar',
            unique: true
        })
    ], Channel.prototype, "name");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'boolean',
            "default": false
        })
    ], Channel.prototype, "password_protected");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'boolean',
            "default": false
        })
    ], Channel.prototype, "private");
    __decorate([
        (0, typeorm_1.Column)({
            type: 'varchar',
            "default": null,
            nullable: true,
            select: false
        })
    ], Channel.prototype, "password");
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, { nullable: true, cascade: true, onDelete: 'CASCADE', orphanedRowAction: 'delete' })
    ], Channel.prototype, "owner");
    __decorate([
        (0, typeorm_1.RelationId)(function (channel) { return channel.owner; })
    ], Channel.prototype, "ownerId");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return user_entity_1.User; }, { nullable: true, cascade: true, onDelete: 'CASCADE', orphanedRowAction: 'delete' }),
        (0, typeorm_1.JoinTable)()
    ], Channel.prototype, "admins");
    __decorate([
        (0, typeorm_1.RelationId)(function (channel) { return channel.admins; })
    ], Channel.prototype, "adminsId");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return user_entity_1.User; }, { nullable: true, cascade: true, onDelete: 'CASCADE', orphanedRowAction: 'delete' }),
        (0, typeorm_1.JoinTable)(),
        (0, typeorm_1.JoinColumn)({ name: 'mutedId' })
    ], Channel.prototype, "muted");
    __decorate([
        (0, typeorm_1.RelationId)(function (channel) { return channel.muted; })
    ], Channel.prototype, "mutedId");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return user_entity_1.User; }, function (user) { return user.channels; }, { cascade: true, onDelete: 'CASCADE', orphanedRowAction: 'delete' }),
        (0, typeorm_1.JoinTable)()
    ], Channel.prototype, "users");
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return channelMessage_entity_1.channelMessage; }, function (channelMessage) { return channelMessage.target; })
    ], Channel.prototype, "messages");
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return user_entity_1.User; }),
        (0, typeorm_1.JoinTable)()
    ], Channel.prototype, "banned");
    Channel = __decorate([
        (0, typeorm_1.Entity)('Channels')
    ], Channel);
    return Channel;
}(typeorm_1.BaseEntity));
exports.Channel = Channel;
