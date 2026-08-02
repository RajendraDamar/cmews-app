# Cache & Network Services

This directory contains robust caching, network, and error handling services for the CMEWS app.

## Services Overview

### 1. CacheService

File-based caching with TTL (Time-to-Live) support using Expo FileSystem.

**Features:**
- Cross-platform support (iOS, Android, Web)
- Configurable TTL per cache entry
- Automatic expiration handling
- Cache cleanup utilities

**Usage:**

```typescript
import { CacheService } from '@/lib/services';

const cache = new CacheService();
await cache.init();

// Save with 30-minute TTL (default)
await cache.set('weather-jakarta', weatherData);

// Save with custom TTL (10 minutes for warnings)
await cache.set('early-warnings', warningData, 600000);

// Retrieve
const data = await cache.get('weather-jakarta');

// Clear expired entries
await cache.clearExpired();

// Clear all cache
await cache.clear();
```

**Recommended TTL Values:**
- Weather data: 1800000ms (30 minutes)
- Early warnings: 600000ms (10 minutes)
- Maritime data: 1800000ms (30 minutes)

### 2. ErrorHandlingService

Error handling utilities with retry logic and exponential backoff.

**Features:**
- Automatic retry with exponential backoff
- Custom APIError class for structured errors
- Error type detection (network, BMKG API, etc.)
- User-friendly error messages (Indonesian)

**Usage:**

```typescript
import { ErrorHandlingService, APIError } from '@/lib/services';

// Retry an operation with exponential backoff
const result = await ErrorHandlingService.withRetry(
  async () => {
    const response = await fetch('https://api.bmkg.go.id/...');
    if (!response.ok) {
      throw new APIError('API failed', response.status, response.url);
    }
    return await response.json();
  },
  3,    // max retries (default: 3)
  1000  // initial delay in ms (default: 1000ms)
);

// Get user-friendly error message
const message = ErrorHandlingService.getUserFriendlyMessage(error);

// Check error types
if (ErrorHandlingService.isNetworkError(error)) {
  console.log('Network issue detected');
}

if (ErrorHandlingService.isBMKGError(error)) {
  console.log('BMKG API issue detected');
}
```

**Retry Behavior:**
- Attempt 1: Immediate
- Attempt 2: 1 second delay
- Attempt 3: 2 second delay (exponential backoff: 1000 * 2^(attempt-1))

### 3. NetworkService

Network request utilities with timeout and error handling.

**Features:**
- Automatic timeout handling (10 seconds default)
- Convenience methods for GET/POST
- Network connectivity check
- Integrated retry support

**Usage:**

```typescript
import { NetworkService } from '@/lib/services';

const network = new NetworkService();

// Simple GET request
const data = await network.get('https://api.example.com/data');

// POST request
const result = await network.post(
  'https://api.example.com/submit',
  { key: 'value' }
);

// Request with custom configuration
const response = await network.request('https://api.example.com/data', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' },
  timeout: 5000  // 5 second timeout
});

// Check connectivity
const isOnline = await network.checkConnectivity();

// Request with automatic retry
const dataWithRetry = await network.requestWithRetry(
  'https://api.example.com/data',
  { method: 'GET' },
  3  // max retries
);
```

## Combined Usage Example

Typical pattern: cached API call with retry logic

```typescript
import { 
  CacheService, 
  NetworkService, 
  ErrorHandlingService 
} from '@/lib/services';

async function fetchWeatherData(wilayahCode: string) {
  const cache = new CacheService();
  const network = new NetworkService();
  
  await cache.init();

  // Check cache first
  const cacheKey = `weather-${wilayahCode}`;
  let data = await cache.get(cacheKey);

  if (data) {
    console.log('Using cached data');
    return data;
  }

  // Cache miss - fetch with retry
  try {
    data = await ErrorHandlingService.withRetry(
      async () => {
        return await network.get(
          `https://api.bmkg.go.id/publik/prakiraan-cuaca?adm4=${wilayahCode}`
        );
      },
      3,
      1000
    );

    // Cache for 30 minutes
    await cache.set(cacheKey, data, 1800000);

    return data;
  } catch (error) {
    const message = ErrorHandlingService.getUserFriendlyMessage(error);
    throw new Error(message);
  }
}
```

## Architecture Notes

### Cross-Platform Compatibility

All services are designed to work on:
- iOS (native)
- Android (native)
- Web

**CacheService** uses Expo FileSystem's new API:
- `Paths.document` for document directory
- `Directory` class for directory operations
- `File` class for file operations

These classes automatically handle platform differences.

### Error Handling Strategy

1. **Network Errors**: Automatically retried with exponential backoff
2. **API Errors**: Categorized by status code
3. **Cache Errors**: Gracefully degraded (return null)
4. **User Feedback**: Indonesian language error messages

### Performance Considerations

- **Cache**: File-based, no memory overhead
- **Network**: 10-second default timeout prevents hanging
- **Retry**: Max 3 attempts to avoid excessive delays
- **Cleanup**: Manual cache cleanup recommended (not automatic)

## Testing

See `examples.ts` for comprehensive usage examples.

### Manual Testing Checklist

- [ ] Test CacheService on iOS
- [ ] Test CacheService on Android
- [ ] Test CacheService on Web
- [ ] Test NetworkService with real BMKG API
- [ ] Test retry logic with simulated failures
- [ ] Test cache expiration (set short TTL)
- [ ] Test offline behavior

## Integration with Existing Services

These services are **independent** and do **not** modify existing services:

- ✅ `MockBMKGService` - unchanged
- ✅ `MockStorageService` - unchanged
- ✅ All existing exports preserved

They can be used alongside existing services or integrated gradually.

## Future Enhancements

Potential improvements for future iterations:

1. **CacheService**:
   - LRU (Least Recently Used) eviction
   - Cache size limits
   - Automatic background cleanup

2. **NetworkService**:
   - Request queuing
   - Rate limiting
   - Upload progress tracking

3. **ErrorHandlingService**:
   - Custom retry strategies per error type
   - Error logging/analytics integration
   - Circuit breaker pattern

## Files

- `CacheService.ts` - File-based caching with TTL
- `ErrorHandlingService.ts` - Retry logic and error utilities
- `NetworkService.ts` - Network request utilities
- `examples.ts` - Usage examples
- `index.ts` - Barrel exports
- `README.md` - This file

## Dependencies

- `expo-file-system` (v19.0.17) - For file operations
- Native `fetch` - For network requests
- No additional dependencies required

## License

Part of the CMEWS (Comprehensive Maritime Early Warning System) application.
