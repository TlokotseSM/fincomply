import {
  IsOptional,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeStatus, EmployeeType } from '../entities/employee.entity';

export class SearchEmployeeDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsOptional()
  @IsEnum(EmployeeType)
  employeeType?: EmployeeType;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  countryId?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder: 'ASC' | 'DESC' = 'DESC';
}