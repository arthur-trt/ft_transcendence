import { ConsoleLogger, HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMatchDto, endMatchDto } from 'src/dtos/match.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Brackets, Repository } from 'typeorm';
import { MatchHistory } from './game.entity';
import { Socket, Server } from 'socket.io'

interface Match
{
    width: string;
    height: string;
    player_1: User;
    player_2: User;
    // player_1PaddleX: number;
    // player_1PaddleY: number;
    // posBall_x: number;
    // posBall_y: number;
}