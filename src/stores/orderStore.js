import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref(JSON.parse(localStorage.getItem('orders')) || [])

  const categories = ref(JSON.parse(localStorage.getItem('categories')) || [
    { id: 1, name: 'Burger', icon: '🍔', subcategories: [{ name: 'Classic', price: 5.99 }, { name: 'Cheese', price: 6.99 }], price: 0 },
    { id: 2, name: 'Drinks', icon: '🥤', subcategories: [{ name: 'Coke', price: 1.99 }, { name: 'Sprite', price: 1.99 }], price: 0 },
    { id: 3, name: 'Snacks', icon: '🍟', subcategories: [{ name: 'Fries', price: 2.99 }], price: 0 }
  ])

  const items = ref(JSON.parse(localStorage.getItem('items')) || [
    { id: 1, name: 'Classic Burger', categoryId: 1, subcategory: 'Classic', price: 5.99 },
    { id: 2, name: 'Cheese Burger', categoryId: 1, subcategory: 'Cheese', price: 6.99 },
    { id: 3, name: 'Coke', categoryId: 2, subcategory: 'Coke', price: 1.99 },
    { id: 4, name: 'Fries', categoryId: 3, subcategory: 'Fries', price: 2.99 }
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
    // sync items for this category
    syncCategoryItems(newCat.id, newCat.subcategories)
    return newCat
  }

  const updateCategory = (id, updates) => {
    const index = categories.value.findIndex(c => c.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
      localStorage.setItem('categories', JSON.stringify(categories.value))
      if (updates.subcategories) {
        syncCategoryItems(id, updates.subcategories)
      }
    }
  }

  const deleteCategory = (id) => {
    categories.value = categories.value.filter(c => c.id !== id)
    // also remove any items belonging to this category
    items.value = items.value.filter(i => i.categoryId !== id)
    localStorage.setItem('categories', JSON.stringify(categories.value))
    localStorage.setItem('items', JSON.stringify(items.value))
  }

  const syncCategoryItems = (categoryId, newItems) => {
    // remove existing items for this category
    items.value = items.value.filter(i => i.categoryId !== categoryId)
    // add provided items as orderStore items
    if (Array.isArray(newItems)) {
      newItems.forEach((it, index) => {
        const itemId = Date.now() + index
        const item = {
          id: itemId,
          name: it.name,
          categoryId,
          subcategory: it.name,
          price: Number(it.price) || 0
        }
        items.value.push(item)
      })
      // force reactive re-assignment and persist
      items.value = [...items.value]
      localStorage.setItem('items', JSON.stringify(items.value))
    }
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