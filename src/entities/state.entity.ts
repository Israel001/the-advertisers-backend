import { AutoMap } from '@automapper/classes';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lga } from './lga.entity';

@Entity('state', { synchronize: false })
export class State extends BaseEntity {
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

  @OneToMany(() => Lga, (lga) => lga.state, {
    lazy: true,
  })
  lgas: Promise<Lga[]>;
}
