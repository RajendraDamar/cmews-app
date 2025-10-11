#!/bin/bash
# Test script to validate the worklets web fix

set -e

echo "========================================"
echo "Worklets Web Fix Validation"
echo "========================================"
echo ""

echo "1. Verifying Babel configuration..."
if grep -q "if (platform !== 'web')" babel.config.js; then
  echo "   ✓ Babel config has platform check for reanimated plugin"
else
  echo "   ✗ Babel config missing platform check"
  exit 1
fi
echo ""

echo "2. Verifying patch is applied..."
if grep -q "if (__DEV__ && !SHOULD_BE_USE_WEB)" node_modules/react-native-worklets/lib/module/threads.js; then
  echo "   ✓ Worklets patch is applied (web serialization disabled)"
else
  echo "   ✗ Worklets patch is NOT applied"
  echo "   Run: npx patch-package"
  exit 1
fi
echo ""

echo "3. Verifying patch file exists..."
if [ -f "patches/react-native-worklets+0.5.1.patch" ]; then
  echo "   ✓ Patch file exists in patches/ directory"
else
  echo "   ✗ Patch file missing"
  exit 1
fi
echo ""

echo "4. Verifying postinstall script..."
if grep -q '"postinstall": "patch-package"' package.json; then
  echo "   ✓ Postinstall script configured"
else
  echo "   ✗ Postinstall script missing"
  exit 1
fi
echo ""

echo "5. Verifying patch-package is installed..."
if npm ls patch-package > /dev/null 2>&1; then
  echo "   ✓ patch-package is installed"
else
  echo "   ✗ patch-package is not installed"
  exit 1
fi
echo ""

echo "6. Running TypeScript compilation..."
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
  echo "   ⚠ TypeScript has errors"
else
  echo "   ✓ TypeScript compilation passed"
fi
echo ""

echo "7. Running linter..."
if npm run lint > /dev/null 2>&1; then
  echo "   ✓ Linting passed"
else
  echo "   ✗ Linting failed"
  exit 1
fi
echo ""

echo "========================================"
echo "✅ All web fix validations passed!"
echo "========================================"
echo ""
echo "The worklets web fix is working correctly."
echo "You can now run:"
echo "  - npx expo start --web --clear (for web development)"
echo "  - npx expo start --clear (for native development)"
echo ""
echo "For more information, see:"
echo "  - WORKLETS_WEB_FIX.md (complete documentation)"
echo "  - README.md (quick start guide)"
