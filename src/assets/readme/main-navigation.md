# MainNavigation Component Technical Documentation

## Component Identity

- **File Path**: src/components/navigation/MainNavigation.vue
- **Component Type**: Vue 3 Component
- **API Style**: Composition API with `<script setup>`
- **Primary Purpose**: Main navigation bar with responsive design, search functionality, user account management, and shopping cart integration

## Core Dependencies

1. **Framework Dependencies**

   - Vue 3 (ref, computed, onMounted, onUnmounted)
   - Vue Router (useRouter)
   - Pinia (storeToRefs)

2. **Store Dependencies**

   - `useShoppingCartStore` - For cart functionality
   - `useAuthStore` - For authentication state

3. **Component Dependencies**

   - `SearchBar` - For search functionality
   - `AddToCartModal` - For editing cart items
   - `ConfirmationDialog` - For confirmations (logout, remove item)
   - `UserRegistrationDialog` - For user registration
   - `UserLogin` - For user login

4. **UI Dependencies**
   - Heroicons (@heroicons/vue/24/outline)
     - UserIcon
     - ShoppingCartIcon
     - TrashIcon
     - Bars3Icon
     - XMarkIcon

## Component Structure

The component is structured as a responsive navigation bar with different layouts for desktop and mobile views:

1. **Desktop Navigation**

   - Logo (links to home page)
   - Search bar
   - User menu (login/register or account options)
   - Shopping cart with dropdown

2. **Mobile Navigation**

   - Collapsible menu with hamburger icon
   - Search bar
   - Login/account button
   - Cart button

3. **Modals and Dialogs**
   - Cart edit modal
   - Item removal confirmation
   - User registration dialog
   - Login dialog
   - Logout confirmation

## State Management

1. **Local State (refs)**

   - `isMenuOpen` - Controls mobile menu visibility
   - `showEditModal` - Controls cart item edit modal
   - `showConfirmDialog` - Controls item removal confirmation
   - `showRegistrationDialog` - Controls registration dialog
   - `showLoginDialog` - Controls login dialog
   - `selectedProduct` - Currently selected product for editing
   - `itemToRemove` - Item to be removed from cart
   - `isCartOpen` - Controls cart dropdown visibility
   - `showUserMenu` - Controls user menu dropdown visibility
   - `showLogoutDialog` - Controls logout confirmation
   - `isLoggingOut` - Loading state for logout
   - `imageLoaded` - Tracks image loading status

2. **External State**
   - Shopping cart items and total (from cartStore)
   - User authentication state (from authStore)

## Key Features

1. **Responsive Design**

   - Desktop layout with expanded navigation
   - Mobile layout with collapsible menu
   - Adaptive component rendering based on screen size

2. **User Authentication**

   - Login/Register options for guests
   - User account menu for authenticated users
   - Logout functionality with confirmation

3. **Shopping Cart Integration**

   - Cart icon with item count badge
   - Dropdown cart preview
   - Quick edit functionality for cart items
   - Cart total calculation
   - Checkout button

4. **Search Functionality**

   - Integrated search bar
   - Different placement on desktop vs mobile

5. **Navigation**
   - Home link via logo
   - Account navigation
   - Checkout navigation

## Event Handling

1. **Click Outside Detection**

   - Closes dropdowns when clicking outside
   - Uses event listeners added on mount and removed on unmount

2. **Cart Interactions**

   - Add/edit items
   - Remove items with confirmation
   - Checkout navigation

3. **Authentication Flows**
   - Login/Registration dialog switching
   - Logout with confirmation

## Helper Functions

1. **Alert System**

   - `showAlert` - Dispatches custom events for alert display

2. **Image Handling**
   - `getImageUrl` - Resolves product images or fallbacks
   - `handleImageLoad` - Manages image loading state
   - `handleImageError` - Handles image loading errors

## Usage

The MainNavigation component is typically mounted at the application root level and appears on all pages, providing consistent navigation and access to core features like search, cart, and user authentication.

## Styling

The component uses Tailwind CSS for styling with:

- Responsive layouts
- Transitions and animations
- Custom styles for disabled states

## Related Components

- **SearchBar** - Provides search functionality
- **UserLogin** - Handles user authentication
- **UserRegistrationDialog** - Handles user registration
- **AddToCartModal** - Manages cart item editing
- **ConfirmationDialog** - Reusable confirmation dialog
