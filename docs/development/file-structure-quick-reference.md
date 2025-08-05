# File Structure Quick Reference

## 🎯 Where to Put Files

| File Type | Location | Example |
|-----------|----------|---------|
| **Backend Code** | `src/backend/` | `src/backend/api/banks/bankRoutes.ts` |
| **Frontend Code** | `src/frontend/` | `src/frontend/components/BankSelection.tsx` |
| **Shared Code** | `src/shared/` | `src/shared/types/bank.ts` |
| **Infrastructure** | `src/infrastructure/` | `src/infrastructure/mcp-servers/` |
| **Documentation** | `docs/` | `docs/api/banks.md` |
| **Tests** | `tests/` | `tests/unit/backend/BankService.test.ts` |
| **Deployment** | `deployment/` | `deployment/docker-compose.yml` |
| **Demos** | `demo/` | `demo/bank-selection-demo.html` |
| **Requirements** | `economy-simulator-prd/` | `economy-simulator-prd/prd/features/` |

## 🚨 Common Mistakes

| ❌ Wrong | ✅ Correct |
|----------|------------|
| `prd/features/src/backend/` | `src/backend/` |
| `prd/features/docs/deployment/` | `docs/deployment/` |
| `docker-compose.yml` (root) | `deployment/docker-compose.yml` |
| `prd/features/demo/` | `demo/` |

## 🔧 Quick Commands

```bash
# Validate file structure
./scripts/validate-file-structure.sh

# Create new backend API
mkdir -p src/backend/api/banks && touch src/backend/api/banks/bankRoutes.ts

# Create new frontend component
mkdir -p src/frontend/components/BankSelection && touch src/frontend/components/BankSelection/BankSelection.tsx

# Create new documentation
mkdir -p docs/api && touch docs/api/api-banks.md

# Create new test
mkdir -p tests/unit/backend && touch tests/unit/backend/BankService.test.ts
```

## 📋 Pre-commit Checklist

- [ ] All new files are in correct directories
- [ ] No source code in `economy-simulator-prd/`
- [ ] No docs in `prd/features/docs/`
- [ ] No deployment files in root
- [ ] File names follow conventions
- [ ] Directory structure matches README

## 📖 Full Guide

See `docs/development/file-structure-guide.md` for complete details. 