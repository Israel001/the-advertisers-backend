import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store, StoreUsers } from '../users/users.entity';

@Entity('products', { synchronize: true })
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  name: string;

  @Column()
  @AutoMap()
  featuredImage: string;

  @Column()
  @AutoMap()
  images: string;

  @Column({ default: 0 })
  @AutoMap()
  quantity: number;

  @Column()
  @AutoMap()
  outOfStock: boolean;

  @Column()
  @AutoMap()
  published: boolean;

  @Column({ type: 'float' })
  @AutoMap()
  price: number;

  @Column({ type: 'float' })
  @AutoMap()
  discountPrice: number;

  @Column({ type: 'text' })
  @AutoMap()
  description: string;

  @Column()
  @AutoMap()
  brand: string;

  @Column({ default: 0 })
  @AutoMap()
  avgRating: number;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  attributes: string;

  @ManyToOne(() => Store)
  @AutoMap()
  store: Store;

  @ManyToOne(() => StoreUsers, { eager: true })
  @AutoMap()
  createdBy: StoreUsers;

  @ManyToOne(() => StoreUsers)
  @AutoMap()
  lastUpdatedBy: StoreUsers;

  @DeleteDateColumn()
  deletedAt?: Date;
}
