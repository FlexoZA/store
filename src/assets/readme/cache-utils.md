# CacheUtils Technical Documentation

## File Identity

- **File Path**: src/utils/cacheUtils.js
- **File Type**: JavaScript Utility Module
- **API Style**: ES6 Module with named exports
- **Primary Purpose**: Provide cache validation functionality for client-side data caching

## Core Functionality

The `cacheUtils.js` file provides a simple but effective utility for validating browser-based cache timestamps, helping applications implement efficient data caching strategies and prevent unnecessary API calls.

## Exposed Functions

### `isCacheValid(cacheKey)`

**Purpose**: Determines if a cached item is still valid based on its timestamp.

**Parameters**:

- `cacheKey` (String): The key used to identify the cached data in localStorage

**Return Value**:

- `Boolean`: Returns `true` if the cache is valid, `false` if expired or does not exist

**Logic Flow**:

1. Retrieves the timestamp associated with the provided cache key from localStorage
2. If no timestamp exists, returns `false` immediately
3. Compares the current time with the stored timestamp
4. Returns `true` if the difference is less than the defined cache duration (1 hour)
5. Returns `false` if the cache has expired

**Cache Duration**:

- The default cache expiration is set to 1 hour (3,600,000 milliseconds)
- This value is defined as a constant: `CACHE_DURATION`

## Implementation Details

```javascript
export const isCacheValid = (cacheKey) => {
  const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`)
  if (!cacheTimestamp) return false

  // Cache expires after 1 hour (3600000 ms)
  const CACHE_DURATION = 3600000
  return Date.now() - parseInt(cacheTimestamp) < CACHE_DURATION
}
```

## Usage Pattern

The utility is typically used in conjunction with data fetching operations in store modules or components:

```javascript
// Example usage in a Pinia store
import { isCacheValid } from '@/utils/cacheUtils'

export const useDataStore = defineStore('data', () => {
  async function fetchData() {
    // Check if cache is valid
    if (isCacheValid('my-data-key')) {
      // Use cached data
      const cachedData = JSON.parse(localStorage.getItem('my-data-key'))
      return cachedData
    }

    // Fetch fresh data
    const response = await api.getData()

    // Cache the result
    localStorage.setItem('my-data-key', JSON.stringify(response.data))
    localStorage.setItem('my-data-key_timestamp', Date.now().toString())

    return response.data
  }

  return { fetchData }
})
```

## Related Concepts

1. **Browser Storage**:

   - Uses `localStorage` for persistent cache storage
   - Requires string values (timestamps are converted to/from strings)

2. **Caching Strategy**:

   - Implements a time-based cache invalidation strategy
   - Can be easily modified for different cache durations

3. **Performance Optimization**:
   - Reduces unnecessary network requests
   - Improves application responsiveness
   - Decreases load on backend services

## Best Practices

1. Use consistent naming conventions for cache keys
2. Store both the data and its timestamp separately
3. Consider adding a mechanism to force-refresh cache when needed
4. Adjust the cache duration based on data volatility
5. Handle edge cases like browser storage limits or disabled localStorage

## Dependencies

This utility has no external dependencies and relies only on:

- JavaScript's Date.now() for timestamp generation
- Browser localStorage API for data persistence

## Notes for Developers

- The utility doesn't handle storage or retrieval of the actual cached data, only the validation logic
- Cache durations could be made configurable by exporting a function that accepts a custom duration
- Consider adding error handling for localStorage access issues
