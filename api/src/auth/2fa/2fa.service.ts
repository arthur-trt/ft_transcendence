import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { authenticator } from 'otplib';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { toDataURL } from 'qrcode';
import { jwtConstants } from '../jwt/jwt.constants';
import { TransformStreamDefaultController } from 'stream/web';
import { useContainer } from 'class-validator';
import { AuthService } from '../auth.service';

@Injectable()
export class TwoFaService extends AuthService {
	constructor(
		userService: UserService,
		jwtService: JwtService
	) { super (userService, jwtService); }

	/**
	 * Generate and save in DB a secret for twoFA
	 * @param user User
	 * @returns secret and url to put in qrcode
	 */
	public async generateTwoFactorAuthtificationSecret (user: User) {
		let		secret;
		if (user.TwoFA_secret != null)
			secret			= user.TwoFA_secret;
		else
			secret			= authenticator.generateSecret();
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

	public twofa_login (user: User, @Res() res: Response) {
		res.header('Set-Cookie', this.generateCookie(user, true));
		return res.json(JSON.stringify({
			connection: "ok"
		}));
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

	async deactivateTwoFa (user: User)
	{
		user.TwoFA_enable = false;
		user.TwoFA_secret = null;
		return await user.save();
	}
}
