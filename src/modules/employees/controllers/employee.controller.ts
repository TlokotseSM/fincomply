import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { EmployeeService } from '../services/employee.service';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';
import { SearchEmployeeDto } from '../dtos/search-employee.dto';
import { EmployeeDto } from '../dtos/employee.dto';
import { EmployeeStatus } from '../entities/employee.entity';
import { UserRole } from 'src/shared/database/entities/user.entity';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  /**
   * Create a new employee record
   * Requires ADMIN or HR_OFFICER role
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.HR_OFFICER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new employee',
    description: 'Create a new employee record with personal and employment details',
  })
  @ApiBody({
    type: CreateEmployeeDto,
    description: 'Employee data to create',
    examples: {
      example1: {
        summary: 'Basic Employee',
        value: {
          firstName: 'Thapelo',
          lastName: 'Maleka',
          email: 'thapelo.maleka@company.com',
          phoneNumber: '+1234567890',
          dateOfBirth: '1990-01-15',
          joiningDate: '2023-01-01',
          department: 'Engineering',
          jobTitle: 'Senior Developer',
          employeeType: 'full_time',
          salary: 75000,
          salaryFrequency: 'annual',
          companyId: 'uuid-here',
          countryId: 'uuid-here',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Employee created successfully',
    type: EmployeeDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiConflictResponse({ description: 'Email already exists' })
  async create(
    @Body() dto: CreateEmployeeDto,
    @CurrentUser('id') userId: string,
  ): Promise<EmployeeDto> {
    const employee = await this.employeeService.create(dto, userId);
    return this.mapToDto(employee);
  }

  /**
   * Search and filter employees with pagination
   * Supports filtering by keyword, status, type, department, company, and country
   */
  @Get()
  @Roles(
    UserRole.ADMIN,
    UserRole.HR_OFFICER,
    UserRole.EMPLOYEE,
    UserRole.FINANCE_MANAGER,
  )
  @ApiOperation({
    summary: 'Search and filter employees',
    description:
      'Get a paginated list of employees with optional filters and search',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Search by name, email, or employee number',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['active', 'inactive', 'on_leave', 'terminated', 'suspended'],
    description: 'Filter by employee status',
  })
  @ApiQuery({
    name: 'employeeType',
    required: false,
    description: 'Filter by employment type (full_time, part_time, contract, intern)',
  })
  @ApiQuery({
    name: 'department',
    required: false,
    description: 'Filter by department',
  })
  @ApiQuery({
    name: 'companyId',
    required: false,
    description: 'Filter by company ID',
  })
  @ApiQuery({
    name: 'countryId',
    required: false,
    description: 'Filter by country ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 20, max: 100)',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Field to sort by (default: createdAt)',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order (default: DESC)',
  })
  @ApiOkResponse({
    description: 'Employees retrieved successfully',
    schema: {
      example: {
        items: [],
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0,
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async search(@Query() dto: SearchEmployeeDto): Promise<{
    items: EmployeeDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const result = await this.employeeService.search(dto);
    return {
      ...result,
      items: result.items.map((e) => this.mapToDto(e)),
    };
  }

  /**
   * Get a specific employee by ID
   */
  @Get(':id')
  @Roles(
    UserRole.ADMIN,
    UserRole.HR_OFFICER,
    UserRole.EMPLOYEE,
    UserRole.FINANCE_MANAGER,
  )
  @ApiOperation({
    summary: 'Get employee by ID',
    description: 'Retrieve detailed information for a specific employee',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Employee ID (UUID)',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Employee retrieved successfully',
    type: EmployeeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async findById(@Param('id') id: string): Promise<EmployeeDto> {
    const employee = await this.employeeService.findById(id);
    return this.mapToDto(employee);
  }

  /**
   * Get employee audit trail
   * Shows all changes made to the employee record
   */
  @Get(':id/audit-trail')
  @Roles(UserRole.ADMIN, UserRole.HR_OFFICER)
  @ApiOperation({
    summary: 'Get employee audit trail',
    description: 'Retrieve change history for a specific employee',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Employee ID (UUID)',
    format: 'uuid',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of records to return (default: 50)',
  })
  @ApiOkResponse({
    description: 'Audit trail retrieved successfully',
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async getAuditTrail(
    @Param('id') id: string,
    @Query('limit') limit: number = 50,
  ) {
    return this.employeeService.getAuditTrail(id, limit);
  }

  /**
   * Update employee information
   * Only updates provided fields
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.HR_OFFICER)
  @ApiOperation({
    summary: 'Update employee information',
    description: 'Partially update employee details',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Employee ID (UUID)',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateEmployeeDto,
    description: 'Fields to update (all optional)',
  })
  @ApiOkResponse({
    description: 'Employee updated successfully',
    type: EmployeeDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateEmployeeDto,
    @CurrentUser('id') userId: string,
  ): Promise<EmployeeDto> {
    const employee = await this.employeeService.update(id, dto, userId);
    return this.mapToDto(employee);
  }

  /**
   * Update employee status
   * Can change status to active, inactive, on_leave, terminated, or suspended
   */
  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.HR_OFFICER)
  @ApiOperation({
    summary: 'Update employee status',
    description: 'Change employee status with reason tracking',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Employee ID (UUID)',
    format: 'uuid',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          enum: Object.values(EmployeeStatus),
          description: 'New status',
        },
        reason: {
          type: 'string',
          description: 'Reason for status change',
        },
      },
      required: ['status', 'reason'],
    },
  })
  @ApiOkResponse({
    description: 'Employee status updated successfully',
    type: EmployeeDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid status' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: EmployeeStatus; reason: string },
    @CurrentUser('id') userId: string,
  ): Promise<EmployeeDto> {
    const employee = await this.employeeService.updateStatus(
      id,
      body.status,
      body.reason,
      userId,
    );
    return this.mapToDto(employee);
  }

  /**
   * Delete an employee record
   * Only ADMIN can delete employees
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete employee',
    description: 'Soft delete an employee record',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Employee ID (UUID)',
    format: 'uuid',
  })
  @ApiOkResponse({ description: 'Employee deleted successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions (Admin only)' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<{ message: string }> {
    await this.employeeService.delete(id, userId);
    return { message: 'Employee deleted successfully' };
  }

  /**
   * Bulk update employee statuses
   * Update multiple employees' status in one operation
   */
  @Post('bulk-status-update')
  @Roles(UserRole.ADMIN, UserRole.HR_OFFICER)
  @ApiOperation({
    summary: 'Bulk update employee statuses',
    description: 'Update status for multiple employees at once',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        employeeIds: {
          type: 'array',
          items: { type: 'string', format: 'uuid' },
          description: 'List of employee IDs',
        },
        status: {
          enum: Object.values(EmployeeStatus),
          description: 'Status to apply to all employees',
        },
        reason: {
          type: 'string',
          description: 'Reason for bulk status change',
        },
      },
      required: ['employeeIds', 'status', 'reason'],
    },
  })
  @ApiOkResponse({
    description: 'Bulk update completed',
    schema: {
      example: { updated: 10, failed: 0 },
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async bulkUpdateStatus(
    @Body()
    body: {
      employeeIds: string[];
      status: EmployeeStatus;
      reason: string;
    },
    @CurrentUser('id') userId: string,
  ) {
    return this.employeeService.bulkUpdateStatus(
      body.employeeIds,
      body.status,
      body.reason,
      userId,
    );
  }

  /**
   * Get employees by department
   */
  @Get('department/:department')
  @Roles(
    UserRole.ADMIN,
    UserRole.HR_OFFICER,
    UserRole.FINANCE_MANAGER,
  )
  @ApiOperation({
    summary: 'Get employees by department',
    description: 'Retrieve all active employees in a specific department',
  })
  @ApiParam({
    name: 'department',
    type: 'string',
    description: 'Department name',
  })
  @ApiOkResponse({
    description: 'Employees retrieved successfully',
    isArray: true,
    type: EmployeeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getByDepartment(
    @Param('department') department: string,
  ): Promise<EmployeeDto[]> {
    const employees =
      await this.employeeService.getEmployeesByDepartment(department);
    return employees.map((e) => this.mapToDto(e));
  }

  /**
   * Get employees by country
   */
  @Get('country/:countryId')
  @Roles(
    UserRole.ADMIN,
    UserRole.HR_OFFICER,
    UserRole.FINANCE_MANAGER,
  )
  @ApiOperation({
    summary: 'Get employees by country',
    description: 'Retrieve all active employees in a specific country',
  })
  @ApiParam({
    name: 'countryId',
    type: 'string',
    description: 'Country ID (UUID)',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Employees retrieved successfully',
    isArray: true,
    type: EmployeeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getByCountry(
    @Param('countryId') countryId: string,
  ): Promise<EmployeeDto[]> {
    const employees =
      await this.employeeService.getEmployeesByCountry(countryId);
    return employees.map((e) => this.mapToDto(e));
  }

  /**
   * Get employees by company
   */
  @Get('company/:companyId')
  @Roles(
    UserRole.ADMIN,
    UserRole.HR_OFFICER,
    UserRole.FINANCE_MANAGER,
  )
  @ApiOperation({
    summary: 'Get employees by company',
    description: 'Retrieve all active employees in a specific company',
  })
  @ApiParam({
    name: 'companyId',
    type: 'string',
    description: 'Company ID (UUID)',
    format: 'uuid',
  })
  @ApiOkResponse({
    description: 'Employees retrieved successfully',
    isArray: true,
    type: EmployeeDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  async getByCompany(
    @Param('companyId') companyId: string,
  ): Promise<EmployeeDto[]> {
    const employees =
      await this.employeeService.getEmployeesByCompany(companyId);
    return employees.map((e) => this.mapToDto(e));
  }

  private mapToDto(employee: any): EmployeeDto {
    return {
      id: employee.id,
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      dateOfBirth: employee.dateOfBirth,
      joiningDate: employee.joiningDate,
      department: employee.department,
      jobTitle: employee.jobTitle,
      status: employee.status,
      employeeType: employee.employeeType,
      manager: employee.manager,
      salary: employee.salary,
      salaryFrequency: employee.salaryFrequency,
      notes: employee.notes,
      profile: employee.profile,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }
}