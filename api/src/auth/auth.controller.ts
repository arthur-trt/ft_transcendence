import { Controller, UseGuards, HttpStatus, HttpException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Get, Req, Res, Post, Body } from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { twoFaDto } from 'src/dtos/twofa_token.dto';
import { AuthGuard } from '@nestjs/passport';



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
	async	callback (@Req() req, @Res() res)
	{
		return this.authService.login(req.user, res);
	}
}

@ApiTags('auth')
@Controller('auth/cheat')
export class CheatAuthController {
	constructor (
		private authServie: AuthService,
		private httpService: HttpService,
		private userService: UserService
	) {}

	@Get('login')
	async login  (@Res() res) {
		const { data } = await firstValueFrom(this.httpService.get("https://api.namefake.com/"));
		const fake = JSON.parse(JSON.stringify(data));

		const image: string[] = [
			"https://fr.web.img6.acsta.net/r_1920_1080/medias/nmedia/18/62/48/25/18645943.jpg",
			"https://img.phonandroid.com/2018/11/xavier-niel-portrait.jpg",
			"https://upload.wikimedia.org/wikipedia/commons/e/eb/Joseph_Stalin_at_the_Tehran_conference_on_1943.jpg",
			"https://upload.wikimedia.org/wikipedia/commons/a/a6/Nicolas_Sarkozy_in_2010.jpg",
			"https://upload.wikimedia.org/wikipedia/commons/d/de/Bernard_Arnault_%283%29_-_2017_%28cropped%29.jpg",
			"https://www.challenges.fr/assets/img/2016/06/07/cover-r4x3w1000-59c3e4252e6e8-liliane-bettencourt.jpg",

		]

		const user = await this.userService.findOrCreateUser(
			Math.floor(100000 + Math.random() * 900000),
			fake.name,
			fake.username,
			image[Math.floor(Math.random()*image.length)],
			fake.email_u + "@" + fake.email_d
		)

		return this.authServie.login(user, res);
	}

}

@ApiTags('auth')
@Controller('auth/2fa')
export class TwoFAAuthController {
	constructor (
		private userService: UserService,
		private authService: AuthService,
	) {}

	/**
	 * Generate a secret key for user
	 * @param req Request sent by nav containing user object
	 * @returns secret and base64 encoded qrcode
	 */
	@Get('generate')
	@ApiOperation({ summary: "Generate a QRCode use by application for turn-on 2fa" })
	@ApiResponse({
		status: 200,
		description: "QRCode have been generated",
		content: {
			'application/json': {
			  example: {
				"qrcode": "<base64_qrcode>",
				"secret": "<string_secret>"
			  }
			},
		  },
	})
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async generate (@Req() req: Request) {
		const { secret, optAuthUrl } = await this.authService.generateTwoFactorAuthtificationSecret(
			req
		);
		const qrcode = await this.authService.pipeQrCodeURL(optAuthUrl);

		return {
			qrcode,
			secret
		};
	}

	@Post('turn-on')
	@ApiOperation({ summary: "Turn On TwoFA for the connected user if validation code is correct" })
	@ApiResponse({ status: 201, description: "TwoFA have been enable on user account" })
	@ApiResponse({ status: 401, description: "Unvalid token sent" })
	@ApiResponse({ status: 403, description: "User is not logged in" })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	async turnOnTwoFA (@Req() req: Request, @Res() res: Response, @Body() twofa_token : twoFaDto) {
		const isValidCode = await this.authService.isTwoFactorCodeValid(
			twofa_token.token,
			req
		);
		if (!isValidCode)
			throw new HttpException('Wrong 2FA', HttpStatus.UNAUTHORIZED);
		await this.userService.turnOnTwoFactorAuthentication(req);
		this.authService.twofa_login(
			await this.userService.getUserByRequest(req),
			res
		);
	}

	@Post('validate')
	@ApiOperation({ summary: "Validate twoFa code" })
	@ApiResponse({ status: 201, description: "TwoFa token is valid" })
	@ApiResponse({ status: 401, description: "Unvalid token sent" })
	@ApiResponse({ status: 403, description: "User is not logged in" })
	@ApiCookieAuth()
	@UseGuards(JwtAuthGuard)
	@UsePipes(ValidationPipe)
	async validateTwoFa(@Req() req, @Res() res: Response, @Body() twofa_token: twoFaDto) {
		const isValidCode = await this.authService.isTwoFactorCodeValid(
			twofa_token.token,
			req
		);
		if (!isValidCode)
			throw new HttpException('Wrong 2FA', HttpStatus.UNAUTHORIZED);
		this.authService.twofa_login(
			await this.userService.getUserByRequest(req),
			res
		);
	}
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor (
		private authService: AuthService
	) {}

	@Get('logout')
	@ApiOperation({ summary: "Disconnect user by deleting cookie"})
	@ApiResponse({ status: 200, description: "User succesfully disconnected" })
	@ApiResponse({ status: 403, description: "User is not logged in" })
	@ApiBearerAuth()
	@UseGuards(JwtAuthGuard)
	async logout(@Req() req: Request, @Res() res: Response) {
		const cookie = `Authentication=deleted; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
		res.setHeader('Set-Cookie', cookie);
		res.send()
	}

	@Post('test')
	@ApiOperation({ summary: "Super tet"})
	@ApiResponse({ status: 418, description:'This is a test'})
	async test() {
		return;
	}
}
