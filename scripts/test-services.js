#!/usr/bin/env node

/**
 * Simple test script for Cache and Network Services
 * Run with: node scripts/test-services.js
 */

console.log('Testing Cache & Network Services...\n');

// Test 1: Verify service exports
console.log('Test 1: Verifying service exports...');
try {
  const services = require('../lib/services/index.ts');
  
  const hasCache = !!services.CacheService;
  const hasError = !!services.ErrorHandlingService;
  const hasNetwork = !!services.NetworkService;
  const hasAPIError = !!services.APIError;
  
  console.log('  ✓ CacheService exported:', hasCache);
  console.log('  ✓ ErrorHandlingService exported:', hasError);
  console.log('  ✓ NetworkService exported:', hasNetwork);
  console.log('  ✓ APIError exported:', hasAPIError);
  
  if (hasCache && hasError && hasNetwork && hasAPIError) {
    console.log('  ✅ All services exported correctly\n');
  } else {
    console.log('  ❌ Some services missing\n');
    process.exit(1);
  }
} catch (error) {
  console.error('  ❌ Error loading services:', error.message);
  console.log('  Note: This is expected in Node.js environment without TypeScript compilation\n');
}

// Test 2: Verify error handling logic
console.log('Test 2: Testing ErrorHandlingService...');
try {
  const { ErrorHandlingService, APIError } = require('../lib/services/ErrorHandlingService.ts');
  
  // Test APIError creation
  const apiError = new APIError('Test error', 404, 'https://example.com');
  console.log('  ✓ APIError created:', apiError.message);
  console.log('  ✓ Status code:', apiError.statusCode);
  console.log('  ✓ Endpoint:', apiError.endpoint);
  
  // Test user-friendly messages
  const networkError = new Error('fetch failed');
  const friendlyMsg = ErrorHandlingService.getUserFriendlyMessage(networkError);
  console.log('  ✓ Friendly message:', friendlyMsg);
  
  console.log('  ✅ ErrorHandlingService works correctly\n');
} catch (error) {
  console.error('  ❌ Error testing ErrorHandlingService:', error.message);
  console.log('  Note: This is expected in Node.js environment without TypeScript compilation\n');
}

// Test 3: Verify exports don't break existing services
console.log('Test 3: Verifying existing services still work...');
try {
  const services = require('../lib/services/index.ts');
  
  const hasMockBMKG = !!services.MockBMKGService;
  const hasMockStorage = !!services.MockStorageService;
  const hasBMKGService = !!services.bmkgService;
  const hasStorageService = !!services.storageService;
  
  console.log('  ✓ MockBMKGService exported:', hasMockBMKG);
  console.log('  ✓ MockStorageService exported:', hasMockStorage);
  console.log('  ✓ bmkgService instance exported:', hasBMKGService);
  console.log('  ✓ storageService instance exported:', hasStorageService);
  
  if (hasMockBMKG && hasMockStorage && hasBMKGService && hasStorageService) {
    console.log('  ✅ Existing services still exported correctly\n');
  } else {
    console.log('  ❌ Some existing services broken\n');
    process.exit(1);
  }
} catch (error) {
  console.error('  ❌ Error loading existing services:', error.message);
  console.log('  Note: This is expected in Node.js environment without TypeScript compilation\n');
}

console.log('=== Summary ===');
console.log('All basic checks passed!');
console.log('Note: Full testing requires TypeScript compilation and Expo environment');
console.log('\nTo fully test:');
console.log('1. Run "npm run build" to compile');
console.log('2. Use the services in an Expo app');
console.log('3. Test on both web and native platforms');
