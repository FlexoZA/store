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
      const { data, error: supaError } = await supabase
        .from('categories')
        .select('*')
        .eq('enabled', true)
        .order('category_name')

      if (supaError) {
        await logError(supaError, 'productsStore', {
          component: 'getCategories',
        })
        throw supaError
      }

      categories.value = data
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

    // Check if valid cached data exists
    if (cachedData && cachedCount && isCacheValid(cacheKey)) {
      products.value = JSON.parse(cachedData)
      currentPage.value = page
      totalPages.value = Math.ceil(JSON.parse(cachedCount) / itemsPerPage)
      loading.value = false
      return
    }

    try {
      // Calculate offset for pagination
      const offset = (page - 1) * itemsPerPage

      // Start building the query
      let query = supabase
        .from('products')
        .select(
          `id, product_name, description, price, quantity, sku, material_id,
          category_id, is_bundled, is_featured, enabled, allow_no_stock_sale,
          product_image(*),
          product_features(*)`,
          { count: 'exact' },
        )
        .eq('enabled', true)

      // Add category filter if provided
      if (categoryId) {
        // When filtering by category, include all products in that category
        query = query.eq('category_id', categoryId)
      }

      // If on page 1, make sure we include featured products
      let featuredProductsData = []
      if (page === 1) {
        // First, get featured products regardless of pagination
        const { data: featuredData, error: featuredError } = await supabase
          .from('products')
          .select(
            `id, product_name, description, price, quantity, sku, material_id,
            category_id, is_bundled, is_featured, enabled, allow_no_stock_sale,
            product_image(*),
            product_features(*)`,
          )
          .eq('enabled', true)
          .eq('is_featured', true)
          .limit(5) // Assuming there aren't many featured products

        if (featuredError) {
          await logError(featuredError, 'productsStore', {
            component: 'getFeaturedProducts',
          })
        } else if (featuredData && featuredData.length > 0) {
          // Save featured products for later
          featuredProductsData = featuredData
        }
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

      // For page 1, ensure featured products are included (but avoid duplicates)
      let combinedProductData = [...productData]
      if (page === 1 && featuredProductsData.length > 0) {
        // Get IDs of products already in the results
        const existingIds = new Set(productData.map((p) => p.id))

        // Add featured products that aren't already in the results
        for (const featuredProduct of featuredProductsData) {
          if (!existingIds.has(featuredProduct.id)) {
            combinedProductData.push(featuredProduct)
          }
        }
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
      products.value = combinedProductData
      currentPage.value = page
      totalPages.value = Math.ceil(count / itemsPerPage)

      // Updated cache storage with 'products.' prefix
      localStorage.setItem(cacheKey, JSON.stringify(combinedProductData))
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
   * Clear products cache when schema or data changes
   */
  const clearProductsCache = () => {
    // Clear all product-related cache entries
    for (const key in localStorage) {
      if (key.startsWith('products.')) {
        localStorage.removeItem(key)
      }
    }
  }

  // Expose store properties and methods
  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    categories,
    selectedCategory,
    getProducts,
    getCategories,
    clearProductsCache,
  }
})
