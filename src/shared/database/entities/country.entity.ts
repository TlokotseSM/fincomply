import { Entity, Column, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Currency } from './currency.entity';
import { Employee } from './employee.entity';
import { TaxRule } from './tax-rule.entity';
import { ComplianceDocument } from './compliance-document.entity';

@Entity('countries')
@Index(['code'], { unique: true })
export class Country extends BaseEntity {
  @Column({ length: 2, unique: true })
  @Index()
  code: string; // ISO 3166-1 alpha-2 code (e.g., 'US', 'GB', 'ZA')

  @Column({ length: 3, unique: true })
  iso3: string; // ISO 3166-1 alpha-3 code (e.g., 'USA', 'GBR', 'ZAF')

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'official_name', length: 200, nullable: true })
  officialName?: string;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode: string;

  @Column({ type: 'jsonb', nullable: true })
  timezone?: string[];

  @Column({ name: 'phone_code', length: 10, nullable: true })
  phoneCode?: string;

  @Column({ default: true })
  active: boolean;

  // Labor law and compliance metadata
  @Column({ name: 'min_wage', type: 'decimal', precision: 12, scale: 2, nullable: true })
  minWage?: number;

  @Column({ name: 'standard_work_hours', type: 'int', default: 40 })
  standardWorkHours: number;

  @Column({ name: 'overtime_threshold', type: 'int', default: 40 })
  overtimeThreshold: number;

  @Column({ type: 'jsonb', nullable: true })
  holidays?: string[]; // ISO date strings

  @Column({ name: 'tax_year_start', type: 'varchar', length: 5, default: '01-01' })
  taxYearStart: string; // MM-DD format

  @Column({ name: 'requires_work_permit', default: true })
  requiresWorkPermit: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Currency, currency => currency.countries)
  @JoinColumn({ name: 'currency_code', referencedColumnName: 'code' })
  currency: Currency;

  @OneToMany(() => Employee, employee => employee.country)
  employees: Employee[];

  @OneToMany(() => TaxRule, taxRule => taxRule.country)
  taxRules: TaxRule[];

  @OneToMany(() => ComplianceDocument, document => document.country)
  complianceDocuments: ComplianceDocument[];
}