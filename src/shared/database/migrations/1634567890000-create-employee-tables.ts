import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateEmployeeTables1634567890000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create employee_profiles table
    await queryRunner.createTable(
      new Table({
        name: 'employee_profiles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'national_id', type: 'varchar', length: '255', isNullable: true },
          { name: 'nationality', type: 'varchar', length: '50', isNullable: true },
          { name: 'address', type: 'text', isNullable: true },
          { name: 'city', type: 'varchar', length: '50', isNullable: true },
          { name: 'state', type: 'varchar', length: '50', isNullable: true },
          { name: 'postal_code', type: 'varchar', length: '20', isNullable: true },
          { name: 'emergency_contact_name', type: 'varchar', length: '255', isNullable: true },
          { name: 'emergency_contact_phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'bank_details', type: 'json', isNullable: true },
          { name: 'tax_information', type: 'json', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );

    // Create employees table
    await queryRunner.createTable(
      new Table({
        name: 'employees',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'employee_number', type: 'varchar', length: '255', isUnique: true },
          { name: 'first_name', type: 'varchar', length: '255' },
          { name: 'last_name', type: 'varchar', length: '255' },
          { name: 'email', type: 'varchar', length: '255', isUnique: true },
          { name: 'phone_number', type: 'varchar', length: '20', isNullable: true },
          { name: 'date_of_birth', type: 'date' },
          { name: 'joining_date', type: 'date' },
          { name: 'termination_date', type: 'date', isNullable: true },
          { name: 'department', type: 'varchar', length: '50' },
          { name: 'job_title', type: 'varchar', length: '100' },
          { name: 'status', type: 'varchar', length: '20', default: '\'active\'' },
          { name: 'employee_type', type: 'varchar', length: '20', default: '\'full_time\'' },
          { name: 'manager', type: 'varchar', length: '255', isNullable: true },
          { name: 'salary', type: 'decimal', precision: 10, scale: 2, isNullable: true },
          { name: 'salary_frequency', type: 'varchar', length: '50', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'company_id', type: 'uuid' },
          { name: 'country_id', type: 'uuid' },
          { name: 'profile_id', type: 'uuid', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
        indices: [
          { columnNames: ['company_id', 'status'] },
          { columnNames: ['country_id', 'status'] },
          { columnNames: ['email'] },
          { columnNames: ['employee_number'] },
        ],
      }),
      true,
    );

    // Create employee_audit_logs table
    await queryRunner.createTable(
      new Table({
        name: 'employee_audit_logs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          { name: 'employee_id', type: 'uuid' },
          { name: 'action', type: 'varchar', length: '100' },
          { name: 'field', type: 'varchar', length: '100', isNullable: true },
          { name: 'old_value', type: 'text', isNullable: true },
          { name: 'new_value', type: 'text', isNullable: true },
          { name: 'changed_by', type: 'varchar', length: '100', isNullable: true },
          { name: 'reason', type: 'text', isNullable: true },
          { name: 'metadata', type: 'json', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'updated_at', type: 'timestamptz', default: 'CURRENT_TIMESTAMP' },
          { name: 'deleted_at', type: 'timestamptz', isNullable: true },
        ],
        indices: [
          { columnNames: ['employee_id', 'created_at'] },
          { columnNames: ['action', 'created_at'] },
        ],
      }),
      true,
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      'employees',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'employees',
      new TableForeignKey({
        columnNames: ['country_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'countries',
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'employees',
      new TableForeignKey({
        columnNames: ['profile_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employee_profiles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'employee_audit_logs',
      new TableForeignKey({
        columnNames: ['employee_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'employees',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('employee_audit_logs');
    await queryRunner.dropTable('employees');
    await queryRunner.dropTable('employee_profiles');
  }
}