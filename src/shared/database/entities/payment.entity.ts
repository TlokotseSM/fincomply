import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { Payrun } from './payrun.entity';
import { Currency } from './currency.entity';
import { TaxLiability } from './tax-liability.entity';

export enum PaymentStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum PaymentType {
  SALARY = 'salary',
  BONUS = 'bonus',
  COMMISSION = 'commission',
  REIMBURSEMENT = 'reimbursement',
  SEVERANCE = 'severance',
  OTHER = 'other',
}

@Entity('payments')
@Index(['employeeId', 'paymentDate'])
@Index(['payrunId'])
@Index(['status'])
export class Payment extends BaseEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'payrun_id', type: 'uuid', nullable: true })
  payrunId?: string;

  @Column({ name: 'payment_number', length: 100, unique: true })
  @Index()
  paymentNumber: string;

  @Column({
    name: 'payment_type',
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.SALARY,
  })
  paymentType: PaymentType;

  @Column({ name: 'payment_date', type: 'date' })
  @Index()
  paymentDate: Date;

  @Column({ name: 'period_start', type: 'date' })
  periodStart: Date;

  @Column({ name: 'period_end', type: 'date' })
  periodEnd: Date;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode: string;

  // Amounts
  @Column({ name: 'gross_amount', type: 'decimal', precision: 12, scale: 2 })
  grossAmount: number;

  @Column({ name: 'net_amount', type: 'decimal', precision: 12, scale: 2 })
  netAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'deductions_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  deductionsAmount: number;

  @Column({ name: 'reimbursements_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  reimbursementsAmount: number;

  // Hours and rates
  @Column({ name: 'hours_worked', type: 'decimal', precision: 8, scale: 2, nullable: true })
  hoursWorked?: number;

  @Column({ name: 'overtime_hours', type: 'decimal', precision: 8, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.DRAFT,
  })
  @Index()
  status: PaymentStatus;

  @Column({ type: 'jsonb', nullable: true })
  breakdown?: Record<string, any>; // Detailed breakdown of earnings and deductions

  @Column({ name: 'payslip_file_path', length: 500, nullable: true })
  payslipFilePath?: string;

  @Column({ name: 'payment_method', length: 50, default: 'bank_transfer' })
  paymentMethod: string;

  @Column({ name: 'payment_reference', length: 200, nullable: true })
  paymentReference?: string;

  @Column({ name: 'processed_at', type: 'timestamptz', nullable: true })
  processedAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Employee, employee => employee.payments)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Payrun, payrun => payrun.payments)
  @JoinColumn({ name: 'payrun_id' })
  payrun?: Payrun;

  @ManyToOne(() => Currency, currency => currency.payments)
  @JoinColumn({ name: 'currency_code', referencedColumnName: 'code' })
  currency: Currency;

  @OneToMany(() => TaxLiability, liability => liability.payment)
  taxLiabilities: TaxLiability[];
}