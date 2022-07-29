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
import { Client } from "socket.io/dist/client";

const MIN_SPEED = 7;
const VEL_X= 5;
const VEL_Y = 5;

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
        
        
        // async resetBall(){
        //     this.match.ball.x = 50;
        //     this.match.ball.y = 100;
        //     this.match.ball.velocity.x = VEL_X;
        //     this.match.ball.velocity.y = VEL_Y;
        //     //this.match.ball.speed = 7;
        // }
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
        
        @UseGuards(WsJwtAuthGuard)
        @UsePipes(ValidationPipe)
        //@SubscribeMessage('game_start')
        async sendPosition(client: Socket)
        {
            console.log("ooooooooooooooo")
            console.log("game_start")
            this.dataT.player1_paddle_x = 2;
            this.dataT.player1_paddle_y = 50;
            this.dataT.player2_paddle_x = 200-2;
            this.dataT.player2_paddle_y = 50;
            this.dataT.ball_x = 100;
            this.dataT.ball_y = 50;
            this.gateway.server.to(this.match.id).emit('game_position', this.dataT);
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
            //console.log(this.match.id)
            this.match.id = Match.id;
            //this.initGamePosition();
        }

    
        // @UseGuards(WsJwtAuthGuard)
        // @UsePipes(ValidationPipe)
        // //@SubscribeMessage('game_start')
        // async initGamePosition()
        // {
        //     //this.match.ball.speed = 7;
        //     //this.match.ball.velocity.x = VEL_X;
        //     //this.match.ball.velocity.y = VEL_Y;
        //     this.match.ball.x = 50;
        //     this.match.ball.y = 100;
        //     this.match.player_1.x = 2;
        //     this.match.player_1.y = 50;
        //     this.match.player_2.x = 198;
        //     this.match.player_2.y = 50;
        //     //this.sendPosition(client);
        // };
        
        // @UseGuards(WsJwtAuthGuard)
        // @UsePipes(ValidationPipe)
        // @SubscribeMessage('game_start')
        // async sendPosition(client : Socket)
        // {
        //     console.log("game_start")
        //     this.dataT.player1_paddle_x = this.match.player_1.x;
        //     this.dataT.player1_paddle_y = this.match.player_1.y;
        //     this.dataT.player2_paddle_x = this.match.player_2.x;
        //     this.dataT.player2_paddle_y = this.match.player_2.y;
        //     this.dataT.ball_x = this.match.ball.x;
        //     this.dataT.ball_y = this.match.ball.y;
        //     console.log(this.match.id)
        //     this.gateway.server.to(this.match.id).emit('game_position', this.dataT);
        // }
    
    // collision detection
    
    
    //watchmode if a friend is on a match (make a research ), join on watch mode
    // for (friend in matchhistory)
    //  if (matchhistory.stoptime == null)
    // join (matchhistory.uuid) (room)
    

    // @UseGuards(WsJwtAuthGuard)
    // @UsePipes(ValidationPipe)
    // @SubscribeMessage('game_settings')
    // async updateCanvas(client : Socket)
    // {     
    // }
    
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

}