import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Socket } from "socket.io";
import { Channel } from "src/channel/channel.entity";
import { ChannelService } from "src/channel/channel.service";
import { ModifyChannelDto } from "src/dtos/modifyChannel.dto";
import { newChannelDto } from "src/dtos/newChannel.dto";
import { sendChannelMessageDto } from "src/dtos/sendChannelMessageDto.dto";
import { sendPrivateMessageDto } from "src/dtos/sendPrivateMessageDto.dto";
import { FriendshipsService } from "src/friendships/friendships.service";
import { MessageService } from "src/message/message.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { WSServer } from "./wsserver.gateway";



@Injectable()
export class ChatService {

	constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
		protected readonly channelService: ChannelService,
		protected readonly messageService: MessageService,
		protected readonly friendService: FriendshipsService,
		@Inject(forwardRef(() => WSServer)) protected gateway : WSServer
	) {
	}

	async findSocketId(user: User) : Promise<Socket>
	{
		for (let [allUsers, socket] of this.gateway.activeUsers.entries()) {
  			if (allUsers.id == user.id)
    			return socket;
		}
	}

	async findUserbySocket(askedsocket: string): Promise<User>
	{
		for (let [allUsers, socket] of this.gateway.activeUsers.entries()) {
  			if (socket.id == askedsocket)
    			return allUsers;
		}
	}

	async getRooms(client? : Socket)
	{
		console.log("POPOPO")
		for (let [allUsers, socket] of this.gateway.activeUsers.entries())
			this.gateway.server.to(socket.id).emit('rooms', " get rooms ", await this.channelService.getChannelsForUser(allUsers));
	}

	async refreshChanMessage(channelName: string)
	{
		for (let [allUsers, socket] of this.gateway.activeUsers.entries())
			this.gateway.server.to(socket.id).emit('channelMessage', await this.messageService.getMessage(channelName, allUsers));
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
		.then(async () =>  {
			client.join(joinRoom.chanName);
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
	}

	async ban(client: Socket, data : { channel: string, toBan: User })
	{
		console.log("chat service");
		const chan: Channel = await this.channelService.getChannelByIdentifier(data.channel);
		await this.channelService.temporaryBanUser(client.data.user, chan, data.toBan);
		await this.refreshChanMessage(data.channel);
		await this.getRooms();
	}

	async setAdmin(client: Socket, data : { channel: string, toSetAdmin: User })
	{
		const chan: Channel = await this.channelService.getChannelByIdentifier(data.channel);
		await this.channelService.setNewAdmin(client.data.user, chan, data.toSetAdmin);
		await this.refreshChanMessage(data.channel);
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
		this.gateway.server.to(data.chan).emit('channelMessage', await this.messageService.getMessage(data.chan, client.data.user));
	}

	async getChannelMessages(client : Socket, channelName: string)
	{
		this.gateway.server.to(channelName).emit('channelMessage', await this.messageService.getMessage(channelName, client.data.user));
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
	}

	async unblock(client: Socket, toUnBlock: User)
	{
		await this.userService.unblock(client.data.user, toUnBlock);
		this.gateway.server.to(client.id).emit('unblocked', toUnBlock.name + " has been unblocked");
	}
}
