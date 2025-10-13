import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { Payrun } from './payrun.entity';

@Entity('companies')
@Index(['registrationNumber'], { unique: true })
export class Company extends BaseEntity {
  @Column({ length: 200 })
  name: string;

  @Column({ name: 'legal_name', length: 200 })
  legalName: string;

  @Column({ name: 'registration_number', length: 100, unique: true })
  @Index()
  registrationNumber: string;

  @Column({ name: 'tax_id', length: 100, nullable: true })
  taxId?: string;

  @Column({ name: 'country_code', length: 2 })
  countryCode: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 100, nullable: true })
  state?: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode?: string;

  @Column({ length: 50, nullable: true })
  phone?: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ length: 200, nullable: true })
  website?: string;

  @Column({ name: 'primary_currency', length: 3, default: 'USD' })
  primaryCurrency: string;

  @Column({ name: 'fiscal_year_end', type: 'varchar', length: 5, default: '12-31' })
  fiscalYearEnd: string; // MM-DD format

  @Column({ default: true })
  active: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @OneToMany(() => Employee, employee => employee.company)
  employees: Employee[];

  @OneToMany(() => Payrun, payrun => payrun.company)
  payruns: Payrun[];
}