import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOrderStore = defineStore('orders', () => {
  const orders = ref(JSON.parse(localStorage.getItem('orders')) || [])

  const categories = ref([
    { id: 1, name: 'Burger', icon: '🍔' },
    { id: 2, name: 'Drinks', icon: '🥤' },
    { id: 3, name: 'Snacks', icon: '🍟' }
  ])

  const items = ref([
    { id: 1, name: 'Classic Burger', categoryId: 1, price: 5.99 },
    { id: 2, name: 'Cheese Burger', categoryId: 1, price: 6.99 },
    { id: 3, name: 'Coke', categoryId: 2, price: 1.99 },
    { id: 4, name: 'Fries', categoryId: 3, price: 2.99 }
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
    searchOrders
  }
}, {
  persist: true
})