#!/bin/bash

echo "🔍 Validating Economy Simulator file structure..."

# Check for source files in wrong locations
echo "📁 Checking for source files in wrong locations..."

if find . -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.json" | grep -q "prd/features/src"; then
    echo "❌ ERROR: Found source files in prd/features/src/"
    exit 1
else
    echo "✅ SUCCESS: No source files found in wrong locations"
fi

# Check for docs in wrong locations
echo "📚 Checking for documentation in wrong locations..."

if find . -name "*.md" | grep -q "prd/features/docs"; then
    echo "❌ ERROR: Found documentation in prd/features/docs/"
    exit 1
else
    echo "✅ SUCCESS: No documentation found in wrong locations"
fi

# Check for deployment files in root
echo "🚀 Checking for deployment files in root directory..."

if find . -maxdepth 1 -name "docker-compose.yml" -o -name "*.sh" | grep -q -v "README" | grep -q -v "package.json"; then
    echo "❌ ERROR: Found deployment files in root directory"
    exit 1
else
    echo "✅ SUCCESS: No deployment files found in root directory"
fi

# Check required directories
echo "📂 Checking required directory structure..."

for dir in src docs tests deployment demo; do
    if [ -d "$dir" ]; then
        echo "✅ SUCCESS: Directory '$dir' exists"
    else
        echo "❌ ERROR: Required directory '$dir' is missing"
        exit 1
    fi
done

echo ""
echo "🎉 All checks passed! File structure is correct."
