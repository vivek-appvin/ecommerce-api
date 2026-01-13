import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

export enum OtpPurpose {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  VERIFY = 'VERIFY',
}

@Entity('otps')
export class OtpEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identifier: string; // Phone number or email address

  @Column()
  otp: string; // OTP code

  @Column({
    type: 'enum',
    enum: OtpPurpose,
  })
  purpose: OtpPurpose; // Purpose: LOGIN | REGISTER | VERIFY

  @Column({ type: 'timestamp' })
  expires_at: Date; // OTP expiration timestamp

  @Column({ default: false })
  is_used: boolean; // Whether OTP has been used

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
