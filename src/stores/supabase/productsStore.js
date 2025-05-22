import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from './supabaseClient'
import { isCacheValid } from '../../utils/cacheUtils'
import { logError } from '@/utils/errorLogger'

/**
 * Store for managing product data using Pinia
 * Handles product fetching, pagination, and caching
 */
export const useProductsStore = defineStore('products', () => {
  // State management using refs
  const products = ref([]) // Stores the current page of products
  const featuredProducts = ref([]) // Stores featured products
  const loading = ref(false) // Loading state indicator
  const error = ref(null) // Error state management
  const currentPage = ref(1) // Current page number
  const totalPages = ref(0) // Total number of pages
  const itemsPerPage = 20 // Number of items to display per page
  const categories = ref([]) // Stores all categories
  const selectedCategory = ref(null) // Currently selected category

  /**
   * Fetches categories from Supabase
   */
  const getCategories = async () => {
    try {
      const cacheKey = 'categories'
      const cachedData = localStorage.getItem(cacheKey)

      // Check if valid cached data exists and properly parse it
      if (cachedData && isCacheValid(cacheKey)) {
        try {
          const parsedData = JSON.parse(cachedData)
          // Ensure the cached data has all required properties
          if (
            parsedData &&
            Array.isArray(parsedData) &&
            parsedData.every(
              (category) =>
                category.id && category.category_name && typeof category.enabled === 'boolean',
            )
          ) {
            categories.value = parsedData
            return
          }
        } catch (e) {
          console.warn('Categories cache parse error:', e)
          // If there's any error parsing the cache, we'll fetch fresh data
        }
      }

      const { data, error: supaError } = await supabase
        .from('categories')
        .select('id, category_name, enabled, category_description')
        .eq('enabled', true)
        .order('category_name')

      if (supaError) {
        await logError(supaError, 'productsStore', {
          component: 'getCategories',
        })
        throw supaError
      }

      // Ensure we have valid data before caching
      if (data && Array.isArray(data)) {
        categories.value = data
        localStorage.setItem(cacheKey, JSON.stringify(data))
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
      }
    } catch (e) {
      error.value = e.message
      await logError(e, 'productsStore', {
        component: 'getCategories',
      })
    }
  }

  /**
   * Fetches products from Supabase with pagination and optional category filter
   * Implements caching to improve performance
   * @param {number} page - Page number to fetch (defaults to 1)
   * @param {number|null} categoryId - Optional category ID to filter by
   */
  const getProducts = async (page = 1, categoryId = null) => {
    loading.value = true
    error.value = null

    // Update selected category
    selectedCategory.value = categoryId

    // Updated cache keys with 'products.' prefix and category
    const categoryPart = categoryId ? `.category_${categoryId}` : ''
    const cacheKey = `products.page_${page}${categoryPart}`
    const cachedData = localStorage.getItem(cacheKey)
    const cachedCount = localStorage.getItem(`products.total_count${categoryPart}`)
    const cachedFeatured = localStorage.getItem('products.featured')

    // Check if valid cached data exists for featured products
    if (cachedFeatured && isCacheValid('products.featured')) {
      try {
        const parsedFeatured = JSON.parse(cachedFeatured)
        if (parsedFeatured && Array.isArray(parsedFeatured)) {
          featuredProducts.value = parsedFeatured
        }
      } catch (e) {
        console.warn('Featured products cache parse error:', e)
      }
    }

    // Check if valid cached data exists and properly parse it
    if (cachedData && cachedCount && isCacheValid(cacheKey)) {
      try {
        const parsedData = JSON.parse(cachedData)
        // Ensure the cached data has all required properties and relationships
        if (
          parsedData &&
          Array.isArray(parsedData) &&
          parsedData.length > 0 &&
          parsedData.every(
            (product) =>
              product.id &&
              product.product_name &&
              Array.isArray(product.product_image) &&
              Array.isArray(product.product_features) &&
              // Validate that we have at least empty arrays for relationships
              typeof product.product_image !== 'undefined' &&
              typeof product.product_features !== 'undefined',
          )
        ) {
          products.value = parsedData
          currentPage.value = page
          totalPages.value = Math.ceil(JSON.parse(cachedCount) / itemsPerPage)

          // If we're on page 1 and don't have featured products yet, fetch them
          if (page === 1 && featuredProducts.value.length === 0) {
            await getFeaturedProducts(categoryId)
          }

          loading.value = false
          return
        } else {
          console.warn('Invalid cached data structure, fetching fresh data')
        }
      } catch (e) {
        console.warn('Cache parse error:', e)
        // If there's any error parsing the cache, we'll fetch fresh data
      }
    }

    try {
      // If we're on page 1 or don't have featured products yet, fetch them
      if (page === 1 || featuredProducts.value.length === 0) {
        await getFeaturedProducts(categoryId)
      }

      // Calculate offset for pagination
      const offset = (page - 1) * itemsPerPage

      // Start building the query with explicit field selection
      let query = supabase
        .from('products')
        .select(
          `
          id,
          product_name,
          description,
          price,
          quantity,
          sku,
          material_id,
          category_id,
          is_bundled,
          is_featured,
          enabled,
          allow_no_stock_sale,
          product_image (
            id,
            product_id,
            url,
            name
          ),
          product_features (
            id,
            product_id,
            feature
          )
        `,
          { count: 'exact' },
        )
        .eq('enabled', true)

      // Add category filter if provided
      if (categoryId) {
        // When filtering by category, include all products in that category
        query = query.eq('category_id', categoryId)
      }

      // Add pagination and ordering
      query = query.range(offset, offset + itemsPerPage - 1).order('id')

      // Execute the query
      const { data: productData, count, error: supaError } = await query

      if (supaError) {
        await logError(supaError, 'productsStore', {
          page,
          categoryId,
          component: 'productsStore',
        })
        throw supaError
      }

      // If no products found with this category, check if there are any products with this category
      if (productData.length === 0 && categoryId) {
        const { data: checkData } = await supabase
          .from('products')
          .select('id, category_id')
          .eq('category_id', categoryId)
          .limit(1)

        if (!checkData || checkData.length === 0) {
          error.value = 'No products found in this category'
        }
      }

      // Update store state with combined data
      products.value = productData
      currentPage.value = page
      totalPages.value = Math.ceil(count / itemsPerPage)

      // Cache the data with proper validation of relationships
      const dataToCache = productData.map((product) => {
        // Ensure product has valid structure before caching
        return {
          ...product,
          // Always ensure these are arrays, even if empty
          product_image: Array.isArray(product.product_image) ? product.product_image : [],
          product_features: Array.isArray(product.product_features) ? product.product_features : [],
        }
      })

      // Updated cache storage with 'products.' prefix
      localStorage.setItem(cacheKey, JSON.stringify(dataToCache))
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
      localStorage.setItem(`products.total_count${categoryPart}`, JSON.stringify(count))
      localStorage.setItem(`products.total_count${categoryPart}_timestamp`, Date.now().toString())
    } catch (e) {
      error.value = e.message
      await logError(e, 'productsStore', {
        page,
        categoryId,
        component: 'productsStore',
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetches featured products from Supabase
   * @param {number|null} categoryId - Optional category ID to filter by
   */
  const getFeaturedProducts = async (categoryId = null) => {
    try {
      const cacheKey = 'products.featured'
      const cachedData = localStorage.getItem(cacheKey)

      // Check if valid cached data exists
      if (cachedData && isCacheValid(cacheKey)) {
        try {
          const parsedData = JSON.parse(cachedData)
          if (parsedData && Array.isArray(parsedData)) {
            featuredProducts.value = parsedData
            return
          }
        } catch (e) {
          console.warn('Featured products cache parse error:', e)
        }
      }

      // Build query for featured products
      let query = supabase
        .from('products')
        .select(
          `
          id,
          product_name,
          description,
          price,
          quantity,
          sku,
          material_id,
          category_id,
          is_bundled,
          is_featured,
          enabled,
          allow_no_stock_sale,
          product_image (
            id,
            product_id,
            url,
            name
          ),
          product_features (
            id,
            product_id,
            feature
          )
        `,
        )
        .eq('enabled', true)
        .eq('is_featured', true)
        .order('id')

      // Add category filter if provided
      if (categoryId) {
        query = query.eq('category_id', categoryId)
      }

      const { data: featuredData, error: featuredError } = await query

      if (featuredError) {
        await logError(featuredError, 'productsStore', {
          component: 'getFeaturedProducts',
        })
        throw featuredError
      }

      // Update featured products state
      featuredProducts.value = featuredData || []

      // Cache the featured products
      localStorage.setItem(cacheKey, JSON.stringify(featuredData))
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
    } catch (e) {
      console.error('Error fetching featured products:', e)
      await logError(e, 'productsStore', {
        component: 'getFeaturedProducts',
      })
    }
  }

  /**
   * Clear products cache when schema or data changes
   */
  const clearProductsCache = () => {
    // Clear all product-related cache entries
    for (const key in localStorage) {
      if (key.startsWith('products.') || key === 'categories' || key === 'categories_timestamp') {
        console.log(`Clearing cache for: ${key}`)
        localStorage.removeItem(key)
      }
    }

    // Force reset state
    products.value = []
    featuredProducts.value = []
    categories.value = []
  }

  /**
   * Validates the cache integrity on app startup
   * Clears corrupted cache to ensure fresh data is loaded
   */
  const validateCache = () => {
    try {
      // Check categories cache
      const categoriesCache = localStorage.getItem('categories')
      if (categoriesCache) {
        try {
          const parsed = JSON.parse(categoriesCache)
          if (!Array.isArray(parsed) || !parsed.every((c) => c.id && c.category_name)) {
            console.warn('Corrupted categories cache found, clearing')
            localStorage.removeItem('categories')
            localStorage.removeItem('categories_timestamp')
          }
        } catch (e) {
          console.warn('Invalid categories cache, clearing:', e.message)
          localStorage.removeItem('categories')
          localStorage.removeItem('categories_timestamp')
        }
      }

      // Check product caches
      for (const key in localStorage) {
        if (key.startsWith('products.') && !key.includes('_timestamp')) {
          try {
            const parsed = JSON.parse(localStorage.getItem(key))

            // Validate cache structure
            if (
              !Array.isArray(parsed) ||
              parsed.some(
                (p) =>
                  !p.id ||
                  !p.product_name ||
                  !Array.isArray(p.product_image) ||
                  !Array.isArray(p.product_features),
              )
            ) {
              console.warn(`Corrupted products cache found for ${key}, clearing`)
              localStorage.removeItem(key)
              localStorage.removeItem(`${key}_timestamp`)
            }
          } catch (e) {
            console.warn(`Invalid products cache for ${key}, clearing: ${e.message}`)
            localStorage.removeItem(key)
            localStorage.removeItem(`${key}_timestamp`)
          }
        }
      }
    } catch (e) {
      console.error('Error validating cache:', e.message)
      // If something goes really wrong, clear all cache
      clearProductsCache()
    }
  }

  /**
   * Fetches a single product by its ID
   * @param {number} productId - The ID of the product to fetch
   * @returns {Promise<Object|null>} The product data or null if not found
   */
  const getProductById = async (productId) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: supaError } = await supabase
        .from('products')
        .select(
          `
          id,
          product_name,
          description,
          price,
          quantity,
          sku,
          material_id,
          category_id,
          is_bundled,
          is_featured,
          enabled,
          allow_no_stock_sale,
          product_image (
            id,
            product_id,
            url,
            name
          ),
          product_features (
            id,
            product_id,
            feature
          )
        `,
        )
        .eq('id', productId)
        .single()

      if (supaError) {
        await logError(supaError, 'productsStore', {
          productId,
          component: 'getProductById',
        })
        throw supaError
      }

      if (!data) {
        error.value = 'Product not found'
        return null
      }

      // Ensure product has valid structure
      return {
        ...data,
        product_image: Array.isArray(data.product_image) ? data.product_image : [],
        product_features: Array.isArray(data.product_features) ? data.product_features : [],
      }
    } catch (e) {
      error.value = e.message
      await logError(e, 'productsStore', {
        productId,
        component: 'getProductById',
      })
      return null
    } finally {
      loading.value = false
    }
  }

  // Call validateCache immediately to ensure cache integrity
  validateCache()

  // Expose store properties and methods
  return {
    products,
    featuredProducts,
    loading,
    error,
    currentPage,
    totalPages,
    categories,
    selectedCategory,
    getProducts,
    getFeaturedProducts,
    getCategories,
    clearProductsCache,
    validateCache, // Expose the validate function
    getProductById,
  }
})
