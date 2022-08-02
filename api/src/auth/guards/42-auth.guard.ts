import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";
import { Observable } from "rxjs";

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
	handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
		if (err || !user)
		{
			return null;
		}
		return user;
	}
}
