import axios from 'axios'
import { defineStore } from 'pinia'

export const useSalesBinderStore = defineStore('salesBinder', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  }),

  actions: {
    async fetchItems(page = 1, retryCount = 3) {
      this.loading = true
      this.error = null
      this.currentPage = page

      try {
        const version = import.meta.env.VITE_SALESBINDER_API_VERSION
        console.log('DEBUG:: Fetching page:', page)

        const response = await axios.get(`/api/api/${version}/items.json`, {
          params: { page },
          timeout: 10000, // 10 second timeout
        })

        // Update pagination info
        this.totalPages = parseInt(response.data.pages) || 1
        this.totalItems = parseInt(response.data.count) || 0

        // Update items
        this.items = Array.isArray(response.data.items) ? response.data.items[0] : []
      } catch (err) {
        console.error('Error fetching items:', err)

        // Retry on timeout or 500 error if we have retries left
        if (retryCount > 0 && (err.code === 'ETIMEDOUT' || err.response?.status === 500)) {
          console.log(`DEBUG:: Retrying... (${retryCount} attempts left)`)
          await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
          return this.fetchItems(page, retryCount - 1)
        }

        this.error = 'Failed to load items. Please try again.'
        this.items = [] // Clear items on error
      } finally {
        this.loading = false
      }
    },
  },
})
