export const isCacheValid = (cacheKey) => {
  const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`)
  if (!cacheTimestamp) return false

  // Cache expires after 1 hour (3600000 ms)
  const CACHE_DURATION = 3600000
  return Date.now() - parseInt(cacheTimestamp) < CACHE_DURATION
}
