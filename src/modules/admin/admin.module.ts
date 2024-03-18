import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUser, Slider } from './admin.entities';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthConfiguration } from 'src/config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthConfig } from 'src/config/types/jwt-auth.config';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AdminLocalStrategy } from './strategies/local.strategy';
import { AdminJwtStrategy } from './strategies/jwt.strategy';
import { Customer, Store, StoreUsers } from '../users/users.entity';
import { ProductsModule } from '../products/products.module';
import { OrderModule } from '../order/order.module';
import { Products } from '../products/products.entity';
import { Order } from '../order/order.entity';
import { MainCategory, SubCategory } from '../category/category.entity';
import { CategoryModule } from '../category/category.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdminUser,
      Customer,
      Store,
      StoreUsers,
      Products,
      Order,
      Slider,
      MainCategory,
      SubCategory,
    ]),
    PassportModule,
    ConfigModule.forRoot({ load: [JwtAuthConfiguration] }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [JwtAuthConfiguration] })],
      useFactory: (configSevice: ConfigService) => ({
        secret: configSevice.get<JwtAuthConfig>('jwtAuthConfig').adminSecretKey,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
    OrderModule,
    CategoryModule,
    UsersModule
  ],
  providers: [AdminService, AdminLocalStrategy, AdminJwtStrategy],
  controllers: [AdminController],
})
export class AdminModule {}
