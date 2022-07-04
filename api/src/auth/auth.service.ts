import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PassportModule } from 'passport-42';

@Injectable()
export class AuthService {
	constructor (
		@InjectRepository(User) private userRepo: Repository<User>
	) {}

}
