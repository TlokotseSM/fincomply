import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types
    await queryRunner.query(`
      CREATE TYPE "employee_status_enum" AS ENUM('active', 'inactive', 'on_leave', 'terminated');
    `);

    await queryRunner.query(`
      CREATE TYPE "employment_type_enum" AS ENUM('full_time', 'part_time', 'contract', 'intern', 'consultant');
    `);

    await queryRunner.query(`
      CREATE TYPE "contract_status_enum" AS ENUM('draft', 'active', 'expired', 'terminated');
    `);

    await queryRunner.query(`
      CREATE TYPE "payment_frequency_enum" AS ENUM('weekly', 'bi_weekly', 'semi_monthly', 'monthly', 'annually');
    `);

    await queryRunner.query(`
      CREATE TYPE "payrun_status_enum" AS ENUM('draft', 'pending_approval', 'approved', 'processing', 'completed', 'failed', 'cancelled');
    `);

    await queryRunner.query(`
      CREATE TYPE "payment_status_enum" AS ENUM('draft', 'pending', 'approved', 'processing', 'paid', 'failed', 'cancelled');
    `);

    await queryRunner.query(`
      CREATE TYPE "payment_type_enum" AS ENUM('salary', 'bonus', 'commission', 'reimbursement', 'severance', 'other');
    `);

    await queryRunner.query(`
      CREATE TYPE "tax_type_enum" AS ENUM('income_tax', 'social_security', 'medicare', 'unemployment', 'pension', 'vat', 'corporate_tax', 'withholding_tax', 'other');
    `);

    await queryRunner.query(`
      CREATE TYPE "tax_calculation_method_enum" AS ENUM('percentage', 'brackets', 'flat_rate', 'formula');
    `);

    await queryRunner.query(`
      CREATE TYPE "document_type_enum" AS ENUM('visa', 'work_permit', 'passport', 'tax_form', 'employment_contract', 'nda', 'background_check', 'certification', 'other');
    `);

    await queryRunner.query(`
      CREATE TYPE "document_status_enum" AS ENUM('pending', 'approved', 'rejected', 'expired', 'under_review');
    `);

    // Create currencies table
    await queryRunner.query(`
      CREATE TABLE "currencies" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "code" varchar(3) NOT NULL UNIQUE,
        "name" varchar(50) NOT NULL,
        "symbol" varchar(10) NOT NULL,
        "decimal_places" integer NOT NULL DEFAULT 2,
        "active" boolean NOT NULL DEFAULT true,
        "is_crypto" boolean NOT NULL DEFAULT false,
        "description" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz
      );
    `);

    // Create countries table
    await queryRunner.query(`
      CREATE TABLE "countries" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "code" varchar(2) NOT NULL UNIQUE,
        "iso3" varchar(3) NOT NULL UNIQUE,
        "name" varchar(100) NOT NULL,
        "official_name" varchar(200),
        "currency_code" varchar(3) NOT NULL,
        "timezone" jsonb,
        "phone_code" varchar(10),
        "active" boolean NOT NULL DEFAULT true,
        "min_wage" decimal(12,2),
        "standard_work_hours" integer NOT NULL DEFAULT 40,
        "overtime_threshold" integer NOT NULL DEFAULT 40,
        "holidays" jsonb,
        "tax_year_start" varchar(5) NOT NULL DEFAULT '01-01',
        "requires_work_permit" boolean NOT NULL DEFAULT true,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_countries_currency" FOREIGN KEY ("currency_code") 
          REFERENCES "currencies"("code") ON DELETE RESTRICT
      );
    `);

    // Create companies table
    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar(200) NOT NULL,
        "legal_name" varchar(200) NOT NULL,
        "registration_number" varchar(100) NOT NULL UNIQUE,
        "tax_id" varchar(100),
        "country_code" varchar(2) NOT NULL,
        "address" text,
        "city" varchar(100),
        "state" varchar(100),
        "postal_code" varchar(20),
        "phone" varchar(50),
        "email" varchar(100),
        "website" varchar(200),
        "primary_currency" varchar(3) NOT NULL DEFAULT 'USD',
        "fiscal_year_end" varchar(5) NOT NULL DEFAULT '12-31',
        "active" boolean NOT NULL DEFAULT true,
        "settings" jsonb,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz
      );
    `);

    // Create employees table
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "employee_number" varchar(50),
        "first_name" varchar(100) NOT NULL,
        "middle_name" varchar(100),
        "last_name" varchar(100) NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "phone" varchar(50),
        "date_of_birth" date,
        "country_code" varchar(2) NOT NULL,
        "address" text,
        "city" varchar(100),
        "state" varchar(100),
        "postal_code" varchar(20),
        "hire_date" date NOT NULL,
        "termination_date" date,
        "status" employee_status_enum NOT NULL DEFAULT 'active',
        "employment_type" employment_type_enum NOT NULL DEFAULT 'full_time',
        "department" varchar(100),
        "job_title" varchar(100),
        "manager_id" uuid,
        "tax_identifier" varchar(100),
        "social_security_number" varchar(100),
        "passport_number" varchar(100),
        "visa_type" varchar(50),
        "visa_expiry" date,
        "work_permit_number" varchar(100),
        "work_permit_expiry" date,
        "bank_name" varchar(100),
        "bank_account_number" varchar(100),
        "bank_routing_number" varchar(100),
        "iban" varchar(100),
        "swift_code" varchar(20),
        "metadata" jsonb,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_employees_company" FOREIGN KEY ("company_id") 
          REFERENCES "companies"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_employees_country" FOREIGN KEY ("country_code") 
          REFERENCES "countries"("code") ON DELETE RESTRICT
      );
    `);

    // Create contracts table
    await queryRunner.query(`
      CREATE TABLE "contracts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "employee_id" uuid NOT NULL,
        "contract_number" varchar(100) NOT NULL UNIQUE,
        "start_date" date NOT NULL,
        "end_date" date,
        "status" contract_status_enum NOT NULL DEFAULT 'draft',
        "job_title" varchar(100) NOT NULL,
        "department" varchar(100),
        "base_salary" decimal(12,2) NOT NULL,
        "salary_currency" varchar(3) NOT NULL,
        "payment_frequency" payment_frequency_enum NOT NULL DEFAULT 'monthly',
        "hours_per_week" decimal(5,2),
        "vacation_days" integer NOT NULL DEFAULT 0,
        "sick_days" integer NOT NULL DEFAULT 0,
        "benefits" jsonb,
        "signing_bonus" decimal(12,2) NOT NULL DEFAULT 0,
        "probation_period_months" integer NOT NULL DEFAULT 3,
        "notice_period_days" integer NOT NULL DEFAULT 30,
        "contract_file_path" varchar(500),
        "signed_date" date,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_contracts_employee" FOREIGN KEY ("employee_id") 
          REFERENCES "employees"("id") ON DELETE CASCADE
      );
    `);

    // Create payruns table
    await queryRunner.query(`
      CREATE TABLE "payruns" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "company_id" uuid NOT NULL,
        "payrun_number" varchar(100) NOT NULL UNIQUE,
        "name" varchar(200) NOT NULL,
        "period_start" date NOT NULL,
        "period_end" date NOT NULL,
        "payment_date" date NOT NULL,
        "status" payrun_status_enum NOT NULL DEFAULT 'draft',
        "currency_code" varchar(3) NOT NULL,
        "total_gross" decimal(15,2) NOT NULL DEFAULT 0,
        "total_net" decimal(15,2) NOT NULL DEFAULT 0,
        "total_tax" decimal(15,2) NOT NULL DEFAULT 0,
        "total_deductions" decimal(15,2) NOT NULL DEFAULT 0,
        "employee_count" integer NOT NULL DEFAULT 0,
        "approved_by" uuid,
        "approved_at" timestamptz,
        "processed_at" timestamptz,
        "notes" text,
        "metadata" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_payruns_company" FOREIGN KEY ("company_id") 
          REFERENCES "companies"("id") ON DELETE CASCADE
      );
    `);

    // Create payments table
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "employee_id" uuid NOT NULL,
        "payrun_id" uuid,
        "payment_number" varchar(100) NOT NULL UNIQUE,
        "payment_type" payment_type_enum NOT NULL DEFAULT 'salary',
        "payment_date" date NOT NULL,
        "period_start" date NOT NULL,
        "period_end" date NOT NULL,
        "currency_code" varchar(3) NOT NULL,
        "gross_amount" decimal(12,2) NOT NULL,
        "net_amount" decimal(12,2) NOT NULL,
        "tax_amount" decimal(12,2) NOT NULL DEFAULT 0,
        "deductions_amount" decimal(12,2) NOT NULL DEFAULT 0,
        "reimbursements_amount" decimal(12,2) NOT NULL DEFAULT 0,
        "hours_worked" decimal(8,2),
        "overtime_hours" decimal(8,2) NOT NULL DEFAULT 0,
        "hourly_rate" decimal(10,2),
        "status" payment_status_enum NOT NULL DEFAULT 'draft',
        "breakdown" jsonb,
        "payslip_file_path" varchar(500),
        "payment_method" varchar(50) NOT NULL DEFAULT 'bank_transfer',
        "payment_reference" varchar(200),
        "processed_at" timestamptz,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_payments_employee" FOREIGN KEY ("employee_id") 
          REFERENCES "employees"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_payments_payrun" FOREIGN KEY ("payrun_id") 
          REFERENCES "payruns"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_payments_currency" FOREIGN KEY ("currency_code") 
          REFERENCES "currencies"("code") ON DELETE RESTRICT
      );
    `);

    // Create tax_rules table
    await queryRunner.query(`
      CREATE TABLE "tax_rules" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "country_code" varchar(2) NOT NULL,
        "name" varchar(200) NOT NULL,
        "tax_type" tax_type_enum NOT NULL,
        "calculation_method" tax_calculation_method_enum NOT NULL DEFAULT 'percentage',
        "rate" decimal(5,2),
        "brackets" jsonb,
        "formula" text,
        "threshold_amount" decimal(12,2),
        "annual_cap" decimal(12,2),
        "effective_from" date NOT NULL,
        "effective_to" date,
        "applies_to_employer" boolean NOT NULL DEFAULT false,
        "applies_to_employee" boolean NOT NULL DEFAULT true,
        "active" boolean NOT NULL DEFAULT true,
        "description" text,
        "metadata" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_tax_rules_country" FOREIGN KEY ("country_code") 
          REFERENCES "countries"("code") ON DELETE CASCADE
      );
    `);

    // Create tax_liabilities table
    await queryRunner.query(`
      CREATE TABLE "tax_liabilities" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "payment_id" uuid NOT NULL,
        "tax_rule_id" uuid,
        "tax_type" tax_type_enum NOT NULL,
        "tax_name" varchar(200) NOT NULL,
        "taxable_amount" decimal(12,2) NOT NULL,
        "tax_amount" decimal(12,2) NOT NULL,
        "tax_rate" decimal(5,2),
        "employer_portion" decimal(12,2) NOT NULL DEFAULT 0,
        "employee_portion" decimal(12,2) NOT NULL DEFAULT 0,
        "year_to_date" decimal(15,2) NOT NULL DEFAULT 0,
        "calculation" jsonb,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_tax_liabilities_payment" FOREIGN KEY ("payment_id") 
          REFERENCES "payments"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_tax_liabilities_tax_rule" FOREIGN KEY ("tax_rule_id") 
          REFERENCES "tax_rules"("id") ON DELETE SET NULL
      );
    `);

    // Create compliance_documents table
    await queryRunner.query(`
      CREATE TABLE "compliance_documents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "employee_id" uuid NOT NULL,
        "country_code" varchar(2) NOT NULL,
        "document_type" document_type_enum NOT NULL,
        "document_number" varchar(200),
        "title" varchar(200) NOT NULL,
        "description" text,
        "issue_date" date,
        "expiry_date" date,
        "issuing_authority" varchar(200),
        "status" document_status_enum NOT NULL DEFAULT 'pending',
        "file_path" varchar(500),
        "file_name" varchar(255),
        "file_size" integer,
        "mime_type" varchar(100),
        "verified_by" uuid,
        "verified_at" timestamptz,
        "reminder_sent_at" timestamptz,
        "notes" text,
        "metadata" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_compliance_documents_employee" FOREIGN KEY ("employee_id") 
          REFERENCES "employees"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_compliance_documents_country" FOREIGN KEY ("country_code") 
          REFERENCES "countries"("code") ON DELETE RESTRICT
      );
    `);

    // Create exchange_rates table
    await queryRunner.query(`
      CREATE TABLE "exchange_rates" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "from_currency_code" varchar(3) NOT NULL,
        "to_currency_code" varchar(3) NOT NULL,
        "date" date NOT NULL,
        "rate" decimal(18,8) NOT NULL,
        "inverse_rate" decimal(18,8) NOT NULL,
        "source" varchar(100) NOT NULL DEFAULT 'manual',
        "source_timestamp" timestamptz,
        "active" boolean NOT NULL DEFAULT true,
        "metadata" jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        "deleted_at" timestamptz,
        CONSTRAINT "fk_exchange_rates_from_currency" FOREIGN KEY ("from_currency_code") 
          REFERENCES "currencies"("code") ON DELETE CASCADE,
        CONSTRAINT "fk_exchange_rates_to_currency" FOREIGN KEY ("to_currency_code") 
          REFERENCES "currencies"("code") ON DELETE CASCADE,
        CONSTRAINT "uq_exchange_rates_date" UNIQUE ("from_currency_code", "to_currency_code", "date")
      );
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "idx_currencies_code" ON "currencies"("code");`);
    await queryRunner.query(`CREATE INDEX "idx_countries_code" ON "countries"("code");`);
    await queryRunner.query(`CREATE INDEX "idx_companies_registration_number" ON "companies"("registration_number");`);
    await queryRunner.query(`CREATE INDEX "idx_employees_email" ON "employees"("email");`);
    await queryRunner.query(`CREATE INDEX "idx_employees_company_status" ON "employees"("company_id", "status");`);
    await queryRunner.query(`CREATE INDEX "idx_employees_country" ON "employees"("country_code");`);
    await queryRunner.query(`CREATE INDEX "idx_employees_hire_date" ON "employees"("hire_date");`);
    await queryRunner.query(`CREATE INDEX "idx_employees_employee_number" ON "employees"("employee_number");`);
    await queryRunner.query(`CREATE INDEX "idx_contracts_employee_start" ON "contracts"("employee_id", "start_date");`);
    await queryRunner.query(`CREATE INDEX "idx_contracts_contract_number" ON "contracts"("contract_number");`);
    await queryRunner.query(`CREATE INDEX "idx_payruns_company_period" ON "payruns"("company_id", "period_start", "period_end");`);
    await queryRunner.query(`CREATE INDEX "idx_payruns_status" ON "payruns"("status");`);
    await queryRunner.query(`CREATE INDEX "idx_payruns_payrun_number" ON "payruns"("payrun_number");`);
    await queryRunner.query(`CREATE INDEX "idx_payments_employee_date" ON "payments"("employee_id", "payment_date");`);
    await queryRunner.query(`CREATE INDEX "idx_payments_payrun" ON "payments"("payrun_id");`);
    await queryRunner.query(`CREATE INDEX "idx_payments_status" ON "payments"("status");`);
    await queryRunner.query(`CREATE INDEX "idx_payments_payment_number" ON "payments"("payment_number");`);
    await queryRunner.query(`CREATE INDEX "idx_payments_payment_date" ON "payments"("payment_date");`);
    await queryRunner.query(`CREATE INDEX "idx_tax_rules_country_type_effective" ON "tax_rules"("country_code", "tax_type", "effective_from");`);
    await queryRunner.query(`CREATE INDEX "idx_tax_rules_tax_type" ON "tax_rules"("tax_type");`);
    await queryRunner.query(`CREATE INDEX "idx_tax_liabilities_payment_type" ON "tax_liabilities"("payment_id", "tax_type");`);
    await queryRunner.query(`CREATE INDEX "idx_tax_liabilities_tax_type" ON "tax_liabilities"("tax_type");`);
    await queryRunner.query(`CREATE INDEX "idx_compliance_documents_employee_type" ON "compliance_documents"("employee_id", "document_type");`);
    await queryRunner.query(`CREATE INDEX "idx_compliance_documents_expiry" ON "compliance_documents"("expiry_date");`);
    await queryRunner.query(`CREATE INDEX "idx_compliance_documents_status" ON "compliance_documents"("status");`);
    await queryRunner.query(`CREATE INDEX "idx_compliance_documents_document_type" ON "compliance_documents"("document_type");`);
    await queryRunner.query(`CREATE INDEX "idx_exchange_rates_date" ON "exchange_rates"("date");`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order (to respect foreign key constraints)
    await queryRunner.query(`DROP TABLE IF EXISTS "exchange_rates" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "compliance_documents" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tax_liabilities" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "tax_rules" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payruns" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "contracts" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "employees" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "companies" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "countries" CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS "currencies" CASCADE;`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS "document_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "document_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tax_calculation_method_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "tax_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payrun_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payment_frequency_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "contract_status_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "employment_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "employee_status_enum";`);
  }
}