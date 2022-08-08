import { DataSource } from 'typeorm';
import { User } from './user.entity';


export const UserRepository = (src: DataSource) => src.getRepository(User);
