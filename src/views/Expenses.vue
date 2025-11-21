<template>
  <Layout>
    <div class="max-w-4xl p-6 mx-auto space-y-6">
      
      <!-- Total Expenses (Top) -->
      <div class="p-8 text-center bg-white shadow-sm rounded-xl">
        <div class="flex items-center justify-center space-x-4">
          <!-- <div class="p-4 bg-red-100 rounded-full">
            <span class="text-3xl">💸</span>
          </div> -->
          <div>
            <p class="mb-1 text-sm text-gray-600">Total Expenses</p>
            <p class="text-4xl font-bold text-red-600">{{ expenseStore.totalExpenses.toFixed(2) }} tk</p>
          </div>
        </div>
      </div>

      <!-- Add Expense Form -->
      <div class="p-6 bg-white shadow-sm rounded-xl">
        <h3 class="mb-6 text-xl font-semibold">Add New Expense</h3>
        
        <form @submit.prevent="submitExpense" class="space-y-4">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- Amount -->
            <div>
              <label class="block mb-1 text-sm font-medium">Amount *</label>
              <input v-model="form.amount" type="number" step="0" placeholder="00" required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <!-- Category -->
            <div>
              <label class="block mb-1 text-sm font-medium">Category *</label>
              <select v-model="form.category" required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Select Category</option>
                <option v-for="cat in expenseStore.expenseCategories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- Date -->
            <div>
              <label class="block mb-1 text-sm font-medium">Date *</label>
              <input v-model="form.date" type="date" required
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

            <!-- Vendor -->
            <div>
              <label class="block mb-1 text-sm font-medium">Vendor/Supplier</label>
              <input v-model="form.vendor" type="text" placeholder="e.g., ABC Supplies"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>

          </div>

          <!-- Description -->
          <div>
            <label class="block mb-1 text-sm font-medium">Description *</label>
            <textarea v-model="form.description" rows="2" placeholder="What was this expense for?" required
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
          </div>

          <!-- Submit -->
          <div class="flex justify-end">
            <button type="submit"
              class="px-6 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">
              Save Expense
            </button>
          </div>
        </form>
      </div>

      <!-- Recent Expenses (Simple List) -->
      <div class="p-6 bg-white shadow-sm rounded-xl">
        <h3 class="mb-4 text-lg font-semibold">Recent Expenses</h3>
        
        <div v-if="recentExpenses.length === 0" class="py-8 text-center text-gray-500">
          No expenses recorded yet. Add your first expense above!
        </div>

        <div v-else class="space-y-3">
          <div v-for="expense in recentExpenses" :key="expense.id" 
               class="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <span class="px-2 py-1 text-xs font-medium bg-white rounded-full">
                  {{ expense.category }}
                </span>
                <p class="font-medium">{{ expense.description }}</p>
              </div>
              <p class="mt-1 text-sm text-gray-600">
                {{ formatDate(expense.date) }} • {{ expense.vendor || 'No vendor' }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="font-semibold text-red-600">{{ expense.amount.toFixed(2) }} tk</span>
              <button @click="deleteExpense(expense.id)" class="text-sm text-red-600 hover:text-red-800">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/layout/Layout.vue'
// import StatCard from '../components/dashboard/StatCard.vue'
import { useExpenseStore } from '../stores/expenseStore'

const expenseStore = useExpenseStore()

const form = ref({
  amount: '',
  category: '',
  description: '',
  vendor: '',
  date: new Date().toISOString().split('T')[0]
})

const recentExpenses = computed(() => {
  return [...expenseStore.expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10) // Show last 10
})

const submitExpense = () => {
  expenseStore.addExpense(form.value)
  // Reset form
  form.value = {
    amount: '',
    category: '',
    description: '',
    vendor: '',
    date: new Date().toISOString().split('T')[0]
  }
}

const deleteExpense = (id) => {
  if (confirm('Delete this expense?')) {
    expenseStore.deleteExpense(id)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

onMounted(() => {
  // Add sample data if empty
  if (expenseStore.expenses.length === 0) {
    expenseStore.addExpense({
      amount: 45.50,
      category: 'Ingredients',
      description: 'Burger buns and patties',
      vendor: 'Metro Supplies',
      date: new Date().toISOString().split('T')[0]
    })
  }
})
</script>