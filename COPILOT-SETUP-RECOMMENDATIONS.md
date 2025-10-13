# COPILOT-SETUP-RECOMMENDATIONS.md

## GitHub Copilot Setup Steps - Enhancement Recommendations

This document provides detailed recommendations for optimizing the `copilot-setup-steps.yml` workflow for the CMEWS App.

---

## 🎯 What This Workflow Does

The `copilot-setup-steps.yml` workflow prepares the development environment for GitHub Copilot by:

1. **Validating project structure** - Ensures all required directories and files exist
2. **Checking dependencies** - Verifies core libraries are installed
3. **Running quality checks** - Validates TypeScript, linting, and formatting
4. **Building the project** - Confirms the app can be built successfully
5. **Providing context** - Gives Copilot important information about the project

---

## ✅ Current Enhancements Made

### 1. **AGENTS.md Compliance Validation**
- Checks that AGENTS.md exists (required for development guidelines)
- Warns about extra documentation files (only README.md, CHANGES.md, AGENTS.md allowed per principle #8)
- Validates documentation structure

### 2. **Enhanced Project Structure Validation**
- Validates all required directories: `app`, `components`, `lib`, `store`, `lib/data`, `lib/services`
- Checks for mock data files: `weather-mock.ts`, `warning-mock.ts`, `maritime-mock.ts`
- Verifies service layer files exist: `MockBMKGService.ts`, `MockStorageService.ts`, `types.ts`

### 3. **Expo & React Native Specific Checks**
- Verifies Expo SDK 54+ is installed
- Checks React Native 0.81 compatibility
- Validates Expo Router for file-based navigation
- Confirms NativeWind 4 and Zustand are present

### 4. **Cross-Platform Library Verification**
- Confirms React Native Chart Kit is installed (per AGENTS.md migration from ECharts)
- Validates MapLibre libraries for both native and web
- Checks for Lucide React Native icons

### 5. **Cross-Platform Compatibility Scanning**
- Detects `Platform.OS` usage and reminds about web fallbacks
- Warns about React Native Reanimated usage without web guards (performance concerns per AGENTS.md)

### 6. **Mock Data Integrity Checks**
- Validates that mock data files export the required constants
- Ensures exports match BMKG API schema requirements:
  - `mockWeatherForecast` and `mockWeatherData` from weather-mock.ts
  - `mockEarlyWarning` from warning-mock.ts
  - `mockMaritimeWeather` from maritime-mock.ts

### 7. **Comprehensive Context Summary**
- Provides a detailed summary of project status
- Lists key AGENTS.md principles
- Shows available NPM commands
- Documents mock data APIs
- Gives Copilot clear context about the project phase (Frontend Development with Mock Data)

---

## 🔧 How to Further Customize

### Option 1: Add Performance Benchmarks

Add a step to measure build and bundle sizes:

```yaml
- name: Performance metrics
  run: |
    echo "::group::Performance Metrics"
    # Measure bundle size
    if [ -f "dist/_expo/static/js/web/entry-*.js" ]; then
      bundle_size=$(du -sh dist/_expo/static/js/web/entry-*.js | awk '{print $1}')
      echo "📦 Bundle size: $bundle_size"
    fi
    
    # Measure build time (already tracked in build step)
    echo "⏱️ Check build duration in previous step logs"
    echo "::endgroup::"
```

### Option 2: Add Security Scanning

Check for sensitive data or API keys:

```yaml
- name: Security scan
  run: |
    echo "::group::Security Scan"
    # Check for hardcoded secrets
    if grep -r "API_KEY\|SECRET\|PASSWORD" app/ lib/ --include="*.ts" --include="*.tsx" | grep -v "mock" | grep -v "example"; then
      echo "::warning::Potential hardcoded secrets found"
    fi
    
    # Validate .gitignore covers sensitive files
    if [ -f ".gitignore" ]; then
      echo "✓ .gitignore present"
    fi
    echo "::endgroup::"
```

### Option 3: Add Dependency Audit

Check for vulnerable dependencies:

```yaml
- name: Dependency audit
  run: |
    echo "::group::Dependency Audit"
    npm audit --production || echo "::warning::Vulnerabilities found in dependencies"
    echo "::endgroup::"
  continue-on-error: true
```

### Option 4: Add Web-Specific Validation

Since the app supports web, add web-specific checks:

```yaml
- name: Web platform validation
  run: |
    echo "::group::Web Platform Checks"
    # Check for web-specific configs
    if [ -f "metro.config.js" ]; then
      echo "✓ Metro bundler configured"
    fi
    
    # Validate CanvasKit setup for Skia charts
    if [ ! -f "public/canvaskit.wasm" ]; then
      echo "::warning::Run 'npm run setup:web' to generate CanvasKit WASM for Skia charts on web"
    fi
    
    # Check for react-native-web compatibility
    if npm list react-native-web >/dev/null 2>&1; then
      echo "✓ react-native-web installed for web support"
    fi
    echo "::endgroup::"
```

### Option 5: Add Test Coverage (When Tests are Added)

Currently, the project has no tests. When they're added:

```yaml
- name: Run tests
  run: |
    echo "::group::Test Execution"
    if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
      npm test
      echo "✓ All tests passed"
    else
      echo "::notice::No tests configured (add 'test' script to package.json)"
    fi
    echo "::endgroup::"
  continue-on-error: true
```

---

## 📋 Workflow Execution Summary

When this workflow runs, it will:

1. ✅ Install dependencies
2. ✅ Validate AGENTS.md compliance
3. ✅ Check project structure (directories and files)
4. ✅ Verify Expo/React Native setup
5. ✅ Confirm cross-platform libraries
6. ✅ Compile TypeScript
7. ✅ Run linting and formatting checks
8. ✅ Build the production bundle
9. ✅ Scan for cross-platform compatibility issues
10. ✅ Validate mock data integrity
11. ✅ Generate comprehensive context summary

---

## 🚀 Benefits for GitHub Copilot

This enhanced workflow provides Copilot with:

- **Clear project context** - Understanding of Expo/React Native setup
- **Development phase awareness** - Knows we're in frontend-first mock data phase
- **Library knowledge** - Aware of Chart Kit, MapLibre, NativeWind usage
- **Constraint awareness** - Understands AGENTS.md principles and limitations
- **Quality gates** - Ensures code meets TypeScript, linting, and build standards
- **Cross-platform reminders** - Highlights platform-specific code concerns

---

## 🔄 When to Update This Workflow

Update the workflow when:

1. **Moving to real API integration** - Add API endpoint validation
2. **Adding tests** - Include test execution steps
3. **Adding new critical dependencies** - Update verification checks
4. **Changing deployment targets** - Add platform-specific validations
5. **Implementing CI/CD** - Add deployment-specific steps

---

## 💡 Pro Tips

1. **Keep it focused** - Don't add checks that slow down the workflow unnecessarily
2. **Use warnings, not errors** - For non-critical issues, use `::warning::` instead of failing
3. **Group related checks** - Use `::group::` for better log organization
4. **Provide context** - Each check should explain what it validates and why
5. **Make it actionable** - When issues are found, suggest how to fix them

---

## 📚 Related Documentation

- [GitHub Copilot Setup Steps Documentation](https://gh.io/copilot/actions-setup-steps)
- [AGENTS.md](./AGENTS.md) - Project development guidelines
- [README.md](./README.md) - Project overview and setup
- [CHANGES.md](./CHANGES.md) - Change history and implementation details

---

## ✨ Summary

The enhanced `copilot-setup-steps.yml` workflow is now tailored specifically for the CMEWS App, providing:

- ✅ AGENTS.md compliance validation
- ✅ Mock data integrity checks
- ✅ Cross-platform compatibility scanning
- ✅ Expo/React Native specific validations
- ✅ Comprehensive development context

This ensures GitHub Copilot has all the information needed to make intelligent, context-aware suggestions that align with the project's architecture and guidelines.
