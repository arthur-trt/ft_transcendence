import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Get, Query, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './guards/42-auth.guard';

@ApiTags('auth')
@Controller('auth/42')
export class FortyTwoAuthController {

	@Get('login')
	@UseGuards(FortyTwoAuthGuard)
	async	login() {
		return ;
	}

	@Get('callback')
	@UseGuards(FortyTwoAuthGuard)
	async	callback (@Request() req, @Res() res)
	{
		console.log(req);
		console.log(res);
	}
}
