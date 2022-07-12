import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { jwtConstants } from '../jwt/jwt.constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {

		try {
			const client: Socket = context.switchToWs().getClient<Socket>();
			const authCookie: string = client.handshake.headers.cookie;
			const authToken = authCookie.substring(15, authCookie.length);
			const jwtOptions: JwtVerifyOptions = {
				secret: jwtConstants.secret
			}
			const jwtPayload = await this.jwtService.verify(authToken, jwtOptions);
			const user: any = await this.userService.getUserByIdentifier(jwtPayload.sub);
			client.data.user = user;
			return Boolean(user);
		} catch (err) {
			console.log("Guard error : ");
			console.log(err.message);
			throw new WsException(err.message);
		}
	}
}
