import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

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
