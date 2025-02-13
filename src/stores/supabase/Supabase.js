import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export const useSupabaseStore = defineStore('supabase', () => {
  const products = ref([])
  const featured_products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const itemsPerPage = 20

  // Add cache expiration helper
  const isCacheValid = (cacheKey) => {
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`)
    if (!cacheTimestamp) return false

    // Cache expires after 1 hour (3600000 ms)
    const CACHE_DURATION = 3600000
    return Date.now() - parseInt(cacheTimestamp) < CACHE_DURATION
  }

  // Gets product from supabase
  const getProducts = async (page = 1) => {
    loading.value = true
    error.value = null

    const cacheKey = `products_page_${page}`
    const cachedData = localStorage.getItem(cacheKey)
    const cachedCount = localStorage.getItem('products_total_count')

    if (cachedData && cachedCount && isCacheValid(cacheKey)) {
      products.value = JSON.parse(cachedData)
      currentPage.value = page
      totalPages.value = Math.ceil(JSON.parse(cachedCount) / itemsPerPage)
      loading.value = false
      return
    }

    try {
      // Calculate offset based on page number
      const offset = (page - 1) * itemsPerPage

      // Fetch items with pagination and status filter
      const {
        data: productData,
        count,
        error: supaError,
      } = await supabase
        .from('products')
        .select('*, product_image(*)', { count: 'exact' })
        .eq('status', true)
        .range(offset, offset + itemsPerPage - 1)
        .order('id')

      if (supaError) throw supaError

      products.value = productData
      currentPage.value = page
      totalPages.value = Math.ceil(count / itemsPerPage)

      // Store with timestamp
      localStorage.setItem(cacheKey, JSON.stringify(productData))
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString())
      localStorage.setItem('products_total_count', JSON.stringify(count))
      localStorage.setItem('products_total_count_timestamp', Date.now().toString())
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Gets featured_products from supabase
  const getFeaturedProducts = async () => {
    loading.value = true
    error.value = null

    // Try to get data from localStorage first
    const cachedData = localStorage.getItem('featured_products')
    if (cachedData) {
      featured_products.value = JSON.parse(cachedData)
      loading.value = false
      return
    }

    try {
      const { data: featuredProductData, error: supaError } = await supabase
        .from('featured_products')
        .select('*, featured_product_specification(*), featured_product_image(*)')
        .eq('status', true)
        .order('id')

      if (supaError) throw supaError

      featured_products.value = featuredProductData
      // Store the data in localStorage
      localStorage.setItem('featured_products', JSON.stringify(featuredProductData))
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // Add a method to clear the cache if needed
  const clearFeaturedProductsCache = () => {
    localStorage.removeItem('featured_products')
  }

  // Add method to clear products cache
  const clearProductsCache = () => {
    // Clear all pages and their timestamps
    for (let i = 1; i <= totalPages.value; i++) {
      const cacheKey = `products_page_${i}`
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(`${cacheKey}_timestamp`)
    }
    localStorage.removeItem('products_total_count')
    localStorage.removeItem('products_total_count_timestamp')
  }

  return {
    featured_products,
    products,
    loading,
    error,
    currentPage,
    totalPages,
    getProducts,
    getFeaturedProducts,
    clearFeaturedProductsCache,
    clearProductsCache,
  }
})
