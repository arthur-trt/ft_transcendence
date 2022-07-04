import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-42";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class FortyTwoAuthSrategy extends PassportStrategy(Strategy)
{
	constructor (private readonly userService:UserService) {
		super({
			clientID: process.env.API_42_UID,
			clientSecret: process.env.API_42_SECRET,
			callbackURL: process.env.API_42_CALLBACK,
			profileFields: {
				'id': 'id',
				'username': 'login',
				'displayName': 'displayname',
				'name.familyName': 'last_name',
				'name.givenName': 'first_name',
				'profileUrl': 'url',
				'emails.0.value': 'email',
				'phoneNumbers.0.value': 'phone',
				'photos.0.value': 'image_url'
			  }
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		//const json_profile = JSON.parse(profile);
		console.log("START");
		console.log(profile.id);
		console.log("END");
		//console.log(profile);
		//let user = await this.usersService.findByLogin(username);
		//if (!user)
		//	user = await this.usersService.create(username);
		//return user
	}
}
