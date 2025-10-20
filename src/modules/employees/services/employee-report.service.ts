import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeEntity, EmployeeStatus } from '../entities/employee.entity';

@Injectable()
export class EmployeeReportService {
  constructor(
    @InjectRepository(EmployeeEntity)
    private employeeRepo: Repository<EmployeeEntity>,
  ) {}

  async getEmployeeSummary(companyId: string) {
    // Used companyId column directly instead of company relationship
    const total = await this.employeeRepo.count({
      where: { companyId },
    });

    const active = await this.employeeRepo.count({
      where: {
        companyId,
        status: EmployeeStatus.ACTIVE,
      },
    });

    const byStatus = await this.employeeRepo
      .createQueryBuilder('e')
      .select('e.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('e.companyId = :companyId', { companyId })
      .groupBy('e.status')
      .getRawMany();

    const byDepartment = await this.employeeRepo
      .createQueryBuilder('e')
      .select('e.department', 'department')
      .addSelect('COUNT(*)', 'count')
      .where('e.companyId = :companyId', { companyId })
      .groupBy('e.department')
      .getRawMany();

    const byType = await this.employeeRepo
      .createQueryBuilder('e')
      .select('e.employeeType', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('e.companyId = :companyId', { companyId })
      .groupBy('e.employeeType')
      .getRawMany();

    return {
      total,
      active,
      byStatus,
      byDepartment,
      byType,
    };
  }

  async getEmployeesByCountryReport(companyId: string) {
    // Note: Country relationship not yet available
    // This will need to be updated once CountryEntity is created
    return this.employeeRepo
      .createQueryBuilder('e')
      .select('e.countryId', 'countryId')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(CAST(e.salary AS DECIMAL))', 'totalSalary')
      .where('e.companyId = :companyId', { companyId })
      .groupBy('e.countryId')
      .getRawMany();
  }

  async getDepartmentReport(companyId: string) {
    return this.employeeRepo
      .createQueryBuilder('e')
      .select('e.department', 'department')
      .addSelect('COUNT(*)', 'employeeCount')
      .addSelect('AVG(CAST(e.salary AS DECIMAL))', 'averageSalary')
      .addSelect('MIN(CAST(e.salary AS DECIMAL))', 'minSalary')
      .addSelect('MAX(CAST(e.salary AS DECIMAL))', 'maxSalary')
      .where('e.companyId = :companyId AND e.status = :status', {
        companyId,
        status: EmployeeStatus.ACTIVE,
      })
      .groupBy('e.department')
      .getRawMany();
  }

  async getNewHiresReport(companyId: string, monthsBack: number = 6) {
    const dateFrom = new Date();
    dateFrom.setMonth(dateFrom.getMonth() - monthsBack);

    return this.employeeRepo
      .createQueryBuilder('e')
      .select('DATE_TRUNC(\'month\', e.joiningDate)', 'month')
      .addSelect('COUNT(*)', 'count')
      .where('e.companyId = :companyId AND e.joiningDate >= :dateFrom', {
        companyId,
        dateFrom,
      })
      .groupBy('DATE_TRUNC(\'month\', e.joiningDate)')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getTurnoverReport(companyId: string, monthsBack: number = 12) {
    const dateFrom = new Date();
    dateFrom.setMonth(dateFrom.getMonth() - monthsBack);

    return this.employeeRepo
      .createQueryBuilder('e')
      .select('DATE_TRUNC(\'month\', e.terminationDate)', 'month')
      .addSelect('COUNT(*)', 'count')
      .where(
        'e.companyId = :companyId AND e.terminationDate >= :dateFrom AND e.status = :status',
        {
          companyId,
          dateFrom,
          status: EmployeeStatus.TERMINATED,
        },
      )
      .groupBy('DATE_TRUNC(\'month\', e.terminationDate)')
      .orderBy('month', 'ASC')
      .getRawMany();
  }

  async getTenureReport(companyId: string) {
    /**
     * Calculate employee tenure groups
     * Groups employees by how long they've been with the company
     */
    return this.employeeRepo
      .createQueryBuilder('e')
      .select(
        `CASE 
          WHEN EXTRACT(YEAR FROM AGE(e.joiningDate)) < 1 THEN 'Less than 1 year'
          WHEN EXTRACT(YEAR FROM AGE(e.joiningDate)) < 3 THEN '1-3 years'
          WHEN EXTRACT(YEAR FROM AGE(e.joiningDate)) < 5 THEN '3-5 years'
          WHEN EXTRACT(YEAR FROM AGE(e.joiningDate)) < 10 THEN '5-10 years'
          ELSE '10+ years'
        END`,
        'tenureGroup',
      )
      .addSelect('COUNT(*)', 'count')
      .where('e.companyId = :companyId AND e.status = :status', {
        companyId,
        status: EmployeeStatus.ACTIVE,
      })
      .groupBy('tenureGroup')
      .getRawMany();
  }

  async getSalaryReport(companyId: string) {
    /**
     * Generate salary statistics by department
     */
    return this.employeeRepo
      .createQueryBuilder('e')
      .select('e.department', 'department')
      .addSelect('COUNT(*)', 'employeeCount')
      .addSelect('AVG(CAST(e.salary AS DECIMAL))', 'averageSalary')
      .addSelect('MEDIAN(CAST(e.salary AS DECIMAL))', 'medianSalary')
      .addSelect('MIN(CAST(e.salary AS DECIMAL))', 'minSalary')
      .addSelect('MAX(CAST(e.salary AS DECIMAL))', 'maxSalary')
      .addSelect(
        'STDDEV(CAST(e.salary AS DECIMAL))',
        'salaryStandardDeviation',
      )
      .where('e.companyId = :companyId AND e.status = :status', {
        companyId,
        status: EmployeeStatus.ACTIVE,
      })
      .groupBy('e.department')
      .orderBy('averageSalary', 'DESC')
      .getRawMany();
  }

  async getEmployeeTypeDistribution(companyId: string) {
    /**
     * Breakdown of employees by employment type
     */
    return this.employeeRepo
      .createQueryBuilder('e')
      .select('e.employeeType', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER(), 2)', 'percentage')
      .where('e.companyId = :companyId', { companyId })
      .groupBy('e.employeeType')
      .getRawMany();
  }

  async getActiveDepartmentCounts(companyId: string) {
    /**
     * Count of active employees per department
     */
    return this.employeeRepo
      .createQueryBuilder('e')
      .select('e.department', 'department')
      .addSelect('COUNT(*)', 'activeCount')
      .where('e.companyId = :companyId AND e.status = :status', {
        companyId,
        status: EmployeeStatus.ACTIVE,
      })
      .groupBy('e.department')
      .orderBy('activeCount', 'DESC')
      .getRawMany();
  }

  async getAgeDistribution(companyId: string) {
    /**
     * Employees grouped by age ranges
     */
    return this.employeeRepo
      .createQueryBuilder('e')
      .select(
        `CASE 
          WHEN EXTRACT(YEAR FROM AGE(e.dateOfBirth)) < 25 THEN 'Under 25'
          WHEN EXTRACT(YEAR FROM AGE(e.dateOfBirth)) < 35 THEN '25-34'
          WHEN EXTRACT(YEAR FROM AGE(e.dateOfBirth)) < 45 THEN '35-44'
          WHEN EXTRACT(YEAR FROM AGE(e.dateOfBirth)) < 55 THEN '45-54'
          ELSE '55+'
        END`,
        'ageGroup',
      )
      .addSelect('COUNT(*)', 'count')
      .where('e.companyId = :companyId', { companyId })
      .groupBy('ageGroup')
      .getRawMany();
  }

  async getComprehensiveReport(companyId: string) {
    /**
     * Generate a comprehensive report with multiple metrics
     */
    const [
      summary,
      departmentStats,
      salaryStats,
      typeDistribution,
      ageDistribution,
      tenureStats,
    ] = await Promise.all([
      this.getEmployeeSummary(companyId),
      this.getActiveDepartmentCounts(companyId),
      this.getSalaryReport(companyId),
      this.getEmployeeTypeDistribution(companyId),
      this.getAgeDistribution(companyId),
      this.getTenureReport(companyId),
    ]);

    return {
      timestamp: new Date(),
      companyId,
      summary,
      departmentStats,
      salaryStats,
      typeDistribution,
      ageDistribution,
      tenureStats,
    };
  }
}