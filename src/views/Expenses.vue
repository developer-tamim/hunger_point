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
            <p class="text-4xl font-bold text-red-600">{{ Math.round(expenseStore.totalExpenses) }} tk</p>
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
                <span class="px-2 py-1 text-xs font-medium bg-slate-400 rounded-full">
                  {{ expense.category }}
                </span>
                <p class="font-medium">{{ expense.description }}</p>
              </div>
              <p class="mt-1 text-sm text-gray-600">
                {{ formatDate(expense.date) }} • {{ expense.vendor || 'No vendor' }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="font-semibold text-red-600">{{ Math.round(expense.amount) }} tk</span>
              <div class="relative">
                <button
                  @click="openDropdown === expense.id ? (openDropdown = null) : (openDropdown = expense.id)"
                  class="px-2 py-1 text-gray-500 hover:text-gray-700"
                >
                  ⋮
                </button>
                <div
                  v-if="openDropdown === expense.id"
                  class="absolute right-0 mt-1 w-32 bg-white border rounded-lg shadow-lg z-10"
                >
                  <button
                    @click="startEditExpense(expense); openDropdown = null"
                    class="block w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50"
                  >
                    Edit
                  </button>
                  <button
                    @click="confirmDeleteExpense(expense.id); openDropdown = null"
                    class="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Edit Expense Modal -->
    <div v-if="editMode && editingExpense" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="w-full max-w-md bg-white rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Edit Expense</h3>
        <form @submit.prevent="saveEditExpense" class="space-y-4">
          <div>
            <label class="block mb-1 text-sm font-medium">Amount</label>
            <input v-model="editingExpense.amount" type="number" step="0.01"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Category</label>
            <select v-model="editingExpense.category"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option v-for="cat in expenseStore.expenseCategories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Description</label>
            <textarea v-model="editingExpense.description" rows="2"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Vendor</label>
            <input v-model="editingExpense.vendor" type="text"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label class="block mb-1 text-sm font-medium">Date</label>
            <input v-model="editingExpense.date" type="date"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div class="flex justify-end gap-2 mt-6">
            <button @click="editMode = false" type="button"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      :visible="showDeleteConfirm"
      title="Confirm Delete"
      message="Are you sure you want to delete this expense? This action cannot be undone."
      @confirm="handleDeleteExpense"
      @cancel="showDeleteConfirm = false"
    />
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Layout from '../components/layout/Layout.vue'
import ConfirmModal from '../components/ui/ConfirmModal.vue'
// import StatCard from '../components/dashboard/StatCard.vue'
import { useExpenseStore } from '../stores/expenseStore'

const expenseStore = useExpenseStore()

const showDeleteConfirm = ref(false)
const deleteTargetId = ref(null)
const openDropdown = ref(null)
const editingExpense = ref(null)
const editMode = ref(false)

const confirmDeleteExpense = (id) => {
  deleteTargetId.value = id
  showDeleteConfirm.value = true
}

const handleDeleteExpense = () => {
  if (deleteTargetId.value !== null) {
    expenseStore.deleteExpense(deleteTargetId.value)
    deleteTargetId.value = null
  }
  showDeleteConfirm.value = false
}

const startEditExpense = (expense) => {
  editingExpense.value = { ...expense }
  editMode.value = true
}

const saveEditExpense = () => {
  if (editingExpense.value) {
    expenseStore.updateExpense(editingExpense.value.id, {
      amount: parseFloat(editingExpense.value.amount),
      category: editingExpense.value.category,
      description: editingExpense.value.description,
      vendor: editingExpense.value.vendor,
      date: editingExpense.value.date
    })
    editMode.value = false
    editingExpense.value = null
  }
}

const form = ref({
  amount: '',
  category: '',
  description: '',
  vendor: '',
  date: new Date().toISOString().split('T')[0]
})

const recentExpenses = computed(() => {
  return [...expenseStore.expenses]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
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
      amount: 45,
      category: 'Ingredients',
      description: 'Burger buns and patties',
      vendor: 'Metro Supplies',
      date: new Date().toISOString().split('T')[0]
    })
  }
})
</script>