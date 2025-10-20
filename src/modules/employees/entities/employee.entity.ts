import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from 'src/shared/database/entities/base.entity';
import { EmployeeProfileEntity } from './employee-profile.entity';
import { EmployeeAuditLogEntity } from './employee-audit-log.entity';

export enum EmployeeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ON_LEAVE = 'on_leave',
  TERMINATED = 'terminated',
  SUSPENDED = 'suspended',
}

export enum EmployeeType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  INTERN = 'intern',
}

@Entity('employees')
@Index(['companyId', 'status'])
@Index(['countryId', 'status'])
@Index(['email'])
@Index(['employeeNumber'])
export class EmployeeEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  employeeNumber: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'date' })
  joiningDate: Date;

  @Column({ type: 'date', nullable: true })
  terminationDate: Date;

  @Column({ type: 'varchar', length: 50 })
  department: string;

  @Column({ type: 'varchar', length: 100 })
  jobTitle: string;

  @Column({ type: 'varchar', length: 20, default: EmployeeStatus.ACTIVE })
  status: EmployeeStatus;

  @Column({ type: 'varchar', length: 20, default: EmployeeType.FULL_TIME })
  employeeType: EmployeeType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  manager: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  salaryFrequency: string; // monthly, annual, hourly

  @Column({ type: 'text', nullable: true })
  notes: string;

  // Foreign key columns (store IDs directly)
  @Column({ type: 'uuid', nullable: false })
  companyId: string;

  @Column({ type: 'uuid', nullable: false })
  countryId: string;

  // Relations will be added after modules are created
  // @ManyToOne(() => CompanyEntity, (company) => company.employees)
  // @JoinColumn({ name: 'company_id' })
  // company: CompanyEntity;

  // @ManyToOne(() => CountryEntity)
  // @JoinColumn({ name: 'country_id' })
  // country: CountryEntity;

  @OneToOne(() => EmployeeProfileEntity, (profile) => profile.employee, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  @JoinColumn({ name: 'profile_id' })
  profile: EmployeeProfileEntity;

  @OneToMany(() => EmployeeAuditLogEntity, (log) => log.employee)
  auditLogs: EmployeeAuditLogEntity[];

  // Relations to be added later:
  // @OneToMany(() => ContractEntity, (contract) => contract.employee)
  // contracts: ContractEntity[];

  // @OneToMany(() => PaymentEntity, (payment) => payment.employee)
  // payments: PaymentEntity[];

  // @OneToMany(() => ComplianceDocumentEntity, (doc) => doc.employee)
  // complianceDocuments: ComplianceDocumentEntity[];

  // Helper methods
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === EmployeeStatus.ACTIVE;
  }
}