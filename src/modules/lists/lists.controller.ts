import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ListService } from "./lists.service";
import { ApiTags } from "@nestjs/swagger";

@Controller('lists')
@ApiTags('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get('states')
  fetchStates() {
    return this.listService.fetchStates();
  }

  @Get('lgas/:stateId')
  fetchLgas(@Param('stateId', ParseIntPipe) stateId: number) {
    return this.listService.fetchLgas(stateId);
  }
}