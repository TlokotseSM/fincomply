import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  FINANCE_MANAGER = 'finance_manager',
  PAYROLL_OFFICER = 'payroll_officer',
  HR_OFFICER = 'hr_officer',
  EMPLOYEE = 'employee',
  AUDITOR = 'auditor',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked',
  PENDING_VERIFICATION = 'pending_verification',
  SUSPENDED = 'suspended',
}

@Entity('users')
@Index(['email'], { unique: true })
@Index(['username'], { unique: true })
@Index(['status'])
@Index(['role'])
@Index(['createdAt'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude() // Exclude from responses
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'email_verified_at' })
  emailVerifiedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'last_login_at' })
  lastLoginAt: Date;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'phone_number' })
  @Exclude()
  phoneNumber: string;

  @Column({ type: 'boolean', default: false, name: 'two_factor_enabled' })
  twoFactorEnabled: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'two_factor_secret' })
  @Exclude()
  twoFactorSecret: string;

  @Column({ type: 'int', default: 0, name: 'failed_login_attempts' })
  failedLoginAttempts: number;

  @Column({ type: 'timestamp', nullable: true, name: 'locked_until' })
  lockedUntil: Date;

  @Column({ type: 'text', nullable: true, name: 'profile_picture' })
  profilePicture: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  // Methods
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2b$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isAccountLocked(): boolean {
    return this.status === UserStatus.LOCKED || (this.lockedUntil && this.lockedUntil > new Date());
  }

  canLogin(): boolean {
    return this.status === UserStatus.ACTIVE && !this.isAccountLocked();
  }
}