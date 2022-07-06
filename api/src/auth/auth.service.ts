import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { authenticator } from 'otplib';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { toFileStream } from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	public login (user: User) {
		const payload = {
			username: user.name,
			sub: user.id,
		}

/*
**	Token we will need to authenticate : 
*/
		return {
			access_token: this.jwtService.sign(payload)
		};
	}

	public async generateTwoFactorAuthtificationSecret (req: Request) {
		const user			= await this.userService.getUserByRequest(req);
		const secret		= authenticator.generateSecret();
		const optAuthUrl	= authenticator.keyuri(
			user.mail,
			process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
			secret
		);

		await this.userService.setTwoFactorAuthenticationSecret(user, secret);
		return {
			secret,
			optAuthUrl
		};
	}

	public async pipeQrCodeStream (stream: Response, optAuthUrl: string)
	{
		return toFileStream(stream, optAuthUrl);
	}
}
