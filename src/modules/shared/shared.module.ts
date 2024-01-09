import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmtpConfiguration } from 'src/config/configuration';
import { NotificationTemplates } from 'src/entities/notification-templates.entity';
import { SharedService } from './shared.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NotificationTemplates]),
    ConfigModule.forRoot({
      load: [SmtpConfiguration],
    }),
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
