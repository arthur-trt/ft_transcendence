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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WebsocketExceptionsFilter = void 0;
var common_1 = require("@nestjs/common");
var websockets_1 = require("@nestjs/websockets");
var typeorm_1 = require("typeorm");
var WebsocketExceptionsFilter = /** @class */ (function (_super) {
    __extends(WebsocketExceptionsFilter, _super);
    function WebsocketExceptionsFilter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebsocketExceptionsFilter.prototype["catch"] = function (exception, host) {
        var client = host.switchToWs().getClient();
        var data = host.switchToWs().getData();
        var error;
        if (exception instanceof websockets_1.WsException)
            error = exception.getError();
        else if (exception instanceof common_1.BadRequestException) // pour les DTO
         {
            error = exception.getResponse();
            if (typeof (error) == 'object')
                error = error.message[0]; // a chaque fois on prend juste le premier pour assurere un meilleur formatage
        }
        else if (exception instanceof common_1.HttpException)
            error = exception.getResponse();
        else if (exception instanceof typeorm_1.QueryFailedError)
            error = "Query failed [" + exception.parameters + "] : " + exception.message;
        var details = error instanceof Object ? __assign({}, error) : { message: error };
        client.emit("error", { event: error, data: data });
    };
    WebsocketExceptionsFilter = __decorate([
        (0, common_1.Catch)(websockets_1.WsException, common_1.HttpException, typeorm_1.QueryFailedError)
    ], WebsocketExceptionsFilter);
    return WebsocketExceptionsFilter;
}(websockets_1.BaseWsExceptionFilter));
exports.WebsocketExceptionsFilter = WebsocketExceptionsFilter;
