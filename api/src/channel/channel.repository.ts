import { DataSource } from 'typeorm';
import { Channel } from './channel.entity';


export const ChannelRepository = (src: DataSource) => src.getRepository(Channel);
