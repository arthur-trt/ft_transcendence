import { Injectable, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { Response } from 'express';
import { jwtConstants } from '../jwt/jwt.constants';
import { AuthService } from '../auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FortyTwoService extends AuthService {
	constructor(
		userService: UserService,
		jwtService: JwtService
	) {
		super(userService, jwtService);
	}

	/**
	 * Login user, generate cookie without 2FA validate
	 * @param user User who made login request
	 * @param res Response for handle redirect
	 * @returns redirection
	 */
	public login (user: User, @Res() res: Response) {
		res.header('Set-Cookie', this.generateCookie(user));
		if (user.TwoFA_enable)
		{
			return res.redirect('/2fa');
		}
		return res.redirect('/');
	}
}
