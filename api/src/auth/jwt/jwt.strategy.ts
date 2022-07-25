import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { jwtConstants } from "./jwt.constants";
import { Request } from "express";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy)
{
	constructor(
		private readonly userService: UserService
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
				return request?.cookies?.Authentication
			}]),
			ignoreExpiration: false,
			secretOrKey: jwtConstants.secret,
			passReqToCallback: true,
		});
	}

	async validate(request: Request, payload: any) {
		const	user = await this.userService.getUserByIdentifier(payload.sub);
		if (!user.TwoFA_enable)
			return { userId: payload.sub };
		if (payload.isSecondFactorAuthenticated || request.url == "/api/auth/2fa/validate")
		{
			return { userId: payload.sub };
		}
	}
}
