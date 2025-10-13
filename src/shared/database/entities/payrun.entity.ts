import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { Payment } from './payment.entity';

export enum PayrunStatus {
  DRAFT = 'draft',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('payruns')
@Index(['companyId', 'periodStart', 'periodEnd'])
@Index(['status'])
export class Payrun extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'payrun_number', length: 100, unique: true })
  @Index()
  payrunNumber: string;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  @Column({ name: 'payment_date', type: 'date' })
  paymentDate: Date;

  @Column({
    type: 'enum',
    enum: PayrunStatus,
    default: PayrunStatus.DRAFT,
  })
  @Index()
  status: PayrunStatus;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode: string;

  @Column({ name: 'total_gross', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalGross: number;

  @Column({ name: 'total_net', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalNet: number;

  @Column({ name: 'total_tax', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalTax: number;

  @Column({ name: 'total_deductions', type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDeductions: number;

  @Column({ name: 'employee_count', type: 'int', default: 0 })
  employeeCount: number;

  @Column({ name: 'approved_by', type: 'uuid', nullable: true })
  approvedBy?: string;

  @Column({ name: 'approved_at', type: 'timestamptz', nullable: true })
  approvedAt?: Date;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Relations
  @ManyToOne(() => Company, company => company.payruns)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Payment, payment => payment.payrun)
  payments: Payment[];
}