// export { BaseEntity } from './base.entity';
// export { Country } from './country.entity';
// export { Currency } from './currency.entity';
// export { Company } from './company.entity';
// export { Employee, EmployeeStatus, EmploymentType } from './employee.entity';
// export { Contract, ContractStatus, PaymentFrequency } from './contract.entity';
// export { Payrun, PayrunStatus } from './payrun.entity';
// export { Payment, PaymentStatus, PaymentType } from './payment.entity';
// export { TaxRule, TaxType, TaxCalculationMethod } from './tax-rule.entity';
// export { TaxLiability } from './tax-liability.entity';
// export { ComplianceDocument, DocumentType, DocumentStatus } from './compliance-document.entity';
// export { ExchangeRate } from './exchange-rate.entity';

// Export entity classes only (for TypeORM)
export { BaseEntity } from './base.entity';
export { Country } from './country.entity';
export { Currency } from './currency.entity';
export { Company } from './company.entity';
export { Employee } from './employee.entity';
export { Contract } from './contract.entity';
export { Payrun } from './payrun.entity';
export { Payment } from './payment.entity';
export { TaxRule } from './tax-rule.entity';
export { TaxLiability } from './tax-liability.entity';
export { ComplianceDocument } from './compliance-document.entity';
export { ExchangeRate } from './exchange-rate.entity';

// Export enums separately (for use in DTOs and services)
export { EmployeeStatus, EmploymentType } from './employee.entity';
export { ContractStatus, PaymentFrequency } from './contract.entity';
export { PayrunStatus } from './payrun.entity';
export { PaymentStatus, PaymentType } from './payment.entity';
export { TaxType, TaxCalculationMethod } from './tax-rule.entity';
export { DocumentType, DocumentStatus } from './compliance-document.entity';