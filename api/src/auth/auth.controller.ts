import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Get, Query, Request, Res } from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/user/user.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/user/user.service';


@ApiTags('auth')
@Controller('auth/42')
export class FortyTwoAuthController {

	constructor (
		private authService: AuthService
	) {}

	@Get('login')
	@UseGuards(FortyTwoAuthGuard)
	async	login() {
		return ;
	}

	@Get('callback')
	@UseGuards(FortyTwoAuthGuard)
	async	callback (@Request() req)
	{
		return this.authService.login(req.user);
	}
}

@Controller('auth/cheat')
export class CheatAuthController {
	constructor (
		private authServie: AuthService,
		private httpService: HttpService,
		private userService: UserService
	) {}

	@Get('login')
	async login  () {
		const { data } = await firstValueFrom(this.httpService.get("https://api.namefake.com/"));
		const fake = JSON.parse(JSON.stringify(data));

		//const user = {
		//	"name": fake.username,
		//	"fullname": fake.name,
		//	"mail": fake.email_u + "@" + fake.email_d,
		//	"intra_id": Math.floor(100000 + Math.random() * 900000),
		//	"avatar_url": "https://fr.web.img6.acsta.net/r_1920_1080/medias/nmedia/18/62/48/25/18645943.jpg",
		//}

		const user = await this.userService.findOrCreateUser(
			Math.floor(100000 + Math.random() * 900000),
			fake.name,
			fake.username,
			"https://fr.web.img6.acsta.net/r_1920_1080/medias/nmedia/18/62/48/25/18645943.jpg",
			fake.email_u + "@" + fake.email_d
		)

		return this.authServie.login(user);
	}

}
