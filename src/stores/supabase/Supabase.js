import { defineStore } from 'pinia'
import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export const useSupabaseStore = defineStore('supabase', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const totalPages = ref(0)
  const itemsPerPage = 20

  // Gets product from supabase
  const getProducts = async (page = 1) => {
    loading.value = true
    error.value = null
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
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    error,
    currentPage,
    totalPages,
    getProducts,
  }
})
