import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lga } from "src/entities/lga.entity";
import { State } from "src/entities/state.entity";
import { ListController } from "./lists.controller";
import { ListService } from "./lists.service";

@Module({
  imports: [TypeOrmModule.forFeature([State, Lga])],
  providers: [ListService],
  controllers: [ListController],
  exports: [ListService],
})
export class ListModule {}