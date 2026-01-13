import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { RoleEntity } from '../../roles/role.entity';

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  full_name: string; // User's full name

  @Column({ unique: true, nullable: true })
  email: string; // User's email address (unique, nullable)

  @Column({ unique: true, nullable: true })
  phone_number: string; // User's phone number (unique, nullable)

  @Column()
  password: string; // Hashed password

  @Column()
  role_id: string; // Foreign key to roles.id

  @ManyToOne(() => RoleEntity, { eager: false })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column({
    type: 'enum',
    enum: UserStatus,
  })
  status: UserStatus; // User account status: ACTIVE | PENDING | BLOCKED

  @Column({ default: false })
  is_phone_verified: boolean; // Whether phone number is verified

  @Column({ default: false })
  is_email_verified: boolean; // Whether email is verified

  @Column({ type: 'timestamp', nullable: true })
  last_login_at: Date; // Last login timestamp (nullable)

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
