import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from '../roles/role.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', unique: true })
  phone_number: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'uuid', name: 'role_id' })
  role_id: string;

  @ManyToOne(() => RoleEntity, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @Column({ type: 'boolean', default: false })
  is_phone_verified: boolean;

  @Column({ type: 'boolean', default: false })
  is_email_verified: boolean;

  // Seller-specific fields
  @Column({ type: 'boolean', default: false })
  is_seller_approved: boolean;

  @Column({ type: 'timestamp', nullable: true })
  seller_approved_at: Date | null;

  @Column({ type: 'uuid', nullable: true, name: 'approved_by' })
  approved_by: string | null;

  @Column({ type: 'boolean', default: false })
  is_kyc_verified: boolean;

  @Column({ type: 'varchar', nullable: true })
  first_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  last_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  profile_picture: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
