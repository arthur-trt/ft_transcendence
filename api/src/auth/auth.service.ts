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
import { useContainer } from 'class-validator';
import { userInfo } from 'os';

@Injectable()
export class AuthService {
	constructor(
		protected userService: UserService,
		protected jwtService: JwtService
	) {}

	protected	generateCookie(user: User, isSecondFactorAuthenticated:boolean = false)
	{
		const payload = {
			sub: user.id,
			isSecondFactorAuthenticated
		}
		const token = this.jwtService.sign(payload);
		const cookie = `Authentication=${token}; Path=/; Max-Age=${jwtConstants.expire_time}`;
		return cookie;
	}
}
