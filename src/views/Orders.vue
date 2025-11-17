<template>
  <Layout>
    <div class="p-6 space-y-6">
      <!-- Search and Filter -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search by item name or category..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            v-model="searchQuery"
          />
          <select 
            v-model="selectedCategory"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            <option v-for="category in orderStore.categories" :key="category.id" :value="category.name">
              {{ category.icon }} {{ category.name }}
            </option>
          </select>
          <button 
            @click="showAddOrderModal = true"
            class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            + New Order
          </button>
        </div>
      </div>

      <!-- Daily Orders -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold">Today's Orders</h2>
          <div class="text-right">
            <p class="text-sm text-gray-600">Total Orders: {{ filteredOrders.length }}</p>
            <p class="text-lg font-bold text-green-600">Total: {{ dailyTotal.toFixed(2) }} tk</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4">Order #</th>
                <th class="text-left py-3 px-4">Items</th>
                <th class="text-left py-3 px-4">Total</th>
                <th class="text-left py-3 px-4">Time</th>
                <th class="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4 font-medium">#{{ order.id }}</td>
                <td class="py-3 px-4">
                  <div v-for="item in order.items" :key="item.id" class="text-sm">
                    {{ item.quantity }}x {{ item.name }}
                  </div>
                </td>
                <td class="py-3 px-4 font-semibold">{{ order.total.toFixed(2) }} tk</td>
                <td class="py-3 px-4 text-sm text-gray-600">
                  {{ formatTime(order.createdAt) }}
                </td>
                <td class="py-3 px-4">
                  <button class="text-red-600 hover:text-red-800 text-sm" @click="deleteOrder(order.id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Calendar View -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6">Order History</h2>
        <div class="grid grid-cols-7 gap-2 mb-4">
          <div v-for="day in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" 
               :key="day"
               class="text-center font-medium text-gray-600 py-2"
          >
            {{ day }}
          </div>
        </div>
        <div class="grid grid-cols-7 gap-2">
          <div 
            v-for="date in calendarDates" 
            :key="date.date"
            class="border rounded-lg p-2 cursor-pointer hover:bg-orange-50 transition-colors"
            :class="{ 'bg-orange-100': date.hasOrders }"
            @click="selectDate(date.date)"
          >
            <div class="text-sm font-medium">{{ date.day }}</div>
            <div v-if="date.hasOrders" class="text-xs text-orange-600">
              {{ date.total.toFixed(0) }} tk
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Order Modal -->
    <Modal v-if="showAddOrderModal" @close="showAddOrderModal = false">
      <OrderForm @order-added="handleOrderAdded" @close="showAddOrderModal = false" />
    </Modal>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/layout/Layout.vue'
// import Modal from '../components/ui/Modal.vue'
import OrderForm from '../components/orders/OrderForm.vue'
import { useOrderStore } from '../stores/orderStore'

const orderStore = useOrderStore()

const searchQuery = ref('')
const selectedCategory = ref('')
const showAddOrderModal = ref(false)
const selectedDate = ref(null)

const filteredOrders = computed(() => {
  let orders = orderStore.todayOrders
  
  if (searchQuery.value) {
    orders = orderStore.searchOrders(searchQuery.value)
  }
  
  if (selectedCategory.value) {
    orders = orders.filter(order => order.category === selectedCategory.value)
  }
  
  return orders
})

const dailyTotal = computed(() => {
  return filteredOrders.value.reduce((sum, order) => sum + order.total, 0)
})

const calendarDates = computed(() => {
  const dates = []
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    dates.push({ day: '', date: null, hasOrders: false, total: 0 })
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day).toISOString()
    const dayOrders = orderStore.getOrdersByDate(date)
    const total = dayOrders.reduce((sum, order) => sum + order.total, 0)
    
    dates.push({
      day,
      date,
      hasOrders: dayOrders.length > 0,
      total
    })
  }
  
  return dates
})

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleOrderAdded = () => {
  showAddOrderModal.value = false
}

const deleteOrder = (orderId) => {
  if (confirm('Are you sure you want to delete this order?')) {
    orderStore.orders = orderStore.orders.filter(o => o.id !== orderId)
    localStorage.setItem('orders', JSON.stringify(orderStore.orders))
  }
}

const selectDate = (date) => {
  if (date) {
    selectedDate.value = date
  }
}

onMounted(() => {
  // Initialize data if empty
  if (orderStore.orders.length === 0) {
    // Add sample orders for demo
    orderStore.addOrder({
      category: 'Burger',
      items: [
        { id: 1, name: 'Classic Burger', quantity: 2, price: 5.99 }
      ],
      total: 11.98
    })
  }
})
</script>