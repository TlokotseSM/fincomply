import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Employee } from './employee.entity';

export enum ContractStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
}

export enum PaymentFrequency {
  WEEKLY = 'weekly',
  BI_WEEKLY = 'bi_weekly',
  SEMI_MONTHLY = 'semi_monthly',
  MONTHLY = 'monthly',
  ANNUALLY = 'annually',
}

@Entity('contracts')
@Index(['employeeId', 'startDate'])
export class Contract extends BaseEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'contract_number', length: 100, unique: true })
  @Index()
  contractNumber: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({
    type: 'enum',
    enum: ContractStatus,
    default: ContractStatus.DRAFT,
  })
  @Index()
  status: ContractStatus;

  @Column({ name: 'job_title', length: 100 })
  jobTitle: string;

  @Column({ length: 100, nullable: true })
  department?: string;

  @Column({ name: 'base_salary', type: 'decimal', precision: 12, scale: 2 })
  baseSalary: number;

  @Column({ name: 'salary_currency', length: 3 })
  salaryCurrency: string;

  @Column({
    name: 'payment_frequency',
    type: 'enum',
    enum: PaymentFrequency,
    default: PaymentFrequency.MONTHLY,
  })
  paymentFrequency: PaymentFrequency;

  @Column({ name: 'hours_per_week', type: 'decimal', precision: 5, scale: 2, nullable: true })
  hoursPerWeek?: number;

  @Column({ name: 'vacation_days', type: 'int', default: 0 })
  vacationDays: number;

  @Column({ name: 'sick_days', type: 'int', default: 0 })
  sickDays: number;

  @Column({ type: 'jsonb', nullable: true })
  benefits?: Record<string, any>;

  @Column({ name: 'signing_bonus', type: 'decimal', precision: 12, scale: 2, default: 0 })
  signingBonus: number;

  @Column({ name: 'probation_period_months', type: 'int', default: 3 })
  probationPeriodMonths: number;

  @Column({ name: 'notice_period_days', type: 'int', default: 30 })
  noticePeriodDays: number;

  @Column({ name: 'contract_file_path', length: 500, nullable: true })
  contractFilePath?: string;

  @Column({ name: 'signed_date', type: 'date', nullable: true })
  signedDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Employee, employee => employee.contracts)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}