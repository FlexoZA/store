import axios from 'axios'
import { defineStore } from 'pinia'

export const useSalesBinderStore = defineStore('salesBinder', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchItems() {
      this.loading = true
      this.error = null

      try {
        const version = import.meta.env.VITE_SALESBINDER_API_VERSION
        const response = await axios.get(`/api/api/${version}/items.json`)

        // Ensure items is set correctly
        this.items = Array.isArray(response.data.items) ? response.data.items[0] : []
      } catch (err) {
        this.error = err.message
        console.error('Error fetching items:', err)
      } finally {
        this.loading = false
      }
    },
  },
})
