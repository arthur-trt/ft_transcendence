import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class FortyTwoAuthGuard extends AuthGuard('42') {
	//canActivate(context: ExecutionContext): boolean {
	//	const request = context.switchToHttp().getRequest();
	//	console.log(request);
	//	return true;
	//}
}
