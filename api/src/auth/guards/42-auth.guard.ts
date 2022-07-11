import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
	//handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
	//	if (err || !user)
	//	{
	//		throw err || new HttpException('Caca boudin', HttpStatus.UNAUTHORIZED);;
	//	}
	//	return user;
	//}
	//canActivate(context: ExecutionContext): boolean {
	//	const request = context.switchToHttp().getRequest();
	//	console.log(request);
	//	return true;
	//}
}
