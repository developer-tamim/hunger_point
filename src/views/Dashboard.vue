<template>
  <Layout>
    <div class="p-6 space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Sales" 
          :value="`$${totalSalesToday.toFixed(2)}`"
          icon="💰"
          color="bg-green-100"
        />
        <StatCard 
          title="Total Orders" 
          :value="todayOrders.length"
          icon="📋"
          color="bg-blue-100"
        />
        <StatCard 
          title="Total Expenses" 
          :value="`$${totalExpensesToday.toFixed(2)}`"
          icon="💸"
          color="bg-red-100"
        />
        <StatCard 
          title="Net Profit" 
          :value="`$${netProfit.toFixed(2)}`"
          icon="📈"
          color="bg-purple-100"
        />
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">Sales vs Expenses</h3>
          <canvas id="salesChart" width="400" height="200"></canvas>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold mb-4">Top Items</h3>
          <canvas id="itemsChart" width="400" height="200"></canvas>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Recent Orders</h3>
            <router-link to="/orders" class="text-orange-600 text-sm hover:underline">View All</router-link>
          </div>
          <div class="space-y-3">
            <div 
              v-for="order in recentOrders.slice(0, 5)" 
              :key="order.id"
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium">#{{ order.id }}</p>
                <p class="text-sm text-gray-600">{{ order.items.length }} items</p>
              </div>
              <span class="font-semibold">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Recent Expenses -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Recent Expenses</h3>
            <router-link to="/expenses" class="text-orange-600 text-sm hover:underline">View All</router-link>
          </div>
          <div class="space-y-3">
            <div 
              v-for="expense in recentExpenses.slice(0, 5)" 
              :key="expense.id"
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="font-medium">{{ expense.category }}</p>
                <p class="text-sm text-gray-600">{{ expense.description }}</p>
              </div>
              <span class="font-semibold text-red-600">-${{ expense.amount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { Chart } from 'chart.js'
import Layout from '../components/layout/Layout.vue'
import StatCard from '../components/dashboard/StatCard.vue'
import { useOrderStore } from '../stores/orderStore'
import { useExpenseStore } from '../stores/expenseStore'

const orderStore = useOrderStore()
const expenseStore = useExpenseStore()

const todayOrders = computed(() => orderStore.todayOrders)
const totalSalesToday = computed(() => orderStore.totalSalesToday)
const totalExpensesToday = computed(() => expenseStore.todayExpenses.reduce((sum, exp) => sum + exp.amount, 0))
const netProfit = computed(() => totalSalesToday.value - totalExpensesToday.value)

const recentOrders = computed(() => {
  return [...todayOrders.value].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  )
})

const recentExpenses = computed(() => {
  return [...expenseStore.todayExpenses].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )
})

onMounted(() => {
  // Initialize Chart.js
  const salesCtx = document.getElementById('salesChart')
  if (salesCtx) {
    new Chart(salesCtx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Sales',
          data: [300, 450, 380, 520, 480, 600, 550],
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4
        }, {
          label: 'Expenses',
          data: [150, 200, 180, 220, 200, 250, 230],
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }
})
</script>