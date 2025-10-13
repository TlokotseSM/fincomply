import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Payment } from './payment.entity';
import { TaxRule, TaxType } from './tax-rule.entity';

@Entity('tax_liabilities')
@Index(['paymentId', 'taxType'])
export class TaxLiability extends BaseEntity {
  @Column({ name: 'payment_id', type: 'uuid' })
  paymentId: string;

  @Column({ name: 'tax_rule_id', type: 'uuid', nullable: true })
  taxRuleId?: string;

  @Column({
    name: 'tax_type',
    type: 'enum',
    enum: TaxType,
    enumName: 'tax_type_enum',
  })
  @Index()
  taxType: TaxType;

  @Column({ name: 'tax_name', length: 200 })
  taxName: string;

  @Column({ name: 'taxable_amount', type: 'decimal', precision: 12, scale: 2 })
  taxableAmount: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 12, scale: 2 })
  taxAmount: number;

  @Column({ name: 'tax_rate', type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate?: number;

  @Column({ name: 'employer_portion', type: 'decimal', precision: 12, scale: 2, default: 0 })
  employerPortion: number;

  @Column({ name: 'employee_portion', type: 'decimal', precision: 12, scale: 2, default: 0 })
  employeePortion: number;

  @Column({ name: 'year_to_date', type: 'decimal', precision: 15, scale: 2, default: 0 })
  yearToDate: number;

  @Column({ type: 'jsonb', nullable: true })
  calculation?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Payment, payment => payment.taxLiabilities)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @ManyToOne(() => TaxRule)
  @JoinColumn({ name: 'tax_rule_id' })
  taxRule?: TaxRule;
}