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

      console.log('Categories fetched:', data)
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

    console.log('Fetching products with categoryId:', categoryId)

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
          `*,
          product_image(*)`,
          { count: 'exact' },
        )
        .eq('enabled', true)

      // Add category filter if provided
      if (categoryId) {
        // When filtering by category, exclude featured products
        query = query.eq('category_id', categoryId).eq('featured', false)
      }
      // If not filtering by category, show all products (including featured)

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

      console.log('Product query results:', productData.length, 'products found')

      // If no products found with this category, log more detailed info
      if (productData.length === 0 && categoryId) {
        console.log('No products found for category ID:', categoryId)

        // Let's check if any product has this category at all
        const { data: checkData } = await supabase
          .from('products')
          .select('id, category_id')
          .eq('category_id', categoryId)
          .limit(1)

        console.log('Product category check:', checkData)

        // Let's also look at a sample product's data structure
        const { data: sampleData } = await supabase.from('products').select('*').limit(1)

        console.log('Sample product data structure:', sampleData)
      }

      // Update store state
      products.value = productData
      currentPage.value = page
      totalPages.value = Math.ceil(count / itemsPerPage)

      // Updated cache storage with 'products.' prefix
      localStorage.setItem(cacheKey, JSON.stringify(productData))
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
