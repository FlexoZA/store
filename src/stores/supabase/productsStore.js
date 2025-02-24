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
  const searchResults = ref([]) // Add this new state for search results
  const searchLoading = ref(false) // Add loading state for search

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
        .select(
          `*,
          product_image(*)`,
          { count: 'exact' },
        )
        .eq('status', true)
        .range(offset, offset + itemsPerPage - 1)
        .order('id')

      if (supaError) {
        await logError(supaError, 'productsStore', {
          page,
          component: 'productsStore',
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
   * Searches products by name
   * @param {string} query - Search query
   */
  const searchProducts = async (query) => {
    if (!query || query.trim().length < 2) {
      searchResults.value = []
      return
    }

    searchLoading.value = true
    try {
      const { data, error: supaError } = await supabase
        .from('products')
        .select('id, name, price, quantity, product_image(*)')
        .eq('status', true)
        .ilike('name', `%${query}%`)
        .limit(10) // Limit results to prevent performance issues

      if (supaError) {
        await logError(supaError, 'productsStore', {
          query,
          component: 'searchProducts',
        })
        throw supaError
      }

      searchResults.value = data
    } catch (e) {
      error.value = e.message
      await logError(e, 'productsStore', {
        query,
        component: 'searchProducts',
      })
    } finally {
      searchLoading.value = false
    }
  }

  // Expose store properties and methods
  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    getProducts,
    searchProducts,
    searchResults,
    searchLoading,
  }
})
