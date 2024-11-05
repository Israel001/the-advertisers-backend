import { AutoMap } from '@automapper/classes';
import { BaseEntity } from '../../base/entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sliders', { synchronize: false })
export class Slider extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  image: string;
}

@Entity('admin_roles', { synchronize: false })
export class AdminRoles extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 20 })
  @AutoMap()
  name: string;
}

@Entity('admin_users', { synchronize: true })
export class AdminUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column({ length: 150 })
  @AutoMap()
  fullName: string;

  @Column({ length: 50, unique: true })
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  password: string;

  @Column({ nullable: true })
  @AutoMap()
  phone: string;

  @ManyToOne(() => AdminRoles, { eager: true })
  role: AdminRoles;
}
