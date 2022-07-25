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
import { AfterRecover, QueryFailedError, TreeRepositoryNotSupportedError } from 'typeorm';
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


@Injectable()
@UseFilters(new WebsocketExceptionsFilter())
@WebSocketGateway()
export class WSServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	protected _server: Server;

	constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
		protected readonly channelService: ChannelService,
		protected readonly messageService: MessageService,
		protected readonly friendService: FriendshipsService,
		@Inject(forwardRef(() => ChatService)) protected readonly chatService : ChatService
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
		try {
			const authCookies: string[] = client.handshake.headers.cookie.split('; ');
			const authCookie: string[] = authCookies.filter(s => s.includes('Authentication='));
			const authToken = authCookie[0].substring(15, authCookie[0].length);
			const jwtOptions: JwtVerifyOptions = {
				secret: jwtConstants.secret
			}
			const jwtPayload = await this.jwtService.verify(authToken, jwtOptions);
			const user: any = await this.userService.getUserByIdentifierLight(jwtPayload.sub);

			return user;
		} catch (err) {
			console.log("Guard error :");
			console.log(err.message);
		}
	}

	/**
	 * Handle first connection from WebSocket. Can't use Guard on this
	 * So we validate directly on the function
	 * @param client Socket initialized by client
	 * @returns Nothing, but handle disconnection if problems occurs
	 */
	async handleConnection(client: Socket) {
		const user = await this.validateConnection(client);
		if (!user)
			return this.handleDisconnect(client);

		client.data.user = user;
		this.logger.log("New connection: " + user.name);
		this.all_users = await this.userService.getUsers();
		if (!this.active_users.has(user))
		{
			console.log("Add : " + user.name);
			this.active_users.set(user, client);
		}
		this.logger.log(client.id);

		this.active_users.forEach((socket: Socket, user: User) => {
			this._server.to(socket.id).emit(
				'listUsers',
				this.listConnectedUser(socket, this.all_users, this.active_users, false)
			);
		});

		let chan : Channel[] = await this.userService.getChannelsForUser(user);
		this.logger.log("CHANS" + chan);

		for (let c of chan) {
			client.join(c.name);
			this.logger.log(user.name + " : Client joining" + c.name)
		}

	}

	afterInit(server: Server) {
		this.logger.log("Start listenning");
	}

	/**
	 * Handle Socket disconnection.
	 * @param client Socket received from client
	 */
	async handleDisconnect(client: Socket) {
		try {
			for (let [entries, socket] of this.active_users.entries())
			{
				if (entries.id == client.data.user.id)
				{
					this.active_users.delete(entries);
					break;
				}
			}
		}
		catch (err) {
			console.log("Don't know what happened");
		}
		this.active_users.forEach((socket: Socket, user: User) => {
			this._server.to(socket.id).emit(
				'listUsers',
				this.listConnectedUser(socket, this.all_users, this.active_users, false)
			);
		});
		client.emit('bye');
		client.disconnect(true);
	}

	/**
	 * Return a JSON object with all active user. With or without the user who made the request
	 * regarding of `withCurrentUser` parameters
	 * @param client user who made the request
	 * @param active_user map of active user
	 * @param withCurrentUser if true user who made the request will be included
	 * @returns
	 */
	protected listConnectedUser(client: Socket, all_users: User[] ,active_user: Map<User, Socket>, withCurrentUser: boolean = true) {
		let data: User[] = [];
		let i = 0;

		for (let user of active_user.keys()) {
			user.status = "online";
			if (client.data.user.id == user.id && withCurrentUser) {
				data[i] = user;
				i++;
			}
			else if (client.data.user.id != user.id) {
				data[i] = user;
				i++;
			}
		}
		if (all_users)
		{
			for (let user of all_users)
			{
				if (!data.find(element => element.id == user.id) && client.data.user.id != user.id)
				{
					user.status = "offline";
					data[i] = user;
					i++;
				}
			}
		}
		return (data);
	}


	/**
	 * @brief get all users
	 * @param client
	 */
	 @UseGuards(WsJwtAuthGuard)
	 @SubscribeMessage('getUsers')
	 async get_users_list(client: Socket)
	 {
		 this._server.to(client.id).emit(
			 'listUsers',
			 this.listConnectedUser(client, this.all_users, this.active_users, false)
		 );
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
	async onGetRooms(client: Socket){
		this.chatService.getRooms();
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
	async onCreateRoom(client: Socket, channel: newChannelDto) {
		this.chatService.createRoom(client, channel);
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
		this.chatService.joinRoom(client, joinRoom);
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
		this.chatService.deleteRoom(client, channel);
	}

	/**
	 * @brief leave room for current user
	 * @param client
	 * @param channel by string
	 * @returns
	 */
	@SubscribeMessage('leaveRoom')
	@UseGuards(WsJwtAuthGuard)
	async onLeaveRoom(client: Socket, channel: string){
		this.chatService.leaveRoom(client, channel)
	}

	@SubscribeMessage('banUser')
	async onBanUser(client: Socket, channel : string, toBan: User) {
		this.chatService.ban(client, channel, toBan);
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
		this.chatService.sendPrivateMessage(client, msg)
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
		this.chatService.getPrivateMessages(client, user2);
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
		this.chatService.sendChannelMessage(client, data)
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
		this.chatService.getChannelMessages(client, channelName);
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
		this.chatService.addFriend(client, friend);
	}

	/**
	 * @brief Accept friendship - status goes from "pending" to "accepted"
	 * @param client
	 * @param friend
	 */
	@SubscribeMessage('acceptFriend')
	@UseGuards(WsJwtAuthGuard)
	async acceptFriendRequest(client: Socket, friend: User) {
		this.chatService.acceptFriendRquest(client, friend);
	}


	/**
	 * @brief Remove a friend
	 * @param client
	 * @param friend
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('removeFriend')
	async removeFriend(client: Socket, friend: User) {
		this.chatService.removeFriend(client, friend);
	}

	/**
	 * @brief Get friends of the client
	 * @param client
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getFriends')
	async getFriends(client: Socket) {
		this.chatService.getFriends(client);
	}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getFriendRequests')
	async getFriendRequests(client: Socket) {
		this.chatService.getFriendRequests(client);
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
		this.chatService.block(client, toBlock);
	}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('unblock')
	async unblock(client: Socket, toUnBlock: User) {
		this.chatService.unblock(client, toUnBlock)
	}
}
