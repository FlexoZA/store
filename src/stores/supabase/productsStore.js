import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from './supabaseClient'
import { isCacheValid } from './utils/cacheUtils'
import { logError } from '@/stores/supabase/utils/errorLogger'

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

  /**
   * Fetches products from Supabase with pagination
   * Implements caching to improve performance
   * @param {number} page - Page number to fetch (defaults to 1)
   */
  const getProducts = async (page = 1) => {
    loading.value = true
    error.value = null

    // Updated cache keys with 'products.' prefix
    const cacheKey = `products.page_${page}`
    const cachedData = localStorage.getItem(cacheKey)
    const cachedCount = localStorage.getItem('products.total_count')

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

      // Fetch products from Supabase
      const {
        data: productData,
        count,
        error: supaError,
      } = await supabase
        .from('products')
        .select('*, product_image(*)', { count: 'exact' }) // Select products with their images
        .eq('status', true) // Only active products
        .range(offset, offset + itemsPerPage - 1) // Pagination range
        .order('id') // Order by ID

      if (supaError) {
        await logError(supaError, 'productsStore', {
          page,
          offset,
          itemsPerPage,
          query: 'products.select',
        })
        throw supaError
      }

      // Update store state
      products.value = productData
      currentPage.value = page
      totalPages.value = Math.ceil(count / itemsPerPage)

      // Updated cache storage with 'products.' prefix
      localStorage.setItem(cacheKey, JSON.stringify(productData))
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
      localStorage.setItem('products.total_count', JSON.stringify(count))
      localStorage.setItem('products.total_count_timestamp', Date.now().toString())
    } catch (e) {
      error.value = e.message
      await logError(e, 'productsStore', {
        page,
        component: 'productsStore',
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * Clears all product-related cache from localStorage
   * Useful when data needs to be refreshed
   */
  const clearProductsCache = () => {
    for (let i = 1; i <= totalPages.value; i++) {
      const cacheKey = `products.page_${i}`
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(`${cacheKey}_timestamp`)
    }
    localStorage.removeItem('products.total_count')
    localStorage.removeItem('products.total_count_timestamp')
  }

  // Expose store properties and methods
  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    getProducts,
    clearProductsCache,
  }
})
