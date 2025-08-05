# File Structure Guide

This document ensures all team members follow the correct file structure hierarchy for the Economy Simulator project.

## 📁 Project Structure Overview

```
Economy-Simulator/
├── economy-simulator-prd/          # Product Requirements & Documentation
│   └── prd/                       # Product requirements documents
├── src/                           # Source Code
│   ├── backend/                   # Backend Services
│   │   ├── api/                   # API endpoints and controllers
│   │   ├── services/              # Business logic services
│   │   ├── database/              # Database models and migrations
│   │   ├── models/                # Data models
│   │   └── utils/                 # Backend utilities
│   ├── frontend/                  # Frontend Application
│   │   ├── components/            # React/Vue components
│   │   ├── pages/                 # Page components
│   │   ├── utils/                 # Frontend utilities
│   │   └── styles/                # CSS/SCSS styles
│   ├── shared/                    # Shared Code
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── constants/             # Shared constants
│   │   └── utils/                 # Shared utilities
│   └── infrastructure/            # Infrastructure Components
│       ├── mcp-servers/           # Model Context Protocol servers
│       ├── data-pipelines/        # Data processing pipelines
│       └── monitoring/            # Monitoring and observability
├── docs/                          # Documentation
│   ├── api/                       # API documentation
│   ├── architecture/              # System architecture docs
│   ├── deployment/                # Deployment guides
│   └── user-guides/               # User documentation
├── tests/                         # Test Suites
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # End-to-end tests
├── deployment/                    # Deployment Configuration
│   ├── docker/                    # Docker configurations
│   ├── kubernetes/                # Kubernetes manifests
│   └── terraform/                 # Infrastructure as Code
├── demo/                          # Demo files
└── README.md                      # This file
```

## 🎯 File Placement Rules

### ✅ Where Files Should Go

| File Type | Location | Examples |
|-----------|----------|----------|
| **Backend Code** | `src/backend/` | API routes, services, models |
| **Frontend Code** | `src/frontend/` | React components, pages, styles |
| **Shared Code** | `src/shared/` | TypeScript types, utilities |
| **Infrastructure** | `src/infrastructure/` | MCP servers, data pipelines |
| **Documentation** | `docs/` | API docs, architecture, guides |
| **Tests** | `tests/` | Unit, integration, e2e tests |
| **Deployment** | `deployment/` | Docker, K8s, Terraform configs |
| **Demos** | `demo/` | HTML demos, examples |
| **Requirements** | `economy-simulator-prd/` | PRD, feature docs, schemas |

### ❌ Where Files Should NOT Go

- **Never put source code in `economy-simulator-prd/`**
- **Never put docs in `prd/features/docs/`**
- **Never put deployment files in root directory**
- **Never put demo files in `prd/features/demo/`**

## 🔧 Development Workflow

### Before Creating New Files

1. **Check this guide** for the correct location
2. **Use the file structure validator** (see below)
3. **Follow naming conventions** (see below)

### File Creation Checklist

- [ ] Is this source code? → `src/` directory
- [ ] Is this documentation? → `docs/` directory  
- [ ] Is this a test? → `tests/` directory
- [ ] Is this deployment config? → `deployment/` directory
- [ ] Is this a demo? → `demo/` directory
- [ ] Is this a requirement? → `economy-simulator-prd/` directory

## 📝 Naming Conventions

### Backend Files
- **Controllers**: `*Controller.ts` (e.g., `BankController.ts`)
- **Services**: `*Service.ts` (e.g., `BankService.ts`)
- **Models**: `*Model.ts` or `*Entity.ts` (e.g., `Bank.ts`)
- **Routes**: `*Routes.ts` (e.g., `bankRoutes.ts`)
- **Utils**: `*Utils.ts` or `*Helper.ts` (e.g., `logger.ts`)

### Frontend Files
- **Components**: `*Component.tsx` or `*.tsx` (e.g., `BankSelection.tsx`)
- **Pages**: `index.tsx` in page directories
- **Services**: `*Service.ts` (e.g., `bankService.ts`)
- **Types**: `*.types.ts` or `*.d.ts` (e.g., `bank.types.ts`)

### Documentation Files
- **API Docs**: `api-*.md` (e.g., `api-banks.md`)
- **Architecture**: `architecture-*.md` (e.g., `architecture-overview.md`)
- **Deployment**: `deployment-*.md` (e.g., `deployment-guide.md`)

## 🛠️ Tools and Scripts

### File Structure Validator

Run this script to check for misplaced files:

```bash
./scripts/validate-file-structure.sh
```

### Quick Reference Commands

```bash
# Create new backend API route
mkdir -p src/backend/api/banks && touch src/backend/api/banks/bankRoutes.ts

# Create new frontend component
mkdir -p src/frontend/components/BankSelection && touch src/frontend/components/BankSelection/BankSelection.tsx

# Create new documentation
mkdir -p docs/api && touch docs/api/api-banks.md

# Create new test
mkdir -p tests/unit/backend && touch tests/unit/backend/BankService.test.ts
```

## 🚨 Common Mistakes to Avoid

1. **❌ Creating `src/` inside `prd/features/`**
   - ✅ Correct: `src/backend/`
   - ❌ Wrong: `economy-simulator-prd/prd/features/src/backend/`

2. **❌ Putting docs in wrong location**
   - ✅ Correct: `docs/deployment/`
   - ❌ Wrong: `economy-simulator-prd/prd/features/docs/deployment/`

3. **❌ Creating deployment files in root**
   - ✅ Correct: `deployment/docker-compose.yml`
   - ❌ Wrong: `docker-compose.yml` (in root)

4. **❌ Mixing source code with documentation**
   - ✅ Correct: Keep source code in `src/`
   - ❌ Wrong: Put TypeScript files in `docs/`

## 🔍 Validation Commands

### Check for Misplaced Files

```bash
# Find any source files in wrong locations
find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" | grep -E "(prd/features/src|docs/.*\.ts|demo/.*\.ts)"

# Find any docs in wrong locations  
find . -name "*.md" | grep -E "(prd/features/docs|src/.*\.md)"

# Find any deployment files in root
find . -maxdepth 1 -name "docker-compose.yml" -o -name "*.sh" | grep -v "README"
```

### Validate Structure

```bash
# Check if all required directories exist
ls -la | grep -E "(src|docs|tests|deployment|demo)"

# Check backend structure
ls -la src/backend/ | grep -E "(api|services|models|utils)"

# Check frontend structure  
ls -la src/frontend/ | grep -E "(components|pages|services|styles)"
```

## 📋 Pre-commit Checklist

Before committing changes, verify:

- [ ] All new files are in the correct directories
- [ ] No source code is in `economy-simulator-prd/`
- [ ] No docs are in `prd/features/docs/`
- [ ] No deployment files are in root directory
- [ ] File names follow naming conventions
- [ ] Directory structure matches README

## 🆘 Getting Help

If you're unsure where to place a file:

1. **Check this guide first**
2. **Look at similar existing files**
3. **Ask the team for clarification**
4. **Use the validation scripts**

Remember: **When in doubt, refer to the README.md file structure!** 