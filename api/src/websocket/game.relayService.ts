// import { Channel } from "src/channel/channel.entity";
// import { ChannelService } from "src/channel/channel.service";
// import { newChannelDto } from "src/dtos/newChannel.dto";
// import { sendChannelMessageDto } from "src/dtos/sendChannelMessageDto.dto";
// import { sendPrivateMessageDto } from "src/dtos/sendPrivateMessageDto.dto";
// import { FriendshipsService } from "src/friendships/friendships.service";
// import { MessageService } from "src/message/message.service";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { WSServer } from "./wsserver.gateway";
import { forwardRef, Inject, Injectable, Logger, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsJwtAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { GameService } from '../game/game.service';
import { MatchHistory } from "src/game/game.entity";

@Injectable()
export class GameRelayService
{
    constructor(
		protected readonly jwtService: JwtService,
		protected readonly userService: UserService,
        protected readonly gameService: GameService,

        @Inject(forwardRef(() => WSServer)) protected gateway : WSServer
        ) {
        }
        
        protected players = new Set<Socket>();
        protected MatchRooms = [];
        static nb_room = 0 ;

    @UseGuards(WsJwtAuthGuard)
    @UsePipes(ValidationPipe)
    async getInQueue(client : Socket)
    {
        console.log("coucou");
        client.join('queue');
        this.players.add(client);
        if (this.players.size == 2)
        {
            const Match = this.startMatch(this.players);
            delete this.players;
        }
    }
    
	async startMatch(players)
	{
		console.log(this.players.size);
		const [first] = players;
		const[, second] = players;
		console.log("starting match");
		var Match = this.gameService.createMatch(first.data.user, second.data.user);
		first.join((await Match).id);
		second.join((await Match).id);
        this.MatchRooms.push((await Match).id);
		this.gateway.server.to((await Match).id).emit('game_countdownStart');
		this.gateway.server.in('queue').socketsLeave('queue');
	}

    @UseGuards(WsJwtAuthGuard)
    @UsePipes(ValidationPipe)
    @SubscribeMessage('game_settings')
    async updateCanvas(client : Socket)
    {
        
    }
}