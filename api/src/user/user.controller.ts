import { Req, Controller, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { joinChannelDto } from 'src/dtos/joinChannel.dto';
import { Request } from 'express';
import { ApiOperation, ApiTags, ApiResponse, ApiCookieAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { uuidDto } from 'src/dtos/uuid.dto';
import { ModifyUserDto } from 'src/dtos/user.dto';
import { Channel } from 'src/channel/channel.entity';

/** https://stackoverflow.com/questions/54958244/how-to-use-query-parameters-in-nest-js?answertab=trending#tab-top PARMAS AND TOUTES  */
@ApiTags('User')
@Controller('user')
export class UserController
{
	constructor(private userService: UserService) {}

	/**
	 *
	 * Returns an array of all users in database
	 * @returns an array of users
	 */

	@ApiOperation({ summary: "Get all users" })
	@Get('/')
	@UseGuards(JwtAuthGuard)
	async getUsers() : Promise<User[]> {
		return await this.userService.getUsers();
	}

	@Get('me')
	@ApiOperation({ summary: "Get information about current user with cookie" })
	@ApiResponse({ status: 200, description: "User is returned normally", type: User})
	@ApiResponse({ status: 403, description: "User is not logged in" })
	@ApiCookieAuth()
	@UseGuards(JwtAuthGuard)
	async getMe(@Req() req: Request) : Promise<User>
	{
		const user: User = await this.userService.getUserByRequest(req);
		return this.userService.getUserByIdentifier(user.id);
	}

	/**
	 *
	 * Get info about user identified by uuid (also works when providing
	 * nickname)
	 * @param uuid the id or nickname
	 */

	@Get(':uuid')
	@ApiOperation({ summary: "Get all info about a user identified by :uuid" })
	@ApiResponse({ status: 200, description: "User is returned normally" })
	@ApiResponse({ status: 404, description: "User is not found" })
	async getUser(@Param() uuid: uuidDto) : Promise<User> {
		return await this.userService.getUserByIdentifier(uuid.uuid);
	}


	/**
	 *
	 * Join channel from user.
	 *
	 * @param req the request containing user id
	 * @param joinRequest the joinChannelDto containing the channel name
	 */

	@Post('joinChannel')
	@UseGuards(JwtAuthGuard)
	@ApiCookieAuth()
	@ApiOperation({ summary: "Join a channel" })
	@ApiResponse({ status: 200, description: "User joined normally" })
	@ApiResponse({ status: 404, description: "User is not found/channel not created" })
	public async joinChannel(@Req() req: Request, @Body() joinRequest: joinChannelDto)
	{
		const channelname = joinRequest.chanName;
		const user: User = await this.userService.getUserByRequest(req);
		return this.userService.joinChannel(user, channelname);
	}

	/**
	 * Update profile of the connected user.
	 * @param req
	 * @param mail
	 * @returns
	 */
	@Patch('userSettings')
	@ApiOperation({ summary: "Update user settings on connected account" })
	@ApiResponse({ status: 200, description: "Profile updated"})
	@ApiResponse({ status: 403, description: "You're not logged in"})
	@UseGuards(JwtAuthGuard)
	@ApiCookieAuth()
	public async updateUser(@Req() req: Request, @Body() changes: ModifyUserDto) : Promise<User>
	{
		const user : User = await this.userService.getUserByRequest(req);
		return this.userService.updateUser(user, changes);
	}

	@Post('leaveChannel')
	@ApiOperation({ summary: "leave a channel" })
	@UseGuards(JwtAuthGuard)
	@ApiCookieAuth()
	public async leaveChannel(@Req() req: Request, @Body() chanName : joinChannelDto) //: Promise<User>
	{
		const user: User = await this.userService.getUserByRequest(req);
		return await this.userService.leaveChannel(user, chanName.chanName);
	}


}
