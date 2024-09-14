import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Currencies, OrderStatus, PaymentType } from 'src/types';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Customer } from '../users/users.entity';
import { AdminUser } from '../admin/admin.entities';

@Entity('payments', { synchronize: false })
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

  @Column()
  @AutoMap()
  reference: string;

  @ManyToOne(() => Customer)
  @AutoMap()
  customer: Customer;

  @Column()
  @AutoMap()
  stores: string;

  @Column('longtext')
  @AutoMap()
  details: string;

  @ManyToOne(() => Payment, { eager: true })
  @AutoMap()
  payment: Payment;

  @Column('enum', { enum: OrderStatus, default: OrderStatus.PENDING })
  @AutoMap()
  status: OrderStatus;

  @ManyToOne(() => AdminUser, { eager: true })
  @AutoMap()
  adminUser: AdminUser;
}
