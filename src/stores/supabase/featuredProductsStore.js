import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from './supabaseClient'
import { logError } from '@/stores/supabase/utils/errorLogger'

export const useFeaturedProductsStore = defineStore('featuredProducts', () => {
  const featured_products = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getFeaturedProducts = async () => {
    loading.value = true
    error.value = null

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

      if (supaError) {
        await logError(supaError, 'featuredProductsStore', {
          query: 'featured_products.select',
        })
        throw supaError
      }

      featured_products.value = featuredProductData
      localStorage.setItem('featured_products', JSON.stringify(featuredProductData))
    } catch (e) {
      error.value = e.message
      await logError(e, 'featuredProductsStore', {
        component: 'featuredProductsStore',
      })
    } finally {
      loading.value = false
    }
  }

  const clearFeaturedProductsCache = () => {
    localStorage.removeItem('featured_products')
  }

  return {
    featured_products,
    loading,
    error,
    getFeaturedProducts,
    clearFeaturedProductsCache,
  }
})
