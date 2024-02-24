import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Lga } from 'src/entities/lga.entity';
import { State } from 'src/entities/state.entity';
import { UserType } from 'src/types';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('customers', { synchronize: false })
export class Customer extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 150 })
  fullName: string;

  @Column({ length: 15, unique: true })
  @AutoMap()
  phone: string;

  @Column({ unique: true, nullable: true })
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  password: string;

  @ManyToOne(() => State, { eager: true })
  @AutoMap()
  state: State;

  @ManyToOne(() => Lga, { eager: true })
  @AutoMap()
  lga: Lga;

  @Column()
  @AutoMap()
  street: string;

  @Column({ nullable: true })
  @AutoMap()
  landmark: string;

  @Column({ nullable: true })
  @AutoMap()
  houseNo: string;

  @Column({ nullable: true })
  @AutoMap()
  address: string;

  @Column({ length: 15, enum: UserType })
  @AutoMap()
  type: UserType;

  @Column()
  @AutoMap()
  verified: boolean;

  @Column({ default: null, nullable: true })
  @AutoMap()
  lastLoggedIn: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}

@Entity('otp', { synchronize: false })
export class OTP extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 6 })
  @AutoMap()
  otp: string;

  @Column()
  @AutoMap()
  pinId: string;

  @Column({ default: null, nullable: true })
  @AutoMap()
  expiredAt: Date;
}

@Entity('store', { synchronize: false })
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 100 })
  @AutoMap()
  storeName: string;

  @ManyToOne(() => State, { eager: true })
  @AutoMap()
  state: State;

  @ManyToOne(() => Lga, { eager: true })
  @AutoMap()
  lga: Lga;

  @Column({ length: 50 })
  @AutoMap()
  street: string;

  @Column({ length: 50 })
  @AutoMap()
  landmark: string;

  @Column({ nullable: true })
  @AutoMap()
  houseNo: string;

  @Column({ nullable: true })
  @AutoMap()
  address: string;

  @Column({ length: 150 })
  @AutoMap()
  contactName: string;

  @Column({ length: 15 })
  @AutoMap()
  contactPhone: string;

  @Column({ length: 50 })
  @AutoMap()
  contactEmail: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}

@Entity('roles', { synchronize: false })
export class Roles extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 20 })
  @AutoMap()
  name: string;
}

@Entity('store_users', { synchronize: false })
export class StoreUsers extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 150 })
  @AutoMap()
  name: string;

  @Column({ length: 50 })
  @AutoMap()
  email: string;

  @Column({ length: 15 })
  @AutoMap()
  phone: string;

  @Column()
  @AutoMap()
  password: string;

  @Column({ length: 15, enum: UserType })
  @AutoMap()
  type: UserType;

  @Column()
  @AutoMap()
  verified: boolean;

  @Column()
  @AutoMap()
  invited: boolean;

  @Column({ default: null, nullable: true })
  @AutoMap()
  lastLoggedIn?: Date;

  @ManyToOne(() => Store, { eager: true })
  store: Store;

  @ManyToOne(() => Roles, { eager: true })
  role: Roles;

  @DeleteDateColumn()
  deletedAt?: Date;
}

@Entity('wishlist', { synchronize: false })
export class Wishlist extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column('longtext')
  @AutoMap()
  data: string;

  @ManyToOne(() => Customer)
  @AutoMap()
  customer: Customer;
}
