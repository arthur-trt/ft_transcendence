import { ConsoleLogger, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMatchDto, endMatchDto } from 'src/dtos/match.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Brackets, Repository } from 'typeorm';
import { MatchHistory } from './game.entity';
import { Socket, Server } from 'socket.io'


interface Player extends User
{
    pos_X: number;
    pos_Y: number;
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

interface Match
{
    Canvas;
    Paddle;
    Ball;
    player_1: Player;
    player_2: Player;
    watcher : User;
}