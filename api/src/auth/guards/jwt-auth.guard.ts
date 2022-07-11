import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard, IAuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { Request } from 'express';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
