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
import { GameModule } from "../game/game.module";
import { UserModule } from "../user/user.module";
import { Match } from "../game/game.interface"
import { dataFront } from "../game/game.interface";
import { createHistogram } from "perf_hooks";


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
        protected match = {} as Match;
        protected dataT = {} as dataFront;
        

    @UseGuards(WsJwtAuthGuard)
    @UsePipes(ValidationPipe)
    async getInQueue(client : Socket)
    {
        console.log("coucou");

        if (!this.players.has(client))
            this.players.add(client);
        console.log(this.players.size);
        if (this.players.size == 2)
        {
            console.log("starting match");
            const Match = this.startMatch(this.players);
            this.players.clear();

        }
    }
    
	async startMatch(players)
	{
		const [first] = players;
		const[, second] = players;
		console.log("starting match");
		var Match = await this.gameService.createMatch(first.data.user, second.data.user);
		first.join( Match.id);
		second.join( Match.id);
        this.MatchRooms.push( Match.id);
		this.gateway.server.to( Match.id).emit('game_countdownStart');
        this.sendPosition( Match.id);

	}
    // async watchMatch(players)
    // {
    //     const [first] = players;
	// 	const[, second] = players;

    //     console.log("watchingMode");
    //     first.join(this.MatchRooms[0]);
	// 	second.join(this.MatchRooms[0]);
    // }

    @UseGuards(WsJwtAuthGuard)
    @UsePipes(ValidationPipe)
    @SubscribeMessage('game_settings')
    async updateCanvas(client : Socket)
    {
        

          
    }
    
    // @SubscribeMessage('test')
    // async test(client: Socket, position: any) {
    //     this.dataT.player1_paddle_x = 50;
    //       this.dataT.player1_paddle_y = position;
    //       this.dataT.player2_paddle_x = 150;
    //       this.dataT.player2_paddle_y = position;
    //       this.dataT.ball_x = 50;
    //       this.dataT.ball_y = 80;
    //     console.log(client.id + ' position ' + position)
    //     this.gateway.server.emit('game_postion', position)
    // }
      @UseGuards(WsJwtAuthGuard)
      @UsePipes(ValidationPipe)
      //@SubscribeMessage('game_postion')
      async sendPosition(room)
      {
          this.dataT.player1_paddle_x = 50;
          this.dataT.player1_paddle_y = 100;
          this.dataT.player2_paddle_x = 100;
          this.dataT.player2_paddle_y = 100;
          this.dataT.ball_x = 50;
          this.dataT.ball_y = 80;
          return this.gateway.server.to(room).emit('game_postion', this.dataT);
    }
}