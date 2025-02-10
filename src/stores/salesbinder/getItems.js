import { defineStore } from 'pinia'
import api from '../services/api'

export const useDataStore = defineStore('data', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async getItems() {
      this.loading = true
      try {
        const response = await api.get('/your-endpoint')
        this.items = response.data
        this.error = null
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
