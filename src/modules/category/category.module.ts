import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MainCategory, SubCategory } from "./category.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtAuthConfiguration } from "src/config/configuration";
import { JwtModule } from "@nestjs/jwt";
import { JwtAuthConfig } from "src/config/types/jwt-auth.config";
import { CategoryController } from "./category.controller";
import { CategoryService } from "./category.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([MainCategory, SubCategory]),
    ConfigModule.forRoot({
      load: [JwtAuthConfiguration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule.forRoot({ load: [JwtAuthConfiguration] })],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<JwtAuthConfig>('jwtAuthConfig').secretKey,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}