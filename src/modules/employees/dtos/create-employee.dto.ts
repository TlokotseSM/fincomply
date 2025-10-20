import {
  IsString,
  IsEmail,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmployeeType } from '../entities/employee.entity';

export class CreateEmployeeProfileDto {
  @IsOptional()
  @IsString()
  nationalId?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsPhoneNumber()
  emergencyContactPhone?: string;
}

export class CreateEmployeeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsDate()
  @Type(() => Date)
  joiningDate: Date;

  @IsString()
  @MaxLength(100)
  department: string;

  @IsString()
  @MaxLength(200)
  jobTitle: string;

  @IsEnum(EmployeeType)
  employeeType: EmployeeType;

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

  @IsString()
  companyId: string;

  @IsString()
  countryId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmployeeProfileDto)
  profile?: CreateEmployeeProfileDto;
}
