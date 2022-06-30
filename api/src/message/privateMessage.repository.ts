import { DataSource } from 'typeorm';
import { privateMessage } from './privateMessage.entity';


export const pm = (src: DataSource) => src.getRepository(privateMessage);
