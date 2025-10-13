import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Employee } from './employee.entity';
import { Country } from './country.entity';

export enum DocumentType {
  VISA = 'visa',
  WORK_PERMIT = 'work_permit',
  PASSPORT = 'passport',
  TAX_FORM = 'tax_form',
  EMPLOYMENT_CONTRACT = 'employment_contract',
  NDA = 'nda',
  BACKGROUND_CHECK = 'background_check',
  CERTIFICATION = 'certification',
  OTHER = 'other',
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  UNDER_REVIEW = 'under_review',
}

@Entity('compliance_documents')
@Index(['employeeId', 'documentType'])
@Index(['expiryDate'])
@Index(['status'])
export class ComplianceDocument extends BaseEntity {
  @Column({ name: 'employee_id', type: 'uuid' })
  employeeId: string;

  @Column({ name: 'country_code', length: 2 })
  countryCode: string;

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: DocumentType,
  })
  @Index()
  documentType: DocumentType;

  @Column({ name: 'document_number', length: 200, nullable: true })
  documentNumber?: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'issue_date', type: 'date', nullable: true })
  issueDate?: Date;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  @Index()
  expiryDate?: Date;

  @Column({ name: 'issuing_authority', length: 200, nullable: true })
  issuingAuthority?: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  @Index()
  status: DocumentStatus;

  @Column({ name: 'file_path', length: 500, nullable: true })
  filePath?: string;

  @Column({ name: 'file_name', length: 255, nullable: true })
  fileName?: string;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize?: number;

  @Column({ name: 'mime_type', length: 100, nullable: true })
  mimeType?: string;

  @Column({ name: 'verified_by', type: 'uuid', nullable: true })
  verifiedBy?: string;

  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt?: Date;

  @Column({ name: 'reminder_sent_at', type: 'timestamptz', nullable: true })
  reminderSentAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  // Relations
  @ManyToOne(() => Employee, employee => employee.complianceDocuments)
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Country, country => country.complianceDocuments)
  @JoinColumn({ name: 'country_code', referencedColumnName: 'code' })
  country: Country;
}