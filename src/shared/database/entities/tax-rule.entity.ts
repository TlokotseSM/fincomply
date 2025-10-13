import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Country } from './country.entity';

export enum TaxType {
  INCOME_TAX = 'income_tax',
  SOCIAL_SECURITY = 'social_security',
  MEDICARE = 'medicare',
  UNEMPLOYMENT = 'unemployment',
  PENSION = 'pension',
  VAT = 'vat',
  CORPORATE_TAX = 'corporate_tax',
  WITHHOLDING_TAX = 'withholding_tax',
  OTHER = 'other',
}

export enum TaxCalculationMethod {
  PERCENTAGE = 'percentage',
  BRACKETS = 'brackets',
  FLAT_RATE = 'flat_rate',
  FORMULA = 'formula',
}

@Entity('tax_rules')
@Index(['countryCode', 'taxType', 'effectiveFrom'])
export class TaxRule extends BaseEntity {
  @Column({ name: 'country_code', length: 2 })
  countryCode: string;

  @Column({ length: 200 })
  name: string;

  @Column({
    name: 'tax_type',
    type: 'enum',
    enum: TaxType,
    enumName: 'tax_type_enum',
  })
  @Index()
  taxType: TaxType;

  @Column({
    name: 'calculation_method',
    type: 'enum',
    enum: TaxCalculationMethod,
    enumName: 'tax_calculation_method_enum',
  })
  calculationMethod: TaxCalculationMethod;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  rate?: number;

  @Column({ type: 'jsonb', nullable: true })
  brackets?: Array<{
    min: number;
    max: number | null;
    rate: number;
  }>;

  @Column({ type: 'text', nullable: true })
  formula?: string;

  @Column({ name: 'threshold_amount', type: 'decimal', precision: 12, scale: 2, nullable: true })
  thresholdAmount?: number;

  @Column({ name: 'annual_cap', type: 'decimal', precision: 12, scale: 2, nullable: true })
  annualCap?: number;

  @Column({ name: 'effective_from', type: 'date' })
  effectiveFrom: Date;

  @Column({ name: 'effective_to', type: 'date', nullable: true })
  effectiveTo?: Date;

  @Column({ name: 'applies_to_employer', default: false })
  appliesToEmployer: boolean;

  @Column({ name: 'applies_to_employee', default: true })
  appliesToEmployee: boolean;

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Relations
  @ManyToOne(() => Country, country => country.taxRules)
  @JoinColumn({ name: 'country_code', referencedColumnName: 'code' })
  country: Country;
}