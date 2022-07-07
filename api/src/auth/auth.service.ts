import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { authenticator } from 'otplib';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { toFileStream, toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	public login (user: User, res: Response) {
		const payload = {
			username: user.name,
			sub: user.id,
		}

		if (user.TwoFA_enable)
		{
			res.redirect('/authenticate')
		}

		res.json({
			access_token: this.jwtService.sign(payload)
		})
	}

	public async generateTwoFactorAuthtificationSecret (req: Request) {
		const	user		= await this.userService.getUserByRequest(req);
		let		secret;
		if (user.TwoFA_secret != null)
		{
			secret			= user.TwoFA_secret;
		}
		else
		{
			secret			= authenticator.generateSecret();
		}
		const	optAuthUrl	= authenticator.keyuri(
			user.name,
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

	public async pipeQrCodeURL (text: string)
	{
		return toDataURL(text);
	}

	public async isTwoFactorCodeValid (code: string, req: Request)
	{
		const user	= await this.userService.getUserByRequest(req);
		return (authenticator.verify({
			token: code,
			secret: user.TwoFA_secret,
		}));
	}
}
