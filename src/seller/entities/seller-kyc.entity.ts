import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

export enum SellerKycStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity('seller_kyc')
export class SellerKycEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string; // Foreign key to users.id

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  business_name: string; // Seller's business name

  @Column()
  pan_number: string; // PAN (Permanent Account Number)

  @Column({ nullable: true })
  gst_number: string; // GST number (nullable)

  @Column()
  bank_account: string; // Bank account number

  @Column()
  ifsc_code: string; // IFSC code for bank account

  @Column({ type: 'text' })
  address: string; // Business address

  @Column({
    type: 'enum',
    enum: SellerKycStatus,
  })
  status: SellerKycStatus; // KYC status: PENDING | APPROVED | REJECTED

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submitted_at: Date; // When KYC was submitted

  @Column({ type: 'timestamp', nullable: true })
  verified_at: Date; // When KYC was verified (nullable)

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
