# Project Roadmap

## 1. File Structure

```
store/
│
├── public/                # Static assets served directly
│
├── src/                   # Source code
│   ├── assets/            # Static resources
│   │   ├── readme/        # Technical documentation for files
│   │   ├── products/      # Product images
│   │   ├── main.css       # Main stylesheet
│   │   └── base.css       # Base styles
│   │
│   ├── components/        # Reusable UI components
│   │   ├── products/      # Product-related components
│   │   ├── search/        # Search functionality components
│   │   ├── modals/        # Modal dialog components
│   │   ├── navigation/    # Navigation components
│   │   ├── authentication/# Authentication-related components
│   │   ├── alerts/        # Alert and notification components
│   │   ├── cart/          # Shopping cart components
│   │   ├── loaders/       # Loading indicators
│   │   └── icons/         # Icon components
│   │
│   ├── views/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── cart/          # Shopping cart pages
│   │   └── HomeView.vue   # Home page
│   │
│   ├── stores/            # State management
│   │   ├── supabase/      # Supabase-related stores
│   │   │   ├── shoppingCartStore.js
│   │   │   ├── productsStore.js
│   │   │   ├── searchStore.js
│   │   │   ├── featuredProductsStore.js
│   │   │   └── supabaseClient.js
│   │   │
│   │   └── authentication/# Authentication state management
│   │
│   ├── utils/             # Utility functions
│   │   ├── cacheUtils.js  # Cache validation utilities
│   │   └── priceUtils.js  # Price formatting utilities
│   │
│   ├── router/            # Vue Router configuration
│   ├── App.vue            # Root component
│   └── main.js            # Application entry point
│
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
├── .env                   # Environment variables
└── .env.example           # Example environment variables
└── TODO.md                # List of pending tasks and TODOs
```

## 2. Application Overview

This is an e-commerce store application built with Vue.js, using Supabase as the backend service.

## 3. Key Components

- **Authentication System**: User registration, login, and session management
- **Product Catalog**: Display and filtering of products
- **Shopping Cart**: Add, remove, and manage items in cart
- **Search Functionality**: Search through product inventory

## 4. Data Management

The application uses Pinia stores to manage state:

- `shoppingCartStore.js`: Manages shopping cart state and operations
- `productsStore.js`: Handles product data and operations
- `searchStore.js`: Manages search functionality
- `featuredProductsStore.js`: Controls featured products display

## 5. Backend Integration

Supabase is used as the backend service, providing:

- Database storage
- Authentication
- API endpoints

## 6. Technical Documentation

Each file in the project has an associated readme file in `/src/assets/readme/` that contains technical documentation. For example, `products-store.md` documents the `productsStore.js` file.

### Available Documentation Files

| Documentation File                                               | Description                                | Associated Code File                         |
| ---------------------------------------------------------------- | ------------------------------------------ | -------------------------------------------- |
| [sql-schema.md](./sql-schema.md)                                 | Database schema definitions for all tables | Supabase SQL Schema                          |
| [products-store.md](./products-store.md)                         | Product store documentation                | src/stores/supabase/productsStore.js         |
| [user-login.md](./user-login.md)                                 | Authentication documentation               | Authentication components and stores         |
| [get-products-vue-component.md](./get-products-vue-component.md) | Product component documentation            | Product-related components                   |
| [main-navigation.md](./main-navigation.md)                       | Main navigation bar documentation          | src/components/navigation/MainNavigation.vue |
| [cache-utils.md](./cache-utils.md)                               | Cache utility documentation                | src/utils/cacheUtils.js                      |
| [price-utils.md](./price-utils.md)                               | Price formatting utility documentation     | src/utils/priceUtils.js                      |
| [readme.md](./readme.md)                                         | Instructions for maintaining documentation | General reference                            |
| [roadmap.md](./roadmap.md)                                       | This roadmap file                          | Project overview                             |
| [TODO.md](./TODO.md)                                             | List of pending tasks from ::TODO comments | Collected from all source files              |

## 7. Database Schema

For detailed database schema information, refer to [sql-schema.md](./sql-schema.md), which includes definitions for:

- `products` - Product catalog data
- `product_image` - Product images
- `product_features` - Product features and specifications
- `bundle_products` - Product bundling information
- `profiles` - User profile data
- `categories` - Product categories
- `logs` - Application logging

## 8. Component Usage

This section tracks where key components are used throughout the application:

| Component              | Location                                                 | Usage                                                                                                                                                                                                                                                                                                                                      |
| ---------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| MainNavigation         | src/components/navigation/MainNavigation.vue             | Used in App.vue as the main navigation bar across all pages. Features responsive design with desktop/mobile layouts, search functionality, user authentication interface (login/logout/registration), shopping cart dropdown with item management, and navigation links. Acts as the central UI control for core e-commerce functionality. |
| SearchBar              | src/components/search/SearchBar.vue                      | Used in MainNavigation for product search functionality                                                                                                                                                                                                                                                                                    |
| UserLogin              | src/components/authentication/UserLoginDialog.vue        | Used in MainNavigation for user authentication                                                                                                                                                                                                                                                                                             |
| UserRegistrationDialog | src/components/authentication/UserRegistrationDialog.vue | Used in MainNavigation for new user registration                                                                                                                                                                                                                                                                                           |
| AddToCartModal         | src/components/modals/AddToCartModal.vue                 | Used in MainNavigation for editing cart items                                                                                                                                                                                                                                                                                              |
| ConfirmationDialog     | src/components/modals/ConfirmationDialog.vue             | Used in MainNavigation for confirmations (logout, remove item)                                                                                                                                                                                                                                                                             |

## 9. Utilities Usage

This section tracks how utility modules are used throughout the application:

| Utility    | Location                | Usage                                                                                                         |
| ---------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| cacheUtils | src/utils/cacheUtils.js | Used in store modules (especially productsStore.js) to validate cached data and prevent unnecessary API calls |
| priceUtils | src/utils/priceUtils.js | Used in product components to format prices in South African currency format (e.g., "R34 000,00")             |

## 10. Dependencies

### Core Dependencies

| Dependency            | Description                                                   |
| --------------------- | ------------------------------------------------------------- |
| @heroicons/vue        | UI icons library designed by the makers of Tailwind CSS       |
| @supabase/supabase-js | JavaScript client library for Supabase, our backend service   |
| @tailwindcss/vite     | Tailwind CSS integration with Vite                            |
| axios                 | Promise-based HTTP client for making API requests             |
| dotenv                | Loads environment variables from .env files                   |
| pinia                 | State management library for Vue 3                            |
| tailwindcss           | Utility-first CSS framework                                   |
| vue                   | Progressive JavaScript framework for building user interfaces |
| vue-router            | Official router for Vue.js applications                       |

### Development Dependencies

| Dependency                  | Description                                                                   |
| --------------------------- | ----------------------------------------------------------------------------- |
| @eslint/js                  | Core JavaScript configurations for ESLint                                     |
| @vitejs/plugin-vue          | Official Vue plugin for Vite                                                  |
| @vue/eslint-config-prettier | ESLint configuration for Prettier with Vue support                            |
| eslint                      | Static code analysis tool for identifying problematic patterns                |
| eslint-plugin-vue           | ESLint plugin for Vue.js                                                      |
| prettier                    | Code formatter to enforce consistent code style                               |
| vite                        | Modern frontend build tool that significantly improves development experience |
| vite-plugin-vue-devtools    | Vite plugin for Vue devtools integration                                      |

## 11. Development Guidelines

1. Always keep readme files updated when modifying associated code files
2. Create readme files for new code files
3. Keep this roadmap updated
4. Never remove ::TODO comments
5. Maintain comments in code files
6. Keep track of where each component is being used in roadmap
7. If any ::TODO comments are found save in TODO.md

### Image Loading Best Practices

1. Use native browser lazy loading with the `loading="lazy"` attribute on images
2. Keep image loading logic simple and avoid complex state management
3. Use optional chaining for safe property access when handling image URLs
4. Let the browser handle loading states and optimizations
5. Avoid custom loading skeletons unless absolutely necessary
6. Use appropriate image formats and sizes for different contexts
7. Implement proper alt text for accessibility
8. Use placeholder images for fallback cases

Example implementation:

```vue
<img
  :src="getImageUrl(product)"
  :alt="product.product_name"
  class="h-full w-full object-cover object-center"
  loading="lazy"
/>
```
