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
      <div v-if="showProfileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
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
        <h2 class="mb-4 text-xl font-semibold">Order Categories</h2>
        
        <div class="space-y-3 overflow-y-auto max-h-80">
          <div 
            v-for="cat in orderStore.categories" 
            :key="cat.id"
            class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <span class="font-medium">{{ cat.name }}</span>
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

        <form @submit.prevent="addCategory('order')" class="flex gap-2 pt-4 border-t">
          <input 
            v-model="newOrderCat"
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
      </div>

      <!-- Expense Categories Tab -->
      <div v-if="activeTab === 'expense-cats'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
        <h2 class="mb-4 text-xl font-semibold">Expense Categories</h2>
        
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
      </div>

      <!-- Recipe Categories Tab -->
      <div v-if="activeTab === 'recipe-cats'" class="p-6 space-y-4 bg-white shadow-sm rounded-xl">
        <h2 class="mb-4 text-xl font-semibold">Recipe Categories</h2>
        
        <div class="space-y-3 overflow-y-auto max-h-80">
          <div 
            v-for="cat in recipeCategories" 
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
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useOrderStore } from '../stores/orderStore'
import { useExpenseStore } from '../stores/expenseStore'
import { useRouter } from 'vue-router'
import Layout from '../components/layout/Layout.vue'

const authStore = useAuthStore()
const orderStore = useOrderStore()
const expenseStore = useExpenseStore()
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
const newOrderCat = ref('')
const newExpenseCat = ref('')
const newRecipeCat = ref('')

const recipeCategories = ref(JSON.parse(localStorage.getItem('recipeCategories')) || ['Burger', 'Drinks', 'Snacks', 'Dessert', 'Other'])

const addCategory = (type) => {
  const value = type === 'order' ? newOrderCat.value : 
                type === 'expense' ? newExpenseCat.value : newRecipeCat.value
  
  if (value.trim()) {
    if (type === 'order') {
      orderStore.categories.push({ id: Date.now(), name: value, icon: '🍔' })
      localStorage.setItem('categories', JSON.stringify(orderStore.categories))
      newOrderCat.value = ''
    } else if (type === 'expense') {
      expenseStore.expenseCategories.push(value)
      localStorage.setItem('expenseCategories', JSON.stringify(expenseStore.expenseCategories))
      newExpenseCat.value = ''
    } else {
      recipeCategories.value.push(value)
      localStorage.setItem('recipeCategories', JSON.stringify(recipeCategories.value))
      newRecipeCat.value = ''
    }
  }
}

const startEdit = (type, id) => {
  const newName = prompt('Edit category name:')
  if (newName && newName.trim()) {
    if (type === 'order') {
      const cat = orderStore.categories.find(c => c.id === id)
      if (cat) {
        cat.name = newName
        localStorage.setItem('categories', JSON.stringify(orderStore.categories))
      }
    } else if (type === 'expense') {
      const index = expenseStore.expenseCategories.indexOf(id)
      if (index > -1) {
        expenseStore.expenseCategories[index] = newName
        localStorage.setItem('expenseCategories', JSON.stringify(expenseStore.expenseCategories))
      }
    } else {
      const index = recipeCategories.value.indexOf(id)
      if (index > -1) {
        recipeCategories.value[index] = newName
        localStorage.setItem('recipeCategories', JSON.stringify(recipeCategories.value))
      }
    }
  }
}

const deleteCategory = (type, id) => {
  if (confirm('Delete category?')) {
    if (type === 'order') {
      orderStore.categories = orderStore.categories.filter(c => c.id !== id)
      localStorage.setItem('categories', JSON.stringify(orderStore.categories))
    } else if (type === 'expense') {
      expenseStore.expenseCategories = expenseStore.expenseCategories.filter(c => c !== id)
      localStorage.setItem('expenseCategories', JSON.stringify(expenseStore.expenseCategories))
    } else {
      recipeCategories.value = recipeCategories.value.filter(c => c !== id)
      localStorage.setItem('recipeCategories', JSON.stringify(recipeCategories.value))
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