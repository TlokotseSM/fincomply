import { Entity, Column, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';
import { Country } from './country.entity';
import { Contract } from './contract.entity';
import { Payment } from './payment.entity';
import { ComplianceDocument } from './compliance-document.entity';

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
  CONSULTANT = 'consultant',
}

@Entity('employees')
@Index(['email'], { unique: true })
@Index(['companyId', 'status'])
@Index(['countryCode'])
export class Employee extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'employee_number', length: 50, nullable: true })
  @Index()
  employeeNumber?: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'middle_name', length: 100, nullable: true })
  middleName?: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ length: 255, unique: true })
  @Index()
  email: string;

  @Column({ length: 50, nullable: true })
  phone?: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth?: Date;

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

  @Column({ name: 'hire_date', type: 'date' })
  @Index()
  hireDate: Date;

  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate?: Date;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  @Index()
  status: EmployeeStatus;

  @Column({
    name: 'employment_type',
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({ length: 100, nullable: true })
  department?: string;

  @Column({ name: 'job_title', length: 100, nullable: true })
  jobTitle?: string;

  @Column({ name: 'manager_id', type: 'uuid', nullable: true })
  managerId?: string;

  // Tax and compliance
  @Column({ name: 'tax_identifier', length: 100, nullable: true })
  taxIdentifier?: string;

  @Column({ name: 'social_security_number', length: 100, nullable: true })
  socialSecurityNumber?: string;

  @Column({ name: 'passport_number', length: 100, nullable: true })
  passportNumber?: string;

  @Column({ name: 'visa_type', length: 50, nullable: true })
  visaType?: string;

  @Column({ name: 'visa_expiry', type: 'date', nullable: true })
  visaExpiry?: Date;

  @Column({ name: 'work_permit_number', length: 100, nullable: true })
  workPermitNumber?: string;

  @Column({ name: 'work_permit_expiry', type: 'date', nullable: true })
  workPermitExpiry?: Date;

  // Banking
  @Column({ name: 'bank_name', length: 100, nullable: true })
  bankName?: string;

  @Column({ name: 'bank_account_number', length: 100, nullable: true })
  bankAccountNumber?: string;

  @Column({ name: 'bank_routing_number', length: 100, nullable: true })
  bankRoutingNumber?: string;

  @Column({ name: 'iban', length: 100, nullable: true })
  iban?: string;

  @Column({ name: 'swift_code', length: 20, nullable: true })
  swiftCode?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @ManyToOne(() => Company, company => company.employees)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Country, country => country.employees)
  @JoinColumn({ name: 'country_code', referencedColumnName: 'code' })
  country: Country;

  @OneToMany(() => Contract, contract => contract.employee)
  contracts: Contract[];

  @OneToMany(() => Payment, payment => payment.employee)
  payments: Payment[];

  @OneToMany(() => ComplianceDocument, document => document.employee)
  complianceDocuments: ComplianceDocument[];
}