import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
}