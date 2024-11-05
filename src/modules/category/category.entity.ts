import { AutoMap } from '@automapper/classes';
import { BaseEntity } from '../../base/entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Products } from '../products/products.entity';

@Entity('main_categories', { synchronize: false })
export class MainCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  name: string;

  @Column({ nullable: true })
  @AutoMap()
  description: string;

  @Column({ nullable: true })
  @AutoMap()
  featuredImage: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}

@Entity('sub_categories', { synchronize: false })
export class SubCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  name: string;

  @Column({ nullable: true })
  @AutoMap()
  description: string;

  @Column({ nullable: true })
  @AutoMap()
  featuredImage: string;

  @ManyToOne(() => MainCategory, { eager: true })
  @AutoMap()
  mainCategory: MainCategory;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}