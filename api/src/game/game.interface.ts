// import { ConsoleLogger, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { CreateMatchDto, endMatchDto } from 'src/dtos/match.dto';
    import { User } from 'src/user/user.entity';
    import { UserModule } from 'src/user/user.module';
// import { UserService } from 'src/user/user.service';
// import { Brackets, Repository } from 'typeorm';
 import { MatchHistory } from './game.entity';
// import { Socket, Server } from 'socket.io'


interface Player extends User
{
    pos_X: number;
    pos_Y: number;
    paddle: Paddle;
}

interface Ball
{
    pos_X: number;
    pos_Y: number;
}

interface Paddle
{
    pos_X: number;
    pos_Y: number;
}

interface Canvas
{
    width: string;
    height: string;
}

export interface Match
{
    Canvas;
    Ball;
    player_1: Player;
    player_2: Player;
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