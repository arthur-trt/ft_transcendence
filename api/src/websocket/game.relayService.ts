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

const speed = 7;
const velX = 5;
const velY = 5;

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

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
        
        
        async resetBall(){
            this.match.ball.x = 50;
            this.match.ball.y = 100;
            //this.match.ball.velocityX = -this.match.ball.velocityX;
            this.match.ball.velocity.x = 5;
            this.match.ball.velocity.y = 5;
            this.match.ball.speed = 7;
        }
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
    
	async startMatch(players) //set a boolean to know if a player is already on match
	{
		const [first] = players;
		const[, second] = players;
		console.log("starting match");
		var Match = await this.gameService.createMatch(first.data.user, second.data.user);
		first.join( Match.id);
		second.join( Match.id);
        this.MatchRooms.push( Match.id);
		this.gateway.server.to( Match.id).emit('game_countdownStart');
        //this.initGamePosition( Match.id);

	}

    

    @UseGuards(WsJwtAuthGuard)
    @UsePipes(ValidationPipe)
    @SubscribeMessage('game_settings')
    async updateCanvas(client : Socket)
    {
        

          
    }

    @UseGuards(WsJwtAuthGuard)
    @UsePipes(ValidationPipe)
    @SubscribeMessage('game_start')
    async initGamePosition(client : Socket)
    {
        this.match.speed = speed;
        this.match.ball.velocity.x = velX;
        this.match.ball.velocity.y = velY;
        this.match.ball.x = 50;
        this.match.ball.y = 80;
        this.match.player_1.x = 50;
        this.match.player_1.y = 100;
        this.match.player_2.x = 50;
        this.match.player_2.y = 150;
        this.sendPosition(client);
    };

//     @UseGuards(WsJwtAuthGuard)
//     @UsePipes(ValidationPipe)
//     async sendPosition(room)
//     {
//         this.dataT.player1_paddle_x = this.match.player_1.x;
//         this.dataT.player1_paddle_y = this.match.player_1.y;
//         this.dataT.player2_paddle_x = this.match.player_2.x;
//         this.dataT.player2_paddle_y = this.match.player_2.y;
//         this.dataT.ball_x = this.match.ball.x;
//         this.dataT.ball_y = this.match.ball.y;
//         return this.gateway.server.to(room).emit('game_postion', this.dataT);
// }

    // collision detection
 

    //watchmode if a friend is on a match (make a research ), join on watch mode
    // for (friend in matchhistory)
    //  if (matchhistory.stoptime == null)
    // join (matchhistory.uuid) (room)
    
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
          this.dataT.player1_paddle_x = 2;
          this.dataT.player1_paddle_y = 50;
          this.dataT.player2_paddle_x = 200-2;
          this.dataT.player2_paddle_y = 50;
          this.dataT.ball_x = 100;
          this.dataT.ball_y = 50;
          return this.gateway.server.to(room).emit('game_postion', this.dataT);
    }

}