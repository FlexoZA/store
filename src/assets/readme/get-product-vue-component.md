# GetProduct Vue Component Documentation

## Overview

The `getProduct.vue` component is responsible for displaying detailed information about a single product. It provides a comprehensive view of the product's details, including images, specifications, and purchasing options.

## Location

`src/components/products/getProduct.vue`

## Features

- Single product display with detailed information
- Responsive layout with grid system
- Breadcrumb navigation
- Product image display with out-of-stock indicator
- Product specifications list
- Add to cart functionality
- Wishlist functionality (placeholder)
- Documentation and 3D view links (placeholders)

## Component Structure

### Template

```vue
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-8">
      <FeaturedProductSkeleton />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-8">
      <div class="text-red-600">Error: {{ error }}</div>
    </div>

    <!-- Main Content -->
    <div v-else-if="product" class="container mx-auto px-4 py-8">
      <!-- Breadcrumb Navigation -->
      <!-- Product Grid -->
      <!-- Add to Cart Modal -->
    </div>
  </div>
</template>
```

### Script

The component uses the following imports and features:

- Vue Router for navigation
- Pinia stores for state management
- HeroIcons for UI icons
- Custom utilities for price formatting

## Props

None. The component uses route parameters to fetch product data.

## Events

None. The component emits events through the AddToCartModal component.

## Dependencies

- `vue-router`: For navigation and route parameters
- `pinia`: For state management
- `@heroicons/vue`: For UI icons
- `FeaturedProductSkeleton`: Loading state component
- `AddToCartModal`: Modal for cart operations
- `priceUtils`: For price formatting

## State Management

The component uses two Pinia stores:

1. `productsStore`: For fetching product data

   - `getProductById`: Fetches single product data
   - `loading`: Loading state
   - `error`: Error state

2. `shoppingCartStore`: For cart operations
   - `addToCart`: Adds product to cart
   - `updateQuantity`: Updates product quantity
   - `isInCart`: Checks if product is in cart

## Usage

The component is used in the router configuration:

```javascript
{
  path: '/product/:id',
  name: 'product',
  component: () => import('../components/products/getProduct.vue'),
  meta: { layout: 'default' },
}
```

## Styling

The component uses Tailwind CSS for styling with the following key classes:

- `container`: Centers content and provides max-width
- `grid`: Responsive grid layout
- `aspect-square`: Maintains image aspect ratio
- `rounded-lg`: Rounded corners
- `shadow-sm`: Subtle shadow effect
- `transition-colors`: Smooth color transitions

## Error Handling

- Displays loading state while fetching data
- Shows error message if product fetch fails
- Handles missing product images with placeholder
- Validates product data structure

## Future Improvements

1. Implement wishlist functionality
2. Add product image gallery
3. Add related products section
4. Implement documentation and 3D view features
5. Add product reviews section
6. Implement product sharing functionality

## Related Components

- `getProducts.vue`: Product listing component
- `AddToCartModal.vue`: Cart operations modal
- `FeaturedProductSkeleton.vue`: Loading state component
