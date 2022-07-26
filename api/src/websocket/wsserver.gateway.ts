import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets"
import { forwardRef, Inject, Injectable, Logger, UseGuards, UsePipes } from '@nestjs/common';
import { jwtConstants } from '../auth/jwt/jwt.constants';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { GameService } from '../game/game.service';
import { WsJwtAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { ChannelService } from 'src/channel/channel.service';
import { MessageService } from 'src/message/message.service';
import { sendPrivateMessageDto } from 'src/dtos/sendPrivateMessageDto.dto';
import { Channel } from 'src/channel/channel.entity';
import { UserModule } from 'src/user/user.module';
import { FriendshipsService } from 'src/friendships/friendships.service';
import { AfterRecover, QueryFailedError, TreeRepositoryNotSupportedError, UsingJoinColumnOnlyOnOneSideAllowedError } from 'typeorm';
import { isArray, isObject } from 'class-validator';
import { newChannelDto } from 'src/dtos/newChannel.dto';
import { CreateMatchDto } from 'src/dtos/match.dto';
import { ValidationPipe } from '@nestjs/common';
import { sendChannelMessageDto } from 'src/dtos/sendChannelMessageDto.dto';
import { WsException } from '@nestjs/websockets'
import { UseFilters, WsExceptionFilter} from '@nestjs/common';
import { HttpStatus, HttpException } from '@nestjs/common';
import { ExceptionFilter, Catch } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { NextFunction, Request, Response} from 'express';
import { BaseWsExceptionFilter } from '@nestjs/websockets'
import { WebsocketExceptionsFilter } from './exception.filter';
import { ChatService } from './chat.service';
import { FortyTwoAuthStrategy } from 'src/auth/fortyTwo/fortyTwo.strategy';
import { ConnectService } from './connect.service';


@Injectable()
@UseFilters(new WebsocketExceptionsFilter())
@WebSocketGateway()
export class WSServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	public _server : Server;

	constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
		protected readonly channelService: ChannelService,
		protected readonly messageService: MessageService,
		protected readonly friendService: FriendshipsService,
	    @Inject(forwardRef(() => ChatService)) protected readonly chatService : ChatService,
		@Inject(forwardRef(() => ConnectService)) protected readonly connectService : ConnectService
		) { }

	protected logger: Logger = new Logger('WebSocketServer');
	protected all_users: User[];
	protected active_users = new Map<User, Socket>();
	protected users = [];

	get server(): Server {
		return this._server;
	}

	get activeUsers(): Map<User, Socket> {
		return this.active_users;
	}

	/*
	**
	** 	 ██████  ██████  ███    ██ ███    ██ ███████  ██████ ████████
	** 	██      ██    ██ ████   ██ ████   ██ ██      ██         ██
	** 	██      ██    ██ ██ ██  ██ ██ ██  ██ █████   ██         ██
	** 	██      ██    ██ ██  ██ ██ ██  ██ ██ ██      ██         ██
	** 	 ██████  ██████  ██   ████ ██   ████ ███████  ██████    ██
	**
	*/

	protected async validateConnection(client: Socket): Promise<User> {
		return this.connectService.validateConnection(client);
	}

	/**
	 * Handle first connection from WebSocket. Can't use Guard on this
	 * So we validate directly on the function
	 * @param client Socket initialized by client
	 * @returns Nothing, but handle disconnection if problems occurs
	 */
	async handleConnection(client: Socket) {
		this.connectService.handleConnection(client);
	}

	afterInit(server: Server) {
		this.logger.log("Start listenning");
	}

	/**
	 * Handle Socket disconnection.
	 * @param client Socket received from client
	 */
	async handleDisconnect(client: Socket) {
		this.connectService.handleDisconnect(client)
	}

	/**
	 * Return a JSON object with all active user. With or without the user who made the request
	 * regarding of `withCurrentUser` parameters
	 * @param client user who made the request
	 * @param active_user map of active user
	 * @param withCurrentUser if true user who made the request will be included
	 * @returns
	 */
	protected listConnectedUser(client: Socket, all_users: User[], active_user: Map<User, Socket>, withCurrentUser: boolean = true) {
		this.connectService.listConnectedUser(client, all_users, active_user, withCurrentUser);
	}


	/**
	 * @brief get all users
	 * @param client
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getUsers')
	async get_users_list(client: Socket)
	{
		this.connectService.getUserList(client);
	}

	/*
	** 		_____ _    _       _______    _____       _______ ________          __ __     __
	** 	  / ____| |  | |   /\|__   __|  / ____|   /\|__   __|  ____\ \        / /\\ \   / /
	** 	 | |    | |__| |  /  \  | |    | |  __   /  \  | |  | |__   \ \  /\  / /  \\ \_/ /
	** 	 | |    |  __  | / /\ \ | |    | | |_ | / /\ \ | |  |  __|   \ \/  \/ / /\ \\   /
	** 	 | |____| |  | |/ ____ \| |    | |__| |/ ____ \| |  | |____   \  /\  / ____ \| |
	** 	  \_____|_|  |_/_/    \_\_|     \_____/_/    \_\_|  |______|   \/  \/_/    \_\_|
	**
	*/

	/*
	**
	** ██████   ██████   ██████  ███    ███ ███████
	** ██   ██ ██    ██ ██    ██ ████  ████ ██
	** ██████  ██    ██ ██    ██ ██ ████ ██ ███████
	** ██   ██ ██    ██ ██    ██ ██  ██  ██      ██
	** ██   ██  ██████   ██████  ██      ██ ███████
	**
	**
	** Rooms (by event name)
	** ├─ getRooms
	** ├─ createRooms
	** ├─ joinRoom
	** ├─ deleteRoom
	** ├─ leaveRoom
   	** ├─ banUser
	*/

	@SubscribeMessage('getRooms')
	@UseGuards(WsJwtAuthGuard)
	async getRooms(client: Socket)
	{
		await this.chatService.getRooms().catch((err) => { throw new WsException ('puree')});
	}

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@SubscribeMessage('createRoom')
	@UseGuards(WsJwtAuthGuard)
	@UsePipes(ValidationPipe)
	async createRoom(client: Socket, channel: newChannelDto) {
		await this.chatService.createRoom(client, channel)
	}

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@SubscribeMessage('joinRoom')
	@UseGuards(WsJwtAuthGuard)
	@UsePipes(ValidationPipe)
	async onJoinRoom(client: Socket, joinRoom: newChannelDto) {
		await this.chatService.joinRoom(client, joinRoom);
	}

	/**
	 * @brief delete room for current user : check if channel owner
	 * @param client
	 * @param channel
	 * @returns
	 */
	@SubscribeMessage('deleteRoom')
	@UseGuards(WsJwtAuthGuard)
	async onDeletedRoom(client: Socket, channel: string) {
		await this.chatService.deleteRoom(client, channel);
	}

	/**
	 * @brief leave room for current user
	 * @param client
	 * @param channel by string
	 * @returns
	 */
	@SubscribeMessage('leaveRoom')
	@UseGuards(WsJwtAuthGuard)
	async onLeaveRoom(client: Socket, channel: string) {
		await this.chatService.leaveRoom(client, channel)
	}

	@SubscribeMessage('banUser')
	async onBanUser(client: Socket, channel : string, toBan: User) {
		await this.chatService.ban(client, channel, toBan);
	}

	/*
	**
	** ███    ███ ███████  ██████  ███████
	** ████  ████ ██      ██       ██
	** ██ ████ ██ ███████ ██   ███ ███████
	** ██  ██  ██      ██ ██    ██      ██
	** ██      ██ ███████  ██████  ███████
	**
	**
	** Messages
	** ├─ [ Private messages ]
	** │  ├─ privateMessage (send private message)
	** │  ├─ getPrivateMessage
	** ├─ [ Channel messages ]
	** │  ├─ sendChannelMessages
	** │  ├─ getChannelMessages
	*/

	/**
	 * Each time someone want to emit/receive a private message, this function is called
	 *
	 * @brief emit the PM to both the sender and emitter
	 * @param client
	 * @param msg
	 * @returns
	 */
	@SubscribeMessage('privateMessage')
	@UseGuards(WsJwtAuthGuard)
	@UsePipes(ValidationPipe)
	async onPrivateMessage(client: Socket, msg: sendPrivateMessageDto) {
		await this.chatService.sendPrivateMessage(client, msg)
	}

	/**
	 * @brief Get Private Messages between two users
	 * @param client
	 * @param user2
	 * @returns
	 */
	@SubscribeMessage('getPrivateMessage')
	@UseGuards(WsJwtAuthGuard)
	async onGetPrivateMessage(client: Socket, user2: User){
		await this.chatService.getPrivateMessages(client, user2);
	}

	/**
	 * @brief Send Channel Messages
	 * @param client
	 * @param data an object containing : chan (string) and msg (string)
	 */
	@SubscribeMessage('sendChannelMessages')
	@UsePipes(ValidationPipe)
	@UseGuards(WsJwtAuthGuard)
	async onSendChannelMessages(client: Socket, data: sendChannelMessageDto) {
		await this.chatService.sendChannelMessage(client, data)
	}

	/**
	 * @brief get Channel Messages
	 * @param client
	 * @param channelName
	 * @returns
	 */
	@SubscribeMessage('getChannelMessages')
	@UseGuards(WsJwtAuthGuard)
	async onGetChannelMessages(client: Socket, channelName: string) {
		await this.chatService.getChannelMessages(client, channelName);
	}

	/*
	**
	** ███████ ██████  ██ ███████ ███    ██ ██████  ███████
	** ██      ██   ██ ██ ██      ████   ██ ██   ██ ██
	** █████   ██████  ██ █████   ██ ██  ██ ██   ██ ███████
	** ██      ██   ██ ██ ██      ██  ██ ██ ██   ██      ██
	** ██      ██   ██ ██ ███████ ██   ████ ██████  ███████
	**
	**
	** Friends
	** ├─ addFriend
	** ├─ acceptFriend
	** ├─ removeFriend
	** ├─ getFriends
	** ├─ getFriendRequests
	*/

	/**
	 * @brief add friend
	 * @param client
	 * @param friend
	 */
	@SubscribeMessage('addFriend')
	@UseGuards(WsJwtAuthGuard)
	async addFriend(client: Socket, friend: User) {
		await this.chatService.addFriend(client, friend);
	}

	/**
	 * @brief Accept friendship - status goes from "pending" to "accepted"
	 * @param client
	 * @param friend
	 */
	@SubscribeMessage('acceptFriend')
	@UseGuards(WsJwtAuthGuard)
	async acceptFriendRequest(client: Socket, friend: User) {
		await this.chatService.acceptFriendRquest(client, friend);
	}


	/**
	 * @brief Remove a friend
	 * @param client
	 * @param friend
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('removeFriend')
	async removeFriend(client: Socket, friend: User) {
		await this.chatService.removeFriend(client, friend);
	}

	/**
	 * @brief Get friends of the client
	 * @param client
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getFriends')
	async getFriends(client: Socket) {
		await this.chatService.getFriends(client);
	}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getFriendRequests')
	async getFriendRequests(client: Socket) {
		await this.chatService.getFriendRequests(client);
	}

	/*
	**
	** ██████  ██       ██████   ██████ ██   ██
	** ██   ██ ██      ██    ██ ██      ██  ██
	** ██████  ██      ██    ██ ██      █████
	** ██   ██ ██      ██    ██ ██      ██  ██
	** ██████  ███████  ██████   ██████ ██   ██
	**
	**
    ** Block
	**	├─ block
	**	├─ unblock
	**
	*/

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('block')
	async block(client: Socket, toBlock: User) {
		await this.chatService.block(client, toBlock);
	}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('unblock')
	async unblock(client: Socket, toUnBlock: User) {
		await this.chatService.unblock(client, toUnBlock)
	}

	async getQueueUsers()
	{
		const users: User[] = [];
		const sockets  = await this._server.in('queue').allSockets();
		console.log(sockets);
		for (let [k] of sockets.entries())
		{
			let u = await this.chatService.findUserbySocket(k);
			console.log(u);

			users.push(u);
		}
		return users;
	}
}
