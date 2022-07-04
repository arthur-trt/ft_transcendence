import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

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

		return {
			access_token: this.jwtService.sign(payload)
		};
	}
}
