<p align="center">
  <img src="[[public/images/Screenshot 2025-07-07 at 07.35.42.png](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRtliRp3q5NbXe3goSwiuBIQgE9nK_Qc8BwA&s)](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmluYW5jZXxlbnwwfHwwfHx8MA%3D%3D)" width="200" alt="FinComply Logo" />
</p>

<p align="center">
  <strong>FinComply - Financial Management & Compliance Platform</strong>
</p>

<p align="center">
  A modern NestJS-based financial platform handling multi-currency payroll, international compliance, and cross-border tax management.
</p>

<p align="center">
  <a href="https://nestjs.com/" target="_blank"><img src="https://img.shields.io/badge/NestJS-ED2942?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://www.postgresql.org/" target="_blank"><img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
  <a href="https://jwt.io/" target="_blank"><img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" /></a>
  <a href="https://swagger.io/" target="_blank"><img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="Swagger" /></a>
</p>

<p align="center">
  <a href="https://github.com/TlokotseSM/fincomply/stargazers" target="_blank"><img src="https://img.shields.io/github/stars/TlokotseSM/fincomply?style=social" alt="Stars" /></a>
  <a href="https://github.com/TlokotseSM/fincomply/network" target="_blank"><img src="https://img.shields.io/github/forks/TlokotseSM/fincomply?style=social" alt="Forks" /></a>
  <a href="https://github.com/TlokotseSM/fincomply/issues" target="_blank"><img src="https://img.shields.io/github/issues/TlokotseSM/fincomply" alt="Issues" /></a>
  <a href="https://github.com/TlokotseSM/fincomply/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/github/license/TlokotseSM/fincomply" alt="License" /></a>
</p>

---

# 💰 FinComply - Financial Management & Compliance Platform

A comprehensive financial platform built with NestJS, featuring multi-currency payroll processing, international compliance tracking, tax management, and financial analytics. Designed for businesses operating across borders.

## 🎯 Project Overview

FinComply is a modern, scalable financial platform that solves critical challenges for global businesses:

- **Automate payroll** across multiple countries and currencies
- **Ensure compliance** with local labor laws and tax regulations
- **Manage currency fluctuations** with real-time exchange rates
- **Simplify tax reporting** for international operations
- **Optimize costs** with detailed financial analytics

## ✨ Features

### 🔐 Authentication & Security

- **Enterprise-grade authentication** with JWT and OAuth 2.0 support
- **Role-based access control** for finance, HR, and compliance teams
- **Audit logging** for all financial transactions
- **GDPR-compliant** data handling
- **SOC 2 Type II ready** security architecture

### 💸 Multi-Currency Payroll System

- **Automated salary calculations** with country-specific rules
- **Support for 50+ currencies** with real-time exchange rates
- **Flexible payment scheduling** (monthly, bi-weekly, etc.)
- **Direct deposit integration** with global payment processors
- **Payslip generation** with customizable templates
- **Bonus & deduction management**

### 🛡️ Compliance Tracking

- **Visa/work permit tracking** with expiration alerts
- **Labor law compliance** by jurisdiction
- **Document management** for compliance proofs
- **Automated reporting** for government filings
- **Employee classification** (FTE, contractor, etc.)
- **Benefit eligibility tracking**

### 📊 Financial Analytics

- **Cost allocation** by department, project, or country
- **Currency exposure analysis**
- **Budget vs. actual reporting**
- **Headcount planning tools**
- **Revenue attribution**
- **Custom KPI dashboards**

### 🧾 Tax Management

- **Automated tax calculations** for 30+ countries
- **Withholding tax management**
- **Double taxation avoidance**
- **Year-end tax reporting**
- **Tax form generation** (W-2, 1099, P60, etc.)
- **Audit trail for all tax transactions**

### 🔧 Technical Features

- **PostgreSQL with TimescaleDB** for financial time-series data
- **Redis caching** for exchange rates and compliance rules
- **TypeORM for data modeling**
- **Swagger API documentation**
- **Docker & Kubernetes ready**
- **Webhook & API integration points**

## 🏗️ Architecture & Design Patterns

### **Layered Architecture**
```
┌─────────────────────────────────────┐
│        Presentation Layer           │
│     (Controllers/Guards)            │
├─────────────────────────────────────┤
│       Business Logic Layer          │
│   (Services/Financial Calculators)  │
├─────────────────────────────────────┤
│        Data Access Layer            │
│   (Repositories/Financial Entities) │
├─────────────────────────────────────┤
│        Integration Layer            │
│  (Payment Processors/Tax APIs)      │
└─────────────────────────────────────┘
```

### **Design Patterns Implemented**

#### **1. Strategy Pattern for Financial Calculations**
- Country-specific payroll calculators
- Multiple tax calculation methods
- Plug-in exchange rate providers

#### **2. Observer Pattern for Compliance Alerts**
- Visa/work permit expirations
- Tax filing deadlines
- Regulatory change notifications

#### **3. Decorator Pattern for Financial Reporting**
- Dynamic report generation
- Customizable output formats
- Multi-currency presentation

#### **4. Factory Pattern for Document Generation**
- Payslips
- Tax forms
- Compliance certificates

#### **5. Repository Pattern for Financial Data**
- Audit-proof data access
- Transaction history
- Immutable records

## 🗂️ Domain Model & Data Relationships

```mermaid
erDiagram
    EMPLOYEE }|--|| COUNTRY: based_in
    EMPLOYEE }|--|{ CONTRACT: has
    EMPLOYEE }|--|{ PAYMENT: receives
    
    PAYMENT ||--|| CURRENCY: in
    PAYMENT ||--|| PAYRUN: part_of
    PAYMENT ||--|{ TAX_LIABILITY: generates
    
    COMPANY ||--o{ EMPLOYEE: employs
    COMPANY ||--o{ COUNTRY: operates_in
    COMPANY ||--o{ COMPLIANCE_REQUIREMENT: subject_to
    
    TAX_RULE }|--|| COUNTRY: applies_to
    COMPLIANCE_REQUIREMENT }|--|| COUNTRY: applies_to
    
    EXCHANGE_RATE }|--|| CURRENCY: from
    EXCHANGE_RATE }|--|| CURRENCY: to
```

### Entity Descriptions

**Employee**
- Represents individual workers across all countries
- Tracks personal details, compensation, and immigration status
- Can have multiple contracts (e.g., full-time and consulting)

**Payment**
- Individual salary or bonus payments
- Linked to specific pay runs and tax periods
- Records gross/net amounts and all deductions

**Payrun**
- Batch of payments processed together
- Tracks approval workflow and accounting status
- Generates audit reports

**Country**
- Jurisdiction-specific rules and requirements
- Contains tax brackets, labor laws, and reporting requirements
- Currency and localization settings

**Compliance Requirement**
- Visa/work permit rules
- Mandatory benefits
- Reporting deadlines
- Penalty information

**Tax Rule**
- Country-specific tax calculations
- Withholding requirements
- Treaty provisions
- Filing procedures

**Exchange Rate**
- Historical currency conversion rates
- Source and timestamp information
- Used for financial reporting

## 🧠 Business Concepts

- **Multi-Jurisdictional**: Handles employees in multiple countries simultaneously
- **Real-Time Calculations**: Payroll updates immediately reflect currency and tax changes
- **Compliance-Centric**: Built around regulatory requirements from day one
- **Audit-Ready**: Complete historical record of all financial decisions
- **Enterprise-Grade**: Designed for organizations with 100-10,000+ employees

## 📈 Example Use Cases

- **Monthly Payroll**: Process salaries for employees in 5 countries with automatic tax withholding
- **New Hire Onboarding**: Automatically check work authorization and set up proper tax forms
- **Year-End Reporting**: Generate all required tax documents for employees worldwide
- **Regulatory Change**: System updates when a country modifies its tax brackets
- **Currency Fluctuation**: Recalculate contractor payments when exchange rates shift

## 📁 Project Structure

```
src/
├── core/                          # Fundamental business logic
│   ├── currency/                  # Exchange rate management
│   ├── payroll/                   # Payroll calculations
│   └── tax/                       # Tax processing
│
├── compliance/                    # Compliance features
│   ├── immigration/               # Visa/work permit tracking
│   └── reporting/                 # Regulatory filings
│
├── employees/                     # Employee management
│   ├── contracts/                 # Employment agreements
│   └── payments/                  # Payment history
│
├── companies/                     # Organization management
│   ├── departments/               # Cost center tracking
│   └── locations/                 # Physical offices
│
├── integrations/                  # External connections
│   ├── payment-processors/        # Bank/payment integrations
│   └── tax-apis/                  # Government tax systems
│
└── shared/                        # Common utilities
    ├── security/                  # Authentication
    └── reporting/                 # Data export
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 12+
- Redis 6+
- npm or yarn

### Installation

1. **Clone repository:**
```bash
git clone https://github.com/TlokotseSM/fincomply.git
cd fincomply
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
cp .env.example .env
```
Edit `.env` with your:
- Database credentials
- JWT secret
- Exchange rate API keys
- Payment processor credentials

4. **Run migrations:**
```bash
npm run migrate:run
```

5. **Start services:**
```bash
npm run start:dev
```

6. **Access:**
- API Docs: http://localhost:3000/api
- Health Check: http://localhost:3000/health

## 📚 API Documentation

### Interactive Swagger UI
Available at `http://localhost:3000/api`

**Key Endpoint Categories:**
- `/api/payroll` - Salary processing
- `/api/compliance` - Regulatory tracking
- `/api/employees` - Worker management
- `/api/reports` - Financial analytics
- `/api/integrations` - Third-party connections

### Example Payroll Flow

1. **Create payrun:**
```http
POST /api/payroll/payruns
{
  "companyId": "uuid",
  "period": "2025-03",
  "currency": "USD"
}
```

2. **Add payments:**
```http
POST /api/payroll/payments
{
  "payrunId": "uuid",
  "employeeId": "uuid",
  "grossAmount": 5000,
  "currency": "USD"
}
```

3. **Process payrun:**
```http
POST /api/payroll/payruns/:id/process
```

## 🗄️ Database Schema

### Core Tables

**employees**
```sql
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  hire_date DATE NOT NULL,
  termination_date DATE,
  country_code CHAR(2) NOT NULL,
  tax_identifier VARCHAR(100),
  visa_expiry DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**payments**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  payrun_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  gross_amount DECIMAL(12,2) NOT NULL,
  net_amount DECIMAL(12,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  payment_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'draft', 'approved', 'processed'
  tax_details JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**compliance_documents**
```sql
CREATE TABLE compliance_documents (
  id UUID PRIMARY KEY,
  employee_id UUID NOT NULL,
  document_type VARCHAR(100) NOT NULL, -- 'visa', 'work_permit', 'tax_form'
  country_code CHAR(2) NOT NULL,
  expiry_date DATE,
  file_reference VARCHAR(255),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔧 Development

### Scripts
```bash
# Run with test data
npm run start:dev

# Run tests
npm test

# Generate migration
npm run migrate:generate --name=feature_name

# Run linter
npm run lint

# Format code
npm run format
```

### Testing Strategy
- **Unit Tests**: Core financial calculations
- **Integration Tests**: Database operations
- **E2E Tests**: API endpoints
- **Snapshot Tests**: Financial reports
- **Performance Tests**: Payrun processing

## 🛡️ Security

### Financial Data Protection
- **Encryption**: AES-256 for sensitive fields
- **Masking**: Automatic PII redaction
- **Access Logs**: All financial transactions logged
- **IP Restrictions**: Configurable network controls
- **2FA**: Required for payment processing

### Compliance Features
- **GDPR**: Right to be forgotten
- **SOC 2**: Audit trails
- **PCI DSS**: Payment data isolation
- **HIPAA**: Healthcare data protections
- **ISO 27001**: Security controls

## 🚀 Deployment

### Docker Setup
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Kubernetes Example
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fincomply-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fincomply
  template:
    spec:
      containers:
      - name: fincomply
        image: fincomply:1.0.0
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: fincomply-secrets
```

## 📈 Roadmap

### Phase 1: Core Financials ✅
- Multi-currency payroll engine
- Basic tax calculations
- Employee management
- API foundation

### Phase 2: Global Compliance 🚧
- Visa/work permit tracking
- Automated tax filings
- Benefits administration
- Advanced reporting

### Phase 3: Enterprise Features 📋
- Approval workflows
- Cost allocation
- Budget integration
- Headcount planning

### Phase 4: Intelligence Layer 🧠
- Currency hedging
- Compliance risk scoring
- Predictive analytics
- AI-assisted filings

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit with descriptive messages
4. Push to the branch
5. Open a pull request

**Guidelines:**
- Follow financial data best practices
- Maintain audit trails
- Document all calculations
- Include tests for financial logic

## 📞 Support

**For help:**
- GitHub Issues
- Email: tlokotsemogudi@gmail.com
- Slack Community

**For security issues:**
- tlokotsemogudi@gmail.com

## 📄 License

MIT License - See [LICENSE](LICENSE)

## 🙏 Acknowledgments

- NestJS team
- Open-source financial libraries
- Global tax experts
- Compliance specialists

## 👨‍💻 Author

**Tlokotse Mogudi**

- GitHub: [TlokotseSM](https://github.com/TlokotseSM)
- LinkedIn: [Tlokotse Mogudi](https://www.linkedin.com/in/tlokotse-mogudi/)
- Twitter: [@Semakaleng_T](https://x.com/Semakaleng_T)

---

<p align="center">
  ⭐️ <b>Star this project if you find it useful!</b> ⭐️
  <br><br>
  <a href="https://github.com/TlokotseSM/fincomply/stargazers">
    <img src="https://img.shields.io/github/stars/TlokotseSM/fincomply?style=social" alt="GitHub Stars">
  </a>
</p>
