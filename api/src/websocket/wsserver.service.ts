import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets"
import { Injectable, Logger, UseGuards, UsePipes } from '@nestjs/common';
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
import { AfterRecover } from 'typeorm';
import { isArray, isObject } from 'class-validator';
import { newChannelDto } from 'src/dtos/newChannel.dto';
import { CreateMatchDto } from 'src/dtos/match.dto';
import { ValidationPipe } from '@nestjs/common';
import { sendChannelMessageDto } from 'src/dtos/sendChannelMessageDto.dto';


@Injectable()
@WebSocketGateway()
export class WSServer implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	protected server: Server;

	constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
		protected readonly channelService: ChannelService,
		protected readonly messageService: MessageService,
		protected readonly friendService: FriendshipsService
	) { }

	protected logger: Logger = new Logger('WebSocketServer');
	protected all_users: User[];
	protected active_users = new Map<User, Socket>();
	protected users = [];


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
			this.server.to(socket.id).emit(
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
			this.server.to(socket.id).emit(
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

	async findSocketId(user: User) : Promise<Socket>
	{
		for (let [allUsers, socket] of this.active_users.entries())
		{
  			if (allUsers.id == user.id)
  			{
    			return socket;
  			}
		}
	}


	/**
	 * @brief get all users
	 * @param client
	 */
	 @UseGuards(WsJwtAuthGuard)
	 @SubscribeMessage('getUsers')
	 async get_users_list(client: Socket)
	 {
		 this.server.to(client.id).emit(
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
	*/

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getRooms') /** Join ROom parce que ca le creera aussi */
	async onGetRooms(client: Socket)
	{
		return this.server.to(client.id).emit('rooms', client.data.user.name + " receive rooms ", await this.channelService.getUsersOfChannels()); // a recuperer dans le service du front
	}

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@UsePipes(ValidationPipe)
	@SubscribeMessage('createRoom') /** Join ROom parce que ca le creera aussi */
	async onCreateRoom(client: Socket, channel: newChannelDto) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		await this.userService.joinChannel(client.data.user, channel.chanName);
		client.join(channel.chanName)
		return this.server.emit('rooms', client.data.user.name + " created the room ", await this.channelService.getUsersOfChannels()); // a recuperer dans le service du front

	}



	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('joinRoom') /** Join ROom parce que ca le creera aussi */
	async onJoinRoom(client: Socket, user_args: any) // qd on pourrq faire passer pqr le service avant, on pourra mettre Channel
	{
		let channel: string
		let password: string

		if (isArray(user_args))
		{
			channel = user_args[0];
			password = user_args[1];
		}
		else
		{
			channel = user_args;
			password = null;
		}
		if (await this.userService.joinChannel(client.data.user, channel, password)) {
			client.join(channel);
			return this.server.emit('rooms', client.data.user.name + " joined the room ", await this.channelService.getUsersOfChannels()); // a recuperer dans le service du front
		}
		else {
			return this.server.emit('rooms', 'incorect password');
		}
	}

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('deleteRoom')
	async onDeletedRoom(client: Socket, channel: string) {
		await this.channelService.deleteChannel(client.data.user, await this.channelService.getChannelByIdentifier(channel));
		return this.server.emit('rooms', channel + "has been deleted", await this.channelService.getUsersOfChannels()); // on emet a tt le monde que le chan a ete supp
	}

	/**
	 *
	 * @param client
	 * @param channel
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('leaveRoom') /** Join ROom parce que ca le creera aussi */
	async onLeaveRoom(client: Socket, channel: string)
	{
		this.logger.log(client.data.user.name + " LEFT ROOM")
		await this.userService.leaveChannel(client.data.user, channel);
		this.server.emit('rooms', client.data.user.name + " left the room ", await this.channelService.getUsersOfChannels()); // a recuperer dans le service du front
		client.leave(channel);
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
	@UseGuards(WsJwtAuthGuard)
	@UsePipes(ValidationPipe)
	@SubscribeMessage('privateMessage')
	async onPrivateMessage(client: Socket, msg: sendPrivateMessageDto)
	{
		const friendSocket: Socket = await this.findSocketId(msg.to);
		this.server.to(friendSocket.id).to(client.id).emit('privateMessage', client.data.user.name + " sent a message to " + msg.to.name, msg);
		return await this.messageService.sendPrivateMessage(client.data.user, msg.to.name, msg.msg);
	}

	/**
	 * @brief Get Private Messages between two users
	 * @param client
	 * @param user2
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getPrivateMessage')
	async onGetPrivateMessage(client: Socket, user2: User) {

		const msg = await this.messageService.getPrivateMessage(client.data.user, user2);
		this.server.to(client.id).emit('privateMessage', client.data.user.name + " get messages with " + user2, msg);
	}
	/**
	 * @brief Send Channel Messages
	 * @param client
	 * @param data an object containing : chan (string) and msg (string)
	 */
	 @UseGuards(WsJwtAuthGuard)
	 @SubscribeMessage('sendChannelMessages')
	 @UsePipes(ValidationPipe)
	 async onSendChannelMessages(client: Socket, data: sendChannelMessageDto)
	 {
		 this.logger.log("MSG " + data.msg + " to " + data.chan + " from " + client.data.user.name)
		 await this.messageService.sendMessageToChannel(data.chan, client.data.user, data.msg);
		 this.server.to(data.chan).emit('channelMessage', await this.messageService.getMessage(data.chan, client.data.user));
	 }

	/**
	 * @brief get Channel Messages
	 * @param client
	 * @param channelName
	 * @returns
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getChannelMessages')
	async onGetChannelMessages(client: Socket, channelName: string)
	{
		this.server.to(channelName).emit('channelMessage', await this.messageService.getMessage(channelName, client.data.user));
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
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('addFriend')
	async addFriend(client: Socket, friend: User)
	{
		const friendSocket: Socket = await this.findSocketId(friend)
		await this.friendService.sendFriendRequest(client.data.user, friend);
		if (friendSocket)
			this.server.to(friendSocket.id).emit('newFriendRequest', "You have a new friend request", await this.friendService.getFriendsRequests(friend))
	}

	/**
	 * @brief Accept friendship - status goes from "pending" to "accepted"
	 * @param client
	 * @param friend
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('acceptFriend')
	async acceptFriendRequest(client: Socket, friend: User)
	{
		console.log("FRIEND IS " + JSON.stringify(friend))
		const friendSocket: Socket = await this.findSocketId(friend)
		await this.friendService.acceptFriendRequest(client.data.user, friend);
		this.server.to(client.id).emit('newFriendRequest', "You have a new friend request", await this.friendService.getFriendsRequests(client.data.user))
		if (friendSocket)
			this.server.to(friendSocket.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(friend));
		this.server.to(client.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(client.data.user));
	}


	/**
	 * @brief Remove a friend
	 * @param client
	 * @param friend
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('removeFriend')
	async removeFriend(client: Socket, friend: User)
	{
		const friendSocket: Socket = await this.findSocketId(friend);
		await this.friendService.removeFriend(client.data.user, friend);
		if (friendSocket)
			this.server.to(friendSocket.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(friend));
		this.server.to(client.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(client.data.user));
	}

	/**
	 * @brief Get friends of the client
	 * @param client
	 */
	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getFriends')
	async getFriends(client: Socket)
	{
		this.server.to(client.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(client.data.user));
	}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('getFriendRequests')
	async getFriendRequests(client: Socket)
	{
		this.server.to(client.id).emit('newFriendRequest', "Friend requests list : you are target of", await this.friendService.getFriendsRequests(client.data.user));
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
	async block(client: Socket, toBlock: User)
	{
		this.userService.block(client.data.user, toBlock);
		this.server.to(client.id).emit('blocked', toBlock.name + " has been blocked");
	}

	@UseGuards(WsJwtAuthGuard)
	@SubscribeMessage('unblock')
	async unblock(client: Socket, toUnBlock: User)
	{
		this.userService.unblock(client.data.user, toUnBlock);
		this.server.to(client.id).emit('unblocked', toUnBlock.name + " has been unblocked");
	}
}
