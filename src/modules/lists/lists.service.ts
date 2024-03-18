import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Lga } from "src/entities/lga.entity";
import { State } from "src/entities/state.entity";
import { Repository } from "typeorm";

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Lga) private readonly lgaRepository: Repository<Lga>,
  ) { }

  async fetchStates() {
    return this.stateRepository.find();
  }

  async fetchLgas(stateId: number) {
    return this.lgaRepository.find({
      where: { state: { id: stateId } },
    });
  }
}