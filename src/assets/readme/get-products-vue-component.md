# GetProducts Vue Component Technical Documentation

## Component Identity

- **File Path**: src/components/products/getProducts.vue
- **Framework**: Vue 3
- **API Style**: Composition API with `<script setup>`
- **Primary Purpose**: Product display and cart management interface

## Core Dependencies

1. **Framework Dependencies**

   - Vue 3
   - Pinia
   - Tailwind CSS

2. **Component Dependencies**

   - ProductSkeleton: '@/components/loaders/productSkeleton.vue'
   - AddToCartModal: '@/components/modals/AddToCartModal.vue'

3. **Store Dependencies**
   - useProductsStore: '@/stores/supabase/productsStore'
   - useShoppingCartStore: '@/stores/supabase/shoppingCartStore'

## State Management

1. **Store References**

   ```javascript
   const { products, loading, error, currentPage, totalPages } = storeToRefs(store)
   ```

2. **Local State**
   ```javascript
   const showAddToCartModal = ref(false)
   const selectedProduct = ref(null)
   ```

## Component Structure

### Template Hierarchy

1. Root conditional rendering:

   - Loading state: `<ProductSkeleton />`
   - Error state: Error message display
   - Main content: Product grid and pagination

2. Product Grid Structure:
   ```html
   <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
     <!-- Product cards -->
   </div>
   ```

### Key Features Implementation

1. **Product Display**

   - Responsive grid system: 1-4 columns
   - Image handling with fallback: '@/assets/products/alt/C_trunking.jpg'
   - Stock status overlay
   - Price formatting: 'R' prefix, 2 decimal places

2. **Cart Integration**

   - Modal-based quantity selection
   - Stock validation
   - Cart state synchronization
   - Visual feedback for cart items

3. **Pagination System**
   - Mobile and desktop layouts
   - Page navigation controls
   - Automatic scroll behavior
   - Boundary page handling

## Data Flow

1. **Data Loading**

   ```javascript
   onMounted(async () => {
     await store.getProducts()
   })
   ```

2. **Cart Operations**
   ```javascript
   handleAddToCart(productWithQuantity) {
     if (cartStore.isInCart(productWithQuantity.id)) {
       cartStore.updateQuantity(productWithQuantity.id, productWithQuantity.quantity)
     } else {
       cartStore.addToCart(productWithQuantity)
     }
   }
   ```

## Component States

1. **Loading State**

   - Triggered: During initial load and page changes
   - Display: ProductSkeleton component

2. **Error State**

   - Triggered: API failures
   - Display: Error message

3. **Empty State**

   - Triggered: No products available
   - Handled by products store

4. **Interactive States**
   - Cart modal visibility
   - Product selection state
   - Pagination current page
   - Stock availability states

## CSS Structure

- Framework: Tailwind CSS
- Grid system: Responsive breakpoints
- State classes: hover, disabled, active
- Transition classes: opacity, background

## Technical Requirements

### Store Requirements

1. **Products Store**

   - Must provide: products, loading, error, currentPage, totalPages
   - Must implement: getProducts(page)

2. **Shopping Cart Store**
   - Must provide: isInCart
   - Must implement: addToCart, updateQuantity

### Data Structure Requirements

```typescript
interface Product {
  id: string | number
  name: string
  price: number
  quantity: number
  product_image?: Array<{ url: string }>
}
```

### Environment Requirements

- Vue 3 environment
- Pinia store setup
- Tailwind CSS configuration
- Image assets path configuration

## Error Handling

- Product fetch failures
- Image loading fallbacks
- Stock validation
- Cart operation validation

## Performance Considerations

- Lazy loading implementation
- Pagination for large datasets
- Image optimization
- State management efficiency

This documentation is structured for optimal context retrieval and understanding by AI systems while maintaining human readability. Each section provides specific, actionable information about the component's implementation and requirements.
