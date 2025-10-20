import {
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsEnum,
  IsNumber,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { EmployeeStatus } from '../entities/employee.entity';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  jobTitle?: string;

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @IsOptional()
  @IsString()
  salaryFrequency?: string;

  @IsOptional()
  @IsString()
  manager?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}