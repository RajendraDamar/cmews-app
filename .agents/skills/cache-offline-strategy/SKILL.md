---
name: cache-offline-strategy
description: Offline data caching and error handling strategy for cmews-app — covers CacheService with expo-file-system, TTL rules, retry logic with exponential backoff, and network error recovery.
---

# Cache & Offline Strategy Skill

This skill covers caching, offline support, and error handling architecture for cmews-app. During the prototyping phase, this caching layer wraps the dynamic mock generator.

## Cache TTL Rules

| Data Type | TTL | Duration (ms) | Rationale |
|:---|:---|:---|:---|
| Weather forecast | 30 minutes | 1,800,000 | Forecast updates twice daily |
| Early warnings | 10 minutes | 600,000 | Safety-critical, needs fresher data |
| Maritime weather | 30 minutes | 1,800,000 | Updates every 6 hours |

## Core Principles

1. **Persistent File Caching (`expo-file-system`)**:
   - Cache directory: `${FileSystem.documentDirectory}bmkg_cache/`
   - Cache keys formatted by entity: `weather-{wilayahCode}`, `early-warnings`, `maritime-weather`.
   - Expired items are deleted on read or via periodic `clearExpired()`.
2. **Error Recovery & Exponential Backoff**:
   - Max 3 retries with exponential delay (`1000ms`, `2000ms`, `4000ms`).
   - Graceful fallback: If cache exists, serve stale cache before throwing network error.
3. **Zustand Store Integration**:
   - Centralize loading, error, and refresh actions in `useWeatherStore`.
   - Co-locate multi-resource fetching under `refreshAllData()` with `Promise.all`.

## Code References

- For full `CacheService` and `BMKGErrorHandler` implementations, see [cache_service.ts](./references/cache_service.ts).
