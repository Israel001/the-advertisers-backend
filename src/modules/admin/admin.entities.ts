import { AutoMap } from "@automapper/classes";
import { BaseEntity } from "src/base/entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
