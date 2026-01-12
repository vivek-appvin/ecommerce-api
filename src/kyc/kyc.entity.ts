import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../users/user.entity';

export enum KycStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('kyc_documents')
export class KycEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true, name: 'user_id' })
  user_id: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // PAN Details
  @Column({ type: 'varchar', nullable: true })
  pan_number: string | null;

  @Column({ type: 'varchar', nullable: true })
  pan_document: string | null; // File path/URL

  @Column({ type: 'boolean', default: false })
  is_pan_verified: boolean;

  // GST Details
  @Column({ type: 'varchar', nullable: true })
  gst_number: string | null;

  @Column({ type: 'varchar', nullable: true })
  gst_document: string | null; // File path/URL

  @Column({ type: 'boolean', default: false })
  is_gst_verified: boolean;

  // Bank Details
  @Column({ type: 'varchar', nullable: true })
  bank_account_number: string | null;

  @Column({ type: 'varchar', nullable: true })
  bank_ifsc: string | null;

  @Column({ type: 'varchar', nullable: true })
  bank_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  bank_account_holder_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  bank_document: string | null; // Cancelled cheque or bank statement

  @Column({ type: 'boolean', default: false })
  is_bank_verified: boolean;

  // Business Details (for sellers)
  @Column({ type: 'varchar', nullable: true })
  business_name: string | null;

  @Column({ type: 'varchar', nullable: true })
  business_type: string | null; // Proprietorship, Partnership, etc.

  @Column({ type: 'varchar', nullable: true })
  business_address: string | null;

  // Verification Status
  @Column({ type: 'enum', enum: KycStatus, default: KycStatus.PENDING })
  status: KycStatus;

  @Column({ type: 'text', nullable: true })
  rejection_reason: string | null;

  @Column({ type: 'uuid', nullable: true, name: 'verified_by' })
  verified_by: string | null;

  @Column({ type: 'timestamp', nullable: true })
  verified_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
