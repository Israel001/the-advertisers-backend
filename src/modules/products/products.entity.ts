import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer, Store, StoreUsers } from '../users/users.entity';
import { MainCategory, SubCategory } from '../category/category.entity';

@Entity('products', { synchronize: false })
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

  @Column({ type: 'text' })
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

  @Column({ type: 'decimal', scale: 2, default: 0 })
  @AutoMap()
  price: number;

  @Column({ type: 'decimal', scale: 2, default: 0 })
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

  @ManyToOne(() => SubCategory, { eager: true })
  @AutoMap()
  category: SubCategory;

  @ManyToOne(() => MainCategory, { eager: true })
  @AutoMap()
  mainCategory: MainCategory;

  @DeleteDateColumn()
  deletedAt?: Date;
}

@Entity('reviews', { synchronize: false })
export class Reviews extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @ManyToOne(() => Customer)
  @AutoMap()
  customer: Customer;

  @ManyToOne(() => Products)
  @AutoMap()
  product: Products;

  @Column()
  @AutoMap()
  title: string;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  description: string;

  @Column({ default: 0 })
  @AutoMap()
  rating: number;

  @DeleteDateColumn()
  deletedAt?: Date;
}
