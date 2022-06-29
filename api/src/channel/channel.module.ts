import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelController } from './channel.controller';
import { ChannelService } from 'src/channel/channel.service';
import { Channel } from './channel.entity';
import { UserModule } from 'src/user/user.module';


@Module({
	imports: [TypeOrmModule.forFeature([Channel]), forwardRef(() => UserModule)], /* Forward ref is for circular dependancy see https://stackoverflow.com/questions/63572923/nest-cant-resolve-dependencies-of-authservice */
	providers: [ChannelService],
	controllers: [ChannelController],
	exports: [ChannelService]
})

export class ChannelModule {}
