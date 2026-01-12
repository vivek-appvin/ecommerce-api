import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum OtpType {
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
}

export enum OtpPurpose {
  REGISTRATION = 'REGISTRATION',
  LOGIN = 'LOGIN',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

@Entity('otps')
@Index(['identifier', 'type', 'purpose', 'is_used'], { unique: false })
export class OtpEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  identifier: string; // email or phone_number

  @Column({ type: 'enum', enum: OtpType })
  type: OtpType;

  @Column({ type: 'enum', enum: OtpPurpose })
  purpose: OtpPurpose;

  @Column({ type: 'varchar', length: 6 })
  code: string;

  @Column({ type: 'boolean', default: false })
  is_used: boolean;

  @Column({ type: 'boolean', default: false })
  is_verified: boolean;

  @Column({ type: 'timestamp' })
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
