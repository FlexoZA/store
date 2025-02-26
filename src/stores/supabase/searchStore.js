import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from './supabaseClient'
import { logError } from '@/utils/errorLogger'

/**
 * Store for managing search functionality using Pinia
 */
export const useSearchStore = defineStore('search', () => {
  // State management
  const searchResults = ref([])
  const searchLoading = ref(false)
  const error = ref(null)

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
        await logError(supaError, 'searchStore', {
          query,
          component: 'searchProducts',
        })
        throw supaError
      }

      searchResults.value = data
    } catch (e) {
      error.value = e.message
      await logError(e, 'searchStore', {
        query,
        component: 'searchProducts',
      })
    } finally {
      searchLoading.value = false
    }
  }

  // Reset search results
  const clearSearchResults = () => {
    searchResults.value = []
  }

  // Expose store properties and methods
  return {
    searchResults,
    searchLoading,
    error,
    searchProducts,
    clearSearchResults,
  }
})
