<template>
  <Layout>
    <div class="p-6 space-y-6 max-w-5xl mx-auto">
      
      <!-- Tabs -->
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

      <!-- Profile Tab -->
      <div v-if="activeTab === 'profile'" class="p-6 space-y-6 bg-white shadow-sm rounded-xl">
        <h2 class="text-xl font-semibold">My Profile</h2>
        
        <!-- Display Current Info -->
        <div class="space-y-4">
          <div class="p-4 rounded-lg bg-gray-50">
            <p class="text-sm text-gray-600">Name</p>
            <p class="text-lg font-medium">{{ authStore.user?.name || 'Not set' }}</p>
          </div>
          <div class="p-4 rounded-lg bg-gray-50">
            <p class="text-sm text-gray-600">Email</p>
            <p class="text-lg font-medium">{{ authStore.user?.email || 'Not set' }}</p>
          </div>
        </div>

        <!-- Update Button -->
        <button 
          @click="openProfileModal"
          class="px-6 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
        >
        Update Profile
        </button>

        <!-- Logout Button (MOVED HERE) -->
        <div class="flex items-center justify-between p-6 mt-8 rounded-lg bg-red-50">
          <div>
            <h3 class="font-semibold text-red-800">Logout</h3>
            <p class="text-sm text-red-600">Logout of your account</p>
          </div>
          <button 
            @click="logout"
            class="px-6 py-2 font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
          Logout
          </button>
        </div>
      </div>

      <!-- Profile Update Modal -->
      <!-- <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"> -->
      <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="w-full max-w-md bg-white shadow-xl rounded-xl">
          <div class="flex items-center justify-between p-6 border-b">
            <h3 class="text-xl font-semibold">Update Profile</h3>
            <button @click="closeProfileModal" class="text-2xl leading-none text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
          
          <form @submit.prevent="updateProfile" class="p-6 space-y-4">
            <div>
              <label class="block mb-1 text-sm font-medium">Name *</label>
              <input 
                v-model="profileForm.name"
                type="text" 
                placeholder="Enter your name"
                class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            <div class="pt-4 border-t">
              <h4 class="mb-3 font-semibold">Change Password (Optional)</h4>
              <div class="space-y-3">
                <input 
                  v-model="passwordForm.currentPassword"
                  type="password" 
                  placeholder="Current Password"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input 
                  v-model="passwordForm.newPassword"
                  type="password" 
                  placeholder="New Password"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input 
                  v-model="passwordForm.confirmPassword"
                  type="password" 
                  placeholder="Confirm New Password"
                  class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div class="flex justify-end pt-4 space-x-3 border-t">
              <button @click="closeProfileModal" type="button"
                class="px-4 py-2 font-medium border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="submit"
                class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Order Categories Tab -->
      <div v-if="activeTab === 'order-cats'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
        <div class="flex items-center justify-between">
          <h2 class="mb-4 text-xl font-semibold">Order Categories</h2>

          <!-- Add Category button placed under the list -->
        <div class="pt-4 flex justify-end">
          <button
            @click="openAddOrderModal"
            class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            Add Category
          </button>
        </div>
        </div>
        
        <div class="space-y-3 overflow-y-auto max-h-80">
          <div 
            v-for="cat in orderStore.categories" 
            :key="cat.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div>
              <div class="font-medium">{{ cat.name }}</div>
                <div class="text-sm text-gray-500">
                  <span v-if="cat.subcategories && cat.subcategories.length">Sub: {{ cat.subcategories.join(', ') }}</span>
                  <span v-if="typeof cat.price !== 'undefined'"> • Price: ${{ cat.price }}</span>
                </div>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="startEdit('order', cat.id)"
                class="text-indigo-600 hover:text-indigo-800"
                title="Edit"
              >
                <font-awesome-icon icon="edit" class="w-4 h-4" />
              </button>
              <button 
                @click="deleteCategory('order', cat.id)"
                class="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Add modal triggered by the Add button (modal layout matches Orders.vue styling) -->
        <div v-if="showAddOrderModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div class="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
            <!-- header -->
            <div class="flex items-center justify-between p-6 border-b shrink-0">
              <h3 class="text-lg font-semibold">{{ isOrderEditing ? 'Edit Order Category' : 'Add Order Category' }}</h3>
              <button @click="closeAddOrderModal" class="text-2xl leading-none text-gray-500 hover:text-gray-700">×</button>
            </div>

            <!-- body (scrollable) -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              <form @submit.prevent="submitAddOrderCategory" class="space-y-4">
                <div>
                  <label class="block mb-1 text-sm font-medium">Category</label>
                  <input v-model="addOrderForm.name" type="text" required placeholder="Category name" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block mb-1 text-sm font-medium">Subcategory (optional)</label>
                  <input v-model="addOrderForm.subcategory" type="text" placeholder="Subcategory" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label class="block mb-1 text-sm font-medium">Price (optional)</label>
                  <input v-model.number="addOrderForm.price" type="number" step="0.01" placeholder="Price" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </form>
            </div>

            <!-- footer (fixed) -->
            <div class="flex justify-end space-x-3 p-6 border-t shrink-0">
              <button type="button" @click="closeAddOrderModal" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button type="button" @click="submitAddOrderCategory" class="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700">{{ isOrderEditing ? 'Update' : 'Save' }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Categories Tab -->
      <div v-if="activeTab === 'expense-cats'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
        <h2 class="mb-4 text-xl font-semibold">Expense Categories</h2>
        <form @submit.prevent="addCategory('expense')" class="flex gap-2 pt-4 border-t">
          <input 
            v-model="newExpenseCat"
            type="text" 
            placeholder="Add new category"
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            type="submit"
            class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            Add
          </button>
        </form>
        
        <div class="space-y-3 overflow-y-auto max-h-80">
          <div 
            v-for="cat in expenseStore.expenseCategories" 
            :key="cat"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <span class="font-medium">{{ cat }}</span>
            <div class="flex space-x-2">
              <button 
                @click="startEdit('expense', cat)"
                class="text-indigo-600 hover:text-indigo-800"
                title="Edit"
              >
                <font-awesome-icon icon="edit" class="w-4 h-4" />
              </button>
              <button 
                @click="deleteCategory('expense', cat)"
                class="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recipe Categories Tab -->
      <div v-if="activeTab === 'recipe-cats'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
        <h2 class="mb-4 text-xl font-semibold">Recipe Categories</h2>
        <form @submit.prevent="addCategory('recipe')" class="flex gap-2 pt-4 border-t">
          <input 
            v-model="newRecipeCat"
            type="text" 
            placeholder="Add new category"
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            type="submit"
            class="px-4 py-2 font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            Add
          </button>
        </form>
        
        <div class="space-y-3 overflow-y-auto max-h-80">
          <div 
            v-for="cat in recipeStore.recipeCategories" 
            :key="cat"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <span class="font-medium">{{ cat }}</span>
            <div class="flex space-x-2">
              <button 
                @click="startEdit('recipe', cat)"
                class="text-indigo-600 hover:text-indigo-800"
                title="Edit"
              >
                <font-awesome-icon icon="edit" class="w-4 h-4" />
              </button>
              <button 
                @click="deleteCategory('recipe', cat)"
                class="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <font-awesome-icon icon="trash" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useOrderStore } from '../stores/orderStore'
import { useExpenseStore } from '../stores/expenseStore'
import { useRecipeStore } from '../stores/recipeStore'
import { useRouter } from 'vue-router'
import Layout from '../components/layout/Layout.vue'

const authStore = useAuthStore()
const orderStore = useOrderStore()
const expenseStore = useExpenseStore()
const recipeStore = useRecipeStore()
const router = useRouter()

const activeTab = ref('profile')
const showProfileModal = ref(false)

const tabs = [
  { id: 'profile', name: 'Profile' },
  { id: 'order-cats', name: 'Order Categories' },
  { id: 'expense-cats', name: 'Expense Categories' },
  { id: 'recipe-cats', name: 'Recipe Categories' }
]

// Profile Modal State
const profileForm = ref({
  name: authStore.user?.name || ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const openProfileModal = () => {
  profileForm.value.name = authStore.user?.name || ''
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showProfileModal.value = true
}

const closeProfileModal = () => {
  showProfileModal.value = false
}

const updateProfile = () => {
  // Update name
  if (profileForm.value.name.trim()) {
    authStore.user.name = profileForm.value.name
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === authStore.user.id)
    if (userIndex > -1) {
      users[userIndex].name = profileForm.value.name
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }
  }

  // Update password
  if (passwordForm.value.currentPassword || passwordForm.value.newPassword) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find(u => u.id === authStore.user.id)
    
    if (!passwordForm.value.currentPassword || !passwordForm.value.newPassword) {
      alert('Please fill all password fields')
      return
    }
    
    if (passwordForm.value.currentPassword !== user.password) {
      alert('Current password is incorrect')
      return
    }
    
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      alert('New passwords do not match')
      return
    }
    
    user.password = passwordForm.value.newPassword
    localStorage.setItem('users', JSON.stringify(users))
    alert('Password updated successfully!')
  }

  alert('Profile updated successfully!')
  closeProfileModal()
}

// Categories
// old inline category input removed in favor of modal
const newExpenseCat = ref('')
const newRecipeCat = ref('')

// Add Order Modal state
const showAddOrderModal = ref(false)
const addOrderForm = ref({ name: '', subcategory: '', price: null })
const isOrderEditing = ref(false)
const editingOrderId = ref(null)

// Using recipe categories from recipeStore now
// const recipeCategories = ref(JSON.parse(localStorage.getItem('recipeCategories')) || ['Burger', 'Drinks', 'Snacks', 'Dessert', 'Other'])

const addCategory = (type) => {
  const value = type === 'expense' ? newExpenseCat.value : newRecipeCat.value
  
  if (!value || !value.trim()) return
  if (type === 'expense') {
    expenseStore.addCategory(value)
    newExpenseCat.value = ''
  } else if (type === 'recipe') {
    recipeStore.addCategory(value)
    newRecipeCat.value = ''
  }
}

const openAddOrderModal = () => {
  isOrderEditing.value = false
  editingOrderId.value = null
  addOrderForm.value = { name: '', subcategory: '', price: null }
  showAddOrderModal.value = true
}

const openOrderEditModal = (id) => {
  const cat = orderStore.categories.find(c => c.id === id)
  if (!cat) return
  isOrderEditing.value = true
  editingOrderId.value = id
  addOrderForm.value = { name: cat.name, subcategory: (cat.subcategories || []).join(', '), price: cat.price || null }
  showAddOrderModal.value = true
}

const closeAddOrderModal = () => {
  showAddOrderModal.value = false
}

const submitAddOrderCategory = () => {
  if (!addOrderForm.value.name || !addOrderForm.value.name.trim()) return
  const name = addOrderForm.value.name.trim()
  const subcats = (addOrderForm.value.subcategory || '').split(',').map(s => s.trim()).filter(Boolean)
  const price = addOrderForm.value.price || 0
  if (isOrderEditing.value && editingOrderId.value) {
    orderStore.updateCategory(editingOrderId.value, { name, subcategories: subcats, price })
  } else {
    orderStore.addCategory(name, '🍔', subcats, price)
  }
  closeAddOrderModal()
}

const startEdit = (type, id) => {
  if (type === 'order') {
    return openOrderEditModal(id)
  }
  const newName = prompt('Edit category name:')
  if (newName && newName.trim()) {
    if (type === 'expense') {
      expenseStore.updateCategory(id, newName)
    } else {
      recipeStore.updateCategory(id, newName)
    }
  }
}

const deleteCategory = (type, id) => {
  if (confirm('Delete category?')) {
    if (type === 'order') {
      orderStore.deleteCategory(id)
    } else if (type === 'expense') {
      expenseStore.deleteCategory(id)
    } else {
      recipeStore.deleteCategory(id)
    }
  }
}

const logout = () => {
  if (confirm('Logout?')) {
    authStore.logout()
    router.push('/login')
  }
}
</script>