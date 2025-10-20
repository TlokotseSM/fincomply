import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeProfileEntity } from './entities/employee-profile.entity';
import { EmployeeAuditLogEntity } from './entities/employee-audit-log.entity';
import { EmployeeService } from './services/employee.service';
import { EmployeeDocumentService } from './services/employee-document.service';
import { EmployeeReportService } from './services/employee-report.service';
import { EmployeeController } from './controllers/employee.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EmployeeEntity,
      EmployeeProfileEntity,
      EmployeeAuditLogEntity,
    ]),
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeDocumentService, EmployeeReportService],
  exports: [EmployeeService, EmployeeDocumentService, EmployeeReportService],
})
export class EmployeesModule {}