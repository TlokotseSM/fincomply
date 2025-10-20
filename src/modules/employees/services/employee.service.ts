import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity, EmployeeStatus, EmployeeType } from '../entities/employee.entity';
import { EmployeeProfileEntity } from '../entities/employee-profile.entity';
import { EmployeeAuditLogEntity } from '../entities/employee-audit-log.entity';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { SearchEmployeeDto } from '../dtos/search-employee.dto';
import { generateEmployeeNumber } from 'src/shared/utils/generators';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(EmployeeProfileEntity)
    private profileRepo: Repository<EmployeeProfileEntity>,
    @InjectRepository(EmployeeAuditLogEntity)
    private auditRepo: Repository<EmployeeAuditLogEntity>,
  ) {}

  async create(dto: CreateEmployeeDto, userId: string): Promise<EmployeeEntity> {
    // Check if email already exists
    const existingEmployee = await this.employeeRepo.findOne({
      where: { email: dto.email },
    });
    if (existingEmployee) {
      throw new ConflictException('Email already in use');
    }

    // Validate age (must be 18+)
    const age = this.calculateAge(dto.dateOfBirth);
    if (age < 18) {
      throw new BadRequestException('Employee must be at least 18 years old');
    }

    // Create employee profile
    const profile = this.profileRepo.create(dto.profile || {});
    await this.profileRepo.save(profile);

    // Generate unique employee number
    const employeeNumber = await this.generateUniqueEmployeeNumber();

    // Create employee
    const employee = this.employeeRepo.create({
      ...dto,
      employeeNumber,
      status: EmployeeStatus.ACTIVE,
      profile,
    });

    await this.employeeRepo.save(employee);

    // Log audit trail
    await this.logAudit(
      employee.id,
      'EMPLOYEE_CREATED',
      null,
      null,
      employee.getFullName(),
      userId,
      'New employee created',
    );

    return employee;
  }

  async update(
    id: string,
    dto: UpdateEmployeeDto,
    userId: string,
  ): Promise<EmployeeEntity> {
    const employee = await this.findById(id);

    // Track changes for audit log
    const changes: { field: string; oldValue: string; newValue: string }[] = [];

    // Update fields
    Object.keys(dto).forEach((key) => {
      if (dto[key] !== undefined && employee[key] !== dto[key]) {
        changes.push({
          field: key,
          oldValue: String(employee[key]),
          newValue: String(dto[key]),
        });
        employee[key] = dto[key];
      }
    });

    if (changes.length > 0) {
      await this.employeeRepo.save(employee);

      // Log each change
      for (const change of changes) {
        await this.logAudit(
          id,
          'EMPLOYEE_UPDATED',
          change.field,
          change.oldValue,
          change.newValue,
          userId,
          'Employee information updated',
        );
      }
    }

    return employee;
  }

  async updateStatus(
    id: string,
    status: EmployeeStatus,
    reason: string,
    userId: string,
  ): Promise<EmployeeEntity> {
    const employee = await this.findById(id);
    const oldStatus = employee.status;

    employee.status = status;
    if (status === EmployeeStatus.TERMINATED) {
      employee.terminationDate = new Date();
    }

    await this.employeeRepo.save(employee);

    await this.logAudit(
      id,
      'STATUS_CHANGED',
      'status',
      oldStatus,
      status,
      userId,
      reason,
    );

    return employee;
  }

  async delete(id: string, userId: string): Promise<void> {
    const employee = await this.findById(id);

    await this.logAudit(
      id,
      'EMPLOYEE_DELETED',
      null,
      null,
      employee.getFullName(),
      userId,
      'Employee record deleted',
    );

    await this.employeeRepo.softDelete(id);
  }

  async findById(id: string): Promise<EmployeeEntity> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: ['profile', 'auditLogs'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async findByEmail(email: string): Promise<EmployeeEntity> {
    const employee = await this.employeeRepo.findOne({
      where: { email },
      relations: ['profile'],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with email ${email} not found`);
    }

    return employee;
  }

  async search(dto: SearchEmployeeDto): Promise<{
    items: EmployeeEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query = this.employeeRepo.createQueryBuilder('employee');

    // Apply filters
    if (dto.keyword) {
      query.where(
        '(LOWER(employee.firstName) LIKE LOWER(:keyword) OR LOWER(employee.lastName) LIKE LOWER(:keyword) OR LOWER(employee.email) LIKE LOWER(:keyword) OR LOWER(employee.employeeNumber) LIKE LOWER(:keyword))',
        { keyword: `%${dto.keyword}%` },
      );
    }

    if (dto.status) {
      query.andWhere('employee.status = :status', { status: dto.status });
    }

    if (dto.employeeType) {
      query.andWhere('employee.employeeType = :employeeType', {
        employeeType: dto.employeeType,
      });
    }

    if (dto.department) {
      query.andWhere('employee.department = :department', {
        department: dto.department,
      });
    }

    // Use companyId column instead of company relationship
    if (dto.companyId) {
      query.andWhere('employee.companyId = :companyId', {
        companyId: dto.companyId,
      });
    }

    // Use countryId column instead of country relationship
    if (dto.countryId) {
      query.andWhere('employee.countryId = :countryId', {
        countryId: dto.countryId,
      });
    }

    // Pagination
    const skip = (dto.page - 1) * dto.limit;
    query.skip(skip).take(dto.limit);

    // Sorting
    query.orderBy(`employee.${dto.sortBy}`, dto.sortOrder);

    // Load relationships that exist
    query.leftJoinAndSelect('employee.profile', 'profile');

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page: dto.page,
      limit: dto.limit,
      totalPages: Math.ceil(total / dto.limit),
    };
  }

  async bulkUpdateStatus(
    employeeIds: string[],
    status: EmployeeStatus,
    reason: string,
    userId: string,
  ): Promise<{ updated: number; failed: number }> {
    let updated = 0;
    let failed = 0;

    for (const id of employeeIds) {
      try {
        await this.updateStatus(id, status, reason, userId);
        updated++;
      } catch {
        failed++;
      }
    }

    return { updated, failed };
  }

  async getAuditTrail(
    employeeId: string,
    limit: number = 50,
  ): Promise<EmployeeAuditLogEntity[]> {
    return this.auditRepo.find({
      where: { employee: { id: employeeId } },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['employee'],
    });
  }

  async getEmployeesByDepartment(
    department: string,
  ): Promise<EmployeeEntity[]> {
    return this.employeeRepo.find({
      where: { department, status: EmployeeStatus.ACTIVE },
      relations: ['profile'],
      order: { firstName: 'ASC' },
    });
  }

  async getEmployeesByCountry(countryId: string): Promise<EmployeeEntity[]> {
    return this.employeeRepo.find({
      where: { countryId, status: EmployeeStatus.ACTIVE },
      relations: ['profile'],
      order: { firstName: 'ASC' },
    });
  }

  async getEmployeesByCompany(companyId: string): Promise<EmployeeEntity[]> {
    return this.employeeRepo.find({
      where: { companyId, status: EmployeeStatus.ACTIVE },
      relations: ['profile'],
      order: { department: 'ASC', firstName: 'ASC' },
    });
  }

  async getActiveEmployeeCount(companyId: string): Promise<number> {
    return this.employeeRepo.count({
      where: {
        companyId,
        status: EmployeeStatus.ACTIVE,
      },
    });
  }

  async getTotalPayroll(companyId: string): Promise<number> {
    const result = await this.employeeRepo
      .createQueryBuilder('e')
      .select('SUM(CAST(e.salary AS DECIMAL))', 'totalSalary')
      .where('e.companyId = :companyId AND e.status = :status', {
        companyId,
        status: EmployeeStatus.ACTIVE,
      })
      .getRawOne();

    return result?.totalSalary || 0;
  }

  async getEmployeesByStatus(
    companyId: string,
    status: EmployeeStatus,
  ): Promise<EmployeeEntity[]> {
    return this.employeeRepo.find({
      where: { companyId, status },
      relations: ['profile'],
      order: { firstName: 'ASC' },
    });
  }

  async searchByName(companyId: string, name: string): Promise<EmployeeEntity[]> {
    return this.employeeRepo
      .createQueryBuilder('e')
      .where('e.companyId = :companyId', { companyId })
      .andWhere(
        '(LOWER(e.firstName) LIKE LOWER(:name) OR LOWER(e.lastName) LIKE LOWER(:name))',
        { name: `%${name}%` },
      )
      .leftJoinAndSelect('e.profile', 'profile')
      .orderBy('e.firstName', 'ASC')
      .addOrderBy('e.lastName', 'ASC')
      .getMany();
  }

  // Helper methods
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
    ) {
      age--;
    }

    return age;
  }

  private async generateUniqueEmployeeNumber(): Promise<string> {
    let employeeNumber: string;
    let exists = true;

    while (exists) {
      employeeNumber = generateEmployeeNumber();
      const employee = await this.employeeRepo.findOne({
        where: { employeeNumber },
      });
      exists = !!employee;
    }

    return employeeNumber;
  }

  private async logAudit(
    employeeId: string,
    action: string,
    field: string | null,
    oldValue: string | null,
    newValue: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    const log = this.auditRepo.create({
      employee,
      action,
      field,
      oldValue,
      newValue,
      changedBy: userId,
      reason,
    });

    await this.auditRepo.save(log);
  }
}