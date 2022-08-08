import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { Channel } from "src/channel/channel.entity";
import { ChannelService } from "src/channel/channel.service";
import { addToPrivateRoomDto } from "src/dtos/addToPrivateRoom.dto";
import { banUserDto } from "src/dtos/banUser.dto";
import { ModifyChannelDto } from "src/dtos/modifyChannel.dto";
import { muteUserDto } from "src/dtos/muteUser.dto";
import { newChannelDto } from "src/dtos/newChannel.dto";
import { sendChannelMessageDto } from "src/dtos/sendChannelMessageDto.dto";
import { sendPrivateMessageDto } from "src/dtos/sendPrivateMessageDto.dto";
import { FriendshipsService } from "src/friendships/friendships.service";
import { MessageService } from "src/message/message.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { InitializedRelationError } from "typeorm";
import { WSServer } from "./wsserver.gateway";



@Injectable()
export class ChatService {

	private chatBot: User;

	constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
		protected readonly channelService: ChannelService,
		protected readonly messageService: MessageService,
		protected readonly friendService: FriendshipsService,
		@Inject(forwardRef(() => WSServer)) protected gateway : WSServer
	) {
	}

	async init() {
		console.log("init bot")
		try {

			this.chatBot = await this.userService.getUserByIdentifier("chatBot")
		}
		catch
		{
			this.chatBot = await this.userService.findOrCreateUser(
				0,
				"chatBot",
				"chatBot",
				"https://upload.wikimedia.org/wikipedia/commons/a/a6/Nicolas_Sarkozy_in_2010.jpg",
				"chat@bot.fr"
			);
		}
	}

	async findSocketId(user: User) : Promise<Socket>
	{
		for (const [allUsers, socket] of this.gateway.activeUsers.entries()) {
  			if (allUsers.id == user.id)
    			return socket;
		}
	}

	async findUserbySocket(askedsocket: string): Promise<User>
	{
		for (const [allUsers, socket] of this.gateway.activeUsers.entries()) {
  			if (socket.id == askedsocket)
    			return allUsers;
		}
	}

	async getRooms()
	{
		for (const [allUsers, socket] of this.gateway.activeUsers.entries())
			this.gateway.server.to(socket.id).emit('rooms', " get rooms ", await this.channelService.getChannelsForUser(allUsers));
	}

	async createRoom(client: Socket, channel: newChannelDto)
	{
		await this.channelService.createChannel(channel.chanName, client.data.user, channel.password, channel.private)
		client.join(channel.chanName)
		await this.getRooms();
	}

	async joinRoom(client: Socket, joinRoom: newChannelDto)
	{
		await this.userService.joinChannel(client.data.user, joinRoom.chanName, joinRoom.password)
			.then(async () => {
				client.join(joinRoom.chanName);
				await this.getRooms();
			});

		// TEST BOT
		await this.messageService.sendMessageToChannel(joinRoom.chanName, this.chatBot, client.data.user.name + " just joined the chan.");
		await this.getChannelMessages(client, joinRoom.chanName);
	}

	async addUser(client: Socket, userToAdd : addToPrivateRoomDto)
	{
		const userSocket: Socket = await this.findSocketId(userToAdd.user);
		const user: User = await this.userService.getUserByIdentifier(userToAdd.user.id);
		await this.userService.joinChannel(user, userToAdd.chanName)
		.then(async () =>  {
			userSocket.join(userToAdd.chanName);
			await this.getRooms();
		})
	}

	async deleteRoom(client: Socket, channel: string)
	{
		const chan = await this.channelService.getChannelByIdentifier(channel);
		await this.channelService.deleteChannel(client.data.user, chan);
		await this.getRooms();
	}

	async leaveRoom(client: Socket, channel: string)
	{
		await this.userService.leaveChannel(client.data.user, channel)
		client.leave(channel);
		await this.getRooms();
		// TEST BOT
		await this.messageService.sendMessageToChannel(channel, this.chatBot, client.data.user.name + " just left the chan.");
		await this.getChannelMessages(client, channel);
	}

	async ban(client: Socket, data : banUserDto)
	{


		const chan: Channel = await this.channelService.getChannelByIdentifier(data.channel);
		await (await this.findSocketId(data.toBan)).leave(chan.name);
		await this.channelService.temporaryBanUser(client.data.user, chan, data.toBan);
		// TEST BOT
		await this.messageService.sendMessageToChannel(data.channel, this.chatBot, data.toBan.name + " has been banned for 30 sec!");
		await this.getChannelMessages(client, data.channel);
		await this.getRooms();
	}

	async mute(client: Socket, data : muteUserDto)
	{
		const chan: Channel = await this.channelService.getChannelByIdentifier(data.channel);
		await this.channelService.temporaryMuteUser(client.data.user, chan, data.toMute);
		await this.getRooms();
		//Test bot
		await this.messageService.sendMessageToChannel(data.channel, this.chatBot, data.toMute.name + " has been muted for 30 sec!");
		await this.getChannelMessages(client, data.channel);
	}

	async setAdmin(client: Socket, data : { channel: string, toSetAdmin: User })
	{
		const chan: Channel = await this.channelService.getChannelByIdentifier(data.channel);
		await this.channelService.setNewAdmin(client.data.user, chan, data.toSetAdmin);
		await this.messageService.sendMessageToChannel(chan.name, this.chatBot, client.data.user.name + " just joined the chan.");
		await this.getChannelMessages(client, data.channel);
	}

	async modifyChanSettings(client: Socket, changes: ModifyChannelDto)
	{
		await this.channelService.updateChannelSettings(client.data.user, changes);
		await this.getRooms();
	}

	/** 	Messages 	*/

	async sendPrivateMessage(client: Socket, msg: sendPrivateMessageDto)
	{
		const friendSocket: Socket = await this.findSocketId(msg.to);
		await this.messageService.sendPrivateMessage(client.data.user, msg.to, msg.msg);
		const conversation = await this.messageService.getPrivateMessage(client.data.user, msg.to);
		if (friendSocket)
			this.gateway.server.to(friendSocket.id).emit('privateMessage', client.data.user.name + " " + msg.to.name, conversation);
		this.gateway.server.to(client.id).emit('privateMessage', client.data.user.name + " " + msg.to.name, conversation);
	}

	async getPrivateMessages(client: Socket, user2: User)
	{
		const msg = await this.messageService.getPrivateMessage(client.data.user, user2);
		this.gateway.server.to(client.id).emit('privateMessage', client.data.user.name + " " + user2.name, msg);
	}

	async sendChannelMessage(client: Socket, data: sendChannelMessageDto)
	{
		await this.messageService.sendMessageToChannel(data.chan, client.data.user, data.msg);
		await this.getChannelMessages(client, data.chan);
	}


	async getChannelMessages(client : Socket, channelName: string)
	{
		const sockets = await this.gateway.server.in(channelName).allSockets();
        for (const [k] of sockets.entries())
		{
        	const u = await this.userService.getUserByIdentifier((await this.findUserbySocket(k)).id);
			this.gateway.server.to((await this.findSocketId(u)).id).emit('channelMessage', await this.messageService.getMessage(channelName, u));
        }
	}

	/** Friendships */

	async addFriend(client: Socket, friend: User)
	{
		const friendSocket: Socket = await this.findSocketId(friend)
		await this.friendService.sendFriendRequest(client.data.user, friend);
		if (friendSocket)
			this.gateway.server.to(friendSocket.id).emit('newFriendRequest', "You have a new friend request", await this.friendService.getFriendsRequests(friend))
	}

	async acceptFriendRquest(client: Socket, friend: User)
	{
		const friendSocket: Socket = await this.findSocketId(friend)
		await this.friendService.acceptFriendRequest(client.data.user, friend);
		this.gateway.server.to(client.id).emit('newFriendRequest', "You have a new friend request", await this.friendService.getFriendsRequests(client.data.user))
		if (friendSocket)
			this.gateway.server.to(friendSocket.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(friend));
		this.gateway.server.to(client.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(client.data.user));
	}

	async removeFriend(client: Socket, friend: User)
	{
		const friendSocket: Socket = await this.findSocketId(friend);
		await this.friendService.removeFriend(client.data.user, friend);
		if (friendSocket)
			this.gateway.server.to(friendSocket.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(friend));
		this.gateway.server.to(client.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(client.data.user));
	}

	async getFriends(client: Socket)
	{
		this.gateway.server.to(client.id).emit('friendList', "Friend list", await this.friendService.getFriendsofUsers(client.data.user));
	}

	async getFriendRequests(client: Socket)
	{
		this.gateway.server.to(client.id).emit('newFriendRequest', "Friend requests list : you are target of", await this.friendService.getFriendsRequests(client.data.user));
	}

	async block(client: Socket, toBlock: User)
	{
		await this.userService.block(client.data.user, toBlock);
		this.gateway.server.to(client.id).emit('blocked', toBlock.name + " has been blocked");
		await this.getFriends(client);
	}

	async unblock(client: Socket, toUnBlock: User)
	{
		await this.userService.unblock(client.data.user, toUnBlock);
		this.gateway.server.to(client.id).emit('unblocked', toUnBlock.name + " has been unblocked");
		await this.getFriends(client);
	}
}
