import { Req, ClassSerializerInterceptor, Controller, Patch, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { joinChannelDto } from 'src/dtos/joinChannel.dto';
import { Request } from 'express';
import { ApiProperty, ApiOperation, ApiTags, ApiResponse, ApiBearerAuth, ApiResponseProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


/** https://stackoverflow.com/questions/54958244/how-to-use-query-parameters-in-nest-js?answertab=trending#tab-top PARMAS AND TOUTES  */
@ApiTags('user')
@Controller('user')
export class UserController
{
	constructor(private userService: UserService) { }

	@ApiOperation({ summary: "Get all users" })
	@Get('/') /* Get decorator -> we can add subroutes in () */
	async getUsers() : Promise<User[]> {
		return await this.userService.getUsers();
	}

	@ApiOperation({ summary: "Get all info about a user identified by :uuid" })
	@ApiResponse({ status: 200, description: "User is returned normally" })
	@ApiResponse({ status: 404, description: "User is not found" })
	@Get(':uuid')
	async getUser(@Param('uuid') uuid: string) : Promise<User> {
		return await this.userService.getUserByIdentifier(uuid);
	}

	//@Get(':name') /* Get decorator -> we can add subroutes in () */
	//async getCars(@Param('name') name: string): Promise<User> {
	//	console.log('requested name : '+ name)
	//	return await this.userService.getUserByName(name);
	//}

	// localhost:3000/user/createUser
	//@Post('createUser')
	//@UsePipes(ValidationPipe)
	//public async postUser(@Body() user: UserDto) {
	//	return this.userService.createUser(user);
	//}

	@Post('joinChannel') /** query : ?param=value&param=342......etc */
	@UsePipes(ValidationPipe)
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	public async joinChannel(@Req() req: Request, @Body() joinRequest: joinChannelDto)
	{
		const channelname = joinRequest.chanName;
		const user: User = await this.userService.getUserByRequest(req);
		return this.userService.joinChannel(user, channelname);
	}

	@Patch('mail')
	@ApiOperation({ summary: "Update mail on connected account" })
	@ApiResponse({ status: 200, description: "Mail changed"})
	@ApiResponse({ status: 403, description: "You're not logged in"})
	@UseGuards(JwtAuthGuard)
	@ApiBearerAuth()
	public async updateMail(@Req() req: Request, @Body('mail') mail: string)
	{
		return this.userService.updateUserMail(req, mail);
	}
}
