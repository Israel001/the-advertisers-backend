import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('main_categories')
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
}

@Entity('sub_categories')
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

  @ManyToOne(() => MainCategory)
  @AutoMap()
  mainCategory: MainCategory;
}