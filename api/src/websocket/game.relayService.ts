
import { forwardRef, Inject, Injectable, UseGuards} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsJwtAuthGuard } from 'src/auth/guards/ws-auth.guard';
import { UserService } from "src/user/user.service";
import { Ball, dataFront, Match, Names, Paddle, Scores } from "../game/game.interface";
import { GameService } from '../game/game.service';
import { WSServer } from "./wsserver.gateway";
import { ChatService } from './chat.service';
import { AchievementsService} from 'src/achievements/achievements.service';


function collision(b: Ball, p: Paddle) {
    const pad_top = p.y;
    const pad_bottom = p.y + p.height;
    const pad_left = p.x;
    const pad_right = p.x + p.width;

    const ball_top = b.y - b.radius;
    const ball_bottom = b.y + b.radius;
    const ball_left = b.x - b.radius;
    const ball_right = b.x + b.radius;

    //return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
    return pad_left < ball_right && pad_top < ball_bottom && pad_right > ball_left && pad_bottom > ball_top;
}

const VICTORY = 3;


@Injectable()
export class GameRelayService {
    constructor (
        protected readonly jwtService: JwtService,
        protected readonly userService: UserService,
        protected readonly gameService: GameService,
        protected readonly achievementService: AchievementsService,

        @Inject(forwardRef(() => ChatService)) protected readonly chatservice: ChatService,
        @Inject(forwardRef(() => WSServer)) protected gateway: WSServer
    ) {
    }

    protected players = new Set<Socket>();
    protected MatchRooms = [];
    static nb_room = 0;
    protected match = {} as Match;
    protected dataT = {} as dataFront;
    protected ball = {} as Ball;
    protected player1 = {} as Paddle;
    protected player1_pad2 = {} as Paddle;
    protected player2 = {} as Paddle;
    protected player2_pad2 = {} as Paddle;
    // protected p1_score = 0;
    // protected p2_score = 0;
    protected loop_stop: NodeJS.Timer;
    protected players_ready = 0;

    protected P1_MoveUP: boolean;
    protected P1_MoveDOWN: boolean;
    protected P2_MoveUP: boolean;
    protected P2_MoveDOWN: boolean;

    protected P1_MoveUP_pad2: boolean;
    protected P1_MoveDOWN_pad2: boolean;
    protected P2_MoveUP_pad2: boolean;
    protected P2_MoveDOWN_pad2: boolean;

    protected names = {} as Names;
    protected scores = {} as Scores;
    protected isBabyPong = false;

    protected friendID : Socket;


    /*  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
        ██░▄▀▄░█░▄▄▀█▄▄░▄▄██░▄▄▀██░██░██░▄▀▄░█░▄▄▀██░█▀▄█▄░▄██░▀██░██░▄▄░
        ██░█░█░█░▀▀░███░████░█████░▄▄░██░█░█░█░▀▀░██░▄▀███░███░█░█░██░█▀▀
        ██░███░█░██░███░████░▀▀▄██░██░██░███░█░██░██░██░█▀░▀██░██▄░██░▀▀▄
        ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀ */

    /**
     * @brief Random matchmaking
     * @param client
     * @param mode
     */
    @UseGuards(WsJwtAuthGuard)
    async getInQueue(client: Socket, mode) {
        if (!this.players.has(client))
            this.players.add(client);
        if (this.players.size == 2) {
            this.startMatch(this.players, mode);
        }
    }
    /**
     * @brief Matchmaking with a friend
     * @param client
     * @param friendId
     * @param mode
     */
    @UseGuards(WsJwtAuthGuard)
    async joinGame(client: Socket, data : {friendId : string, mode : string} ) {
        const friend = await this.userService.getUserByIdentifier(data.friendId)
        const playerSocket = await this.chatservice.findSocketId(friend);
        this.players.add(client);
        this.players.add(playerSocket);
        this.startMatch(this.players, data.mode);
    }

    @UseGuards(WsJwtAuthGuard)
    async InviteJoinGame(friendId : string)
    {
        const friend = await this.userService.getUserByIdentifier(friendId)
        const playerSocket = await this.chatservice.findSocketId(friend);
        if (!this.players.has(playerSocket) && await this.gameService.isInGame(friend) == false)
        {
            console.log("enter_room");
            this.gateway.server.to(playerSocket.id).emit('enter_room');
            return (true);
        }
        return (false);
    }

    @UseGuards(WsJwtAuthGuard)
    async go_to_game(client : Socket)
    {
        this.gateway.server.to(client.id).emit('enter_room');
    }

    /**
     * @brief Send an event to a friend to play with
     * @param client
     * @param friendId
     * @param mode
     */
     @UseGuards(WsJwtAuthGuard)
     async pendingInvite(client: Socket, data : {friendId : string, mode : string} ) {
         const friend = await this.userService.getUserByIdentifier(data.friendId)
         const friendSocket = await this.chatservice.findSocketId(friend);
         this.friendID = friendSocket;
        this.gateway.server.to(friendSocket.id).emit('accept invite', client.data.user.id, data.mode)
    }
    /**
     * @brief Quit the game when user changes tab
     * @param client
     */
    @UseGuards(WsJwtAuthGuard)
    async changeTab(client: Socket) {
		this.handleDisconnect(client);
    }

        /**
         * @brief Check if user is disconnected
         * @return 1 or 2 depends on who's disconnected
         */
        async handleDisconnect(client : Socket)
		{
			if (client == this.player1.socket || client == this.player2.socket)
				client == this.player1.socket ? this.set_winner(client, 2) : this.set_winner(client, 1);
			else if (this.players.has(client))
            {
                console.log("bonjour HD");
                this.gateway.server.to(client.id).emit('leave_queue');
                this.players.delete(client);
                if (this.friendID)
                {
                    console.log("deco friend");
                    this.gateway.server.to(this.friendID.id).emit('leave_queue');
                    this.players.delete(this.friendID);
                }
            }
        }

    async startMatch(players, mode) {
        const [first] = players;
        const [, second] = players;
        this.player1.socket = first;
        this.player2.active = true;
        this.player2.socket = second;
        this.player2.active = true;
        this.player1_pad2.socket = first;
        this.player2_pad2.socket = second;
        this.names.p1_name = this.player1.socket.data.user.name;
        this.names.p2_name = this.player2.socket.data.user.name;
        this.gateway.server.to(this.player1.socket.id).emit('set_names', this.names); //p1_name = left_name
        this.gateway.server.to(this.player2.socket.id).emit('set_names', this.names);
        players.clear();
        const Match = await this.gameService.createMatch(first.data.user, second.data.user);
        first.join(Match.id);
        second.join(Match.id);
        this.MatchRooms.push(Match.id);
        this.initPositions();
        if (mode == 2)
            this.isBabyPong = true;
        else if (mode == 1)
            this.isBabyPong = false;
        this.gateway.server.to(Match.id).emit('game_countdownStart', this.isBabyPong);
        this.match.id = Match.id;
    }

    async start_gameloop(client : Socket)
    {
        if (this.players_ready == 1)
        {
            this.players_ready++;
			await this.getOngoingMatches(client)
            this.loop_stop = setInterval(() => this.loop(client), 1000 / 60);
        }
        else
        	this.players_ready++;
    }

    async end_game(client : Socket)
    {
        clearInterval(this.loop_stop);
        this.player1.socket.leave(this.match.id)
        this.player2.socket.leave(this.match.id);
        this.players_ready = 0;
        await this.gameService.endMatch({ id: this.match.id, scoreUser1: this.scores.p1, scoreUser2: this.scores.p2 })
		await this.getOngoingMatches(client)

    }

    async set_winner(client :  Socket, winner : number) {
        if (winner == 2)
        {
            this.scores.p2 = VICTORY;
            this.gateway.server.to(this.match.id).emit('game_end', false);
        }
        else if (winner == 1)
        {
            this.scores.p1 = VICTORY;
            this.gateway.server.to(this.match.id).emit('game_end', true);
        }
		await this.end_game(client);
    }


    @UseGuards(WsJwtAuthGuard)
    async loop(client : Socket) {
        if (this.ball && this.player1 && this.player2) {
            // change the score of players, if the ball goes to the left "ball.x<0" p2 win, else if "ball.x > canvas.width" the p1 win
            if (this.ball.x - this.ball.radius < 0) {
                this.scores.p2++;
                this.gateway.server.to(this.match.id).emit('update_score', false);
            if (this.scores.p2 >= VICTORY) /*|| await this.handleDisconnect() == 1)*/ {
                this.set_winner(client, 2);
                return;
            }
            else
                this.resetBall();
            }
            else if (this.ball.x + this.ball.radius > 200) {
                this.scores.p1++;
                this.gateway.server.to(this.match.id).emit('update_score', true);
            if (this.scores.p1 >= VICTORY) /* || await this.handleDisconnect() == 2)*/ {
                this.set_winner(client, 1);
                return;
            }
            else
                this.resetBall();
            }

            this.calculateP1Pad();
            this.calculateP2Pad();

            // the ball has a velocity
            this.ball.x += this.ball.velocityX;
            this.ball.y += this.ball.velocityY;

            // when the ball collides with bottom and top walls we inverse the y velocity.
            if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > 100) {
                this.ball.velocityY = -this.ball.velocityY;
            }

            // we check if the paddle hit the user or the com paddle
            let player = (this.ball.x + this.ball.radius < 200 / 2) ? this.player1 : this.player2;

            if (this.isBabyPong === true) {
                if (player === this.player1) {
                    //Player1's side
                    player = (this.ball.x + this.ball.radius < this.player1_pad2.x) ? this.player1 : this.player1_pad2;
                }
                else {
                    //Player2's side
                    player = (this.ball.x + this.ball.radius > this.player2_pad2.x + this.player2_pad2.width) ? this.player2 : this.player2_pad2;
                }
            }

            // if the ball hits a paddle
            if (collision(this.ball, player)) {
                // we check where the ball hits the paddle
                let collidePoint = (this.ball.y - (player.y + player.height / 2));
                // normalize the value of collidePoint, we need to get numbers between -1 and 1.
                // -player.height/2 < collide Point < player.height/2
                collidePoint = collidePoint / (player.height / 2);

                // when the ball hits the top of a paddle we want the ball, to take a -45degees angle
                // when the ball hits the center of the paddle we want the ball to take a 0degrees angle
                // when the ball hits the bottom of the paddle we want the ball to take a 45degrees
                // Math.PI/4 = 45degrees
                const angleRad = (Math.PI / 4) * collidePoint;

                // change the X and Y velocity direction
                //const direction = (this.ball.x + this.ball.radius < 200 / 2) ? 1 : -1;
                const direction = (this.ball.velocityX >= 0) ? -1 : 1;
                this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
                this.ball.velocityY = this.ball.speed * Math.sin(angleRad);

                // speed up the ball everytime a paddle hits it.
                this.ball.speed += 0.5;
            }
            this.createData();
            this.gateway.server.to(this.match.id).emit('game_position', this.dataT);
        }
    }

    async createData() {
        this.dataT.player1_paddle_y = this.player1.y;
        this.dataT.player1_paddle2_y = this.player1_pad2.y;
        this.dataT.player2_paddle_y = this.player2.y;
        this.dataT.player2_paddle2_y = this.player2_pad2.y;
        this.dataT.ball_x = this.ball.x;
        this.dataT.ball_y = this.ball.y;
    }

    async initPositions() {
        //ball stats
        this.ball.radius = 1;
        this.ball.speed = 1;
        this.ball.velocityX = .5;
        this.ball.velocityY = .5;
        this.ball.x = 100;
        this.ball.y = 50;

        //player1 pad1 stats
        this.player1.x = 2;
        this.player1.y = 50;
        this.player1.height = 10;
        this.player1.width = 2;

        //player1 pad2 stats
        this.player1_pad2.x = 40;
        this.player1_pad2.y = 50;
        this.player1_pad2.height = 10;
        this.player1_pad2.width = 2;

        //player2 pad1 stats
        this.player2.x = 200 - 2 - 2; //P2 est decolle de 2px du mur en comprenant sa largeur (2px)
        this.player2.y = 50;
        this.player2.height = 10;
        this.player2.width = 2;

        //player2 pad2 stats
        this.player2_pad2.x = 200 - 40 - 2;
        this.player2_pad2.y = 50;
        this.player2_pad2.height = 10;
        this.player2_pad2.width = 2;

        this.scores.p1 = 0;
        this.scores.p2 = 0;
    }

    @UseGuards(WsJwtAuthGuard)
    async MoveUp(client: Socket) {
        if (client.id == this.player1.socket.id)
        this.P1_MoveUP = true;
        else if (client.id == this.player2.socket.id) {
            //manip visant a ameliorer l'ergonomie :
            //quand on est p2 les commandes sont inversees (i.e. w et s bougent la pallette droite)
            //ce qui peut etre tres ennuyant, donc si mode babyong et p2 on re-inverse
            if (this.isBabyPong === true)
                this.P2_MoveUP_pad2 = true;
            else
            this.P2_MoveUP = true;
        }
    }

    @UseGuards(WsJwtAuthGuard)
    async MoveDown(client: Socket) {
        if (client.id == this.player1.socket.id)
            this.P1_MoveDOWN = true;
        else if (client.id == this.player2.socket.id) {
            if (this.isBabyPong === true)
                this.P2_MoveDOWN_pad2 = true;
            else
                this.P2_MoveDOWN = true;
            }
    }

    @UseGuards(WsJwtAuthGuard)
    async StopMove(client: Socket) {
        if (client.id == this.player1.socket.id) {
            this.P1_MoveUP = false;
            this.P1_MoveDOWN = false;
        }
        else if (client.id == this.player2.socket.id) {
            if (this.isBabyPong === true) {
                this.P2_MoveDOWN_pad2 = false;
                this.P2_MoveUP_pad2 = false;
            }
            else {
                this.P2_MoveUP = false;
                this.P2_MoveDOWN = false;
            }
        }
    }

    @UseGuards(WsJwtAuthGuard)
    async MoveUp2(client: Socket) {
        if (client.id == this.player1_pad2.socket.id)
        this.P1_MoveUP_pad2 = true;
        else if (client.id == this.player2_pad2.socket.id)
            this.P2_MoveUP = true;
    }

    @UseGuards(WsJwtAuthGuard)
    async MoveDown2(client: Socket) {
        if (client.id == this.player1_pad2.socket.id)
            this.P1_MoveDOWN_pad2 = true;
            else if (client.id == this.player2_pad2.socket.id)
            this.P2_MoveDOWN = true;
    }

    @UseGuards(WsJwtAuthGuard)
    async StopMove2(client: Socket) {
        if (client.id == this.player1_pad2.socket.id) {
            this.P1_MoveUP_pad2 = false;
            this.P1_MoveDOWN_pad2 = false;
        }
        else if (client.id == this.player2_pad2.socket.id) {
            this.P2_MoveUP = false;
            this.P2_MoveDOWN = false;
        }
    }

    async calculateP1Pad() {
        if (this.P1_MoveUP === true) {
            if (this.player1.y - 2 < 0)
                this.player1.y = 0;
                else
                this.player1.y -= 2;
            }
        if (this.P1_MoveDOWN === true) {

            if (this.player1.y + 2 > 100 - this.player1.height)
            this.player1.y = 100 - this.player1.height;
            else
                this.player1.y += 2;
        }

        if (this.isBabyPong === true) {
            if (this.P1_MoveUP_pad2 === true) {
                if (this.player1_pad2.y - 2 < 0)
                this.player1_pad2.y = 0;
                else
                    this.player1_pad2.y -= 2;
            }
            if (this.P1_MoveDOWN_pad2 === true) {

                if (this.player1_pad2.y + 2 > 100 - this.player1.height)
                    this.player1_pad2.y = 100 - this.player1.height;
                else
                    this.player1_pad2.y += 2;
            }
        }
    }

    async calculateP2Pad() {
        if (this.P2_MoveUP === true) {
            if (this.player2.y - 2 < 0)
            this.player2.y = 0;
            else
            this.player2.y -= 2;
        }
        if (this.P2_MoveDOWN === true) {

            if (this.player2.y + 2 > 100 - this.player2.height)
            this.player2.y = 100 - this.player2.height;
            else
            this.player2.y += 2;
        }

        if (this.isBabyPong === true) {
            if (this.P2_MoveUP_pad2 === true) {
                if (this.player2_pad2.y - 2 < 0)
                this.player2_pad2.y = 0;
                else
                    this.player2_pad2.y -= 2;
            }
            if (this.P2_MoveDOWN_pad2 === true) {

                if (this.player2_pad2.y + 2 > 100 - this.player2.height)
                    this.player2_pad2.y = 100 - this.player2.height;
                    else
                    this.player2_pad2.y += 2;
            }
        }
    }

    async resetBall() {
        this.ball.speed = 1;
        this.ball.velocityX = .5;
        this.ball.velocityY = .5;
        this.ball.x = 100;
        this.ball.y = 50;
    }
    /**
     * WATCH MODE
     */

    async getOngoingMatches(client: Socket) {
        this.gateway.server.emit('ActivesMatches', await this.gameService.listGameOngoing());
    }

    async watchGame(client, gameId) {
        client.join(gameId);
        this.gateway.server.to(client.id).emit('set_names', this.names);
        this.gateway.server.to(client.id).emit('set_mode', this.isBabyPong);
        this.gateway.server.to(client.id).emit('set_scores', this.scores);
    }

    /**
     * MATCH HISTORY
     */
    async getMatchHistory(client: Socket) {
        const user = await this.chatservice.findUserbySocket(client.id);
       // this.gateway.server.to(client.id).emit('MatchHistory', await this.gameService.findMatchByUser(user));
        this.gateway.server.to(client.id).emit('MatchHistory', await this.gameService.getAllMatchesofUser(user));

    }

    /**
     * ACHIEVEMENTS
     */
    async sendAchievements(client: Socket)
    {
        const user = await this.chatservice.findUserbySocket(client.id);
        this.gateway.server.to(client.id).emit('Achievements', await this.achievementService.getAchievements(user));
        await this.achievementService.getAchievements(user);
    }
}
