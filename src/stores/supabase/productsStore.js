import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from './supabaseClient'
import { isCacheValid } from './utils/cacheUtils'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const itemsPerPage = 20

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
      const offset = (page - 1) * itemsPerPage

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

  const clearProductsCache = () => {
    for (let i = 1; i <= totalPages.value; i++) {
      const cacheKey = `products_page_${i}`
      localStorage.removeItem(cacheKey)
      localStorage.removeItem(`${cacheKey}_timestamp`)
    }
    localStorage.removeItem('products_total_count')
    localStorage.removeItem('products_total_count_timestamp')
  }

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
