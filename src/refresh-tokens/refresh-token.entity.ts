import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Entity('refresh_tokens')
@Index(['token'], { unique: true })
@Index(['user_id'])
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  user_id: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'varchar', unique: true })
  token: string;

  @Column({ type: 'varchar', nullable: true })
  device_id: string | null;

  @Column({ type: 'varchar', nullable: true })
  ip_address: string | null;

  @Column({ type: 'varchar', nullable: true })
  user_agent: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
