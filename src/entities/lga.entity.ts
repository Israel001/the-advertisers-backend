import { AutoMap } from '@automapper/classes';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { State } from './state.entity';

@Entity('lga', { synchronize: false })
export class Lga extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  strippedName: string;

  @Column()
  @AutoMap()
  code: string;

  @ManyToOne(() => State, (state) => state.lgas, { lazy: true })
  state: State;
}
