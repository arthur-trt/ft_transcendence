import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { Request } from 'express';


@Injectable()
//export class JwtAuthGuard extends AuthGuard('jwt') implements IAuthGuard {
//	//public handleRequest(err: unknown, user: User): any {
//	//	console.log(err);
//	//	console.log(user);
//	//  return user;
//	//}

//	//public async canActivate(context: ExecutionContext): Promise<boolean> {
//	//  await super.canActivate(context);
//	////  console.log(context);
//	//  console.log(context.switchToHttp().getRequest());

<<<<<<< HEAD
		const { user }: Request = context.switchToHttp().getRequest();

		return user ? true : false;
	}
}
=======
//	//  const { user }: Request = context.switchToHttp().getRequest();

//	//  return user ? true : false;
//	//}
//  }

export class JwtAuthGuard extends AuthGuard('jwt') {}
>>>>>>> origin/main
