import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref(JSON.parse(localStorage.getItem('orders')) || [])

  const categories = ref(JSON.parse(localStorage.getItem('categories')) || [
    { id: 1, name: 'Burger', icon: '🍔', subcategories: [], price: 0 },
    { id: 2, name: 'Drinks', icon: '🥤', subcategories: [], price: 0 },
    { id: 3, name: 'Snacks', icon: '🍟', subcategories: [], price: 0 }
  ])

  const items = ref([
    { id: 1, name: 'Classic Burger', categoryId: 1, subcategory: 'Beef', price: 5.99 },
    { id: 2, name: 'Cheese Burger', categoryId: 1, subcategory: 'Beef', price: 6.99 },
    { id: 3, name: 'Coke', categoryId: 2, subcategory: 'Soft Drink', price: 1.99 },
    { id: 4, name: 'Fries', categoryId: 3, subcategory: 'Side', price: 2.99 }
  ])

  const todayOrders = computed(() => {
    const today = new Date().toDateString()
    return orders.value.filter(order => 
      new Date(order.createdAt).toDateString() === today
    )
  })

  const totalSalesToday = computed(() => {
    return todayOrders.value.reduce((sum, order) => sum + order.total, 0)
  })

  const addOrder = (orderData) => {
    const order = {
      id: Date.now(),
      ...orderData,
      createdAt: new Date().toISOString(),
      status: 'completed'
    }
    orders.value.push(order)
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  const addCategory = (name, icon = '🍔', subcategories = [], price = 0) => {
    const newCat = { id: Date.now(), name, icon, subcategories: Array.isArray(subcategories) ? subcategories : [], price: price !== null ? Number(price) : 0 }
    categories.value.push(newCat)
    localStorage.setItem('categories', JSON.stringify(categories.value))
  }

  const updateCategory = (id, updates) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
      localStorage.setItem('categories', JSON.stringify(categories.value))
    }
  }

  const deleteCategory = (id) => {
    categories.value = categories.value.filter(c => c.id !== id)
    localStorage.setItem('categories', JSON.stringify(categories.value))
  }

  const getOrdersByDate = (date) => {
    const targetDate = new Date(date).toDateString()
    return orders.value.filter(order => 
      new Date(order.createdAt).toDateString() === targetDate
    )
  }

  const searchOrders = (query) => {
    if (!query) return todayOrders.value
    
    const searchTerm = query.toLowerCase()
    return todayOrders.value.filter(order => 
      order.items.some(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        order.category.toLowerCase().includes(searchTerm)
      )
    )
  }

  return {
    orders,
    categories,
    items,
    todayOrders,
    totalSalesToday,
    addOrder,
    getOrdersByDate,
    addCategory,
    updateCategory,
    deleteCategory,
    searchOrders
  }
}, {
  persist: true
})