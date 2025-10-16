import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/shared/database/entities/user.entity';

export enum AuditAction {
  // Auth
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGIN_2FA_REQUIRED = 'LOGIN_2FA_REQUIRED',
  LOGOUT = 'LOGOUT',
  USER_REGISTERED = 'USER_REGISTERED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET = 'PASSWORD_RESET',

  // User Management
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  USER_ACTIVATED = 'USER_ACTIVATED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',

  // System
  CONFIGURATION_CHANGED = 'CONFIGURATION_CHANGED',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
  SYSTEM_ERROR = 'SYSTEM_ERROR',

  // Data
  DATA_ACCESSED = 'DATA_ACCESSED',
  DATA_CREATED = 'DATA_CREATED',
  DATA_UPDATED = 'DATA_UPDATED',
  DATA_DELETED = 'DATA_DELETED',
  DATA_EXPORTED = 'DATA_EXPORTED',
}

@Entity('audit_logs')
@Index(['userId'])
@Index(['action'])
@Index(['entity'])
@Index(['entityId'])
@Index(['status'])
@Index(['createdAt'])
@Index(['userId', 'createdAt'])
@Index(['action', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', lazy: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ type: 'varchar', length: 50 })
  action: AuditAction;

  @Column({ type: 'varchar', length: 50 })
  entity: string;

  @Column({ type: 'uuid', nullable: true })
  entityId: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: 'success' | 'failed' | 'pending';

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  method: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  endpoint: string;

  @CreateDateColumn()
  createdAt: Date;
}