import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './jwt/jwt.constants';

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
