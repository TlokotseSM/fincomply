import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { BaseEntity } from '@/shared/database/entities/base.entity';


@Entity('employee_audit_logs')
@Index(['employee', 'createdAt'])
@Index(['action', 'createdAt'])
export class EmployeeAuditLogEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  field: string;

  @Column({ type: 'text', nullable: true })
  oldValue: string;

  @Column({ type: 'text', nullable: true })
  newValue: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  changedBy: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @ManyToOne(() => EmployeeEntity, (employee) => employee.auditLogs)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;
}