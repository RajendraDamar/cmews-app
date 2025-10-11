# Worklets Conflict - Quick Reference

## The Problem

```
Uncaught Error
[Worklets] createSerializableObject should never be called in JSWorklets.

Error: ENOENT: no such file or directory, open 'C:\Users\Damar\Downloads\Github\cmews-app\unknown'
```

## The Cause

**Two worklets runtimes trying to run at the same time:**
- `react-native-reanimated` (includes worklets)
- `react-native-worklets` (standalone - was listed as direct dependency)

## The Fix

**Removed `react-native-worklets` from `package.json`**

Why? Because `react-native-reanimated` v4+ already includes worklets. Having both causes conflicts.

## How to Verify

```bash
# Quick test
./test-worklets-fix.sh

# Check dependency tree
npm ls react-native-worklets
# Should show: └─┬ react-native-reanimated@4.1.2 → react-native-worklets@0.5.1

# Start the app
npx expo start --clear
```

## More Information

- **Full details:** See `WORKLETS_FIX.md`
- **Previous Metro fixes:** See `METRO_FIX_SUMMARY.md` and `STARTUP_ERROR_FIX.md`

## Key Takeaway

**Never install `react-native-worklets` as a direct dependency when using `react-native-reanimated` v3+**

The reanimated package manages worklets internally. Installing both creates conflicts.
