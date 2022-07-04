import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Get, Query, Request, Res } from '@nestjs/common';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';
import { AuthService } from './auth.service';

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
