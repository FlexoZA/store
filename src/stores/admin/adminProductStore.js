import { defineStore } from 'pinia'
import { supabase } from '../supabase/supabaseClient'
import { ref, computed } from 'vue'
import { logError } from '@/utils/errorLogger'

export const useAdminProductStore = defineStore('adminProducts', () => {
  // State
  const products = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const categories = ref([])
  const totalProducts = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const currentQuery = ref('')
  const currentCategoryId = ref(null)
  const currentAction = ref('fetch') // 'fetch', 'search', or 'filter'

  // Computed
  const totalPages = computed(() => Math.ceil(totalProducts.value / pageSize.value))
  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPreviousPage = computed(() => currentPage.value > 1)

  // Get products with pagination
  async function fetchProducts(page = 1) {
    isLoading.value = true
    error.value = null
    currentPage.value = page
    currentAction.value = 'fetch'
    currentQuery.value = ''
    currentCategoryId.value = null

    try {
      // First get the total count
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      if (countError) throw countError

      totalProducts.value = count || 0

      // Then get the data for the current page
      const from = (page - 1) * pageSize.value
      const to = from + pageSize.value - 1

      const { data, error: supabaseError } = await supabase
        .from('products')
        .select(
          `
          id,
          product_name,
          description,
          price,
          quantity,
          sku,
          category_id,
          is_featured,
          enabled
        `,
        )
        .order('product_name')
        .range(from, to)

      if (supabaseError) throw supabaseError

      products.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error fetching products:', err)
      products.value = []
      totalProducts.value = 0
    } finally {
      isLoading.value = false
    }
  }

  // Get all categories
  async function fetchCategories() {
    isLoading.value = true
    error.value = null
    console.log('Starting category fetch from Supabase...')

    try {
      // Try fetching categories from Supabase
      const { data, error: supaError } = await supabase
        .from('categories')
        .select('id, category_name, enabled, category_description')
        .order('category_name')

      console.log('Supabase response:', { data, supaError })

      if (supaError) {
        console.error('Supabase query error:', supaError)
        await logError(supaError, 'adminProductStore', {
          component: 'fetchCategories',
        })
        // Don't throw error, instead use hardcoded categories
      }

      // If data exists and has items, use it
      if (data && data.length > 0) {
        categories.value = data
        console.log('Categories loaded from Supabase:', categories.value)
      } else {
        // Otherwise, use hardcoded categories
        console.log('Using hardcoded categories')
        categories.value = [
          {
            id: 1,
            category_name: 'Electronics',
            enabled: true,
            category_description: 'Electronic devices and accessories',
          },
          {
            id: 2,
            category_name: 'Clothing',
            enabled: true,
            category_description: 'Apparel and fashion items',
          },
          {
            id: 3,
            category_name: 'Home & Kitchen',
            enabled: true,
            category_description: 'Home decor and kitchen products',
          },
          {
            id: 4,
            category_name: 'Books',
            enabled: true,
            category_description: 'Books and reading materials',
          },
          {
            id: 5,
            category_name: 'Sports & Outdoors',
            enabled: true,
            category_description: 'Sports equipment and outdoor gear',
          },
        ]
        console.log('Hardcoded categories set:', categories.value)
      }
    } catch (err) {
      console.error('Category fetch failed:', err)
      error.value = err.message
      await logError(err, 'adminProductStore', {
        component: 'fetchCategories',
      })

      // Fallback to hardcoded categories if any error occurs
      console.log('Falling back to hardcoded categories due to error')
      categories.value = [
        {
          id: 1,
          category_name: 'Electronics',
          enabled: true,
          category_description: 'Electronic devices and accessories',
        },
        {
          id: 2,
          category_name: 'Clothing',
          enabled: true,
          category_description: 'Apparel and fashion items',
        },
        {
          id: 3,
          category_name: 'Home & Kitchen',
          enabled: true,
          category_description: 'Home decor and kitchen products',
        },
        {
          id: 4,
          category_name: 'Books',
          enabled: true,
          category_description: 'Books and reading materials',
        },
        {
          id: 5,
          category_name: 'Sports & Outdoors',
          enabled: true,
          category_description: 'Sports equipment and outdoor gear',
        },
      ]
    } finally {
      isLoading.value = false
      console.log('Category fetch completed with', categories.value.length, 'categories')
    }
  }

  // Create a new product
  async function createProduct(productData) {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .insert(productData)
        .select()

      if (supabaseError) throw supabaseError

      // Refresh the current page to show the new product
      await fetchProducts(currentPage.value)

      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error creating product:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Update an existing product
  async function updateProduct(id, productData) {
    isLoading.value = true
    error.value = null

    try {
      const { data, error: supabaseError } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()

      if (supabaseError) throw supabaseError

      // Update the product in the products array
      if (data && data.length > 0) {
        const index = products.value.findIndex((p) => p.id === id)
        if (index !== -1) {
          products.value[index] = data[0]
        }
      }

      return data[0]
    } catch (err) {
      error.value = err.message
      console.error('Error updating product:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Delete a product
  async function deleteProduct(id) {
    isLoading.value = true
    error.value = null

    try {
      const { error: supabaseError } = await supabase.from('products').delete().eq('id', id)

      if (supabaseError) throw supabaseError

      // Remove the product from the products array
      products.value = products.value.filter((p) => p.id !== id)
      totalProducts.value -= 1

      // If the current page is now empty and it's not the first page, go to the previous page
      if (products.value.length === 0 && currentPage.value > 1) {
        await fetchProducts(currentPage.value - 1)
      } else if (products.value.length === 0) {
        await fetchProducts(1)
      }

      return true
    } catch (err) {
      error.value = err.message
      console.error('Error deleting product:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Search products with pagination
  async function searchProducts(query, page = 1) {
    isLoading.value = true
    error.value = null
    currentPage.value = page
    currentQuery.value = query
    currentCategoryId.value = null
    currentAction.value = 'search'

    try {
      // First get the total count for the search
      const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .or(`product_name.ilike.%${query}%,description.ilike.%${query}%`)

      if (countError) throw countError

      totalProducts.value = count || 0

      // Then get the data for the current page
      const from = (page - 1) * pageSize.value
      const to = from + pageSize.value - 1

      const { data, error: supabaseError } = await supabase
        .from('products')
        .select(
          `
          id,
          product_name,
          description,
          price,
          quantity,
          sku,
          category_id,
          is_featured,
          enabled
        `,
        )
        .or(`product_name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('product_name')
        .range(from, to)

      if (supabaseError) throw supabaseError

      products.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error searching products:', err)
      products.value = []
      totalProducts.value = 0
    } finally {
      isLoading.value = false
    }
  }

  // Filter products by category with pagination
  async function filterProductsByCategory(categoryId, page = 1) {
    isLoading.value = true
    error.value = null
    currentPage.value = page
    currentCategoryId.value = categoryId
    currentQuery.value = ''
    currentAction.value = 'filter'

    try {
      // First get the total count for the filter
      let countQuery = supabase.from('products').select('*', { count: 'exact', head: true })

      if (categoryId) {
        countQuery = countQuery.eq('category_id', categoryId)
      }

      const { count, error: countError } = await countQuery

      if (countError) throw countError

      totalProducts.value = count || 0

      // Then get the data for the current page
      const from = (page - 1) * pageSize.value
      const to = from + pageSize.value - 1

      let dataQuery = supabase
        .from('products')
        .select(
          `
          id,
          product_name,
          description,
          price,
          quantity,
          sku,
          category_id,
          is_featured,
          enabled
        `,
        )
        .order('product_name')
        .range(from, to)

      if (categoryId) {
        dataQuery = dataQuery.eq('category_id', categoryId)
      }

      const { data, error: supabaseError } = await dataQuery

      if (supabaseError) throw supabaseError

      products.value = data || []
    } catch (err) {
      error.value = err.message
      console.error('Error filtering products:', err)
      products.value = []
      totalProducts.value = 0
    } finally {
      isLoading.value = false
    }
  }

  // Go to next page
  function nextPage() {
    if (hasNextPage.value) {
      const nextPageNum = currentPage.value + 1

      if (currentAction.value === 'search' && currentQuery.value) {
        searchProducts(currentQuery.value, nextPageNum)
      } else if (currentAction.value === 'filter') {
        filterProductsByCategory(currentCategoryId.value, nextPageNum)
      } else {
        fetchProducts(nextPageNum)
      }
    }
  }

  // Go to previous page
  function previousPage() {
    if (hasPreviousPage.value) {
      const prevPageNum = currentPage.value - 1

      if (currentAction.value === 'search' && currentQuery.value) {
        searchProducts(currentQuery.value, prevPageNum)
      } else if (currentAction.value === 'filter') {
        filterProductsByCategory(currentCategoryId.value, prevPageNum)
      } else {
        fetchProducts(prevPageNum)
      }
    }
  }

  // Go to specific page
  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      if (currentAction.value === 'search' && currentQuery.value) {
        searchProducts(currentQuery.value, page)
      } else if (currentAction.value === 'filter') {
        filterProductsByCategory(currentCategoryId.value, page)
      } else {
        fetchProducts(page)
      }
    }
  }

  return {
    products,
    isLoading,
    error,
    categories,
    totalProducts,
    currentPage,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    currentQuery,
    currentCategoryId,
    currentAction,
    fetchProducts,
    fetchCategories,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProductsByCategory,
    nextPage,
    previousPage,
    goToPage,
  }
})
