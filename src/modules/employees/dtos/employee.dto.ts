import { EmployeeStatus, EmployeeType } from '../entities/employee.entity';

export class EmployeeProfileDto {
  id: string;
  nationalId: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export class EmployeeDto {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  joiningDate: Date;
  department: string;
  jobTitle: string;
  status: EmployeeStatus;
  employeeType: EmployeeType;
  manager: string;
  salary: number;
  salaryFrequency: string;
  notes: string;
  profile: EmployeeProfileDto;
  createdAt: Date;
  updatedAt: Date;
}