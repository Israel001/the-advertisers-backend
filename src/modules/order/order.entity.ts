import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Currencies, OrderStatus, PaymentType } from 'src/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from '../users/users.entity';

@Entity('payments', { synchronize: true })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  transactionId: string;

  @Column()
  @AutoMap()
  status: string;

  @Column()
  @AutoMap()
  amount: number;

  @Column({ nullable: true })
  @AutoMap()
  channel: string;

  @Column('longtext')
  @AutoMap()
  metadata: string;

  @Column('enum', { enum: PaymentType })
  @AutoMap()
  type: PaymentType;

  @Column('enum', { enum: Currencies, default: Currencies.NGN })
  @AutoMap()
  currencies: Currencies;
}

@Entity('orders', { synchronize: true })
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => Customer)
  @AutoMap()
  customer: Customer;

  @Column('longtext')
  @AutoMap()
  details: string;

  @ManyToOne(() => Payment)
  @AutoMap()
  payment: Payment;

  @Column('enum', { enum: OrderStatus, default: OrderStatus.PENDING })
  @AutoMap()
  status: OrderStatus;
}
