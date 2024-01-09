import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/base/entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notification_templates', { synchronize: false })
export class NotificationTemplates extends BaseEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Column()
  @AutoMap()
  code: string;

  @Column({ type: 'text' })
  @AutoMap()
  body: string;
}
