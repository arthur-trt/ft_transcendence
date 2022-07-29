import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { MatchHistory } from './game.entity';


interface Player extends User
{
    x: number;
    y: number;
}

interface velocity
{
    x: number;
    y: number;
}
interface Ball
{
    speed: number;
    x: number;
    y: number;
    velocity: velocity;
}

interface Canvas
{
    width: string;
    height: string;
}

export interface Match
{
    id: string;
    canvas: Canvas;
    ball :Ball;
    player_1: Player;
    player_2: Player;
    x: number;
    y: number;
    watcher : User;
   
}
export interface dataFront {
    player1_paddle_x: number;
    player1_paddle_y: number;
    player2_paddle_x: number;
    player2_paddle_y: number;
    ball_x: number;
    ball_y: number;
  }