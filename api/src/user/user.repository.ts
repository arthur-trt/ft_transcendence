import { DataSource } from 'typeorm';
import { User } from './user.entity';
import { UserActivity } from './user_activity.entity';


export const UserRepository = (src: DataSource) => src.getRepository(User);
export const UserActivityRepository = (src: DataSource) => src.getRepository(UserActivity);
