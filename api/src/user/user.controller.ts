import { Req, ClassSerializerInterceptor, Controller, Patch, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { joinChannelDto } from 'src/dtos/joinChannel.dto';
import { Request } from 'express';
import { ApiProperty, ApiOperation, ApiTags, ApiResponse, ApiCookieAuth, ApiResponseProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';


/** https://stackoverflow.com/questions/54958244/how-to-use-query-parameters-in-nest-js?answertab=trending#tab-top PARMAS AND TOUTES  */
@ApiTags('User')
@Controller('user')
export class UserController
{
	constructor(private userService: UserService) { }

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
	async getUser(@Param('uuid') uuid: string) : Promise<User> {
		return await this.userService.getUserByIdentifier(uuid);
	}

	/**
	 *
	 * Join channel from user.
	 *
	 * @param req the request containing user id
	 * @param joinRequest the joinChannelDto containing the channel name
	 */

	@Post('joinChannel')
	@UsePipes(ValidationPipe)
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
	 * Update mail of the connected user.
	 * @param req
	 * @param mail
	 * @returns
	 */
	@Patch('mail')
	@ApiOperation({ summary: "Update mail on connected account" })
	@ApiResponse({ status: 200, description: "Mail changed"})
	@ApiResponse({ status: 403, description: "You're not logged in"})
	@UseGuards(JwtAuthGuard)
	@ApiCookieAuth()
	public async updateMail(@Req() req: Request, @Body('mail') mail: string)
	{
		return this.userService.updateUserMail(req, mail);
	}
}
