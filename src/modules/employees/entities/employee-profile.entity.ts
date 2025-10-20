import {
  Entity,
  Column,
  Index,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '@/shared/database/entities/base.entity';
import { EmployeeEntity } from './employee.entity';

@Entity('employee_profiles')
@Index(['employee'])
export class EmployeeProfileEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: true })
  nationalId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nationality: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyContactName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone: string;

  @Column({ type: 'json', nullable: true })
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    routingNumber: string;
    bankName: string;
  };

  @Column({ type: 'json', nullable: true })
  taxInformation: {
    taxId: string;
    taxFilingStatus: string;
    exemptions: number;
  };

  @OneToOne(() => EmployeeEntity, (employee) => employee.profile)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;
}