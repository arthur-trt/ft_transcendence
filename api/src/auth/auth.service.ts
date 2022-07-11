import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { authenticator } from 'otplib';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { toDataURL } from 'qrcode';
import { jwtConstants } from './jwt/jwt.constants';
import { TransformStreamDefaultController } from 'stream/web';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService
	) {}

	private	generateCookie(user: User, isSecondFactorAuthenticated:boolean = false)
	{
		const payload = {
			sub: user.id,
			isSecondFactorAuthenticated
		}
		const token = this.jwtService.sign(payload);
		const cookie = `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.expire_time}`;
		return cookie;
	}

	public login (user: User, @Res() res: Response) {
		res.header('Set-Cookie', this.generateCookie(user));
		if (user.TwoFA_enable)
		{
			return res.redirect('/2fa');
		}
		return res.redirect('/home');
	}

	public twofa_login (user: User, @Res() res: Response) {
		res.header('Set-Cookie', this.generateCookie(user, true));
		return res.json(JSON.stringify({
			connection: "ok"
		}));
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

	public async pipeQrCodeURL (text: string)
	{
		return toDataURL(text);
	}

	public async isTwoFactorCodeValid (code: string, req: Request)
	{
		const user_secret	= await this.userService.getTwoFASecret(req);
		return (authenticator.verify({
			token: code,
			secret: user_secret,
		}));
	}
}
