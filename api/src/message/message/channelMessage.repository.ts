import { DataSource } from 'typeorm';
import { channelMessage } from './channelMessage.entity';


export const cm = (src: DataSource) => src.getRepository(channelMessage);
