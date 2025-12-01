<template>
  <Layout>
    <div class="p-6 space-y-6 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold">Dashboard</h1>
          <p class="text-sm text-gray-500">Overview of today’s activity — no charts, just clean stats & lists</p>
        </div>
        <div class="flex items-center space-x-3">
          <ActionButton to="/orders" icon="📋" text="New Order" />
          <ActionButton to="/expenses" icon="💸" text="Add Expense" />
        </div>
      </div>

      <!-- KPI ROW -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Sales (Today)" :value="`$${Number(salesToday || 0).toFixed(2)}`" icon="💰" color="bg-green-50 text-green-700" caption="Total sales for today" />
        <KpiCard title="Orders (Today)" :value="orderStore.todayOrders.length" icon="📋" color="bg-blue-50 text-blue-700" caption="# of orders placed" />
        <KpiCard title="Expenses (Today)" :value="`$${Number(expensesToday || 0).toFixed(2)}`" icon="💸" color="bg-red-50 text-red-700" caption="Total expenses today" />
        <KpiCard title="Net Profit" :value="`$${Number(netProfit || 0).toFixed(2)}`" icon="📈" color="bg-purple-50 text-purple-700" caption="Sales minus expenses" />
      </div>

      <!-- MAIN ROW -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Orders list -->
        <Card title="Recent Orders" linkText="View All" linkTo="/orders">
          <div v-if="recentOrders.length === 0" class="text-sm text-gray-500">No orders yet.</div>
          <div v-else class="space-y-2">
            <RowCard v-for="o in recentOrders" :key="o.id" :title="`#${o.id}`" :subtitle="o.items.map(i => `${i.quantity}× ${i.name}`).join(', ')" :rightText="`$${Number(o.total || 0).toFixed(2)}`" rightColor="text-green-600" />
          </div>
        </Card>

        <!-- Recent Expenses list -->
        <Card title="Recent Expenses" linkText="View All" linkTo="/expenses">
          <div v-if="recentExpenses.length === 0" class="text-sm text-gray-500">No expenses yet.</div>
          <div v-else class="space-y-2">
            <RowCard v-for="e in recentExpenses" :key="e.id" :title="e.category" :subtitle="e.description" :rightText="`$${Number(e.amount || 0).toFixed(2)}`" rightColor="text-red-600" />
          </div>
        </Card>

        <!-- Quick actions and Top Items column -->
        <div class="space-y-6">
          <Card title="Quick Actions">
            <div class="grid grid-cols-1 gap-2">
              <ActionButton to="/orders" icon="📋" text="Create Order" />
              <ActionButton to="/recipes" icon="📖" text="New Recipe" />
              <ActionButton to="/settings" icon="⚙️" text="Settings" />
            </div>
          </Card>

          <Card title="Top Items Today">
            <div v-if="topItems.length === 0" class="text-sm text-gray-500">No sales yet.</div>
            <div v-else class="space-y-2">
              <div v-for="(item, idx) in topItems" :key="item.name" class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center font-medium">{{ idx + 1 }}</div>
                  <div>
                    <div class="text-sm font-medium">{{ item.name }}</div>
                    <div class="text-xs text-gray-500">{{ item.qty }} sold</div>
                  </div>
                </div>
                <Badge :text="`${item.qty} sold`" color="bg-orange-100 text-orange-700" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Bottom row: Items, alerts or other widgets -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Low Stock Alerts">
          <div class="space-y-2">
            <RowCard title="Burger Buns" subtitle="Only 2 packs left" rightText="⚠️" rightColor="text-amber-600" />
            <RowCard title="Coke 500ml" subtitle="Only 5 bottles left" rightText="⚠️" rightColor="text-amber-600" />
          </div>
        </Card>

        <Card title="Notes & Announcements">
          <div class="text-sm text-gray-500">No announcements</div>
        </Card>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import Layout from '../components/layout/Layout.vue'
import KpiCard from '../components/ui/KpiCard.vue'
import Card from '../components/ui/Card.vue'
import RowCard from '../components/ui/RowCard.vue'
import ActionButton from '../components/ui/ActionButton.vue'
import Badge from '../components/ui/Badge.vue'
import { useOrderStore } from '../stores/orderStore'
import { useExpenseStore } from '../stores/expenseStore'

const orderStore = useOrderStore()
const expenseStore = useExpenseStore()

const salesToday = computed(() => orderStore.totalSalesToday)
const expensesToday = computed(() => expenseStore.todayExpenses.reduce((s, e) => s + e.amount, 0))
const netProfit = computed(() => Number(salesToday.value || 0) - Number(expensesToday.value || 0))

const recentOrders = computed(() => [...orderStore.todayOrders].slice(0, 5))
const recentExpenses = computed(() => [...expenseStore.todayExpenses].slice(0, 5))

const topItems = computed(() => {
  const map = new Map()
  orderStore.todayOrders.forEach(o =>
    (o.items || []).forEach(i => map.set(i.name, (map.get(i.name) || 0) + (i.quantity || 0)))
  )
  return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }))
})
</script>