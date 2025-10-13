#!/bin/bash

# Verify Web Setup Script
# Checks if all required files for web platform are present

echo "🔍 Verifying CMEWS Web Platform Setup..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check 1: CanvasKit WASM file
echo "1. Checking CanvasKit WASM file..."
if [ -f "public/canvaskit.wasm" ]; then
    size=$(du -h public/canvaskit.wasm | cut -f1)
    echo -e "   ${GREEN}✓${NC} Found: public/canvaskit.wasm ($size)"
    
    # Verify size is approximately 7.7MB
    size_bytes=$(stat -f%z public/canvaskit.wasm 2>/dev/null || stat -c%s public/canvaskit.wasm 2>/dev/null)
    if [ $size_bytes -lt 7000000 ] || [ $size_bytes -gt 9000000 ]; then
        echo -e "   ${YELLOW}⚠${NC}  Warning: File size seems incorrect (expected ~7.7MB)"
        warnings=$((warnings+1))
    fi
else
    echo -e "   ${RED}✗${NC} Missing: public/canvaskit.wasm"
    echo "   Run: npx setup-skia-web"
    errors=$((errors+1))
fi
echo ""

# Check 2: Node modules
echo "2. Checking dependencies..."
if [ -d "node_modules/@shopify/react-native-skia" ]; then
    echo -e "   ${GREEN}✓${NC} React Native Skia installed"
else
    echo -e "   ${RED}✗${NC} Missing: @shopify/react-native-skia"
    echo "   Run: npm install"
    errors=$((errors+1))
fi

if [ -d "node_modules/react-native-reanimated" ]; then
    echo -e "   ${GREEN}✓${NC} React Native Reanimated installed"
else
    echo -e "   ${RED}✗${NC} Missing: react-native-reanimated"
    echo "   Run: npm install"
    errors=$((errors+1))
fi
echo ""

# Check 3: Required files
echo "3. Checking required files..."
required_files=(
    "components/charts/SmartChartWrapper.tsx"
    "lib/canvaskit-loader.ts"
    "app.json"
)

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "   ${GREEN}✓${NC} Found: $file"
    else
        echo -e "   ${RED}✗${NC} Missing: $file"
        errors=$((errors+1))
    fi
done
echo ""

# Check 4: Configuration
echo "4. Checking configuration..."
if grep -q '"bundler": "metro"' app.json; then
    echo -e "   ${GREEN}✓${NC} Metro bundler configured for web"
else
    echo -e "   ${YELLOW}⚠${NC}  Warning: Metro bundler not configured in app.json"
    warnings=$((warnings+1))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $errors -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "You can now run:"
    echo "  npm run web"
    echo ""
    echo "Charts should render properly on web platform."
elif [ $errors -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup complete with $warnings warning(s)${NC}"
    echo ""
    echo "You can run: npm run web"
else
    echo -e "${RED}✗ Found $errors error(s) and $warnings warning(s)${NC}"
    echo ""
    echo "Please fix the errors above before running web platform."
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
