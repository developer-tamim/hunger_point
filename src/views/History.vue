<template>
  <Layout>
    <div class="p-6 space-y-6 max-w-6xl mx-auto">

      <!-- Tab Nav -->
      <div class="bg-white rounded-xl shadow-sm p-4">
        <div class="flex flex-wrap space-x-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-orange-600 text-white'
                : 'hover:bg-gray-100'
            ]"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- ===== ORDER HISTORY ===== -->
      <div v-if="activeTab === 'orders'">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-800">Order History</h1>
        </div>

        <!-- Order Summary -->
        <div class="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div><p class="text-sm text-gray-600">Total Orders</p><p class="text-2xl font-bold text-orange-600">{{ filteredOrders.length }}</p></div>
          <div><p class="text-sm text-gray-600">Total Sales</p><p class="text-2xl font-bold text-green-600">${{ orderTotal.toFixed(2) }}</p></div>
          <div><p class="text-sm text-gray-600">Average Order</p><p class="text-2xl font-bold text-blue-600">${{ orderAvg.toFixed(2) }}</p></div>
        </div>

        <!-- Order List -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-2"><h2 class="text-lg font-semibold">All Orders</h2></div>

           <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4">
          <input
            v-model="orderSearch"
            type="text"
            placeholder="Search by item name or category..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            v-model="orderStart"
            type="date"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            v-model="orderEnd"
            type="date"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            v-model="orderCategory"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            <option v-for="cat in orderStore.categories" :key="cat.id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>
        </div>

          <div v-if="filteredOrders.length === 0" class="p-8 text-center text-gray-500">No orders found.</div>
          <div v-else class="divide-y">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              class="p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <span class="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">{{ order.category }}</span>
                    <span class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</span>
                  </div>
                  <h3 class="mt-2 font-semibold text-gray-800">#{{ order.id }}</h3>
                  <div class="mt-1 text-sm text-gray-600">
                    <span v-for="(item, idx) in order.items" :key="idx">{{ item.quantity }}× {{ item.name }}<span v-if="idx < order.items.length - 1">, </span></span>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-green-600">${{ order.total.toFixed(2) }}</p>
                  <p class="text-xs text-gray-500">{{ formatTime(order.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>

      <!-- ===== EXPENSE HISTORY ===== -->
      <div v-if="activeTab === 'expenses'">
        <!-- Header -->
        <div class="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-800">Expense History</h1>
          <!-- <div class="text-sm text-gray-600">
            Total expenses: <span class="font-semibold">{{ filteredExpenses.length }}</span>
          </div> -->
        </div>

        <!-- Expense Summary -->
        <div class="bg-white rounded-xl shadow-sm p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div><p class="text-sm text-gray-600">Total Expenses</p><p class="text-2xl font-bold text-red-600">{{ filteredExpenses.length }}</p></div>
          <div><p class="text-sm text-gray-600">Total Amount</p><p class="text-2xl font-bold text-red-600">${{ expenseTotal.toFixed(2) }}</p></div>
          <div><p class="text-sm text-gray-600">Average Expense</p><p class="text-2xl font-bold text-orange-600">${{ expenseAvg.toFixed(2) }}</p></div>
        </div>

        <!-- Expense List -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-2"><h2 class="text-lg font-semibold">All Expenses</h2></div>

          <!-- Filters -->
        <div class="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-4">
          <input
            v-model="expenseSearch"
            type="text"
            placeholder="Search by description or category..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            v-model="expenseStart"
            type="date"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <input
            v-model="expenseEnd"
            type="date"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            v-model="expenseCategory"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            <option v-for="cat in expenseStore.expenseCategories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

          <div v-if="filteredExpenses.length === 0" class="p-8 text-center text-gray-500">No expenses found.</div>
          <div v-else class="divide-y">
            <div
              v-for="expense in filteredExpenses"
              :key="expense.id"
              class="p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <span class="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">{{ expense.category }}</span>
                    <span class="text-sm text-gray-500">{{ formatDate(expense.date) }}</span>
                  </div>
                  <h3 class="mt-2 font-semibold text-gray-800">${{ expense.amount.toFixed(2) }}</h3>
                  <p class="mt-1 text-sm text-gray-600">{{ expense.description }}</p>
                  <p v-if="expense.vendor" class="text-xs text-gray-500 mt-1">Vendor: {{ expense.vendor }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500">{{ formatTime(expense.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  </Layout>
</template>

<script setup>
/* ---------- Imports ---------- */
import { ref, computed } from 'vue'
import Layout from '../components/layout/Layout.vue'
import { useOrderStore } from '../stores/orderStore'
import { useExpenseStore } from '../stores/expenseStore'

/* ---------- Stores ---------- */
const orderStore = useOrderStore()
const expenseStore = useExpenseStore()

/* ---------- Tabs ---------- */
const activeTab = ref('orders') // orders | expenses
const tabs = [
  { id: 'orders', name: 'Order History' },
  { id: 'expenses', name: 'Expense History' }
]

/* ---------- Order History Filters ---------- */
const orderSearch     = ref('')
const orderCategory   = ref('')
const orderStart      = ref('')
const orderEnd        = ref('')

/* ---------- Expense History Filters ---------- */
const expenseSearch   = ref('')
const expenseCategory = ref('')
const expenseStart    = ref('')
const expenseEnd      = ref('')

/* ---------- Helpers ---------- */
const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

const formatTime = (dateString) =>
  new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

/* ---------- Defaults ---------- */
const now = new Date()
// Pre-fill both date ranges to current month
const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

orderStart.value  = firstDay.toISOString().substr(0, 10)
orderEnd.value    = now.toISOString().substr(0, 10)
expenseStart.value = firstDay.toISOString().substr(0, 10)
expenseEnd.value   = now.toISOString().substr(0, 10)

/* ---------- Order History Computed ---------- */
const allOrders = computed(() =>
  [...orderStore.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
)

const filteredOrders = computed(() => {
  let list = allOrders.value
  if (orderSearch.value) {
    const q = orderSearch.value.toLowerCase()
    list = list.filter(o =>
      o.items.some(i => i.name.toLowerCase().includes(q)) ||
      o.category.toLowerCase().includes(q)
    )
  }
  if (orderCategory.value) list = list.filter(o => o.category === orderCategory.value)
  if (orderStart.value) {
    const start = new Date(orderStart.value)
    list = list.filter(o => new Date(o.createdAt) >= start)
  }
  if (orderEnd.value) {
    const end = new Date(orderEnd.value)
    end.setHours(23, 59, 59, 999)
    list = list.filter(o => new Date(o.createdAt) <= end)
  }
  return list
})

const orderTotal = computed(() => filteredOrders.value.reduce((sum, o) => sum + o.total, 0))
const orderAvg   = computed(() => (filteredOrders.value.length ? orderTotal.value / filteredOrders.value.length : 0))

/* ---------- Expense History Computed ---------- */
const allExpenses = computed(() =>
  [...expenseStore.expenses].sort((a, b) => new Date(b.date) - new Date(a.date))
)

const filteredExpenses = computed(() => {
  let list = allExpenses.value
  if (expenseSearch.value) {
    const q = expenseSearch.value.toLowerCase()
    list = list.filter(e =>
      e.description.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    )
  }
  if (expenseCategory.value) list = list.filter(e => e.category === expenseCategory.value)
  if (expenseStart.value) {
    const start = new Date(expenseStart.value)
    list = list.filter(e => new Date(e.date) >= start)
  }
  if (expenseEnd.value) {
    const end = new Date(expenseEnd.value)
    end.setHours(23, 59, 59, 999)
    list = list.filter(e => new Date(e.date) <= end)
  }
  return list
})

const expenseTotal = computed(() => filteredExpenses.value.reduce((sum, e) => sum + e.amount, 0))
const expenseAvg   = computed(() => (filteredExpenses.value.length ? expenseTotal.value / filteredExpenses.value.length : 0))
</script>