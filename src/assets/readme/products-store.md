# ProductsStore Technical Documentation

## Store Identity

- **File Path**: src/stores/supabase/productsStore.js
- **Store Type**: Pinia Store
- **API Style**: Composition API with `defineStore`
- **Primary Purpose**: Product data management and caching layer

## Core Dependencies

1. **Framework Dependencies**

   - Pinia
   - Vue 3 (ref)
   - Supabase Client

2. **Utility Dependencies**
   - isCacheUtils: './utils/cacheUtils'
   - errorLogger: './utils/errorLogger'

## State Management

1. **Reactive State**

   ```javascript
   const products = ref([]) // Current page products
   const loading = ref(false) // Loading state
   const error = ref(null) // Error state
   const currentPage = ref(1) // Current pagination page
   const totalPages = ref(0) // Total available pages
   const searchResults = ref([]) // Search results
   const searchLoading = ref(false) // Search loading state
   ```

2. **Constants**
   ```javascript
   const itemsPerPage = 20 // Fixed pagination size
   ```

## Core Functionality

### 1. Product Fetching

```javascript
const getProducts = async (page = 1) => {
  // Cache management
  // Pagination handling
  // Supabase query
  // Error handling
  // State updates
}
```

**Implementation Details**:

- Implements caching with localStorage
- Handles pagination with offset calculation
- Includes product images in query
- Filters for active products only
- Orders by product ID
- Updates multiple state variables

### 2. Cache Management

```javascript
const clearProductsCache = () => {
  // Clears all product-related cache entries
  // Removes timestamps
  // Removes count data
}
```

### 3. Search Functionality

```javascript
const searchProducts = async (query) => {
  // Minimum query length validation
  // Supabase ilike query
  // Limited result set
  // Error handling
}
```

## Data Structures

### Product Interface

```typescript
interface Product {
  id: number | string
  name: string
  price: number
  status: boolean
  product_image?: Array<{
    url: string
    [key: string]: any
  }>
  [key: string]: any
}
```

### Cache Structure

```javascript
{
  'products.page_${pageNumber}': string,         // Stringified product data
  'products.page_${pageNumber}_timestamp': number,// Cache timestamp
  'products.total_count': string,                // Total products count
  'products.total_count_timestamp': number       // Count cache timestamp
}
```

## Error Handling

1. **Error Logging**

   - Uses centralized error logger
   - Captures context information
   - Maintains error state

2. **Error Context Captured**
   ```javascript
   {
     page: number,
     offset: number,
     itemsPerPage: number,
     query: string,
     component: string
   }
   ```

## Performance Optimizations

1. **Caching Strategy**

   - Local storage implementation
   - Cache validation checks
   - Timestamp-based expiration
   - Page-specific caching

2. **Query Optimizations**
   - Limited result sets
   - Specific column selection
   - Pagination implementation
   - Status filtering

## Integration Points

### 1. Supabase Integration

```javascript
const { data, count, error } = await supabase
  .from('products')
  .select('*, product_image(*)', { count: 'exact' })
```

### 2. Component Integration

- Exposes reactive state for components
- Provides loading indicators
- Handles error states
- Manages pagination state

## Usage Example

```javascript
import { useProductsStore } from '@/stores/supabase/productsStore'

const store = useProductsStore()
await store.getProducts(1) // Fetch first page
await store.searchProducts('query') // Search products
```

## Technical Requirements

1. **Environment**

   - Supabase client configuration
   - Pinia setup
   - localStorage availability

2. **Database Schema**
   - products table with status field
   - product_image relation
   - Proper indexes for performance

## Performance Considerations

- Implements data caching
- Limits search results
- Uses pagination
- Optimizes database queries
- Manages memory usage

This documentation is structured for optimal AI context understanding while maintaining human readability. Each section provides specific, actionable information about the store's implementation and requirements.
