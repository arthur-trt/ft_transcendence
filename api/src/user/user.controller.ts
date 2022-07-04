import { Controller, Patch, UsePipes, ValidationPipe } from '@nestjs/common';
import { Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserDto } from '../dtos/user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ParseIntPipe } from '@nestjs/common';
import { Channel } from '../channel/channel.entity';
import { joinChannelDto } from 'src/dtos/joinChannel.dto';
import { ApiProperty, ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';


/** https://stackoverflow.com/questions/54958244/how-to-use-query-parameters-in-nest-js?answertab=trending#tab-top PARMAS AND TOUTES  */
@ApiTags('user')
@Controller('user')
export class UserController
{
	constructor(private userService: UserService) { }

	@ApiOperation({
		summary: "Get all users"
	}
	)
	@Get('/') /* Get decorator -> we can add subroutes in () */
	async getUsers() : Promise<User[]> {
		return await this.userService.getUsers();
	}

	@ApiOperation({
		summary: "Get all info about a user identified by :uuid"
	})
	@ApiResponse({
		status: 200,
		description: "User is returned normally"
	})
	@ApiResponse({
		status: 404,
		description: "User is not found"
	})
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
	@Post('createUser')
	@UsePipes(ValidationPipe)
	public async postUser(@Body() user: UserDto) {
		return this.userService.createUser(user);
	}

	@Post('joinChannel') /** query : ?param=value&param=342......etc */
	@UsePipes(ValidationPipe)
	public async joinChannel(@Body() joinRequest: joinChannelDto)
	{
		const username = joinRequest.username;
		const channelname = joinRequest.chanName;
		console.log(joinRequest);
		return this.userService.joinChannel(username, channelname);
	}

	@Patch(':uuid/mail')
	public async updatePhoto(@Param('uuid') uuid: string, @Body('mail') mail: string)
	{
		return this.userService.updateUserPhoto(uuid, mail);
	}
}
