import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ParseIntPipe } from '@nestjs/common';
import { Channel } from './channel.entity';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
  } from '@nestjs/swagger';

/** https://stackoverflow.com/questions/54958244/how-to-use-query-parameters-in-nest-js?answertab=trending#tab-top PARMAS AND TOUTES  */
@Controller('user')
@ApiTags('users')
export class UserController
{
	constructor(private userService: UserService) { }

	@Get('/')
	public defaultRoot() : string {
		return this.userService.defaultRoot();
	}

	@ApiOperation({ summary: "Get all the users" })
	@Get('get_users') /* Get decorator -> we can add subroutes in () */
	async getCars() : Promise<User[]> {
		return await this.userService.getUsers();
	}

	@ApiOperation({ summary: "Get all channel" })
	@Get('get_all_chans') /* Get decorator -> we can add subroutes in () */
	async getChans() : Promise<Channel[]> {
		return await this.userService.getUsersOfChannels();
	}


	@ApiOperation({ summary: "Create a user" })
	@Post('create_user')
	@UsePipes(ValidationPipe)
	public async postUser(@Body() user: UserDto) {
		return this.userService.createUser(user);
	}


	@Post('join_channel') /** query : ?param=value&param=342......etc */
//	@UsePipes(ValidationPipe)
	public async postCar(@Query() query)//, @Body() user: UserDto)
	{
		const username = query.user;
		const channelname = query.channel;
		console.log(query);
		return this.userService.joinChannel(username, channelname);
	}
}