import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, Payment } from './order.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtAuthConfiguration,
  PaystackConfiguration,
} from 'src/config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthConfig } from 'src/config/types/jwt-auth.config';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { AdminUser } from '../admin/admin.entities';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Payment, AdminUser]),
    ConfigModule.forRoot({
      load: [JwtAuthConfiguration, PaystackConfiguration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [JwtAuthConfiguration] })],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtAuthConfig>('jwtAuthConfig').secretKey,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    SharedModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
