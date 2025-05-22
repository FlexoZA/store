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
│   │   ├── icons/         # Icon components
│   │   └── admin/         # Admin dashboard components
│   │       ├── dashboard/ # Dashboard overview components
│   │       │   ├── DashboardOverview.vue
│   │       │   └── StatsOverview.vue
│   │       ├── products/  # Product management components
│   │       │   └── AdminProducts.vue
│   │       ├── orders/    # Order management components
│   │       │   └── AdminOrders.vue
│   │       ├── users/     # User management components
│   │       │   └── AdminUsers.vue
│   │       ├── settings/  # Settings components
│   │       │   └── AdminSettings.vue
│   │       └── navigation/# Admin navigation components
│   │           └── AdminNavigation.vue
│   │
│   ├── views/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   ├── cart/          # Shopping cart pages
│   │   ├── admin/         # Admin dashboard pages
│   │   │   └── AdminDashboard.vue # Main admin dashboard layout
│   │   └── HomeView.vue   # Home page
│   │
│   ├── stores/            # State management
│   │   ├── supabase/      # Supabase-related stores
│   │   │   ├── shoppingCartStore.js
│   │   │   ├── productsStore.js
│   │   │   ├── searchStore.js
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
- **Admin Dashboard**: Administrative interface for managing products, orders, and users

## 4. Data Management

The application uses Pinia stores to manage state:

- `shoppingCartStore.js`: Manages shopping cart state and operations
- `productsStore.js`: Handles product data and operations, including featured products via the is_featured flag
- `searchStore.js`: Manages search functionality

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
| [get-product-vue-component.md](./get-product-vue-component.md)   | Single product view documentation          | src/components/products/getProduct.vue       |
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
| AdminDashboard         | src/views/admin/AdminDashboard.vue                       | Main admin interface layout with sidebar navigation and content area. Protected by authentication with role-based access control.                                                                                                                                                                                                          |
| AdminNavigation        | src/components/admin/navigation/AdminNavigation.vue      | Sidebar navigation component for the admin dashboard, providing links to different admin sections.                                                                                                                                                                                                                                         |
| DashboardOverview      | src/components/admin/dashboard/DashboardOverview.vue     | Main dashboard overview page component that displays statistics and recent activity.                                                                                                                                                                                                                                                       |
| StatsOverview          | src/components/admin/dashboard/StatsOverview.vue         | Component displaying key statistics cards for the admin dashboard.                                                                                                                                                                                                                                                                         |
| AdminProducts          | src/components/admin/products/AdminProducts.vue          | Product management interface for administrators.                                                                                                                                                                                                                                                                                           |
| AdminOrders            | src/components/admin/orders/AdminOrders.vue              | Order management interface for administrators.                                                                                                                                                                                                                                                                                             |
| AdminUsers             | src/components/admin/users/AdminUsers.vue                | User management interface for administrators.                                                                                                                                                                                                                                                                                              |
| AdminSettings          | src/components/admin/settings/AdminSettings.vue          | Store settings management interface for administrators.                                                                                                                                                                                                                                                                                    |
| UpdateProduct          | src/components/admin/products/UpdateProduct.vue          | Modal component used in AdminProducts for updating existing products. Provides form interface for editing product details including name, SKU, description, price, quantity, category, featured status and enabled status.                                                                                                                 |
| GetProduct             | src/components/products/getProduct.vue                   | Single product view component that displays detailed product information. Features product image, name, price, description, specifications, and add to cart functionality. Includes breadcrumb navigation and responsive layout. Used in the product detail route (/product/:id).                                                          |

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

## 12. Admin Dashboard

The admin dashboard provides an interface for store administrators to manage various aspects of the e-commerce platform:

### Features (Implemented)

1. **Dashboard Overview**: Statistics and metrics about store performance

   - Total sales with trend indicator
   - New orders count with weekly comparison
   - Total products count with new additions
   - Active users count with monthly comparison

2. **Product Management**: Interface for managing products

   - Product listing with pagination (20 products per page)
   - Search functionality for products by name
   - Category filtering with hardcoded categories
   - Add/Edit/Delete product capabilities
   - Product details display including name, price, description, stock levels
   - Separate admin product store to avoid caching issues with regular product store

3. **Order Management**: Interface for managing orders

   - Order listing
   - Status filtering
   - Search functionality
   - Order details view (placeholder)

4. **User Management**: Interface for managing users

   - User listing
   - Role filtering
   - Search functionality
   - User details view (placeholder)

5. **Settings**: Store configuration interface
   - Store information management
   - Payment settings
   - Shipping settings

### Implementation Status

- Basic dashboard layout with sidebar navigation implemented
- Dashboard overview with statistics cards implemented
- Placeholder components for products, orders, users, and settings
- Role-based authentication planned for future implementation

### Access Control

The admin dashboard is protected by authentication with role-based access control:

- Only users with admin role will be able to access the dashboard
- Different admin roles may have different permissions (future implementation)
- Authentication is integrated with the existing user authentication system

### Component Structure

The admin dashboard is organized into the following components:

1. **Layout Components**

   - `AdminDashboard.vue`: Main layout component with sidebar and content area
   - `AdminNavigation.vue`: Sidebar navigation component

2. **Page Components**
   - `DashboardOverview.vue`: Main dashboard page
   - `StatsOverview.vue`: Statistics cards component
   - `AdminProducts.vue`: Product management interface
   - `AdminOrders.vue`: Order management interface
   - `AdminUsers.vue`: User management interface
   - `AdminSettings.vue`: Store settings interface

### Routing

The admin dashboard uses nested routes under the `/admin` path:

- `/admin`: Dashboard overview
- `/admin/products`: Product management
- `/admin/orders`: Order management
- `/admin/users`: User management
- `/admin/settings`: Store settings

All admin routes are protected by authentication and require admin role access.

## 13. Row Level Security (RLS) Policies

Supabase RLS policies are implemented to secure database access at the row level:

### Products Table Policies

1. **Read Access**

   ```sql
   CREATE POLICY "Public read access" ON products
   FOR SELECT USING (
     enabled = true OR
     auth.role() = 'admin'
   );
   ```

   - Allows public read access to enabled products
   - Admins can view all products regardless of enabled status

2. **Write Access**
   ```sql
   CREATE POLICY "Admin full access" ON products
   FOR ALL USING (
     auth.role() = 'admin'
   );
   ```
   - Only admins can insert, update, or delete products

### Orders Table Policies

1. **Read Access**

   ```sql
   CREATE POLICY "Users can view own orders" ON orders
   FOR SELECT USING (
     auth.uid() = user_id OR
     auth.role() = 'admin'
   );
   ```

   - Users can only view their own orders
   - Admins can view all orders

2. **Write Access**
   ```sql
   CREATE POLICY "Users can create orders" ON orders
   FOR INSERT WITH CHECK (
     auth.uid() = user_id
   );
   ```
   - Users can only create orders for themselves
   ```sql
   CREATE POLICY "Admin order management" ON orders
   FOR ALL USING (
     auth.role() = 'admin'
   );
   ```
   - Admins have full control over all orders

### User Profiles Policies

1. **Read Access**

   ```sql
   CREATE POLICY "Public profiles are viewable" ON profiles
   FOR SELECT USING (
     is_public = true OR
     auth.uid() = id OR
     auth.role() = 'admin'
   );
   ```

   - Public profiles are viewable by anyone
   - Users can view their own profile
   - Admins can view all profiles

2. **Write Access**
   ```sql
   CREATE POLICY "Users can update own profile" ON profiles
   FOR UPDATE USING (
     auth.uid() = id
   );
   ```
   - Users can only update their own profile
   ```sql
   CREATE POLICY "Admin profile management" ON profiles
   FOR ALL USING (
     auth.role() = 'admin'
   );
   ```
   - Admins have full control over all profiles

### Categories Table Policies

1. **Read Access**

   ```sql
   CREATE POLICY "Public read access" ON categories
   FOR SELECT USING (true);
   ```

   - Categories are publicly readable

2. **Write Access**
   ```sql
   CREATE POLICY "Admin only write access" ON categories
   FOR ALL USING (
     auth.role() = 'admin'
   );
   ```
   - Only admins can modify categories

### Product Images Table Policies

1. **Read Access**

   ```sql
   CREATE POLICY "Public read access" ON product_images
   FOR SELECT USING (
     EXISTS (
       SELECT 1 FROM products
       WHERE products.id = product_images.product_id
       AND products.enabled = true
     ) OR auth.role() = 'admin'
   );
   ```

   - Images are viewable if associated product is enabled
   - Admins can view all images

2. **Write Access**
   ```sql
   CREATE POLICY "Admin only write access" ON product_images
   FOR ALL USING (
     auth.role() = 'admin'
   );
   ```
   - Only admins can modify product images
